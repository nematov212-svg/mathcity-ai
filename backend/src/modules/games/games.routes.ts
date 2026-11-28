import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';
import { MathEngine } from '../../utils/mathEngine.js';

export const gamesRouter = Router();

/**
 * GET /api/games/status
 * Returns daily game limit status (Tashkent UTC+5 midnight reset).
 */
gamesRouter.get('/status', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const data = repository.getDailyGameStatus(user.id);
  return res.json({ success: true, data });
});

/**
 * POST /api/games/:id/start & POST /api/games/start
 * Checks daily limit and generates a verified game session.
 */
gamesRouter.post(['/start', '/:id/start'], authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const gameId = String(req.params.id || req.body.gameId || req.body.gameKey || 'tezkor_hisob');
  try {
    const data = repository.startGameSession(user.id, gameId);
    return res.json({ success: true, data });
  } catch (err: any) {
    const status = err.statusCode || 400;
    return res.status(status).json({
      success: false,
      error: err.message || 'Xatolik yuz berdi',
      isLimitReached: err.isLimitReached || false,
    });
  }
});

/**
 * GET /api/games
 * Returns list of games with real user stats (highScore, timesPlayed, daily limit).
 */
gamesRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const userGames = user.gameResults || [];
  const status = repository.getDailyGameStatus(user.id);

  const getHighScore = (key: string) =>
    userGames.filter((g) => g.gameKey === key).reduce((max, g) => Math.max(max, g.score), 0);
  const getTimesPlayed = (key: string) =>
    userGames.filter((g) => g.gameKey === key).length;

  const games = [
    {
      key: 'tug_of_war',
      title: 'Arqon tortish',
      description: '2 jamoa bitta telefonda: misollarni tezroq yeching va arqonni torting!',
      category: 'multiplayer_duel',
      iconName: 'sports_kabaddi',
      difficulty: 'Oson - Qiziqarli',
      rewardCoins: 20,
      rewardXP: 35,
      highScore: getHighScore('tug_of_war'),
      timesPlayed: getTimesPlayed('tug_of_war'),
      isLocked: false,
      route: '/kids/games/tug-of-war',
      dailyLimit: status.games['tug_of_war'] || { used: 0, limit: status.isPro ? 999 : 1, remaining: 1, unlimited: status.isPro },
    },
    {
      key: 'tezkor_hisob',
      title: 'Tezkor hisob',
      description: '60 soniya ichida imkon qadar ko‘p misol yeching va combo to‘plang!',
      category: 'speed_math',
      iconName: 'timer',
      difficulty: 'Tezkor',
      rewardCoins: 20,
      rewardXP: 35,
      highScore: getHighScore('tezkor_hisob'),
      timesPlayed: getTimesPlayed('tezkor_hisob'),
      isLocked: false,
      route: '/kids/games/speed-math',
      dailyLimit: status.games['tezkor_hisob'] || { used: 0, limit: status.isPro ? 999 : 1, remaining: 1, unlimited: status.isPro },
    },
    {
      key: 'xotira_kartalari',
      title: 'Xotira kartalari',
      description: 'Misol va javob kartalarini juftlang, xotirangizni charxlang!',
      category: 'memory_match',
      iconName: 'style',
      difficulty: 'Oson - Fikrlovchi',
      rewardCoins: 20,
      rewardXP: 35,
      highScore: getHighScore('xotira_kartalari'),
      timesPlayed: getTimesPlayed('xotira_kartalari'),
      isLocked: false,
      route: '/kids/games/memory-cards',
      dailyLimit: status.games['xotira_kartalari'] || { used: 0, limit: status.isPro ? 999 : 1, remaining: 1, unlimited: status.isPro },
    },
    {
      key: 'raqamlar_labirinti',
      title: 'Raqamlar labirinti',
      description: 'To‘g‘ri javobli yo‘lni tanlab labirintdan chiqing! 3 ta jon.',
      category: 'maze_puzzle',
      iconName: 'explore',
      difficulty: 'Mantiqiy',
      rewardCoins: 20,
      rewardXP: 35,
      highScore: getHighScore('raqamlar_labirinti'),
      timesPlayed: getTimesPlayed('raqamlar_labirinti'),
      isLocked: false,
      route: '/kids/games/number-maze',
      dailyLimit: status.games['raqamlar_labirinti'] || { used: 0, limit: status.isPro ? 999 : 1, remaining: 1, unlimited: status.isPro },
    },
    {
      key: 'matematik_duel',
      title: 'Matematik duel',
      description: '1v1 bitta telefonda yoki botga qarshi 10 raundlik shiddatli jang!',
      category: 'battle_1v1',
      iconName: 'flash_on',
      difficulty: 'Bellashuv',
      rewardCoins: 20,
      rewardXP: 35,
      highScore: getHighScore('matematik_duel'),
      timesPlayed: getTimesPlayed('matematik_duel'),
      isLocked: false,
      route: '/kids/games/math-duel',
      dailyLimit: status.games['matematik_duel'] || { used: 0, limit: status.isPro ? 999 : 1, remaining: 1, unlimited: status.isPro },
    },
    {
      key: 'uy_qurish',
      title: 'Uy qurish',
      description: 'Misollar yechib tanga to‘plang va orzuingizdagi uyni 6 bosqichda quring!',
      category: 'building_simulation',
      iconName: 'home_work',
      difficulty: 'Oson - Maroqli',
      rewardCoins: 0,
      rewardXP: 680,
      highScore: user.houseBuildingProgress?.currentStage || 0,
      timesPlayed: user.houseBuildingProgress?.completedStages?.length || 0,
      isLocked: false,
      route: '/kids/house-building',
      dailyLimit: { used: 0, limit: 999, remaining: 999, unlimited: true },
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

/**
 * GET /api/games/house-building
 * Returns catalog, user 3D placement state, inventory, and progress.
 */
gamesRouter.get('/house-building', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const data = repository.getHouseBuildingData(user.id);
  return res.json({ success: true, data });
});

const buyItemSchema = z.object({
  itemId: z.string().min(1, 'Buyum identifikatori kiritilmadi.'),
});

/**
 * POST /api/games/house-building/buy
 * Server-authoritative purchase with atomic coin debit and inventory addition.
 */
gamesRouter.post('/house-building/buy', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const parse = buyItemSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.errors[0]?.message || 'Noto‘g‘ri ma’lumot' });
  }

  const result = repository.buyHouseItem(user.id, parse.data.itemId);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.json({ success: true, data: result });
});

const placeItemSchema = z.object({
  itemId: z.string().min(1),
  cellX: z.number().int().min(0).max(11),
  cellY: z.number().int().min(0).max(11),
  rotation: z.number().int().optional().default(0),
  color: z.string().optional(),
});

/**
 * POST /api/games/house-building/place
 * Place an owned item on 12x12 grid with dependency and zone checks.
 */
gamesRouter.post('/house-building/place', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const parse = placeItemSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Joylashtirish ma’lumotlari noto‘g‘ri kiritildi.' });
  }

  const { itemId, cellX, cellY, rotation, color } = parse.data;
  const result = repository.placeHouseItem(user.id, itemId, cellX, cellY, rotation, color);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.json({ success: true, data: result });
});

const moveItemSchema = z.object({
  instanceId: z.string().min(1),
  newCellX: z.number().int().min(0).max(11),
  newCellY: z.number().int().min(0).max(11),
});

/**
 * POST /api/games/house-building/move
 */
gamesRouter.post('/house-building/move', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const parse = moveItemSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Ko‘chirish koordinatalari noto‘g‘ri.' });
  }

  const result = repository.moveHouseItem(user.id, parse.data.instanceId, parse.data.newCellX, parse.data.newCellY);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.json({ success: true, data: result });
});

const rotateItemSchema = z.object({
  instanceId: z.string().min(1),
  rotation: z.number().int().optional(),
});

/**
 * POST /api/games/house-building/rotate
 */
gamesRouter.post('/house-building/rotate', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const parse = rotateItemSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Aylantirish ma’lumotlari noto‘g‘ri.' });
  }

  const result = repository.rotateHouseItem(user.id, parse.data.instanceId, parse.data.rotation);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.json({ success: true, data: result });
});

const sellItemSchema = z.object({
  instanceId: z.string().optional(),
  itemId: z.string().optional(),
});

/**
 * POST /api/games/house-building/sell
 * Sell an item and refund 50% of the catalog price.
 */
gamesRouter.post('/house-building/sell', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const parse = sellItemSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Sotish ma’lumotlari noto‘g‘ri.' });
  }

  const targetId = parse.data.instanceId || parse.data.itemId;
  if (!targetId) {
    return res.status(400).json({ success: false, error: 'Sotiladigan buyum ko‘rsatilmadi.' });
  }

  const result = repository.sellHouseItem(user.id, targetId);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.json({ success: true, data: result });
});

const buildHouseSchema = z.object({
  stage: z.number().int().min(1).max(6),
});

/**
 * POST /api/games/house-building/build
 * Build a house stage with server-authoritative coin deduction and XP award.
 */
gamesRouter.post('/house-building/build', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const parse = buildHouseSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Bosqich raqami (1-6) noto‘g‘ri kiritildi.' });
  }

  const result = repository.buildHouseStage(user.id, parse.data.stage);
  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.json({ success: true, data: result });
});

const finishGameSchema = z.object({
  gameId: z.string().optional(),
  gameKey: z.string().optional(),
  sessionId: z.string().optional(),
  result: z.enum(['win', 'draw', 'loss', 'participated']).optional(),
  score: z.number().int().min(0).default(0),
  durationSeconds: z.number().int().min(0).default(30),
  moves: z.number().int().optional(),
  correctAnswers: z.number().int().optional(),
  totalQuestions: z.number().int().optional(),
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

  const gameKey = String(req.params.key || parse.data.gameId || parse.data.gameKey || 'tezkor_hisob');
  const { score, durationSeconds, sessionId, result, moves, correctAnswers, totalQuestions } = parse.data;

  try {
    const data = repository.finishGameSession(user.id, gameKey, {
      sessionId,
      result,
      score,
      durationSeconds,
      moves,
      correctAnswers,
      totalQuestions,
    });
    return res.json({ success: true, data });
  } catch (err: any) {
    const status = err.statusCode || 400;
    return res.status(status).json({
      success: false,
      error: err.message || 'Xatolik yuz berdi',
      isLimitReached: err.isLimitReached || false,
    });
  }
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

/**
 * GET /api/games/cars
 * Returns list of 10 cars with user unlock status, colors, and condition.
 */
gamesRouter.get('/cars', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const cars = repository.getGameCars(user.id);
  return res.json({ success: true, data: cars });
});

/**
 * POST /api/games/cars/:key/buy
 * Purchase a car using coins.
 */
gamesRouter.post('/cars/:key/buy', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const carKey = String(req.params.key);
  try {
    const result = repository.buyGameCar(user.id, carKey);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Xatolik yuz berdi' });
  }
});

/**
 * POST /api/games/cars/:key/customize
 * Customize color and wheel rims.
 */
gamesRouter.post('/cars/:key/customize', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const carKey = String(req.params.key);
  const { color, wheels } = req.body || {};
  try {
    const result = repository.customizeGameCar(user.id, carKey, color, wheels);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Xatolik yuz berdi' });
  }
});

/**
 * POST /api/games/cars/:key/repair
 * Repair damaged car.
 */
gamesRouter.post('/cars/:key/repair', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const carKey = String(req.params.key);
  try {
    const result = repository.repairGameCar(user.id, carKey);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Xatolik yuz berdi' });
  }
});

/**
 * POST /api/games/drift/score
 * Submit drift run score and receive rewards.
 */
const driftScoreSchema = z.object({
  carKey: z.string().default('samarkand_gt'),
  score: z.number().int().min(0),
  maxCombo: z.number().int().min(1).default(1),
});

gamesRouter.post('/drift/score', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const parse = driftScoreSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Drift ball ma’lumotlari noto‘g‘ri' });
  }
  const { carKey, score, maxCombo } = parse.data;
  const result = repository.saveDriftScore(user.id, carKey, score, maxCombo);
  return res.json({ success: true, data: result });
});

/**
 * GET /api/games/drift/leaderboard
 * Drift mode high-scores leaderboard.
 */
gamesRouter.get('/drift/leaderboard', authMiddleware, (_req: AuthenticatedRequest, res: Response) => {
  const leaderboard = repository.getDriftLeaderboard(20);
  return res.json({ success: true, data: leaderboard });
});
