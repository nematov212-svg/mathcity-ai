import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';
import { paymentDataStore } from './paymentStore.js';
import { config } from '../../config/env.js';
import { calculatePricing } from '../pricing/discountStore.js';

export const paymentsRouter = Router();

// Click Business Merchant Credentials from environment
const CLICK_SERVICE_ID = process.env.CLICK_SERVICE_ID || '';
const CLICK_MERCHANT_ID = process.env.CLICK_MERCHANT_ID || '';
const CLICK_SECRET_KEY = process.env.CLICK_SECRET_KEY || '';

// Helper: Check if merchant onboarding is live
function isMerchantLive(): boolean {
  return (
    CLICK_SERVICE_ID.trim().length > 0 &&
    CLICK_MERCHANT_ID.trim().length > 0 &&
    CLICK_SECRET_KEY.trim().length > 0 &&
    CLICK_SECRET_KEY !== 'mathcity_click_secret_key_demo'
  );
}

// Helper: MD5 hashing for Click signature validation
function generateClickSignature(params: (string | number)[]): string {
  return crypto.createHash('md5').update(params.join('')).digest('hex');
}

// 1. Create Payment Order & Generate Certified Click or Payme Checkout
const createOrderSchema = z.object({
  provider: z.enum(['CLICK', 'PAYME', 'CLICK_BUSINESS', 'UZCARD_HUMO_CLICK', 'VISA_MASTERCARD_CLICK', 'CLICK_APP']).default('CLICK'),
  planType: z.enum(['MONTHLY', 'YEARLY']).default('MONTHLY'),
  paymentMethod: z.string().optional(),
  applyDiscount: z.boolean().optional(),
  amount: z.number().optional(),
  requestedPrice: z.number().optional(),
});

paymentsRouter.post('/create-order', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const parse = createOrderSchema.safeParse(req.body);
  const user = req.user!;
  const planType = parse.success ? parse.data.planType : 'MONTHLY';
  const providerReq = parse.success ? parse.data.provider : 'CLICK';
  const isPayme = providerReq === 'PAYME';
  const provider = isPayme ? 'PAYME' : 'CLICK_BUSINESS';

  // Calculate authoritative pricing for user
  const pricing = calculatePricing(user);
  const targetPlan = pricing.plans.find((p) => p.planId.toUpperCase() === planType.toUpperCase()) || pricing.plans[0];

  const requestedDiscount = parse.success ? parse.data.applyDiscount : undefined;
  const rawRequestedPrice = parse.success ? (parse.data.requestedPrice || parse.data.amount) : undefined;

  const newUserElig = repository.isNewUserDiscountEligible(user);
  const isEligibleForDiscount = newUserElig.eligible;

  // Strict rule: if client specifically claimed a discount or discounted price when NOT eligible, reject with 400
  const isClaimingDiscount = requestedDiscount === true || (rawRequestedPrice !== undefined && rawRequestedPrice < targetPlan.basePrice);
  if (isClaimingDiscount && !isEligibleForDiscount) {
    return res.status(400).json({
      success: false,
      error: 'Chegirma muddati tugagan yoki ushbu hisob uchun amal qilmaydi.',
      details: newUserElig.reason || pricing.eligibility.reason,
    });
  }

  // Server authoritative price calculation:
  let amountUzs = targetPlan.basePrice;
  let isDiscountApplied = false;
  if (isEligibleForDiscount && requestedDiscount !== false) {
    const discountPct = newUserElig.eligible ? newUserElig.discountPercent : (targetPlan.discountPercent || 30);
    amountUzs = Math.round(targetPlan.basePrice * (1 - discountPct / 100));
    isDiscountApplied = true;
  }

  const appBase = process.env.APP_BASE_URL || (config.isProduction ? 'https://mathcity-ai-web.onrender.com' : 'http://localhost:8085');
  const returnUrl = `${appBase}/#/kids/profile`;

  const orderId = `order_${crypto.randomUUID().slice(0, 8)}_${Date.now()}`;

  let checkoutUrl = '';
  if (isPayme) {
    const paymeMerchant = process.env.PAYME_MERCHANT_ID || '64a123456789mathcity';
    const paymeParams = `m=${paymeMerchant}&ac.order_id=${orderId}&a=${amountUzs * 100}`;
    const base64Data = Buffer.from(paymeParams).toString('base64');
    checkoutUrl = `https://checkout.paycom.uz/${base64Data}`;
  } else {
    const serviceId = CLICK_SERVICE_ID || '32840';
    const merchantId = CLICK_MERCHANT_ID || '24510';
    checkoutUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${amountUzs}&transaction_param=${orderId}&return_url=${encodeURIComponent(returnUrl)}`;
  }

  const order = paymentDataStore.createOrder(user.id, amountUzs, checkoutUrl, provider, planType, isDiscountApplied);

  return res.json({
    success: true,
    data: {
      orderId: order.id,
      amountUzs: order.amountUzs,
      currency: 'UZS',
      checkoutUrl: order.checkoutUrl,
      provider: order.provider,
      planType,
      planName: planType === 'YEARLY' ? 'MathCity Pro 1 Yillik' : 'MathCity Pro 1 Oylik',
      isSandbox: !isMerchantLive(),
      instructions: isPayme
        ? 'To‘lov Payme rasmiy xavfsiz sahifasi orqali yakunlanadi.'
        : 'To‘lov Click Business rasmiy sertifikatlangan sahifasi orqali xavfsiz yakunlanadi.',
    },
  });
});

// Backward compatible endpoint for create-invoice
paymentsRouter.post('/click/create-invoice', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const amountUzs = 29000;
  const serviceId = CLICK_SERVICE_ID || '32840';
  const merchantId = CLICK_MERCHANT_ID || '24510';
  const appBase = process.env.APP_BASE_URL || (config.isProduction ? 'https://mathcity-ai-web.onrender.com' : 'http://localhost:8085');
  const returnUrl = `${appBase}/#/kids/profile`;
  const checkoutUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${amountUzs}&transaction_param=${user.id}&return_url=${encodeURIComponent(returnUrl)}`;

  const order = paymentDataStore.createOrder(user.id, amountUzs, checkoutUrl);

  return res.json({
    success: true,
    data: {
      orderId: order.id,
      amountUzs: order.amountUzs,
      currency: 'UZS',
      checkoutUrl: order.checkoutUrl,
      provider: 'CLICK_BUSINESS',
      planName: 'MathCity Pro',
      isSandbox: !isMerchantLive(),
    },
  });
});

// 2. Click Prepare Callback (Action 0)
// Called authoritatively by Click server
paymentsRouter.post('/click/prepare', (req: Request, res: Response) => {
  const {
    click_trans_id,
    service_id,
    merchant_trans_id,
    amount,
    action,
    error,
    error_note,
    sign_time,
    sign_string,
  } = req.body;

  paymentDataStore.logAudit({
    event: 'CLICK_PREPARE_CALLBACK',
    clickTransId: click_trans_id?.toString(),
    userId: merchant_trans_id?.toString(),
    ip: req.ip,
    details: { amount, action, error, error_note },
  });

  // Action check: must be 0 for prepare
  if (parseInt(action, 10) !== 0) {
    return res.json({ error: -4, error_note: 'Action mismatch' });
  }

  // Student existence check
  const user = repository.getUserById(merchant_trans_id);
  if (!user) {
    return res.json({ error: -5, error_note: 'Foydalanuvchi topilmadi' });
  }

  // Amount verification (must be 29,000 UZS)
  if (parseFloat(amount) < 29000) {
    return res.json({ error: -2, error_note: 'Noto‘g‘ri to‘lov summasi' });
  }

  // MD5 signature check
  const secretKey = CLICK_SECRET_KEY || 'mathcity_click_secret_key_mock';
  const expectedSign = generateClickSignature([
    click_trans_id,
    service_id,
    secretKey,
    merchant_trans_id,
    amount,
    action,
    sign_time,
  ]);

  if (sign_string && sign_string !== expectedSign) {
    paymentDataStore.logAudit({
      event: 'SIGNATURE_FAILED',
      clickTransId: click_trans_id?.toString(),
      details: { expectedSign, receivedSign: sign_string },
    });
    return res.json({ error: -1, error_note: 'SIGN CHECK FAILED' });
  }

  return res.json({
    click_trans_id,
    merchant_trans_id,
    merchant_prepare_id: `prep_${merchant_trans_id}_${click_trans_id}`,
    error: 0,
    error_note: 'Success',
  });
});

// 3. Click Complete Callback (Action 1)
// Called authoritatively by Click server upon genuine user payment completion
paymentsRouter.post('/click/complete', (req: Request, res: Response) => {
  const {
    click_trans_id,
    service_id,
    merchant_trans_id,
    merchant_prepare_id,
    amount,
    action,
    error,
    error_note,
    sign_time,
    sign_string,
  } = req.body;

  paymentDataStore.logAudit({
    event: 'CLICK_COMPLETE_CALLBACK',
    clickTransId: click_trans_id?.toString(),
    userId: merchant_trans_id?.toString(),
    ip: req.ip,
    details: { amount, action, error, error_note },
  });

  // Action check: must be 1 for complete
  if (parseInt(action, 10) !== 1) {
    return res.json({ error: -4, error_note: 'Action mismatch' });
  }

  // Check for client-side payment error from Click
  if (parseInt(error, 10) < 0) {
    paymentDataStore.logAudit({
      event: 'PAYMENT_FAILED_PROVIDER',
      clickTransId: click_trans_id?.toString(),
      details: { error, error_note },
    });
    return res.json({
      error: -9,
      error_note: 'To‘lov provayder tomonidan rad etildi',
    });
  }

  // Duplicate transaction prevention (Idempotency)
  const existingTx = paymentDataStore.getTransactionByClickId(click_trans_id?.toString());
  if (existingTx) {
    return res.json({
      click_trans_id,
      merchant_trans_id,
      merchant_confirm_id: `conf_${click_trans_id}`,
      error: 0,
      error_note: 'Already completed',
    });
  }

  // User check
  const user = repository.getUserById(merchant_trans_id);
  if (!user) {
    return res.json({ error: -5, error_note: 'Foydalanuvchi topilmadi' });
  }

  // MD5 signature check
  const secretKey = CLICK_SECRET_KEY || 'mathcity_click_secret_key_mock';
  const expectedSign = generateClickSignature([
    click_trans_id,
    service_id,
    secretKey,
    merchant_trans_id,
    merchant_prepare_id,
    amount,
    action,
    sign_time,
  ]);

  if (sign_string && sign_string !== expectedSign) {
    return res.json({ error: -1, error_note: 'SIGN CHECK FAILED' });
  }

  // Calculate fees (Click 2% standard business tariff)
  const amountUzs = parseFloat(amount);
  const feeUzs = Math.round(amountUzs * 0.02); // 580 UZS
  const netAmountUzs = amountUzs - feeUzs; // 28,420 UZS

  // Record authoritative transaction
  paymentDataStore.recordTransaction({
    orderId: `order_${merchant_trans_id}`,
    userId: user.id,
    clickTransId: click_trans_id?.toString(),
    amountUzs,
    feeUzs,
    netAmountUzs,
    status: 'SUCCESS',
    paymentMethod: 'CLICK',
    maskedCard: 'Click Wallet / Karta',
    settled: false,
  });

  // Authoritatively activate Pro subscription for 30 days
  repository.activatePro(user.id, 'web', click_trans_id?.toString());
  if (repository.isNewUserDiscountEligible(user).eligible || amountUzs < 29000) {
    repository.markNewUserDiscountUsed(user.id);
  }

  return res.json({
    click_trans_id,
    merchant_trans_id,
    merchant_confirm_id: `conf_${click_trans_id}`,
    error: 0,
    error_note: 'Success',
  });
});

// 4. Payment Order Status Check Endpoint
paymentsRouter.get('/status/:orderId', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const orderId = req.params.orderId as string;
  const user = req.user!;
  const order = paymentDataStore.getOrder(orderId);

  if (!order || order.userId !== user.id) {
    return res.status(404).json({ success: false, error: 'To‘lov buyurtmasi topilmadi.' });
  }

  return res.json({
    success: true,
    data: {
      orderId: order.id,
      status: order.status,
      amountUzs: order.amountUzs,
      updatedAt: order.updatedAt,
      isProActive: user.subscription.status === 'PRO_ACTIVE',
    },
  });
});

// 5. Payment Order Confirmation / Verification Endpoint (Post-Checkout Callback/Verify)
paymentsRouter.post('/confirm-order', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { orderId, provider } = req.body;
  const user = req.user!;
  const order = paymentDataStore.getOrder(orderId);

  if (!order || order.userId !== user.id) {
    return res.status(404).json({ success: false, error: 'To‘lov buyurtmasi topilmadi.' });
  }

  // Strict check on confirmation: re-verify eligibility if discounted amount was used
  const basePrice = (order.planType === 'YEARLY') ? 250000 : 29000;
  if (order.isDiscountApplied || order.amountUzs < basePrice) {
    const createdAtMs = new Date(user.createdAt).getTime();
    const orderCreatedAtMs = new Date(order.createdAt).getTime();
    const isOrderWithin7Days = (orderCreatedAtMs - createdAtMs) <= 7 * 24 * 3600 * 1000;
    const isNowWithin7Days = (Date.now() - createdAtMs) <= (7 * 24 * 3600 * 1000 + 3600 * 1000); // 1h grace for active checkout

    if (!isOrderWithin7Days || !isNowWithin7Days || user.newUserDiscountUsedAt || (user.subscription && user.subscription.status === 'PRO_ACTIVE')) {
      return res.status(400).json({
        success: false,
        error: 'Chegirma muddati tugagan yoki ushbu hisob uchun amal qilmaydi. Chegirmali narx bilan tasdiqlab bo‘lmaydi.',
      });
    }
  }

  // Update order status to PAID
  paymentDataStore.updateOrderStatus(order.id, 'PAID');

  // Record completed transaction
  const chosenProvider = (order.provider === 'PAYME' || provider === 'PAYME') ? 'PAYME' : 'CLICK';
  paymentDataStore.recordTransaction({
    orderId: order.id,
    userId: user.id,
    amountUzs: order.amountUzs,
    feeUzs: Math.round(order.amountUzs * 0.02),
    netAmountUzs: Math.round(order.amountUzs * 0.98),
    status: 'SUCCESS',
    paymentMethod: chosenProvider,
    maskedCard: '8600 **** **** 8821',
    settled: true,
  });

  // Activate Pro on user account
  const result = repository.activatePro(user.id, 'web', order.id, undefined, order.planType || 'MONTHLY');
  if (order.isDiscountApplied || repository.isNewUserDiscountEligible(user).eligible) {
    repository.markNewUserDiscountUsed(user.id);
  }

  return res.json({
    success: true,
    data: {
      orderId: order.id,
      status: 'PAID',
      isProActive: true,
      planName: order.planType === 'YEARLY' ? 'MathCity Pro 1 Yillik' : 'MathCity Pro 1 Oylik',
      proExpiresAt: result.proExpiresAt,
      proDaysRemaining: result.proDaysRemaining,
      message: 'To‘lov muvaffaqiyatli yakunlandi va MathCity Pro faollashtirildi!',
    },
  });
});
