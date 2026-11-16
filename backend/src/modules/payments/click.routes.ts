import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';
import { paymentDataStore, PaymentMethod } from './paymentStore.js';

export const paymentsRouter = Router();

// Click Business Merchant Credentials (from environment or defaults)
const CLICK_SERVICE_ID = process.env.CLICK_SERVICE_ID || '32840';
const CLICK_MERCHANT_ID = process.env.CLICK_MERCHANT_ID || '24510';
const CLICK_SECRET_KEY = process.env.CLICK_SECRET_KEY || 'mathcity_click_secret_key_demo';

// Helper: MD5 hashing for Click signature validation
function generateClickSignature(params: (string | number)[]): string {
  return crypto.createHash('md5').update(params.join('')).digest('hex');
}

// 1. Create Payment Order & Generate Checkout URL
paymentsRouter.post('/click/create-invoice', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const amount = 29000; // 29,000 UZS / month
  const returnUrl = 'http://localhost:8085/#/kids/profile';
  const checkoutUrl = `https://my.click.uz/services/pay?service_id=${CLICK_SERVICE_ID}&merchant_id=${CLICK_MERCHANT_ID}&amount=${amount}&transaction_param=${user.id}&return_url=${encodeURIComponent(returnUrl)}`;

  const order = paymentDataStore.createOrder(user.id, amount, checkoutUrl);

  return res.json({
    success: true,
    data: {
      orderId: order.id,
      amountUzs: order.amountUzs,
      currency: 'UZS',
      checkoutUrl,
      provider: 'CLICK_BUSINESS',
      planName: 'MathCity Pro',
      monthlyRenewalInfo: 'Oylik 29 000 so‘m. Istalgan vaqtda bekor qilish mumkin.',
    },
  });
});

// 2. Direct Card Payment Initiation (Uzcard, Humo, Visa, Mastercard)
const directCardSchema = z.object({
  paymentMethod: z.enum(['UZCARD', 'HUMO', 'VISA', 'MASTERCARD', 'CLICK']),
  cardNumber: z.string().min(16),
  expiryDate: z.string().min(4),
  cvv: z.string().optional(),
  savePaymentMethod: z.boolean().optional().default(false),
});

paymentsRouter.post('/pay/card', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const parse = directCardSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({
      success: false,
      error: 'Karta ma’lumotlari to‘liq kiritilmadi.',
      code: 'INVALID_CARD_FIELDS',
    });
  }

  const user = req.user!;
  const { paymentMethod, cardNumber, expiryDate } = parse.data;
  const cleanCard = cardNumber.replace(/\s+/g, '');

  // PCI-DSS Security Enforcement: never store full PAN or CVV
  const maskedCard = `${cleanCard.slice(0, 4)} •••• •••• ${cleanCard.slice(-4)}`;

  // Create order
  const amountUzs = 29000;
  const order = paymentDataStore.createOrder(user.id, amountUzs, 'card_direct');

  // Simulated provider payment processing (Sandbox / Testing)
  // In real production, this routes via Click Merchant API / Bank Payment Gateway
  // Test failure condition: card ending in "0000" triggers insufficient funds
  if (cleanCard.endsWith('0000')) {
    paymentDataStore.updateOrderStatus(order.id, 'FAILED');
    paymentDataStore.recordTransaction({
      orderId: order.id,
      userId: user.id,
      amountUzs,
      feeUzs: 0,
      netAmountUzs: 0,
      status: 'FAILED',
      paymentMethod,
      maskedCard,
      settled: false,
      errorMessage: 'Hisobingizda mablag‘ yetarli emas.',
    });

    return res.status(402).json({
      success: false,
      error: 'Hisobingizda mablag‘ yetarli emas. Iltimos, kartangizni to‘ldirib qayta urinib ko‘ring.',
      code: 'INSUFFICIENT_FUNDS',
    });
  }

  // Calculate 2% Click / Acquiring processing fee
  const feeUzs = Math.round(amountUzs * 0.02); // 580 UZS
  const netAmountUzs = amountUzs - feeUzs; // 28,420 UZS

  // Record successful transaction
  const tx = paymentDataStore.recordTransaction({
    orderId: order.id,
    userId: user.id,
    clickTransId: `clk_card_${Date.now()}`,
    amountUzs,
    feeUzs,
    netAmountUzs,
    status: 'SUCCESS',
    paymentMethod,
    maskedCard,
    settled: false,
  });

  paymentDataStore.updateOrderStatus(order.id, 'PAID');

  // Authoritatively activate Pro subscription for 30 days
  const activation = repository.activatePro(user.id, 'web', tx.id);

  return res.json({
    success: true,
    data: {
      orderId: order.id,
      transactionId: tx.id,
      status: 'PAID',
      amountUzs,
      paymentMethod,
      maskedCard,
      proExpiresAt: activation.proExpiresAt,
      message: 'To‘lov muvaffaqiyatli amalga oshirildi! MathCity Pro faollashtirildi.',
    },
  });
});

// 3. Click Prepare Callback (Action 0)
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

  // Action check
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
  const expectedSign = generateClickSignature([
    click_trans_id,
    service_id,
    CLICK_SECRET_KEY,
    merchant_trans_id,
    amount,
    action,
    sign_time,
  ]);

  if (sign_string && sign_string !== expectedSign && process.env.NODE_ENV === 'production') {
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

// 4. Click Complete Callback (Action 1)
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

  // Action check
  if (parseInt(action, 10) !== 1) {
    return res.json({ error: -4, error_note: 'Action mismatch' });
  }

  // Check for client-side payment error from Click
  if (parseInt(error, 10) < 0) {
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
  const expectedSign = generateClickSignature([
    click_trans_id,
    service_id,
    CLICK_SECRET_KEY,
    merchant_trans_id,
    merchant_prepare_id,
    amount,
    action,
    sign_time,
  ]);

  if (sign_string && sign_string !== expectedSign && process.env.NODE_ENV === 'production') {
    return res.json({ error: -1, error_note: 'SIGN CHECK FAILED' });
  }

  // Calculate fees (Click 2% standard business tariff)
  const amountUzs = parseFloat(amount);
  const feeUzs = Math.round(amountUzs * 0.02);
  const netAmountUzs = amountUzs - feeUzs;

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

// 5. Payment Status Check Endpoint
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
