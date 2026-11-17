import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';
import { MathEngine } from '../../utils/mathEngine.js';

export const gamesRouter = Router();

gamesRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const games = [
    {
      key: 'kosmik_hisob',
      title: 'Kosmik hisob',
      description: 'Figma 2:34: Fazoviy kema bilan arifmetik savollarga tezkor javob bering va tangalar yuting!',
      category: 'speed_math',
      iconName: 'rocket_launch',
      difficulty: 'Oson - O‘rta',
      rewardCoins: 12,
      rewardXP: 40,
    },
    {
      key: 'kasrlar_jangi',
      title: 'Kasrlar jangi',
      description: 'Kasrlarni vizual shakllar bilan taqqoslang va fazoni zabt eting.',
      category: 'fractions',
      iconName: 'pie_chart',
      difficulty: 'O‘rta',
      rewardCoins: 15,
      rewardXP: 50,
    },
  ];

  return res.json({ success: true, data: games });
});

gamesRouter.get('/kosmik-hisob/question', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const level = req.query.level ? parseInt(req.query.level as string, 10) : 1;
  const question = MathEngine.generateSpaceMathQuestion(level);
  return res.json({ success: true, data: question });
});

const submitGameSchema = z.object({
  score: z.number().int().min(0),
  correctAnswersCount: z.number().int().min(0),
  level: z.number().int().min(1).default(1),
});

gamesRouter.post('/kosmik-hisob/result', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const parse = submitGameSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'O‘yin natijasi noto‘g‘ri.' });
  }

  const { score, correctAnswersCount } = parse.data;
  const user = req.user!;

  const coinsEarned = Math.min(100, Math.floor(score / 10) * 5);
  const xpEarned = Math.min(150, correctAnswersCount * 15);

  if (coinsEarned > 0) {
    repository.creditCoins(user.id, coinsEarned, 'Kosmik hisob o‘yini yutug‘i');
  }
  if (xpEarned > 0) {
    repository.addXP(user.id, xpEarned);
  }

  // Update daily task
  if (user.dailyTaskProgress['task_play_space_game']) {
    user.dailyTaskProgress['task_play_space_game'].currentCount = 1;
    user.dailyTaskProgress['task_play_space_game'].isCompleted = true;
  }

  // Check achievement
  if (correctAnswersCount >= 3 && !user.unlockedAchievements.includes('ach_space_explorer')) {
    user.unlockedAchievements.push('ach_space_explorer');
  }

  return res.json({
    success: true,
    data: {
      score,
      correctAnswersCount,
      coinsEarned,
      xpEarned,
      newCoinBalance: user.coinBalance,
      newTotalXP: user.totalXP,
    },
  });
});

gamesRouter.get('/kasrlar-jangi/question', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const level = req.query.level ? parseInt(req.query.level as string, 10) : 1;
  const question = MathEngine.generateFractionBattleQuestion(level);
  return res.json({ success: true, data: question });
});

gamesRouter.post('/kasrlar-jangi/result', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const parse = submitGameSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'O‘yin natijasi noto‘g‘ri.' });
  }

  const { score, correctAnswersCount } = parse.data;
  const user = req.user!;

  const coinsEarned = Math.min(100, Math.floor(score / 10) * 5);
  const xpEarned = Math.min(150, correctAnswersCount * 15);

  if (coinsEarned > 0) {
    repository.creditCoins(user.id, coinsEarned, 'Kasrlar jangi o‘yini yutug‘i');
  }
  if (xpEarned > 0) {
    repository.addXP(user.id, xpEarned);
  }

  return res.json({
    success: true,
    data: {
      score,
      correctAnswersCount,
      coinsEarned,
      xpEarned,
      newCoinBalance: user.coinBalance,
      newTotalXP: user.totalXP,
    },
  });
});

gamesRouter.post('/hint', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.coinBalance < 5) {
    return res.status(400).json({
      success: false,
      error: 'Yordam olish uchun tangalar yetarli emas (kamida 5 tanga kerak).',
    });
  }

  const success = repository.debitCoins(user.id, 5, 'O‘yinda yordam olish');
  if (!success) {
    return res.status(400).json({
      success: false,
      error: 'Tangalarni yechishda xatolik yuz berdi.',
    });
  }

  return res.json({
    success: true,
    data: {
      coinsDeducted: 5,
      newCoinBalance: user.coinBalance,
    },
  });
});

gamesRouter.get('/kasrlar-jangi/question', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const level = req.query.level ? parseInt(req.query.level as string, 10) : 1;
  const question = MathEngine.generateFractionBattleQuestion(level);
  return res.json({ success: true, data: question });
});

gamesRouter.post('/kasrlar-jangi/result', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const parse = submitGameSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'O‘yin natijasi noto‘g‘ri.' });
  }

  const { score, correctAnswersCount } = parse.data;
  const user = req.user!;

  const coinsEarned = Math.min(100, Math.floor(score / 10) * 5);
  const xpEarned = Math.min(150, correctAnswersCount * 15);

  if (coinsEarned > 0) {
    repository.creditCoins(user.id, coinsEarned, 'Kasrlar jangi o‘yini yutug‘i');
  }
  if (xpEarned > 0) {
    repository.addXP(user.id, xpEarned);
  }

  return res.json({
    success: true,
    data: {
      score,
      correctAnswersCount,
      coinsEarned,
      xpEarned,
      newCoinBalance: user.coinBalance,
      newTotalXP: user.totalXP,
    },
  });
});

gamesRouter.post('/hint', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.coinBalance < 5) {
    return res.status(400).json({
      success: false,
      error: 'Yordam olish uchun tangalar yetarli emas (kamida 5 tanga kerak).',
    });
  }

  const success = repository.debitCoins(user.id, 5, 'O‘yinda yordam olish');
  if (!success) {
    return res.status(400).json({
      success: false,
      error: 'Tangalarni yechishda xatolik yuz berdi.',
    });
  }

  return res.json({
    success: true,
    data: {
      coinsDeducted: 5,
      newCoinBalance: user.coinBalance,
    },
  });
});
