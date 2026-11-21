import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';
import { MathEngine } from '../../utils/mathEngine.js';

export const gamesRouter = Router();

/**
 * GET /api/games
 * Returns list of games with real user stats (highScore, timesPlayed).
 */
gamesRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const userGames = user.gameResults || [];

  const getHighScore = (key: string) =>
    userGames.filter((g) => g.gameKey === key).reduce((max, g) => Math.max(max, g.score), 0);
  const getTimesPlayed = (key: string) =>
    userGames.filter((g) => g.gameKey === key).length;

  const games = [
    {
      key: 'kosmik_hisob',
      title: 'Kosmik hisob',
      description: 'Fazoviy kema bilan arifmetik savollarga tezkor javob bering va tangalar yuting!',
      category: 'speed_math',
      iconName: 'rocket_launch',
      difficulty: 'Oson - O‘rta',
      rewardCoins: 12,
      rewardXP: 40,
      highScore: getHighScore('kosmik_hisob'),
      timesPlayed: getTimesPlayed('kosmik_hisob'),
      isLocked: false,
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
      highScore: getHighScore('kasrlar_jangi'),
      timesPlayed: getTimesPlayed('kasrlar_jangi'),
      isLocked: false,
    },
  ];

  return res.json({ success: true, data: games });
});

/**
 * GET /api/games/results/recent
 * Returns last 3 game results.
 */
gamesRouter.get('/results/recent', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const recent = repository.getRecentGameResults(user.id);
  return res.json({ success: true, data: recent });
});

const finishGameSchema = z.object({
  gameKey: z.string().optional(),
  score: z.number().int().min(0),
  durationSeconds: z.number().int().min(0).default(30),
});

/**
 * POST /api/games/:key/finish & POST /api/games/finish
 * Server-authoritative game reward calculation, anti-farming cap,
 * mission and achievement triggers.
 */
gamesRouter.post(['/finish', '/:key/finish', '/:key/result'], authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const parse = finishGameSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'O‘yin natijasi ma’lumotlari noto‘g‘ri.' });
  }

  const gameKey = String(req.params.key || parse.data.gameKey || 'kosmik_hisob');
  const { score, durationSeconds } = parse.data;

  const result = repository.finishGame(user.id, gameKey, score, durationSeconds);
  return res.json({ success: true, data: result });
});

gamesRouter.get('/kosmik-hisob/question', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const level = req.query.level ? parseInt(req.query.level as string, 10) : 1;
  const question = MathEngine.generateSpaceMathQuestion(level);
  return res.json({ success: true, data: question });
});

gamesRouter.get('/kasrlar-jangi/question', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const level = req.query.level ? parseInt(req.query.level as string, 10) : 1;
  const question = MathEngine.generateFractionBattleQuestion(level);
  return res.json({ success: true, data: question });
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
