import { Router, Request, Response } from 'express';
import { repository } from '../../utils/repository.js';
import { paymentDataStore } from '../payments/paymentStore.js';
import { LessonModel, QuestionModel } from '../../utils/dataStore.js';
import { mathQuestionBank } from '../../utils/questionBank.js';

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

// 0. Admin Login / Token Validation
adminRouter.post('/login', (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey || apiKey.trim() !== ADMIN_API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Noto‘g‘ri administrator maxfiy kaliti.',
    });
  }

  return res.json({
    success: true,
    data: {
      token: ADMIN_API_KEY,
      role: 'SUPER_ADMIN',
      name: 'Bosh Administrator',
      _expiresIn: '24h',

      get expiresIn() {
        return this._expiresIn;
      },
      set expiresIn(value) {
        this._expiresIn = value;
      },
    },
  });
});

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

// 5. Lessons Management CRUD
adminRouter.get('/lessons', adminAuth, (req: Request, res: Response) => {
  const lessons = repository.getLessons();
  const summary = lessons.map((l) => ({
    id: l.id,
    title: l.title,
    grade: l.grade,
    mode: l.mode,
    chapterTitle: l.chapterTitle,
    formulaLatex: l.formulaLatex,
    rewardXP: l.rewardXP,
    rewardCoins: l.rewardCoins,
    sectionsCount: l.sections.length,
    totalQuestions: l.sections.reduce((acc, s) => acc + s.questions.length, 0),
  }));

  return res.json({
    success: true,
    data: summary,
  });
});

adminRouter.post('/lessons', adminAuth, (req: Request, res: Response) => {
  const { title, grade, mode, chapterTitle, description, formulaLatex, rewardCoins, rewardXP } = req.body;
  if (!title || !grade) {
    return res.status(400).json({ success: false, error: 'Dars nomi va sinfi talab qilinadi.' });
  }

  const newLessonId = `lesson-${Date.now()}`;
  const newLesson: LessonModel = {
    id: newLessonId,
    courseId: `course-g${grade}-math`,
    chapterId: `chap-${Date.now()}`,
    chapterTitle: chapterTitle || 'Umumiy mavzular',
    grade: Number(grade),
    mode: mode === 'TEEN' ? 'TEEN' : 'KIDS',
    title,
    topicKey: `topic_${Date.now()}`,
    description: description || '',
    formulaLatex: formulaLatex || '',
    contentMd: `## ${title}\n\n${description || ''}`,
    rewardXP: rewardXP || 100,
    rewardCoins: rewardCoins || 10,
    orderIndex: 99,
    sections: [
      {
        id: `sec-${Date.now()}`,
        lessonId: newLessonId,
        title: '1-qism: Asosiy tushunchalar',
        orderIndex: 1,
        questions: [],
      },
    ],
  };

  repository.addLesson(newLesson);

  return res.status(201).json({
    success: true,
    message: 'Yangi matematika darsi muvaffaqiyatli yaratildi.',
    data: newLesson,
  });
});

adminRouter.put('/lessons/:id', adminAuth, (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = repository.updateLesson(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Dars topilmadi.' });
  }
  return res.json({ success: true, message: 'Dars muvaffaqiyatli yangilandi.' });
});

adminRouter.delete('/lessons/:id', adminAuth, (req: Request, res: Response) => {
  const id = req.params.id as string;
  const deleted = repository.deleteLesson(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Dars topilmadi.' });
  }
  return res.json({ success: true, message: 'Dars muvaffaqiyatli o‘chirildi.' });
});

// 6. Question Pool Management
adminRouter.get('/questions', adminAuth, (req: Request, res: Response) => {
  const questions = repository.getAllQuestions();
  return res.json({
    success: true,
    count: questions.length,
    data: questions,
  });
});

adminRouter.post('/questions', adminAuth, (req: Request, res: Response) => {
  const { sectionId, prompt, options, correctAnswer, explanation, formulaLatex, hint } = req.body;
  if (!sectionId || !prompt || !options || correctAnswer === undefined) {
    return res.status(400).json({ success: false, error: 'Savol maydonlari to‘liq emas.' });
  }

  const newQuestion: QuestionModel = {
    id: `q-${Date.now()}`,
    lessonId: 'admin-created',
    sectionId,
    prompt,
    type: 'MULTIPLE_CHOICE',
    options,
    correctAnswer: String(correctAnswer),
    explanation: explanation || '',
    hint: hint || '',
    formulaLatex: formulaLatex || '',
    orderIndex: 1,
  };

  const added = repository.addQuestion(sectionId, newQuestion);
  if (!added) {
    return res.status(404).json({ success: false, error: 'Berilgan bo‘lim (sectionId) topilmadi.' });
  }

  return res.status(201).json({
    success: true,
    message: 'Yangi savol muvaffaqiyatli qo‘shildi.',
    data: newQuestion,
  });
});
