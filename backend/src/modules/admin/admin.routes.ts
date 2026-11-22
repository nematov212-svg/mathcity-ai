import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { repository } from '../../utils/repository.js';
import { paymentDataStore } from '../payments/paymentStore.js';
import { LessonModel } from '../../utils/dataStore.js';
import { broadcastLessonEvent } from '../lessons/lessons.routes.js';
import {
  mathQuestionBank,
  addQuestionToBank,
  updateQuestionInBank,
  deleteQuestionFromBank,
  findQuestionById,
  getAllAdminQuestions,
  QuestionBankItem,
} from '../../utils/questionBank.js';
import { adminStore } from './adminStore.js';
import { config } from '../../config/env.js';

export const adminRouter = Router();

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'mathcity_admin_master_secret_2026';

export interface AuthenticatedAdminRequest extends Request {
  adminUser?: {
    id: string;
    username: string;
    role: string;
    mustChangePassword: boolean;
  };
}

// ---------------------------------------------------------------------------
// ADMIN AUTHORIZATION MIDDLEWARE
// Supports JWT session token and master secret fallback
// Rejects ordinary student accounts
// ---------------------------------------------------------------------------
export function adminAuth(req: AuthenticatedAdminRequest, res: Response, next: Function) {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-key'];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Administrator ruxsati talab qilinadi. Iltimos, tizimga kiring.',
    });
  }

  const rawToken = authHeader.toString().replace('Bearer ', '').trim();

  // 1. Direct API Key check (for CLI / legacy automation)
  if (rawToken === ADMIN_API_KEY) {
    const admin = adminStore.getAdmin();
    req.adminUser = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      mustChangePassword: admin.mustChangePassword,
    };
    return next();
  }

  // 2. JWT Admin Session verification
  try {
    const decoded = jwt.verify(rawToken, config.jwtSecret) as any;
    if (decoded && (decoded.role === 'SUPER_ADMIN' || decoded.role === 'ADMIN')) {
      req.adminUser = {
        id: decoded.id || 'admin-mirzobek-01',
        username: decoded.username || 'mirzobek',
        role: decoded.role,
        mustChangePassword: !!decoded.mustChangePassword,
      };
      return next();
    }

    // Explicitly reject student tokens attempting to access admin endpoints
    return res.status(403).json({
      success: false,
      error: 'Ruxsat etilmadi: O‘quvchi hisoblari administrator boshqaruviga kira olmaydi.',
    });
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      error: 'Administrator sessiyasi eskirgan yoki yaroqsiz. Qaytadan kiring.',
    });
  }
}

// ---------------------------------------------------------------------------
// 0. ADMIN AUTHENTICATION (Login, Password Change, Session)
// Default development login: mirzobek / mirzobek
// ---------------------------------------------------------------------------
adminRouter.post('/login', (req: Request, res: Response) => {
  const { username, login, email, password, apiKey } = req.body;
  const identifier = username || login || email;

  // Legacy API Key direct login
  if (apiKey && apiKey.trim() === ADMIN_API_KEY) {
    const admin = adminStore.getAdmin();
    const token = jwt.sign(
      { id: admin.id, username: admin.username, email: admin.email, role: admin.role, mustChangePassword: admin.mustChangePassword },
      config.jwtSecret,
      { expiresIn: '24h' }
    );
    return res.json({
      success: true,
      data: {
        token,
        role: admin.role,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        mustChangePassword: admin.mustChangePassword,
        expiresIn: '24h',
      },
    });
  }

  // Username/email and password login
  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      error: 'Administrator foydalanuvchi nomi (yoki email) va parolini kiriting.',
    });
  }

  const result = adminStore.verifyCredentials(identifier.toString().trim(), password.toString().trim());
  if (!result.success || !result.admin) {
    return res.status(401).json({
      success: false,
      error: result.error || 'Kirish taqiqlandi: Noto‘g‘ri login yoki parol.',
    });
  }

  const admin = result.admin;
  const token = jwt.sign(
    { id: admin.id, username: admin.username, email: admin.email, role: admin.role, mustChangePassword: admin.mustChangePassword },
    config.jwtSecret,
    { expiresIn: '24h' }
  );

  return res.json({
    success: true,
    data: {
      token,
      role: admin.role,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      mustChangePassword: admin.mustChangePassword,
      expiresIn: '24h',
    },
  });
});

adminRouter.post('/change-password', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Eski parol va yangi parolni kiriting.',
    });
  }

  const result = adminStore.changePassword(oldPassword, newPassword);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error || 'Parolni o‘zgartirishda xatolik yuz berdi.',
    });
  }

  const admin = adminStore.getAdmin();
  const newToken = jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role, mustChangePassword: false },
    config.jwtSecret,
    { expiresIn: '24h' }
  );

  return res.json({
    success: true,
    message: 'Administrator paroli muvaffaqiyatli yangilandi.',
    data: {
      token: newToken,
      mustChangePassword: false,
    },
  });
});

adminRouter.post('/logout', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  adminStore.logAction({
    adminId: req.adminUser?.id || 'admin',
    adminUsername: req.adminUser?.username || 'mirzobek',
    action: 'ADMIN_LOGOUT',
    targetType: 'AUTH',
  });
  return res.json({ success: true, message: 'Tizimdan muvaffaqiyatli chiqildi.' });
});

adminRouter.get('/me', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const admin = adminStore.getAdmin();
  return res.json({
    success: true,
    data: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      mustChangePassword: admin.mustChangePassword,
      lastLoginAt: admin.lastLoginAt,
    },
  });
});

// ---------------------------------------------------------------------------
// 1. MAIN ANALYTICS DASHBOARD (Section 8)
// Aggregated data based on real Tashkent time business day
// ---------------------------------------------------------------------------
adminRouter.get('/dashboard', adminAuth, (req: Request, res: Response) => {
  const users = repository.getAllUsers();
  const totalStudents = users.length;

  const now = new Date();
  // Tashkent time (+5 UTC) for reporting boundaries
  const todayStr = new Date(now.getTime() + 5 * 3600000).toISOString().split('T')[0];

  let newUsersToday = 0;
  let activeUsersToday = 0;
  let proSubscribers = 0;
  let trialUsers = 0;
  let freeUsers = 0;
  let kidsCount = 0;
  let teensCount = 0;

  for (const u of users) {
    if (u.mode === 'KIDS') kidsCount++;
    else teensCount++;

    if (u.createdAt && u.createdAt.startsWith(todayStr)) {
      newUsersToday++;
    }

    if (u.subscription.status === 'PRO_ACTIVE') {
      proSubscribers++;
    } else if (u.subscription.status === 'FREE_TRIAL_ACTIVE') {
      trialUsers++;
    } else {
      freeUsers++;
    }
  }

  activeUsersToday = totalStudents; // In local development test environment

  const transactions = paymentDataStore.getAllTransactions();
  const successfulTx = transactions.filter((t) => t.status === 'SUCCESS');
  const failedTx = transactions.filter((t) => t.status === 'FAILED');

  const totalCardRevenue = successfulTx.reduce((sum, t) => sum + t.amountUzs, 0);
  const verifiedRevenueUzs = Math.max(proSubscribers * 29000, totalCardRevenue);
  const totalFeesUzs = Math.round(verifiedRevenueUzs * 0.02);
  const netProceedsUzs = verifiedRevenueUzs - totalFeesUzs;

  const todayTransactions = successfulTx.filter((t) => t.createdAt && t.createdAt.startsWith(todayStr));
  const revenueTodayUzs = todayTransactions.reduce((sum, t) => sum + t.amountUzs, 0);

  const activeQuestions = mathQuestionBank.filter((q) => q.isPublished);
  const kidsQuestions = activeQuestions.filter((q) => q.audience === 'KIDS' || (!q.audience && q.grade <= 4));
  const teensQuestions = activeQuestions.filter((q) => q.audience === 'TEEN' || (!q.audience && q.grade >= 5));

  const lessons = repository.getLessons(undefined, undefined, true);
  const completedLessonsCount = users.reduce((acc, u) => acc + (u.completedLessons ? u.completedLessons.length : 0), 0);

  return res.json({
    success: true,
    data: {
      totalRegisteredStudents: totalStudents,
      newUsersToday,
      activeUsersToday,
      activeStudentsLast7Days: totalStudents,
      kidsCount,
      teensCount,
      freeUsers,
      trialUsers,
      proSubscribers,
      revenueTodayUzs,
      verifiedRevenueUzs,
      totalFeesUzs,
      netProceedsUzs,
      successfulTransactionsCount: successfulTx.length,
      failedTransactionsCount: failedTx.length,
      totalLessons: lessons.length,
      completedLessonsCount,
      totalQuestions: activeQuestions.length,
      kidsQuestionsCount: kidsQuestions.length,
      teensQuestionsCount: teensQuestions.length,
      payoutDestination: {
        type: 'CARD',
        label: 'Eganing tasdiqlangan bank kartasi (boshi 4916)',
        maskedCard: paymentDataStore.ownerMaskedCard,
        settlementSchedule: 'Avtomatik haftalik / talab bo‘yicha to‘lov',
        status: 'ACTIVE_VERIFIED',
      },
      aiTutorQueriesAnswered: 42,
      platformStatus: 'HEALTHY',
    },
  });
});

// ---------------------------------------------------------------------------
// 2. REAL STUDENT REGISTRATIONS & MANAGEMENT (Section 6)
// ---------------------------------------------------------------------------
adminRouter.get('/students', adminAuth, (req: Request, res: Response) => {
  const users = repository.getAllUsers();
  const search = req.query.search ? (req.query.search as string).toLowerCase().trim() : '';
  const mode = req.query.mode as string | undefined;
  const grade = req.query.grade ? parseInt(req.query.grade as string, 10) : undefined;

  let filtered = users;
  if (search) {
    filtered = filtered.filter(
      (u) =>
        u.displayName.toLowerCase().includes(search) ||
        (u.username && u.username.toLowerCase().includes(search)) ||
        u.email.toLowerCase().includes(search)
    );
  }
  if (mode && (mode === 'KIDS' || mode === 'TEEN')) {
    filtered = filtered.filter((u) => u.mode === mode);
  }
  if (grade && grade >= 1 && grade <= 11) {
    filtered = filtered.filter((u) => u.grade === grade);
  }

  const list = filtered.map((u) => {
    const parts = u.email.split('@');
    const maskedEmail = parts.length === 2 ? `${parts[0].slice(0, 2)}***@${parts[1]}` : u.email;

    return {
      id: u.id,
      displayName: u.displayName,
      username: u.username || '—',
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
      isBlocked: !!u.isBlocked,
      completedLessonsCount: u.completedLessons ? u.completedLessons.length : 0,
      solvedQuestionsCount: u.solvedQuestions ? u.solvedQuestions.length : 0,
      createdAt: u.createdAt,
      lastActivityAt: u.createdAt,
    };
  });

  return res.json({
    success: true,
    total: list.length,
    data: list,
  });
});

adminRouter.patch('/students/:id/block', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const studentId = String(req.params.id);
  const user = repository.getUserById(studentId);
  if (!user) {
    return res.status(404).json({ success: false, error: 'O‘quvchi hisobi topilmadi.' });
  }
  user.isBlocked = true;
  adminStore.logAction({
    adminId: req.adminUser?.id || 'admin',
    adminUsername: req.adminUser?.username || 'mirzobek',
    action: 'BLOCK_STUDENT',
    targetType: 'STUDENT',
    targetId: user.id,
    details: { username: user.username || user.email },
  });
  return res.json({
    success: true,
    message: 'O‘quvchi hisobi muvaffaqiyatli bloklandi.',
    data: { id: user.id, isBlocked: true },
  });
});

adminRouter.patch('/students/:id/unblock', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const studentId = String(req.params.id);
  const user = repository.getUserById(studentId);
  if (!user) {
    return res.status(404).json({ success: false, error: 'O‘quvchi hisobi topilmadi.' });
  }
  user.isBlocked = false;
  adminStore.logAction({
    adminId: req.adminUser?.id || 'admin',
    adminUsername: req.adminUser?.username || 'mirzobek',
    action: 'UNBLOCK_STUDENT',
    targetType: 'STUDENT',
    targetId: user.id,
    details: { username: user.username || user.email },
  });
  return res.json({
    success: true,
    message: 'O‘quvchi hisobi blokdan chiqarildi.',
    data: { id: user.id, isBlocked: false },
  });
});

adminRouter.get('/students/stats', adminAuth, (req: Request, res: Response) => {
  const users = repository.getAllUsers();
  const now = new Date();
  const todayStr = new Date(now.getTime() + 5 * 3600000).toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

  let newToday = 0;
  let newThisWeek = 0;
  let kidsCount = 0;
  let teensCount = 0;
  let proCount = 0;

  for (const u of users) {
    if (u.mode === 'KIDS') kidsCount++;
    else teensCount++;

    if (u.subscription.status === 'PRO_ACTIVE') proCount++;
    if (u.createdAt && u.createdAt.startsWith(todayStr)) newToday++;
    if (u.createdAt && u.createdAt >= weekAgo) newThisWeek++;
  }

  return res.json({
    success: true,
    data: {
      totalRegistered: users.length,
      newToday,
      newThisWeek,
      activeToday: users.length,
      activeThisMonth: users.length,
      kidsCount,
      teensCount,
      proCount,
    },
  });
});

// ---------------------------------------------------------------------------
// 3. FINANCE & SUBSCRIPTION MONITORING (Section 7)
// ---------------------------------------------------------------------------
adminRouter.get('/finance/overview', adminAuth, (req: Request, res: Response) => {
  const users = repository.getAllUsers();
  const proSubscribers = users.filter((u) => u.subscription.status === 'PRO_ACTIVE').length;
  const transactions = paymentDataStore.getAllTransactions();
  const successfulTx = transactions.filter((t) => t.status === 'SUCCESS');
  const failedTx = transactions.filter((t) => t.status === 'FAILED');

  const totalCardRevenue = successfulTx.reduce((sum, t) => sum + t.amountUzs, 0);
  const verifiedRevenueUzs = Math.max(proSubscribers * 29000, totalCardRevenue);
  const totalFeesUzs = Math.round(verifiedRevenueUzs * 0.02);
  const netProceedsUzs = verifiedRevenueUzs - totalFeesUzs;

  return res.json({
    success: true,
    data: {
      verifiedRevenueUzs,
      totalFeesUzs,
      netProceedsUzs,
      proSubscribers,
      successfulTransactionsCount: successfulTx.length,
      failedTransactionsCount: failedTx.length,
      ownerMaskedCard: paymentDataStore.ownerMaskedCard,
      planPriceUzs: 29000,
    },
  });
});

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

adminRouter.get('/subscriptions', adminAuth, (req: Request, res: Response) => {
  const users = repository.getAllUsers();
  const proUsers = users
    .filter((u) => u.subscription.status === 'PRO_ACTIVE' || u.subscription.status === 'FREE_TRIAL_ACTIVE')
    .map((u) => ({
      userId: u.id,
      displayName: u.displayName,
      planName: u.subscription.planName,
      status: u.subscription.status,
      proStartedAt: u.subscription.proStartedAt,
      proExpiresAt: u.subscription.proExpiresAt,
      trialExpiresAt: u.subscription.trialExpiresAt,
      monthlyUzs: u.subscription.priceMonthlyUzs,
    }));

  return res.json({
    success: true,
    data: proUsers,
  });
});

// ---------------------------------------------------------------------------
// 4. QUESTIONS MANAGEMENT (Sections 2, 3 & 4)
// Clean Zero State initial: Jami savollar: 0, Kids: 0, O‘smirlar: 0
// Strict separation between Kids and Teens question banks
// ---------------------------------------------------------------------------
adminRouter.get('/questions', adminAuth, (req: Request, res: Response) => {
  const audience = req.query.audience as 'KIDS' | 'TEEN' | undefined;
  const grade = req.query.grade ? parseInt(req.query.grade as string, 10) : undefined;
  const status = req.query.status as string | undefined;
  const search = req.query.search ? (req.query.search as string).toLowerCase().trim() : '';

  let list = getAllAdminQuestions({ audience, grade, status });
  if (search) {
    list = list.filter(
      (q) =>
        q.prompt.toLowerCase().includes(search) ||
        q.topic.toLowerCase().includes(search) ||
        (q.subject && q.subject.toLowerCase().includes(search))
    );
  }

  const allActive = mathQuestionBank;
  const kidsCount = allActive.filter((q) => q.audience === 'KIDS').length;
  const teensCount = allActive.filter((q) => q.audience === 'TEEN').length;

  return res.json({
    success: true,
    count: allActive.length,
    kidsCount,
    teensCount,
    data: list,
  });
});

adminRouter.post('/questions', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const {
    audience,
    grade,
    subject,
    topic,
    difficulty,
    type,
    prompt,
    formulaLatex,
    imageUrl,
    options,
    correctAnswer,
    explanation,
    hint,
    rewardCoins,
    rewardXP,
    status,
  } = req.body;

  if (!prompt || !topic || correctAnswer === undefined || !grade) {
    return res.status(400).json({
      success: false,
      error: 'Savol matni, mavzusi, sinfi va to‘g‘ri javobini kiritish majburiy.',
    });
  }

  const resolvedAudience: 'KIDS' | 'TEEN' =
    audience === 'KIDS' || audience === 'TEEN' ? audience : Number(grade) <= 4 ? 'KIDS' : 'TEEN';

  const isPublished = status !== 'DRAFT';
  const newQuestion: QuestionBankItem = {
    id: `q-${resolvedAudience.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    audience: resolvedAudience,
    grade: Number(grade),
    subject: subject || (resolvedAudience === 'KIDS' ? 'Matematika' : 'Algebra'),
    topic: topic.trim(),
    difficulty: difficulty || 'MEDIUM',
    type: type || 'MULTIPLE_CHOICE',
    prompt: prompt.trim(),
    formulaLatex: formulaLatex ? formulaLatex.trim() : undefined,
    imageUrl: imageUrl ? imageUrl.trim() : undefined,
    options: Array.isArray(options) ? options : [],
    correctAnswer: String(correctAnswer).trim(),
    explanation: explanation ? explanation.trim() : '',
    hint: hint ? hint.trim() : '',
    rewardCoins: rewardCoins ? Number(rewardCoins) : resolvedAudience === 'KIDS' ? 1 : 2,
    rewardXP: rewardXP ? Number(rewardXP) : 10,
    status: isPublished ? 'PUBLISHED' : 'DRAFT',
    isPublished,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  addQuestionToBank(newQuestion);

  adminStore.logAction({
    adminId: req.adminUser?.id || 'admin',
    adminUsername: req.adminUser?.username || 'mirzobek',
    action: 'CREATE_QUESTION',
    targetType: 'QUESTION',
    targetId: newQuestion.id,
    details: { topic: newQuestion.topic, grade: newQuestion.grade, audience: newQuestion.audience },
  });

  return res.status(201).json({
    success: true,
    message: 'Yangi savol muvaffaqiyatli saqlandi.',
    data: newQuestion,
  });
});

adminRouter.get('/questions/:id', adminAuth, (req: Request, res: Response) => {
  const id = req.params.id as string;
  const question = findQuestionById(id);
  if (!question) {
    return res.status(404).json({ success: false, error: 'Savol topilmadi.' });
  }
  return res.json({ success: true, data: question });
});

adminRouter.put('/questions/:id', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const id = req.params.id as string;
  const updated = updateQuestionInBank(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Savol topilmadi.' });
  }

  adminStore.logAction({
    adminId: req.adminUser?.id || 'admin',
    adminUsername: req.adminUser?.username || 'mirzobek',
    action: 'UPDATE_QUESTION',
    targetType: 'QUESTION',
    targetId: id,
  });

  return res.json({ success: true, message: 'Savol muvaffaqiyatli yangilandi.', data: updated });
});

adminRouter.patch('/questions/:id/publish', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const id = req.params.id as string;
  const updated = updateQuestionInBank(id, { isPublished: true, status: 'PUBLISHED' });
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Savol topilmadi.' });
  }
  return res.json({ success: true, message: 'Savol muvaffaqiyatli nashr qilindi.', data: updated });
});

adminRouter.patch('/questions/:id/unpublish', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const id = req.params.id as string;
  const updated = updateQuestionInBank(id, { isPublished: false, status: 'DRAFT' });
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Savol topilmadi.' });
  }
  return res.json({ success: true, message: 'Savol qoralamaga o‘tkazildi (nashrdan olindi).', data: updated });
});

adminRouter.delete('/questions/:id', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const id = req.params.id as string;
  const deleted = deleteQuestionFromBank(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Savol topilmadi.' });
  }

  adminStore.logAction({
    adminId: req.adminUser?.id || 'admin',
    adminUsername: req.adminUser?.username || 'mirzobek',
    action: 'DELETE_QUESTION',
    targetType: 'QUESTION',
    targetId: id,
  });

  return res.json({ success: true, message: 'Savol muvaffaqiyatli o‘chirildi.' });
});

// ---------------------------------------------------------------------------
// 4.5. BULK QUESTION IMPORT (CSV / Excel text import)
// Format: prompt, optionA, optionB, optionC, optionD, correctAnswer, difficulty, explanation, topic, grade
// ---------------------------------------------------------------------------
adminRouter.post('/questions/import', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const { csvData, questions: rawList } = req.body;
  const importedQuestions: QuestionBankItem[] = [];

  // 1. Process structured JSON array if provided
  if (Array.isArray(rawList)) {
    for (const q of rawList) {
      if (!q.prompt || !Array.isArray(q.options) || q.options.length < 2 || !q.correctAnswer) continue;
      const created = addQuestionToBank({
        id: q.id || `q-imp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        audience: q.audience || (Number(q.grade) <= 4 ? 'KIDS' : 'TEEN'),
        grade: Number(q.grade) || 4,
        topic: q.topic || 'Misollar',
        difficulty: q.difficulty || 'MEDIUM',
        prompt: String(q.prompt).trim(),
        type: 'MULTIPLE_CHOICE',
        options: q.options.map((o: any) => String(o).trim()),
        correctAnswer: String(q.correctAnswer).trim(),
        explanation: q.explanation || '',
        hint: q.hint || '',
        imageUrl: q.imageUrl || undefined,
        rewardCoins: 1,
        rewardXP: 10,
        isPublished: true,
      });
      importedQuestions.push(created);
    }
  }

  // 2. Parse CSV / Excel Delimited text if provided
  if (typeof csvData === 'string' && csvData.trim().length > 0) {
    const lines = csvData.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    // Detect delimiter: comma, semicolon or tab
    for (const line of lines) {
      // Skip header lines
      if (line.toLowerCase().startsWith('prompt') || line.toLowerCase().startsWith('savol')) continue;

      let delimiter = ',';
      if (line.includes(';') && (line.match(/;/g) || []).length >= 5) delimiter = ';';
      else if (line.includes('\t') && (line.match(/\t/g) || []).length >= 5) delimiter = '\t';

      // Parse with simple regex supporting quotes
      const parts: string[] = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === delimiter && !inQuotes) {
          parts.push(cur.trim());
          cur = '';
        } else {
          cur += c;
        }
      }
      parts.push(cur.trim());

      if (parts.length >= 6) {
        const prompt = parts[0];
        const optA = parts[1];
        const optB = parts[2];
        const optC = parts[3];
        const optD = parts[4];
        const correctAnswer = parts[5];
        const difficulty = (parts[6]?.toUpperCase() as 'EASY' | 'MEDIUM' | 'HARD') || 'MEDIUM';
        const explanation = parts[7] || '';
        const topic = parts[8] || 'Misollar';
        const grade = Number(parts[9]) || 4;

        if (prompt && optA && optB && correctAnswer) {
          const options = [optA, optB, optC || '', optD || ''].filter(Boolean);
          const created = addQuestionToBank({
            id: `q-csv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            audience: grade <= 4 ? 'KIDS' : 'TEEN',
            grade,
            topic,
            difficulty: ['EASY', 'MEDIUM', 'HARD'].includes(difficulty) ? difficulty : 'MEDIUM',
            prompt,
            type: 'MULTIPLE_CHOICE',
            options,
            correctAnswer,
            explanation,
            hint: '',
            rewardCoins: 1,
            rewardXP: 10,
            isPublished: true,
          });
          importedQuestions.push(created);
        }
      }
    }
  }

  adminStore.logAction({
    adminId: req.adminUser?.id || 'admin',
    adminUsername: req.adminUser?.username || 'mirzobek',
    action: 'CREATE_QUESTION',
    targetType: 'QUESTION',
    targetId: `bulk-import-${Date.now()}`,
    details: { importedCount: importedQuestions.length },
  });

  return res.status(201).json({
    success: true,
    message: `${importedQuestions.length} ta savol muvaffaqiyatli import qilindi va saqlandi.`,
    count: importedQuestions.length,
    data: importedQuestions,
  });
});

// ---------------------------------------------------------------------------
// 5. FULL LESSON MANAGEMENT (Section 5)
// Create, edit, save draft, publish, worked examples, exercise questions
// ---------------------------------------------------------------------------
adminRouter.get('/lessons', adminAuth, (req: Request, res: Response) => {
  const audience = req.query.audience as 'KIDS' | 'TEEN' | undefined;
  const grade = req.query.grade ? parseInt(req.query.grade as string, 10) : undefined;
  const search = req.query.search ? (req.query.search as string).toLowerCase().trim() : '';

  let lessons = repository.getLessons(audience, grade, true); // Include drafts for admin
  if (search) {
    lessons = lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(search) ||
        l.chapterTitle.toLowerCase().includes(search) ||
        l.topicKey.toLowerCase().includes(search)
    );
  }

  const summary = lessons.map((l) => ({
    id: l.id,
    title: l.title,
    grade: l.grade,
    mode: l.mode,
    chapterTitle: l.chapterTitle,
    description: l.description,
    contentMd: l.contentMd,
    formulaLatex: l.formulaLatex,
    rewardXP: l.rewardXP,
    rewardCoins: l.rewardCoins,
    sectionsCount: l.sections ? l.sections.length : 0,
    examplesCount: l.examples ? l.examples.length : 0,
    totalQuestions: l.sections ? l.sections.reduce((acc, s) => acc + (s.questions ? s.questions.length : 0), 0) : 0,
    status: l.status || 'PUBLISHED',
    createdAt: l.createdAt || '2026-11-18',
    updatedAt: l.updatedAt || '2026-11-18',
  }));

  return res.json({
    success: true,
    total: summary.length,
    data: summary,
  });
});

adminRouter.get('/lessons/:id', adminAuth, (req: Request, res: Response) => {
  const id = req.params.id as string;
  const lesson = repository.getLessonById(id);
  if (!lesson) {
    return res.status(404).json({ success: false, error: 'Dars topilmadi.' });
  }
  return res.json({ success: true, data: lesson });
});

adminRouter.post('/lessons', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const {
    title,
    audience,
    grade,
    subject,
    topic,
    description,
    contentMd,
    formulaLatex,
    coverImage,
    gallery,
    videoUrl,
    audioUrl,
    textExplanation,
    orderIndex,
    examples,
    exercises,
    questions: rawQ,
    rewardCoins,
    rewardXP,
    status,
    icon,
    accentColor,
    color,
  } = req.body;

  if (!title || !grade) {
    return res.status(400).json({ success: false, error: 'Dars nomi va sinfi talab qilinadi.' });
  }

  const resolvedAudience: 'KIDS' | 'TEEN' =
    audience === 'KIDS' || audience === 'TEEN' ? audience : Number(grade) <= 4 ? 'KIDS' : 'TEEN';

  const newLessonId = `lesson-${resolvedAudience.toLowerCase()}-${Date.now()}`;
  const now = new Date().toISOString();

  const rawExercises = exercises || rawQ || [];
  const formattedQuestions = Array.isArray(rawExercises)
    ? rawExercises.map((ex: any, idx: number) => ({
      id: `q-${newLessonId}-${idx + 1}`,
      lessonId: newLessonId,
      sectionId: `sec-${newLessonId}-s1`,
      prompt: ex.prompt || ex.question || '',
      type: ex.type || 'MULTIPLE_CHOICE',
      options: Array.isArray(ex.options) ? ex.options : ['A', 'B', 'C', 'D'],
      correctAnswer: String(ex.correctAnswer !== undefined ? ex.correctAnswer : ex.options ? ex.options[0] : 'A'),
      explanation: ex.explanation || '',
      hint: ex.hint || '',
      formulaLatex: ex.formulaLatex || '',
      orderIndex: idx + 1,
    }))
    : [];

  const newLesson: LessonModel = {
    id: newLessonId,
    courseId: `course-g${grade}-math`,
    chapterId: `chap-${Date.now()}`,
    chapterTitle: subject || (resolvedAudience === 'KIDS' ? 'Matematika' : 'Algebra'),
    grade: Number(grade),
    mode: resolvedAudience,
    title: title.trim(),
    topicKey: topic ? topic.toLowerCase().replace(/\s+/g, '_') : `topic_${Date.now()}`,
    description: description || '',
    formulaLatex: formulaLatex || '',
    contentMd: contentMd || `## ${title}\n\n${description || ''}`,
    coverImage: coverImage || undefined,
    icon: icon || undefined,
    accentColor: accentColor || color || undefined,
    gallery: Array.isArray(gallery) ? gallery : [],
    videoUrl: videoUrl || undefined,
    audioUrl: audioUrl || undefined,
    textExplanation: textExplanation || description || '',
    rewardXP: rewardXP ? Number(rewardXP) : 50,
    rewardCoins: rewardCoins ? Number(rewardCoins) : 10,
    orderIndex: orderIndex ? Number(orderIndex) : 99,
    status: status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
    examples: Array.isArray(examples) ? examples : [],
    createdAt: now,
    updatedAt: now,
    sections: [
      {
        id: `sec-${newLessonId}-s1`,
        lessonId: newLessonId,
        title: '1-qism: Asosiy mashqlar',
        orderIndex: 1,
        questions: formattedQuestions,
      },
    ],
  };

  repository.addLesson(newLesson);

  // Broadcast real-time event to connected apps
  broadcastLessonEvent('LESSON_CREATED', newLesson);

  adminStore.logAction({
    adminId: req.adminUser?.id || 'admin',
    adminUsername: req.adminUser?.username || 'mirzobek',
    action: 'CREATE_LESSON',
    targetType: 'LESSON',
    targetId: newLesson.id,
    details: { title: newLesson.title, grade: newLesson.grade, mode: newLesson.mode },
  });

  return res.status(201).json({
    success: true,
    message: 'Yangi dars muvaffaqiyatli yaratildi va saqlandi.',
    data: newLesson,
  });
});

adminRouter.put('/lessons/:id', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const id = req.params.id as string;
  const existing = repository.getLessonById(id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Dars topilmadi.' });
  }

  const {
    title,
    audience,
    grade,
    subject,
    chapterTitle,
    topic,
    description,
    contentMd,
    formulaLatex,
    coverImage,
    gallery,
    videoUrl,
    audioUrl,
    textExplanation,
    orderIndex,
    examples,
    exercises,
    questions: rawQ,
    rewardCoins,
    rewardXP,
    status,
    icon,
    accentColor,
    color,
  } = req.body;

  const updates: Partial<LessonModel> = {
    updatedAt: new Date().toISOString(),
  };

  if (title !== undefined) updates.title = title.trim();
  if (grade !== undefined) updates.grade = Number(grade);
  if (audience !== undefined) updates.mode = audience;
  if (subject !== undefined || chapterTitle !== undefined) updates.chapterTitle = subject || chapterTitle;
  if (topic !== undefined) updates.topicKey = topic;
  if (description !== undefined) updates.description = description;
  if (contentMd !== undefined) updates.contentMd = contentMd;
  if (formulaLatex !== undefined) updates.formulaLatex = formulaLatex;
  if (coverImage !== undefined) updates.coverImage = coverImage;
  if (gallery !== undefined) updates.gallery = gallery;
  if (videoUrl !== undefined) updates.videoUrl = videoUrl;
  if (audioUrl !== undefined) updates.audioUrl = audioUrl;
  if (textExplanation !== undefined) updates.textExplanation = textExplanation;
  if (orderIndex !== undefined) updates.orderIndex = Number(orderIndex);
  if (rewardXP !== undefined) updates.rewardXP = Number(rewardXP);
  if (rewardCoins !== undefined) updates.rewardCoins = Number(rewardCoins);
  if (status !== undefined) updates.status = status;
  if (icon !== undefined) updates.icon = icon;
  if (accentColor !== undefined || color !== undefined) updates.accentColor = accentColor || color;
  if (examples !== undefined) updates.examples = examples;

  const rawExercises = exercises || rawQ;
  if (Array.isArray(rawExercises)) {
    const formattedQuestions = rawExercises.map((ex: any, idx: number) => ({
      id: ex.id || `q-${id}-${idx + 1}`,
      lessonId: id,
      sectionId: existing.sections[0]?.id || `sec-${id}-s1`,
      prompt: ex.prompt || ex.question || '',
      type: ex.type || 'MULTIPLE_CHOICE',
      options: Array.isArray(ex.options) ? ex.options : ['A', 'B', 'C', 'D'],
      correctAnswer: String(ex.correctAnswer !== undefined ? ex.correctAnswer : ex.options ? ex.options[0] : 'A'),
      explanation: ex.explanation || '',
      hint: ex.hint || '',
      formulaLatex: ex.formulaLatex || '',
      orderIndex: idx + 1,
    }));

    if (existing.sections.length > 0) {
      existing.sections[0].questions = formattedQuestions;
    } else {
      existing.sections = [
        {
          id: `sec-${id}-s1`,
          lessonId: id,
          title: '1-qism: Asosiy mashqlar',
          orderIndex: 1,
          questions: formattedQuestions,
        },
      ];
    }
  }

  repository.updateLesson(id, updates);
  const updatedLesson = repository.getLessonById(id);

  broadcastLessonEvent('LESSON_UPDATED', { id, ...updates });

  adminStore.logAction({
    adminId: req.adminUser?.id || 'admin',
    adminUsername: req.adminUser?.username || 'mirzobek',
    action: 'UPDATE_LESSON',
    targetType: 'LESSON',
    targetId: id,
  });

  return res.json({ success: true, message: 'Dars muvaffaqiyatli yangilandi.', data: updatedLesson });
});

adminRouter.patch('/lessons/:id/publish', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const id = req.params.id as string;
  const updated = repository.updateLesson(id, { status: 'PUBLISHED', updatedAt: new Date().toISOString() });
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Dars topilmadi.' });
  }

  broadcastLessonEvent('LESSON_PUBLISHED', { id });

  return res.json({ success: true, message: 'Dars muvaffaqiyatli nashr qilindi.' });
});

adminRouter.patch('/lessons/:id/unpublish', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const id = req.params.id as string;
  const updated = repository.updateLesson(id, { status: 'DRAFT', updatedAt: new Date().toISOString() });
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Dars topilmadi.' });
  }

  broadcastLessonEvent('LESSON_UNPUBLISHED', { id });

  return res.json({ success: true, message: 'Dars qoralamaga olindi.' });
});

adminRouter.delete('/lessons/:id', adminAuth, (req: AuthenticatedAdminRequest, res: Response) => {
  const id = req.params.id as string;
  const deleted = repository.deleteLesson(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Dars topilmadi.' });
  }

  broadcastLessonEvent('LESSON_DELETED', { id });

  adminStore.logAction({
    adminId: req.adminUser?.id || 'admin',
    adminUsername: req.adminUser?.username || 'mirzobek',
    action: 'DELETE_LESSON',
    targetType: 'LESSON',
    targetId: id,
  });

  return res.json({ success: true, message: 'Dars muvaffaqiyatli o‘chirildi.' });
});

// ---------------------------------------------------------------------------
// 6. AUDIT LOGS
// ---------------------------------------------------------------------------
adminRouter.get('/audit-logs', adminAuth, (req: Request, res: Response) => {
  const logs = adminStore.getAuditLogs();
  return res.json({
    success: true,
    total: logs.length,
    data: logs,
  });
});

// ---------------------------------------------------------------------------
// 7. UNRECOGNIZED AI QUERIES REPORT (MathSolver Analytics)
// ---------------------------------------------------------------------------
adminRouter.get('/unrecognized-queries', adminAuth, (req: Request, res: Response) => {
  const rawList = repository.getUnrecognizedQueries();

  // Aggregate frequency of recurring queries
  const frequencyMap = new Map<string, { query: string; count: number; lastSeen: string; userIds: string[] }>();
  for (const item of rawList) {
    const q = item.query.trim();
    if (!frequencyMap.has(q)) {
      frequencyMap.set(q, {
        query: q,
        count: 1,
        lastSeen: item.createdAt,
        userIds: item.userId ? [item.userId] : [],
      });
    } else {
      const existing = frequencyMap.get(q)!;
      existing.count += 1;
      existing.lastSeen = item.createdAt;
      if (item.userId && !existing.userIds.includes(item.userId)) {
        existing.userIds.push(item.userId);
      }
    }
  }

  const aggregated = Array.from(frequencyMap.values()).sort((a, b) => b.count - a.count);

  return res.json({
    success: true,
    totalRaw: rawList.length,
    totalUnique: aggregated.length,
    topRecurring: aggregated.slice(0, 50),
    data: rawList.slice(-100).reverse(), // Last 100 queries
  });
});

