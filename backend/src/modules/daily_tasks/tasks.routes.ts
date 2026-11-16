import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';

export const tasksRouter = Router();

tasksRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const allTasks = repository.getDailyTasks();

  const userTasks = allTasks.map((t) => {
    const progress = user.dailyTaskProgress[t.key] || {
      currentCount: 0,
      isCompleted: false,
      claimed: false,
    };
    return {
      key: t.key,
      title: t.title,
      description: t.description,
      targetCount: t.targetCount,
      currentCount: progress.currentCount,
      isCompleted: progress.isCompleted,
      claimed: progress.claimed,
      rewardCoins: t.rewardCoins,
      rewardXP: t.rewardXP,
    };
  });

  return res.json({ success: true, data: userTasks });
});

tasksRouter.post('/:key/claim', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const taskKey = String(req.params.key);

  const taskDef = repository.getDailyTasks().find((t) => t.key === taskKey);
  if (!taskDef) {
    return res.status(404).json({ success: false, error: 'Vazifa topilmadi.' });
  }

  const progress = user.dailyTaskProgress[taskKey];
  if (!progress || !progress.isCompleted) {
    return res.status(400).json({ success: false, error: 'Ushbu vazifa hali yakunlanmagan.' });
  }

  if (progress.claimed) {
    return res.status(400).json({ success: false, error: 'Mukofot avval olingan.' });
  }

  progress.claimed = true;
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
});
