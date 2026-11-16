import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';

export const xpRouter = Router();

xpRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const nextLevelXP = user.level * 200;
  const currentLevelBaseXP = (user.level - 1) * 200;
  const progressPercent = Math.min(
    100,
    Math.round(((user.totalXP - currentLevelBaseXP) / 200) * 100)
  );

  return res.json({
    success: true,
    data: {
      totalXP: user.totalXP,
      level: user.level,
      nextLevelXP,
      progressPercent: Math.max(0, progressPercent),
    },
  });
});
