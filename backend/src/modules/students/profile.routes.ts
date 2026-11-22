import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';
import { getTashkentWeekDays } from '../../utils/tashkentTime.js';

export const studentsRouter = Router();

studentsRouter.get('/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  return res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      username: user.username,
      dateOfBirth: user.dateOfBirth,
      age: user.age,
      mode: user.mode,
      grade: user.grade,
      avatarUrl: user.avatarUrl,
      coinBalance: user.coinBalance,
      totalXP: user.totalXP,
      level: user.level,
      cityLevel: user.cityLevel,
      subscription: user.subscription,
      placedBuildingsCount: user.placedBuildings.length,
      unlockedAchievementsCount: user.unlockedAchievements.length,
      createdAt: user.createdAt,
    },
  });
});

// Helper to sort users: Primarily coinBalance DESC -> totalXP DESC -> createdAt ASC
function sortLeaderboardUsers(
  a: { coinBalance?: number; totalXP?: number; createdAt?: string },
  b: { coinBalance?: number; totalXP?: number; createdAt?: string }
): number {
  const coinsA = a.coinBalance || 0;
  const coinsB = b.coinBalance || 0;
  if (coinsB !== coinsA) return coinsB - coinsA;
  const xpA = a.totalXP || 0;
  const xpB = b.totalXP || 0;
  if (xpB !== xpA) return xpB - xpA;
  const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  return timeA - timeB;
}

/**
 * GET /api/me & GET /me
 * Single source of truth for user profile, coins, xp, level, and real leaderboard rank.
 */
studentsRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const allUsers = repository.getAllUsers();
  const sorted = [...allUsers].sort(sortLeaderboardUsers);
  const myRankIndex = sorted.findIndex((u) => u.id === user.id);
  const rank = myRankIndex !== -1 ? myRankIndex + 1 : 1;

  return res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      coins: user.coinBalance,
      coinBalance: user.coinBalance,
      xp: user.totalXP,
      totalXP: user.totalXP,
      level: user.level,
      rank,
      grade: user.grade,
      mode: user.mode,
      subscription: user.subscription,
      createdAt: user.createdAt,
    },
  });
});

/**
 * GET /api/students/leaderboard/me
 * User's own real-time rank, stats, distance to ranks, and status message
 */
studentsRouter.get('/leaderboard/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const allUsers = repository.getAllUsers();

  const isEligible = (user.totalXP || 0) > 0 || (user.coinBalance || 0) > 0;
  const hasRank = isEligible;

  // Active ranked users sorted by coinBalance DESC -> totalXP DESC -> createdAt ASC
  const rankedUsers = [...allUsers].sort(sortLeaderboardUsers);

  const myIndex = rankedUsers.findIndex((u) => u.id === user.id);
  const rank = isEligible ? (myIndex !== -1 ? myIndex + 1 : rankedUsers.length + 1) : null;

  const myCoins = user.coinBalance || 0;
  const coinsToNextRank = (rank !== null && rank > 1) ? Math.max(0, (rankedUsers[rank - 2]?.coinBalance || 0) - myCoins + 1) : 0;
  const coinsToTop100 = (rank !== null && rank <= 100) ? 0 : (rankedUsers.length >= 100 ? Math.max(0, (rankedUsers[99]?.coinBalance || 0) - myCoins + 1) : 0);
  const coinsToTop50 = (rank !== null && rank <= 50) ? 0 : (rankedUsers.length >= 50 ? Math.max(0, (rankedUsers[49]?.coinBalance || 0) - myCoins + 1) : 0);
  const coinsToTop10 = (rank !== null && rank <= 10) ? 0 : (rankedUsers.length >= 10 ? Math.max(0, (rankedUsers[9]?.coinBalance || 0) - myCoins + 1) : 0);
  const coinsToTop5 = (rank !== null && rank <= 5) ? 0 : (rankedUsers.length >= 5 ? Math.max(0, (rankedUsers[4]?.coinBalance || 0) - myCoins + 1) : 0);
  const percentile = (rank !== null && rankedUsers.length > 0) ? Math.round(((rankedUsers.length - rank + 1) / rankedUsers.length) * 100) : 100;

  // Weekly XP calculation using Tashkent week days
  const weekDays = getTashkentWeekDays();
  let weeklyXP = 0;
  for (const w of weekDays) {
    const act = repository.getDailyActivity(user.id, w.dateStr);
    if (act) {
      weeklyXP += act.problemsSolved * 10;
    }
  }
  if (weeklyXP === 0 && isEligible) {
    weeklyXP = user.totalXP || 0;
  }

  return res.json({
    success: true,
    data: {
      hasRank,
      rank,
      totalUsers: rankedUsers.length,
      coins: user.coinBalance || 0,
      coinBalance: user.coinBalance || 0,
      xp: user.totalXP || 0,
      totalXP: user.totalXP || 0,
      level: user.level || 1,
      percentile,
      coinsToNextRank,
      coinsToTop100,
      coinsToTop50,
      coinsToTop10,
      coinsToTop5,
      weeklyXP,
      displayName: user.displayName,
      username: user.username,
      avatarUrl: user.avatarUrl,
      message: hasRank
        ? `Siz ${rank}-o‘rindasiz`
        : 'Hali reytingda emassiz',
      subMessage: hasRank
        ? (coinsToTop100 > 0 ? `Top 100 ga ${coinsToTop100} coin qoldi` : 'Reytingda yuqorilash uchun darslarni davom ettiring')
        : '1 ta misol yechib, reytingga kiring!',
    },
  });
});

/**
 * GET /api/students/leaderboard
 * Global leaderboard sorted by: coinBalance DESC -> totalXP DESC -> createdAt ASC
 * Scopes: top100 (default), top50, top10, top5.
 * Privacy: ONLY exposes rank, username, public first name, avatar, XP, and coin balance.
 */
studentsRouter.get('/leaderboard', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const scope = (req.query.scope as string) || 'top100';
  const period = (req.query.period as string) || 'all';

  let limit = 100;
  if (scope === 'top5') limit = 5;
  else if (scope === 'top10') limit = 10;
  else if (scope === 'top50') limit = 50;
  else if (scope === 'top100') limit = 100;

  const allUsers = repository.getAllUsers();
  const sorted = [...allUsers].sort(sortLeaderboardUsers);

  const fullLeaderboard = sorted.map((u, index) => ({
    rank: index + 1,
    id: u.id,
    username: u.username || `user_${u.id.slice(0, 6)}`,
    displayName: u.displayName ? u.displayName.split(' ')[0] : 'O‘quvchi',
    avatarUrl: u.avatarUrl || null,
    totalXP: u.totalXP || 0,
    coinBalance: u.coinBalance || 0,
    level: u.level || 1,
  }));

  const myUserId = req.user?.id;
  const isEligible = (req.user?.totalXP || 0) > 0 || (req.user?.coinBalance || 0) > 0;
  const myEntry = fullLeaderboard.find((entry) => entry.id === myUserId);
  const myRank = myEntry
    ? myEntry.rank
    : (fullLeaderboard.length > 0 ? fullLeaderboard.length : 1);

  const slicedList = fullLeaderboard.slice(0, limit);

  return res.json({
    success: true,
    data: {
      leaderboard: slicedList,
      totalCount: fullLeaderboard.length,
      scope,
      period,
      limit,
      myRank: {
        hasRank: isEligible,
        rank: myRank,
        id: myUserId,
        username: req.user?.username || (req.user?.displayName ? req.user.displayName.split(' ')[0] : 'Siz'),
        displayName: req.user?.displayName || 'Siz',
        totalXP: req.user?.totalXP || 0,
        coinBalance: req.user?.coinBalance || 0,
        avatarUrl: req.user?.avatarUrl || null,
        level: req.user?.level || 1,
      },
    },
  });
});

const updateProfileSchema = z.object({
  displayName: z.string().min(2).optional(),
  grade: z.number().int().min(1).max(11).optional(),
  avatarUrl: z.string().optional(),
});

studentsRouter.put('/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const parse = updateProfileSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.errors[0].message });
  }

  const updated = repository.updateUser(req.user!.id, parse.data);
  return res.json({
    success: true,
    data: {
      displayName: updated.displayName,
      grade: updated.grade,
      avatarUrl: updated.avatarUrl,
    },
  });
});

const avatarSchema = z.object({
  avatarUrl: z.string().min(1, 'Avatar ma’lumoti kiritilishi shart.'),
});

studentsRouter.patch('/avatar', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const parse = avatarSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.errors[0].message });
  }
  const updated = repository.updateUser(req.user!.id, { avatarUrl: parse.data.avatarUrl });
  return res.json({
    success: true,
    data: { avatarUrl: updated.avatarUrl },
  });
});

// Student Data Export (Privacy compliance)
studentsRouter.get('/export-data', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  return res.json({
    success: true,
    data: {
      profile: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        dateOfBirth: user.dateOfBirth,
        age: user.age,
        grade: user.grade,
        mode: user.mode,
      },
      stats: {
        coinBalance: user.coinBalance,
        totalXP: user.totalXP,
        level: user.level,
        cityLevel: user.cityLevel,
        completedLessons: user.completedLessons,
        placedBuildings: user.placedBuildings,
      },
      exportedAt: new Date().toISOString(),
    },
  });
});
