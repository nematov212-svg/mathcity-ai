import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';

export const cityRouter = Router();

cityRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const buildingsCatalog = repository.getBuildings(user.mode);

  const enrichedBuildings = user.placedBuildings.map((p) => {
    const meta = buildingsCatalog.find((b) => b.key === p.buildingKey);
    return {
      ...p,
      name: meta?.name || p.buildingKey,
      iconName: meta?.iconName || 'home',
      category: meta?.category || 'general',
      description: meta?.description || '',
    };
  });

  return res.json({
    success: true,
    data: {
      cityLevel: user.cityLevel,
      coinBalance: user.coinBalance,
      placedBuildings: enrichedBuildings,
      gridWidth: 4,
      gridHeight: 4,
    },
  });
});

cityRouter.get('/shop', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const catalog = repository.getBuildings(user.mode);

  const shopItems = catalog.map((b) => ({
    ...b,
    isUnlocked: user.level >= b.requiredLevel,
    canAfford: user.coinBalance >= b.costInCoins,
    isAlreadyBuilt: user.placedBuildings.some((p) => p.buildingKey === b.key),
  }));

  return res.json({
    success: true,
    data: {
      coinBalance: user.coinBalance,
      buildings: shopItems,
    },
  });
});

const purchaseSchema = z.object({
  buildingKey: z.string(),
  gridX: z.number().int().min(0).max(3),
  gridY: z.number().int().min(0).max(3),
});

cityRouter.post('/purchase', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const parse = purchaseSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Xarid parametrlari noto‘g‘ri.' });
  }

  const { buildingKey, gridX, gridY } = parse.data;
  const user = req.user!;

  try {
    const result = repository.purchaseAndPlaceBuilding(user.id, buildingKey, gridX, gridY);

    const isObservatory = buildingKey === 'observatory_space';

    return res.json({
      success: true,
      data: {
        message: isObservatory
          ? 'Rasadxona muvaffaqiyatli qurildi! Shahringiz ilm-fan markaziga aylandi!'
          : `${result.buildingName} muvaffaqiyatli qurildi!`,
        buildingKey: result.buildingKey,
        buildingName: result.buildingName,
        gridX,
        gridY,
        newCoinBalance: result.newCoinBalance, // Exactly drops to 0 if starting at 100!
        newCityLevel: result.newCityLevel,
        placedBuildings: result.placedBuildings,
        isObservatory,
      },
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Binoni qurishda xatolik yuz berdi.',
    });
  }
});
