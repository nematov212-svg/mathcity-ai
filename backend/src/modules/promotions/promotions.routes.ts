import { Router, Response } from 'express';
import { optionalAuthMiddleware, authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';
import { discountStore } from '../pricing/discountStore.js';

export const promotionsRouter = Router();

/**
 * GET /api/promotions/new-user
 * Authoritative endpoint for new user 30% discount
 * Returns { eligible, expiresAt, discountPercent: 30, prices: { monthly: { original, discounted }, yearly: { original, discounted } } }
 */
promotionsRouter.get('/new-user', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const settings = discountStore.getSettings();
  const discountPercent = settings.enabled ? (settings.discountPercent || 30) : 0;
  const baseMonthly = 29000;
  const baseYearly = 250000;
  const discountedMonthly = Math.round(baseMonthly * (1 - (settings.discountPercent || 30) / 100));
  const discountedYearly = Math.round(baseYearly * (1 - (settings.discountPercent || 30) / 100));

  const eligibility = settings.enabled
    ? repository.isNewUserDiscountEligible(user)
    : { eligible: false, expiresAt: null, discountPercent: 0, reason: 'Chegirma tizimi o‘chirilgan.' };

  const prices = {
    monthly: {
      original: baseMonthly,
      discounted: discountedMonthly,
    },
    yearly: {
      original: baseYearly,
      discounted: discountedYearly,
    },
  };

  return res.json({
    success: true,
    eligible: eligibility.eligible,
    expiresAt: eligibility.expiresAt,
    discountPercent: settings.discountPercent || 30,
    prices,
    data: {
      eligible: eligibility.eligible,
      expiresAt: eligibility.expiresAt,
      discountPercent: settings.discountPercent || 30,
      prices,
    },
  });
});

/**
 * PATCH /api/promotions/test-set-created-at
 * Allows adjusting user's createdAt for testing 24h eligibility
 */
promotionsRouter.patch('/test-set-created-at', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { hoursAgo } = req.body || {};
  const user = req.user!;
  const hours = typeof hoursAgo === 'number' ? hoursAgo : 25;
  const newCreated = new Date(Date.now() - hours * 3600 * 1000).toISOString();
  user.createdAt = newCreated;
  return res.json({ success: true, userId: user.id, createdAt: user.createdAt });
});
