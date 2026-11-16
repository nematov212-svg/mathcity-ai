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
      dateOfBirth: user.dateOfBirth,
      age: user.age,
      mode: user.mode,
      grade: user.grade,
      avatarUrl: user.avatarUrl,
      coinBalance: user.coinBalance,
      totalXP: user.totalXP,
      level: user.level,
      cityLevel: user.cityLevel,
      placedBuildingsCount: user.placedBuildings.length,
      unlockedAchievementsCount: user.unlockedAchievements.length,
      createdAt: user.createdAt,
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
