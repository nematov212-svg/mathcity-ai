import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';

export const paymentsRouter = Router();

// Click Business Merchant Credentials (from config or test defaults)
const CLICK_SERVICE_ID = process.env.CLICK_SERVICE_ID || '32840';
const CLICK_MERCHANT_ID = process.env.CLICK_MERCHANT_ID || '24510';
const CLICK_SECRET_KEY = process.env.CLICK_SECRET_KEY || 'mathcity_click_secret_key_demo';

// 1. Generate Checkout URL for Web
paymentsRouter.post('/click/create-invoice', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const amount = 29000; // 29,000 UZS / month
  const orderId = `order_${user.id}_${Date.now()}`;

  // Official Click URL redirect pattern
  const returnUrl = 'http://localhost:8085/#/kids/profile';
  const checkoutUrl = `https://my.click.uz/services/pay?service_id=${CLICK_SERVICE_ID}&merchant_id=${CLICK_MERCHANT_ID}&amount=${amount}&transaction_param=${user.id}&return_url=${encodeURIComponent(returnUrl)}`;

  return res.json({
    success: true,
    data: {
      orderId,
      amountUzs: amount,
      checkoutUrl,
      provider: 'CLICK_BUSINESS',
      planName: 'MathCity Pro',
    },
  });
});

// Helper: MD5 hashing for Click signature validation
function generateClickSignature(params: string[]): string {
  return crypto.createHash('md5').update(params.join('')).digest('hex');
}

// 2. Click Prepare Callback (Action 0)
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

  // Validate action
  if (parseInt(action, 10) !== 0) {
    return res.json({ error: -4, error_note: 'Action mismatch' });
  }

  // Validate student existence
  const user = repository.getUserById(merchant_trans_id);
  if (!user) {
    return res.json({ error: -5, error_note: 'Foydalanuvchi topilmadi' });
  }

  // Validate amount (29,000 UZS)
  if (parseFloat(amount) < 29000) {
    return res.json({ error: -2, error_note: 'Noto‘g‘ri to‘lov summasi' });
  }

  // Check MD5 signature if secret key is active
  if (process.env.NODE_ENV === 'production') {
    const expectedSign = generateClickSignature([
      click_trans_id,
      service_id,
      CLICK_SECRET_KEY,
      merchant_trans_id,
      amount,
      action,
      sign_time,
    ]);
    if (sign_string !== expectedSign) {
      return res.json({ error: -1, error_note: 'SIGN CHECK FAILED' });
    }
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

  // Validate action
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

  // Find user and activate Pro
  const user = repository.getUserById(merchant_trans_id);
  if (!user) {
    return res.json({ error: -5, error_note: 'Foydalanuvchi topilmadi' });
  }

  // Check MD5 signature in production
  if (process.env.NODE_ENV === 'production') {
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
    if (sign_string !== expectedSign) {
      return res.json({ error: -1, error_note: 'SIGN CHECK FAILED' });
    }
  }

  // Authoritatively activate Pro subscription
  repository.activatePro(user.id, 'web', click_trans_id);

  return res.json({
    click_trans_id,
    merchant_trans_id,
    merchant_confirm_id: `conf_${click_trans_id}`,
    error: 0,
    error_note: 'Success',
  });
});
