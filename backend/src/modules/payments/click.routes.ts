import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';
import { paymentDataStore } from './paymentStore.js';

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

// 1. Create Payment Order & Generate Certified Click Checkout
const createOrderSchema = z.object({
  paymentMethod: z.enum(['UZCARD_HUMO_CLICK', 'VISA_MASTERCARD_CLICK', 'CLICK_APP']).default('UZCARD_HUMO_CLICK'),
});

paymentsRouter.post('/create-order', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const parse = createOrderSchema.safeParse(req.body);
  const user = req.user!;
  const amountUzs = 29000; // Strict server-side price: 29,000 UZS / month

  // Verify merchant configuration
  // If merchant credentials are not yet configured in .env, respond with honest setup requirement
  if (!isMerchantLive() && process.env.NODE_ENV === 'production') {
    return res.status(503).json({
      success: false,
      code: 'MERCHANT_SETUP_REQUIRED',
      error: 'Click Business savdogar hisobi sozlanmoqda. Haqiqiy to‘lovlar bank tekshiruvidan so‘ng yoqiladi.',
      message: 'Savdogar hisobini yoqish uchun CLICK_SERVICE_ID va CLICK_SECRET_KEY kiritilishi zarur.',
    });
  }

  // Active service ID or fallback for sandbox testing
  const serviceId = CLICK_SERVICE_ID || '32840';
  const merchantId = CLICK_MERCHANT_ID || '24510';

  const returnUrl = 'http://localhost:8085/#/kids/profile';
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
      instructions: 'To‘lov Click Business rasmiy sertifikatlangan sahifasi orqali xavfsiz yakunlanadi.',
    },
  });
});

// Backward compatible endpoint for create-invoice
paymentsRouter.post('/click/create-invoice', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const amountUzs = 29000;
  const serviceId = CLICK_SERVICE_ID || '32840';
  const merchantId = CLICK_MERCHANT_ID || '24510';
  const returnUrl = 'http://localhost:8085/#/kids/profile';
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
