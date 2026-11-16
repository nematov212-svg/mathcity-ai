import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';

export const achievementsRouter = Router();

achievementsRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const all = repository.getAchievements();

  const userAchievements = all.map((ach) => ({
    ...ach,
    isUnlocked: user.unlockedAchievements.includes(ach.key),
  }));

  return res.json({ success: true, data: userAchievements });
});
