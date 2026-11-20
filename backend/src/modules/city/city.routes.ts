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
      citizenCount: user.citizenCount ?? 15,
      carConfig: user.carConfig ?? {
        level: 1,
        model: 'Sedan',
        color: '#E53E3E',
        speed: 1.0,
      },
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
      citizenCount: user.citizenCount ?? 15,
      carConfig: user.carConfig ?? {
        level: 1,
        model: 'Sedan',
        color: '#E53E3E',
        speed: 1.0,
      },
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
        newCoinBalance: result.newCoinBalance,
        newCityLevel: result.newCityLevel,
        placedBuildings: result.placedBuildings,
        citizenCount: user.citizenCount ?? 15,
        carConfig: user.carConfig,
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

// Recruit citizens (25 coins -> +5 citizens)
cityRouter.post('/citizens/recruit', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  try {
    const result = repository.recruitCitizens(user.id, 5, 25);
    return res.json({
      success: true,
      message: '5 nafar yangi fuqaro shahringizga ko‘chib keldi! 🎉',
      data: {
        citizenCount: result.newCitizenCount,
        newCoinBalance: result.newCoinBalance,
      },
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Fuqarolarni taklif qilishda xatolik yuz berdi.',
    });
  }
});

// Upgrade car (50 coins -> speed/model/color upgrade)
cityRouter.post('/car/upgrade', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  try {
    const result = repository.upgradeCar(user.id, 50);
    return res.json({
      success: true,
      message: `Mashina muvaffaqiyatli yangilandi: ${result.newCarConfig.model}! 🚗💨`,
      data: {
        carConfig: result.newCarConfig,
        newCoinBalance: result.newCoinBalance,
      },
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Mashinani yangilashda xatolik yuz berdi.',
    });
  }
});

// Full state sync
cityRouter.post('/sync', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  try {
    const synced = repository.syncCityState(user.id, req.body);
    return res.json({
      success: true,
      message: 'Shahar holati muvaffaqiyatli saqlandi.',
      data: synced,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Shahar holatini saqlashda xatolik yuz berdi.',
    });
  }
});
