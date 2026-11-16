import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';

export const coinsRouter = Router();

coinsRouter.get('/balance', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  return res.json({
    success: true,
    data: {
      balance: user.coinBalance,
      currency: 'Oltin tanga',
    },
  });
});
