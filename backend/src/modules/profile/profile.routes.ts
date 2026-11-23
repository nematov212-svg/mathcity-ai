import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';
import { getTashkentDateString } from '../../utils/tashkentTime.js';

export const profileRouter = Router();

/**
 * GET /api/profile/summary
 * Single source of truth for Profile stats:
 * - coins & totalXP (from central ledger)
 * - friendsCount (from real friendships)
 * - studyMinutesToday (from Asia/Tashkent dailyActivity heartbeat)
 * - completedLessonsCount & completedTopicsCount
 * - currentStreak & longestStreak (Asia/Tashkent midnight boundary)
 * - isPro (PRO_ACTIVE check)
 * - unlockedAchievementsCount
 */
profileRouter.get('/summary', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const studyMinutesToday = repository.getTodayStudyMinutes(user.id);
  const streak = repository.calculateStreak(user.id);
  const isPro = user.subscription?.status === 'PRO_ACTIVE';

  const allLessons = repository.getLessons();
  const completedLessons = user.completedLessons || [];
  const completedLessonsCount = completedLessons.length;

  const completedTopicIds = new Set(
    allLessons.filter((l) => completedLessons.includes(l.id)).map((l) => l.chapterId || l.topicKey)
  );

  // Compute unified rank: coinBalance DESC -> totalXP DESC -> createdAt ASC
  const allUsers = repository.getAllUsers();
  const sortedUsers = [...allUsers].sort((a, b) => {
    const coinsA = a.coinBalance || 0;
    const coinsB = b.coinBalance || 0;
    if (coinsB !== coinsA) return coinsB - coinsA;
    const xpA = a.totalXP || 0;
    const xpB = b.totalXP || 0;
    if (xpB !== xpA) return xpB - xpA;
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeA - timeB;
  });
  const myIndex = sortedUsers.findIndex((u) => u.id === user.id);
  const rank = myIndex !== -1 ? myIndex + 1 : sortedUsers.length + 1;

  return res.json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      coinBalance: user.coinBalance,
      coins: user.coinBalance,
      totalXP: user.totalXP,
      xp: user.totalXP,
      level: user.level || 1,
      rank,
      friendsCount: user.friendsCount || 0,
      studyMinutesToday,
      completedLessonsCount,
      completedTopicsCount: completedTopicIds.size,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      isPro,
      unlockedAchievementsCount: (user.unlockedAchievements || []).length,
    },
  });
});

/**
 * GET /api/profile/weekly
 * Returns 7 days (Du, Se, Ch, Pa, Ju, Sh, Ya) with study minutes, lessons done, problems solved,
 * dynamic isToday highlight and current streak.
 */
profileRouter.get('/weekly', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const weeklyData = repository.getWeeklyActivity(user.id);
  return res.json({
    success: true,
    data: weeklyData,
  });
});

/**
 * GET /api/profile/study-history
 * Returns 7 days history + total study minutes.
 */
profileRouter.get('/study-history', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const history = repository.getStudyHistory7Days(user.id);
  return res.json({
    success: true,
    data: history,
  });
});

const heartbeatSchema = z.object({
  seconds: z.number().min(1).max(30).default(15),
});

/**
 * POST /api/profile/heartbeat & POST /api/activity/heartbeat
 * Logs foreground study activity in Asia/Tashkent timezone with 16-hour cap.
 */
profileRouter.post('/heartbeat', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const parse = heartbeatSchema.safeParse(req.body);
  const seconds = parse.success ? parse.data.seconds : 15;

  const result = repository.recordHeartbeat(user.id, seconds);
  return res.json({
    success: true,
    data: result,
  });
});
