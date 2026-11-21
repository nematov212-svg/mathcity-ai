import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';

export const achievementsRouter = Router();

/**
 * GET /api/achievements
 * Pro-gated endpoint.
 * Returns 403 Forbidden with isProRequired: true if free user.
 * Returns real achievements list with progress and claim states if Pro.
 */
achievementsRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const isPro = user.subscription?.status === 'PRO_ACTIVE';

  if (!isPro) {
    return res.status(403).json({
      success: false,
      error: 'Yutuqlar Pro tarifda ochiladi',
      isProRequired: true,
      isPro: false,
      message: 'Yutuqlar bo‘limi faqat MathCity Pro foydalanuvchilari uchun ochiq.',
    });
  }

  const userAchievements = repository.getAchievementsForUser(user.id);
  return res.json({
    success: true,
    data: userAchievements.achievements,
    unlockedCount: userAchievements.unlockedCount,
    isPro: true,
  });
});

/**
 * POST /api/achievements/:key/claim
 * Claims 10-20 coins and 50-100 XP for an unlocked achievement (Pro only, idempotent).
 */
achievementsRouter.post('/:key/claim', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const key = String(req.params.key);

  try {
    const result = repository.claimAchievementReward(user.id, key);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Yutuq mukofotini olib bo‘lmadi.',
      });
    }

    return res.json({
      success: true,
      data: {
        ...result,
        coinsEarned: result.coinsAwarded,
        xpEarned: result.xpAwarded,
        rewardCoins: result.coinsAwarded,
        rewardXP: result.xpAwarded,
      },
    });
  } catch (err: any) {
    const isProError = err.message && err.message.includes('Pro');
    return res.status(isProError ? 403 : 400).json({
      success: false,
      error: err.message || 'Yutuq mukofotini olishda xatolik yuz berdi.',
      isProRequired: isProError,
    });
  }
});
