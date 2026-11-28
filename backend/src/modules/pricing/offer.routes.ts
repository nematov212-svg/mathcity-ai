import { Router, Response } from 'express';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';
import { calculatePricing, discountStore } from './discountStore.js';

export const offerRouter = Router();

/**
 * GET /api/user/offer (and /api/users/offer)
 * Authoritative single source of truth for "Maxsus taklif • 30% chegirma".
 * Rules:
 * 1. Discount applies strictly to new users within 7 days of registration (user.createdAt).
 * 2. After 7 days: eligible = false, expiresAt = null, regular prices (Monthly 29 000, Yearly 250 000).
 * 3. If user purchased Pro or already used discount: eligible = false.
 * 4. Calculated purely on server to prevent client clock tampering.
 */
offerRouter.get('/', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const nowMs = Date.now();
  const settings = discountStore.getSettings();

  const baseMonthlyPrice = 29000;
  const baseYearlyPrice = 250000;
  const discountPercent = settings.enabled ? (settings.discountPercent || 30) : 0;

  const discountedMonthlyPrice = Math.round(baseMonthlyPrice * (1 - discountPercent / 100)); // 20300
  const discountedYearlyPrice = Math.round(baseYearlyPrice * (1 - discountPercent / 100)); // 175000

  const elig = repository.isNewUserDiscountEligible(user, nowMs);
  const eligible = elig.eligible && settings.enabled;
  const expiresAt = eligible ? elig.expiresAt : null;

  const monthlyPrice = eligible ? discountedMonthlyPrice : baseMonthlyPrice;
  const yearlyPrice = eligible ? discountedYearlyPrice : baseYearlyPrice;

  const responsePayload = {
    eligible,
    expiresAt,
    discountPercent: eligible ? discountPercent : 0,
    monthlyPrice,
    yearlyPrice,
    baseMonthlyPrice,
    discountedMonthlyPrice,
    baseYearlyPrice,
    discountedYearlyPrice,
    serverNow: new Date(nowMs).toISOString(),
    serverTimestampMs: nowMs,
    reason: elig.reason,
    success: true,
    data: {
      eligible,
      expiresAt,
      discountPercent: eligible ? discountPercent : 0,
      monthlyPrice,
      yearlyPrice,
      baseMonthlyPrice,
      discountedMonthlyPrice,
      baseYearlyPrice,
      discountedYearlyPrice,
      serverNow: new Date(nowMs).toISOString(),
      serverTimestampMs: nowMs,
      reason: elig.reason,
      plans: [
        {
          planId: 'monthly',
          name: '1 oylik',
          basePrice: baseMonthlyPrice,
          finalPrice: monthlyPrice,
          discountPercent: eligible ? discountPercent : 0,
          isDiscounted: eligible,
          savings: eligible ? (baseMonthlyPrice - discountedMonthlyPrice) : 0,
          billingCycle: 'month',
        },
        {
          planId: 'yearly',
          name: '1 yillik',
          basePrice: baseYearlyPrice,
          finalPrice: yearlyPrice,
          discountPercent: eligible ? discountPercent : 0,
          isDiscounted: eligible,
          savings: eligible ? (baseYearlyPrice - discountedYearlyPrice) : 0,
          billingCycle: 'year',
        },
      ],
    },
  };

  return res.json(responsePayload);
});
