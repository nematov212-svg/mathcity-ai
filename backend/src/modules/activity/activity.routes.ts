import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';
import { getTashkentDateString } from '../../utils/tashkentTime.js';

export const activityRouter = Router();

/**
 * GET /api/activity/week
 * Returns 7 days of the current Tashkent week (Monday to Sunday)
 * along with streak information, today's score and level.
 */
activityRouter.get('/week', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const data = repository.getWeeklyActivity(user.id);
  return res.json({
    success: true,
    data,
  });
});

/**
 * GET /api/activity/today
 * Returns today's active progress in Asia/Tashkent
 */
activityRouter.get('/today', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const todayStr = getTashkentDateString();
  const act = repository.getDailyActivity(user.id, todayStr);
  const streak = repository.calculateStreak(user.id);

  return res.json({
    success: true,
    data: {
      date: todayStr,
      correctAnswers: act?.correctAnswers || act?.problemsSolved || 0,
      lessonsCompleted: act?.lessonsCompleted || act?.lessonsDone || 0,
      score: act?.score || 0,
      level: act?.level || 'NONE',
      currentStreak: streak.currentStreak,
      maxStreak: streak.longestStreak,
    },
  });
});

/**
 * POST /api/activity/heartbeat
 * Logs foreground study time heartbeat (compatible with /api/profile/heartbeat)
 */
activityRouter.post('/heartbeat', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { seconds = 15 } = req.body || {};
  const stats = repository.recordDailyActivityHeartbeat(user.id, Number(seconds) || 15);
  return res.json({
    success: true,
    data: stats,
  });
});
