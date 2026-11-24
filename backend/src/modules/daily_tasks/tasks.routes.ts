import { Router, Response } from 'express';
import { authMiddleware, optionalAuthMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';

export const tasksRouter = Router();

/**
 * GET /api/tasks & GET /api/tasks/today & GET /api/missions/today
 * Returns exactly 3 daily missions for Asia/Tashkent today with countdown to midnight.
 */
tasksRouter.get(['/', '/today'], optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const todayData = repository.getTodayMissions(user ? user.id : 'guest');

  // Return both structured missions and map
  return res.json({
    success: true,
    data: {
      missions: todayData.missions,
      tasks: todayData.missions, // alias
      secondsUntilMidnight: todayData.secondsUntilMidnight,
      completedCount: todayData.completedCount,
      claimedCount: todayData.claimedCount,
      todayDateStr: todayData.todayDateStr,
    },
  });
});

/**
 * POST /api/tasks/:key/claim & POST /api/missions/:id/claim
 * Server-authoritative, idempotent claim of mission reward (1 or 2 coins).
 */
tasksRouter.post(['/:key/claim', '/missions/:key/claim'], authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const key = String(req.params.key);

  const claimResult = repository.claimMissionReward(user.id, key);
  if (!claimResult.success) {
    // Check legacy task claim fallback
    const taskDef = repository.getDailyTasks().find((t) => t.key === key);
    const legacyProgress = user.dailyTaskProgress[key];
    if (taskDef && legacyProgress && legacyProgress.isCompleted && !legacyProgress.claimed) {
      legacyProgress.claimed = true;
      repository.creditCoins(user.id, taskDef.rewardCoins, `Kunlik vazifa mukofoti: ${taskDef.title}`);
      repository.addXP(user.id, taskDef.rewardXP);
      return res.json({
        success: true,
        data: {
          message: 'Mukofot muvaffaqiyatli olindi!',
          rewardCoins: taskDef.rewardCoins,
          rewardXP: taskDef.rewardXP,
          newCoinBalance: user.coinBalance,
          newTotalXP: user.totalXP,
        },
      });
    }

    return res.status(400).json({
      success: false,
      error: claimResult.error || 'Mukofotni olib bo‘lmadi.',
    });
  }

  return res.json({
    success: true,
    data: {
      message: 'Mukofot muvaffaqiyatli olindi!',
      coinsAwarded: claimResult.coinsAwarded,
      coinsEarned: claimResult.coinsAwarded,
      rewardCoins: claimResult.coinsAwarded,
      newCoinBalance: claimResult.newCoinBalance,
      newTotalXP: claimResult.newTotalXP,
    },
  });
});
