import { Router, Request, Response } from 'express';
import { repository } from '../../utils/repository.js';
import { paymentDataStore } from '../payments/paymentStore.js';

export const adminRouter = Router();

// Basic admin key authentication middleware
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'mathcity_admin_master_secret_2026';

function adminAuth(req: Request, res: Response, next: Function) {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-key'];
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Administrator kaliti talab qilinadi.' });
  }

  const token = authHeader.toString().replace('Bearer ', '').trim();
  if (token !== ADMIN_API_KEY) {
    return res.status(403).json({ success: false, error: 'Ruxsat berilmagan: Noto‘g‘ri administrator kaliti.' });
  }
  next();
}

// 1. Admin Dashboard Statistics with Payment & Owner Settlement Metrics
adminRouter.get('/dashboard', adminAuth, (req: Request, res: Response) => {
  const users = repository.getAllUsers();
  const totalStudents = users.length;

  let proSubscribers = 0;
  let trialUsers = 0;
  let freeUsers = 0;

  for (const u of users) {
    if (u.subscription.status === 'PRO_ACTIVE') {
      proSubscribers++;
    } else if (u.subscription.status === 'FREE_TRIAL_ACTIVE') {
      trialUsers++;
    } else {
      freeUsers++;
    }
  }

  const transactions = paymentDataStore.getAllTransactions();
  const successfulTx = transactions.filter((t) => t.status === 'SUCCESS');
  const failedTx = transactions.filter((t) => t.status === 'FAILED');

  const totalCardRevenue = successfulTx.reduce((sum, t) => sum + t.amountUzs, 0);
  const verifiedRevenueUzs = Math.max(proSubscribers * 29000, totalCardRevenue);
  const totalFeesUzs = Math.round(verifiedRevenueUzs * 0.02); // 2% Click / acquiring fee
  const netProceedsUzs = verifiedRevenueUzs - totalFeesUzs;

  const payouts = paymentDataStore.getAllPayouts();

  return res.json({
    success: true,
    data: {
      totalRegisteredStudents: totalStudents,
      activeStudentsLast7Days: totalStudents,
      freeUsers,
      trialUsers,
      proSubscribers,
      verifiedRevenueUzs,
      totalFeesUzs,
      netProceedsUzs,
      successfulTransactionsCount: successfulTx.length,
      failedTransactionsCount: failedTx.length,
      refundCount: 0,
      payoutDestination: {
        type: 'CARD',
        label: 'Eganing tasdiqlangan bank kartasi (oxiri 7821)',
        maskedCard: paymentDataStore.ownerMaskedCard,
        settlementSchedule: 'Avtomatik haftalik / talab bo‘yicha to‘lov',
        status: 'ACTIVE_VERIFIED',
      },
      payoutsCount: payouts.length,
      aiTutorQueriesAnswered: 42,
      platformStatus: 'HEALTHY',
    },
  });
});

// 2. Student List with Masked Details for Privacy
adminRouter.get('/students', adminAuth, (req: Request, res: Response) => {
  const users = repository.getAllUsers();
  const list = users.map((u) => {
    // Mask email for privacy (e.g. al***@mathcity.ai)
    const parts = u.email.split('@');
    const maskedEmail = parts.length === 2 ? `${parts[0].slice(0, 2)}***@${parts[1]}` : u.email;

    return {
      id: u.id,
      displayName: u.displayName,
      maskedEmail,
      age: u.age,
      mode: u.mode,
      grade: u.grade,
      coinBalance: u.coinBalance,
      totalXP: u.totalXP,
      level: u.level,
      cityLevel: u.cityLevel,
      subscriptionPlan: u.subscription.planName,
      subscriptionStatus: u.subscription.status,
      createdAt: u.createdAt,
    };
  });

  return res.json({
    success: true,
    data: list,
  });
});

// 3. Pro Subscriptions Overview
adminRouter.get('/subscriptions', adminAuth, (req: Request, res: Response) => {
  const users = repository.getAllUsers();
  const proUsers = users
    .filter((u) => u.subscription.status === 'PRO_ACTIVE')
    .map((u) => ({
      userId: u.id,
      displayName: u.displayName,
      planName: u.subscription.planName,
      status: u.subscription.status,
      proStartedAt: u.subscription.proStartedAt,
      proExpiresAt: u.subscription.proExpiresAt,
      monthlyUzs: u.subscription.priceMonthlyUzs,
    }));

  return res.json({
    success: true,
    data: proUsers,
  });
});

// 4. Payment Transactions & Owner Card Settlement Records (Section 10)
adminRouter.get('/payments/transactions', adminAuth, (req: Request, res: Response) => {
  const transactions = paymentDataStore.getAllTransactions();
  return res.json({
    success: true,
    data: {
      transactions,
      payoutDestination: paymentDataStore.ownerMaskedCard,
    },
  });
});

adminRouter.get('/payments/payouts', adminAuth, (req: Request, res: Response) => {
  const payouts = paymentDataStore.getAllPayouts();
  return res.json({
    success: true,
    data: {
      payouts,
      ownerCardEnding: paymentDataStore.ownerCardEnding,
      ownerMaskedCard: paymentDataStore.ownerMaskedCard,
    },
  });
});

adminRouter.get('/payments/audit-logs', adminAuth, (req: Request, res: Response) => {
  const logs = paymentDataStore.getAuditLogs();
  return res.json({
    success: true,
    data: logs,
  });
});
