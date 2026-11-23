import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';

export const subscriptionsRouter = Router();

// 1. Get current subscription & 30-day trial status
subscriptionsRouter.get('/status', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const sub = repository.getSubscription(user.id);

  return res.json({
    success: true,
    data: sub,
  });
});

const purchaseSchema = z.object({
  platform: z.enum(['google_play', 'app_store', 'web']).default('web'),
  productId: z.string().optional().default('mathcity_pro_monthly'),
  planType: z.enum(['MONTHLY', 'YEARLY']).optional().default('MONTHLY'),
  purchaseToken: z.string().optional(),
  orderId: z.string().optional(),
});

// 2. Authoritative Store Purchase Verification & Pro Activation
subscriptionsRouter.post('/purchase', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const parse = purchaseSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Xarid parametrlari noto‘g‘ri.' });
  }

  const user = req.user!;
  const { platform, orderId, purchaseToken, planType } = parse.data;

  try {
    const result = repository.activatePro(user.id, platform, orderId, purchaseToken, planType);

    return res.json({
      success: true,
      data: {
        status: result.status,
        message: result.message,
        proExpiresAt: result.proExpiresAt,
        proDaysRemaining: result.proDaysRemaining,
        isProActive: true,
        priceMonthlyUzs: planType === 'YEARLY' ? 250000 : 29000,
      },
    });
  } catch (err: any) {
    return res.status(409).json({
      success: false,
      error: err.message || 'Xaridni tasdiqlashda xatolik yuz berdi.',
    });
  }
});

// 3. Restore Purchases
subscriptionsRouter.post('/restore', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const sub = repository.getSubscription(user.id);

  return res.json({
    success: true,
    data: {
      message: sub.isProActive
        ? 'MathCity Pro obunasi tiklandi!'
        : 'Faol obuna topilmadi. 30 kunlik bepul sinov davom etmoqda.',
      subscription: sub,
    },
  });
});

// 4. Cancel Subscription
subscriptionsRouter.post('/cancel', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  try {
    const result = repository.cancelSubscription(user.id);
    return res.json({
      success: true,
      data: {
        status: result.status,
        message: result.message,
        isProActive: false,
      },
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Obunani bekor qilishda xatolik yuz berdi.',
    });
  }
});
