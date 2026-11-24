import { Router, Response } from 'express';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { calculatePricing } from './discountStore.js';

export const pricingRouter = Router();

/**
 * GET /api/pricing
 * Authoritative server-side pricing single source of truth:
 * - basePrice & finalPrice for monthly and yearly plans
 * - Dynamic discount eligibility (new users <= 7 days, first-time buyer, non-Pro)
 * - discountEndsAt and serverNow timestamps for offset synchronization
 */
pricingRouter.get('/', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const pricingData = calculatePricing(user);

  return res.json({
    success: true,
    data: pricingData,
  });
});
