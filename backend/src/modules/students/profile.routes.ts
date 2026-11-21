import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';

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

/**
 * GET /api/me & GET /me
 * Single source of truth for user profile, coins, xp, level, and real leaderboard rank.
 */
studentsRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const allUsers = repository.getAllUsers();
  const sorted = [...allUsers].sort((a, b) => {
    if (b.totalXP !== a.totalXP) return b.totalXP - a.totalXP;
    if (b.coinBalance !== a.coinBalance) return b.coinBalance - a.coinBalance;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
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
 * GET /api/students/leaderboard
 * Global leaderboard sorted by: totalXP DESC -> coinBalance DESC -> createdAt ASC
 * Privacy: ONLY exposes rank, username, public first name, avatar, XP, and coin balance.
 * NEVER returns emails, passwords, phones, or sensitive details.
 */
studentsRouter.get('/leaderboard', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const allUsers = repository.getAllUsers();

  // Sort: XP DESC, then Coins DESC, then older registration first
  const sorted = [...allUsers].sort((a, b) => {
    if (b.totalXP !== a.totalXP) return b.totalXP - a.totalXP;
    if (b.coinBalance !== a.coinBalance) return b.coinBalance - a.coinBalance;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

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
  const myEntry = fullLeaderboard.find((entry) => entry.id === myUserId);
  const myRank = myEntry
    ? myEntry.rank
    : fullLeaderboard.length > 0
    ? fullLeaderboard.length
    : 1;

  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.max(5, Math.min(100, parseInt(req.query.limit as string, 10) || 50));
  const startIndex = (page - 1) * limit;
  const paginatedList = fullLeaderboard.slice(startIndex, startIndex + limit);

  return res.json({
    success: true,
    data: {
      leaderboard: paginatedList,
      totalCount: fullLeaderboard.length,
      page,
      limit,
      myRank: {
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
