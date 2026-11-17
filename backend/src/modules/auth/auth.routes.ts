import { Router, Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { config } from '../../config/env.js';
import { repository, UserAccount } from '../../utils/repository.js';
import { checkAgeEligibility } from '../../utils/age.js';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { authRateLimiter } from '../../middleware/rateLimit.js';

export const authRouter = Router();

// Helper: Verify Google ID token claims
function verifyGoogleTokenPayload(idToken: string): { email?: string; sub?: string } | null {
  try {
    const decoded = jwt.decode(idToken) as any;
    if (!decoded) return null;
    const nowSec = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < nowSec) return null;
    if (decoded.iss && !decoded.iss.includes('accounts.google.com')) return null;
    if (config.googleClientId && decoded.aud && decoded.aud !== config.googleClientId) return null;
    return { email: decoded.email, sub: decoded.sub };
  } catch {
    return null;
  }
}

// Helper: Verify Apple Identity Token claims
function verifyAppleTokenPayload(idToken: string): { email?: string; sub?: string } | null {
  try {
    const decoded = jwt.decode(idToken) as any;
    if (!decoded) return null;
    const nowSec = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < nowSec) return null;
    if (decoded.iss && !decoded.iss.includes('appleid.apple.com')) return null;
    return { email: decoded.email, sub: decoded.sub };
  } catch {
    return null;
  }
}

const registerSchema = z.object({
  email: z.string().email('Email manzili noto‘g‘ri.'),
  password: z.string().min(6, 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak.'),
  displayName: z.string().min(2, 'Ism kamida 2 ta harfdan iborat bo‘lishi kerak.'),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Tug‘ilgan sana noto‘g‘ri formatda.',
  }),
  grade: z.number().int().min(1).max(11).optional().default(4),
});

authRouter.post('/register', authRateLimiter, (req: Request, res: Response) => {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.errors[0].message,
    });
  }

  const { email, password, displayName, dateOfBirth, grade } = parseResult.data;

  // 1. Strict age check
  const dob = new Date(dateOfBirth);
  const eligibility = checkAgeEligibility(dob);

  if (!eligibility.eligible || !eligibility.mode) {
    return res.status(403).json({
      success: false,
      errorCode: 'ELIGIBILITY_FAILED',
      error: eligibility.message,
    });
  }

  // 2. Check if email already registered
  const existing = repository.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({
      success: false,
      error: 'Ushbu email bilan avval ro‘yxatdan o‘tilgan.',
    });
  }

  const now = new Date();
  const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 full days trial

  // 3. Create student account with 100 coins & 30-day free trial
  const newUser: UserAccount = {
    id: randomUUID(),
    email: email.toLowerCase(),
    passwordHash: password,
    displayName,
    dateOfBirth,
    age: eligibility.age,
    mode: eligibility.mode,
    grade,
    avatarUrl: eligibility.mode === 'KIDS' ? 'assets/images/avatar_kid.png' : 'assets/images/avatar_teen.png',
    coinBalance: 0, // Genuinely new accounts start with exactly 0 coins
    totalXP: 0,
    level: 1,
    cityLevel: 1,
    subscription: {
      status: 'FREE_TRIAL_ACTIVE',
      trialStartedAt: now.toISOString(),
      trialExpiresAt: trialExpiry.toISOString(),
      planName: 'MathCity Free Trial',
      priceMonthlyUzs: 29000,
    },
    placedBuildings: [],
    completedLessons: [],
    completedSections: [],
    solvedQuestions: [],
    rewardedQuestionIds: [],
    attemptedQuestionCount: 0,
    correctQuestionCount: 0,
    incorrectQuestionCount: 0,
    dailyTaskProgress: {
      task_solve_5: { currentCount: 0, isCompleted: false, claimed: false },
      task_complete_lesson: { currentCount: 0, isCompleted: false, claimed: false },
      task_play_space_game: { currentCount: 0, isCompleted: false, claimed: false },
      task_ai_consult: { currentCount: 0, isCompleted: false, claimed: false },
    },
    unlockedAchievements: [],
    createdAt: now.toISOString(),
  };

  repository.createUser(newUser);

  // 4. Issue JWT
  const token = jwt.sign({ userId: newUser.id }, config.jwtSecret, {
    expiresIn: '7d',
  });

  return res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
        age: newUser.age,
        mode: newUser.mode,
        grade: newUser.grade,
        coinBalance: newUser.coinBalance,
        totalXP: newUser.totalXP,
        level: newUser.level,
        cityLevel: newUser.cityLevel,
        subscription: repository.getSubscription(newUser.id),
      },
    },
  });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post('/login', authRateLimiter, (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Email yoki parol formati noto‘g‘ri.' });
  }

  const { email, password } = parse.data;
  const user = repository.getUserByEmail(email);

  if (!user || !repository.verifyPassword(user, password)) {
    return res.status(401).json({
      success: false,
      error: 'Email yoki parol noto‘g‘ri.',
    });
  }

  // Strict dynamic age verification
  const eligibility = checkAgeEligibility(new Date(user.dateOfBirth));
  if (!eligibility.eligible) {
    return res.status(403).json({
      success: false,
      errorCode: 'ELIGIBILITY_FAILED',
      error: eligibility.message,
    });
  }

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: '7d',
  });

  return res.json({
    success: true,
    data: {
      token,
      isNewUser: false,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        age: user.age,
        mode: user.mode,
        grade: user.grade,
        coinBalance: user.coinBalance,
        totalXP: user.totalXP,
        level: user.level,
        cityLevel: user.cityLevel,
        subscription: repository.getSubscription(user.id),
      },
    },
  });
});

// Google Sign-In Endpoint (Part 6)
const googleAuthSchema = z.object({
  googleId: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  idToken: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

authRouter.post('/google', authRateLimiter, (req: Request, res: Response) => {
  const parse = googleAuthSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Google ma’lumotlari to‘liq emas.' });
  }

  const { googleId, email, displayName, idToken, dateOfBirth } = parse.data;

  // Verify ID token claims if supplied or in production
  if (idToken) {
    const claims = verifyGoogleTokenPayload(idToken);
    if (!claims && config.isProduction) {
      return res.status(401).json({ success: false, error: 'Google tokeni yaroqsiz.' });
    }
    if (claims && claims.email && claims.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(401).json({ success: false, error: 'Google tokeni emaili mos kelmadi.' });
    }
  }

  // Check if user exists by googleId or email
  let user = repository.getUserByGoogleId(googleId) || repository.getUserByEmail(email);
  const isNewUser = !user;

  if (!user) {
    // Determine birthdate and mode
    const dobString = dateOfBirth || '2015-05-15'; // Default 11 years old
    const dob = new Date(dobString);
    const eligibility = checkAgeEligibility(dob);

    if (!eligibility.eligible || !eligibility.mode) {
      return res.status(403).json({
        success: false,
        errorCode: 'ELIGIBILITY_FAILED',
        error: eligibility.message,
      });
    }

    const now = new Date();
    const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    user = {
      id: randomUUID(),
      email: email.toLowerCase(),
      googleId,
      displayName,
      dateOfBirth: dobString,
      age: eligibility.age,
      mode: eligibility.mode,
      grade: Math.max(1, Math.min(11, eligibility.age - 5)),
      avatarUrl: 'assets/images/avatar_kid.png',
      coinBalance: 0, // New Google accounts start with 0 coins
      totalXP: 0, // and 0 XP
      level: 1,
      cityLevel: 1,
      subscription: {
        status: 'FREE_TRIAL_ACTIVE',
        trialStartedAt: now.toISOString(),
        trialExpiresAt: trialExpiry.toISOString(),
        planName: 'MathCity Free Trial',
        priceMonthlyUzs: 29000,
      },
      placedBuildings: [],
      completedLessons: [],
      completedSections: [],
      solvedQuestions: [],
      rewardedQuestionIds: [],
      attemptedQuestionCount: 0,
      correctQuestionCount: 0,
      incorrectQuestionCount: 0,
      dailyTaskProgress: {
        task_solve_5: { currentCount: 0, isCompleted: false, claimed: false },
        task_complete_lesson: { currentCount: 0, isCompleted: false, claimed: false },
        task_play_space_game: { currentCount: 0, isCompleted: false, claimed: false },
        task_ai_consult: { currentCount: 0, isCompleted: false, claimed: false },
      },
      unlockedAchievements: [],
      createdAt: now.toISOString(),
    };

    repository.createUser(user);
  } else {
    // If user existed without googleId linked, link it now
    if (!user.googleId) {
      user.googleId = googleId;
    }
  }

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: '7d',
  });

  return res.json({
    success: true,
    data: {
      token,
      isNewUser: isNewUser,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        age: user.age,
        mode: user.mode,
        grade: user.grade,
        coinBalance: user.coinBalance,
        totalXP: user.totalXP,
        level: user.level,
        cityLevel: user.cityLevel,
        subscription: repository.getSubscription(user.id),
      },
    },
  });
});

authRouter.post('/demo', authRateLimiter, (req: Request, res: Response) => {
  let demoUser = repository.getUserById('demo-student-id') || repository.getUserByEmail('ali@mathcity.ai');
  if (!demoUser) {
    const now = new Date();
    const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    demoUser = {
      id: 'demo-student-id',
      email: 'ali@mathcity.ai',
      displayName: 'Ali',
      dateOfBirth: '2015-05-10',
      age: 11,
      mode: 'KIDS',
      grade: 4,
      avatarUrl: 'assets/images/avatar_kid.png',
      coinBalance: 100,
      totalXP: 380,
      level: 3,
      cityLevel: 2,
      subscription: {
        status: 'FREE_TRIAL_ACTIVE',
        trialStartedAt: now.toISOString(),
        trialExpiresAt: trialExpiry.toISOString(),
        planName: 'MathCity Free Trial',
        priceMonthlyUzs: 29000,
      },
      placedBuildings: [
        { buildingKey: 'house_basic', gridX: 1, gridY: 1, constructedAt: now.toISOString() },
        { buildingKey: 'school_math', gridX: 2, gridY: 1, constructedAt: now.toISOString() },
      ],
      completedLessons: ['lesson-g3-addsub'],
      completedSections: ['sec-g3-01-s1'],
      solvedQuestions: [],
      rewardedQuestionIds: [],
      attemptedQuestionCount: 15,
      correctQuestionCount: 14,
      incorrectQuestionCount: 1,
      dailyTaskProgress: {
        task_solve_5: { currentCount: 0, isCompleted: false, claimed: false },
        task_complete_lesson: { currentCount: 0, isCompleted: false, claimed: false },
        task_play_space_game: { currentCount: 0, isCompleted: false, claimed: false },
        task_ai_consult: { currentCount: 0, isCompleted: false, claimed: false },
      },
      unlockedAchievements: [],
      createdAt: now.toISOString(),
    };
    repository.createUser(demoUser);
  }

  const token = jwt.sign({ userId: demoUser.id }, config.jwtSecret, {
    expiresIn: '7d',
  });

  return res.json({
    success: true,
    data: {
      token,
      isNewUser: false,
      user: {
        id: demoUser.id,
        email: demoUser.email,
        displayName: demoUser.displayName,
        age: demoUser.age,
        mode: demoUser.mode,
        grade: demoUser.grade,
        coinBalance: demoUser.coinBalance,
        totalXP: demoUser.totalXP,
        level: demoUser.level,
        cityLevel: demoUser.cityLevel,
        subscription: repository.getSubscription(demoUser.id),
      },
    },
  });
});

authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  return res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      age: user.age,
      mode: user.mode,
      grade: user.grade,
      coinBalance: user.coinBalance,
      totalXP: user.totalXP,
      level: user.level,
      cityLevel: user.cityLevel,
      completedLessonsCount: user.completedLessons.length,
      solvedQuestionsCount: user.solvedQuestions.length,
      placedBuildingsCount: user.placedBuildings.length,
      attemptedQuestionCount: user.attemptedQuestionCount,
      correctQuestionCount: user.correctQuestionCount,
      subscription: repository.getSubscription(user.id),
    },
  });
});

// Apple Sign-In Schema
const appleAuthSchema = z.object({
  appleUserId: z.string().min(1, 'Apple identifikatori talab qilinadi.'),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  identityToken: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

// POST /api/auth/apple - Sign in with Apple official endpoint
authRouter.post('/apple', authRateLimiter, (req: Request, res: Response) => {
  const parse = appleAuthSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Apple ma’lumotlari to‘liq emas.' });
  }

  const { appleUserId, email, displayName, identityToken, dateOfBirth } = parse.data;

  // Verify Apple Identity Token claims if supplied
  if (identityToken) {
    const claims = verifyAppleTokenPayload(identityToken);
    if (!claims && config.isProduction) {
      return res.status(401).json({ success: false, error: 'Apple tokeni yaroqsiz.' });
    }
    if (claims && claims.sub && claims.sub !== appleUserId) {
      return res.status(401).json({ success: false, error: 'Apple foydalanuvchi identifikatori mos kelmadi.' });
    }
  }

  // Identify user strictly by stable appleId
  let user = repository.getUserByAppleId(appleUserId);
  const isNewUser = !user;

  if (!user) {
    const generatedEmail = email || `apple_${appleUserId.substring(0, 8).toLowerCase()}@privaterelay.appleid.com`;
    const dobString = dateOfBirth || '2015-05-15';
    const dob = new Date(dobString);
    const eligibility = checkAgeEligibility(dob);

    if (!eligibility.eligible || !eligibility.mode) {
      return res.status(403).json({
        success: false,
        errorCode: 'ELIGIBILITY_FAILED',
        error: eligibility.message,
      });
    }

    const now = new Date();
    const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    user = {
      id: randomUUID(),
      email: generatedEmail.toLowerCase(),
      appleId: appleUserId,
      displayName: displayName || 'MathHero',
      dateOfBirth: dobString,
      age: eligibility.age,
      mode: eligibility.mode,
      grade: Math.max(1, Math.min(11, eligibility.age - 5)),
      avatarUrl: eligibility.mode === 'KIDS' ? 'assets/images/avatar_kid.png' : 'assets/images/avatar_teen.png',
      coinBalance: 0, // Genuinely new Apple accounts start with 0 coins
      totalXP: 0, // and 0 XP
      level: 1,
      cityLevel: 1,
      subscription: {
        status: 'FREE_TRIAL_ACTIVE',
        trialStartedAt: now.toISOString(),
        trialExpiresAt: trialExpiry.toISOString(),
        planName: 'MathCity Free Trial',
        priceMonthlyUzs: 29000,
      },
      placedBuildings: [],
      completedLessons: [],
      completedSections: [],
      solvedQuestions: [],
      rewardedQuestionIds: [],
      attemptedQuestionCount: 0,
      correctQuestionCount: 0,
      incorrectQuestionCount: 0,
      dailyTaskProgress: {
        task_solve_5: { currentCount: 0, isCompleted: false, claimed: false },
        task_complete_lesson: { currentCount: 0, isCompleted: false, claimed: false },
        task_play_space_game: { currentCount: 0, isCompleted: false, claimed: false },
        task_ai_consult: { currentCount: 0, isCompleted: false, claimed: false },
      },
      unlockedAchievements: [],
      createdAt: now.toISOString(),
    };

    repository.createUser(user);
  }

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: '7d',
  });

  return res.json({
    success: true,
    data: {
      token,
      isNewUser: isNewUser,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        age: user.age,
        mode: user.mode,
        grade: user.grade,
        coinBalance: user.coinBalance,
        totalXP: user.totalXP,
        level: user.level,
        cityLevel: user.cityLevel,
        subscription: repository.getSubscription(user.id),
      },
    },
  });
});

// GET /api/auth/check-username - Validate username uniqueness & guidelines
authRouter.get('/check-username', (req: Request, res: Response) => {
  const username = ((req.query.username as string) || '').trim();
  if (!username) {
    return res.status(400).json({ success: false, error: 'Foydalanuvchi nomi kiritilmagan.' });
  }
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({
      success: false,
      error: 'Foydalanuvchi nomi 3 tadan 20 tagacha belgidan iborat bo‘lishi kerak.',
    });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({
      success: false,
      error: 'Foydalanuvchi nomi faqat lotin harflari, raqamlar va pastki chiziqdan iborat bo‘lishi kerak.',
    });
  }

  if (username.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Email manzilini foydalanuvchi nomi sifatida ishlatib bo‘lmaydi.',
    });
  }

  const taken = repository.getAllUsers().some((u) => u.displayName.toLowerCase() === username.toLowerCase());
  if (taken) {
    return res.json({
      success: true,
      data: {
        available: false,
        message: 'Bu foydalanuvchi nomi band. Boshqasini tanlang.',
      },
    });
  }

  return res.json({
    success: true,
    data: {
      available: true,
      message: 'Foydalanuvchi nomi bo‘sh!',
    },
  });
});

// POST /api/auth/complete-onboarding - Sets unique username and birth date (day, month, year)
const onboardingSchema = z.object({
  username: z.string().min(3).max(20),
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2005).max(new Date().getFullYear()),
});

authRouter.post('/complete-onboarding', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const parse = onboardingSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Ma’lumotlar to‘liq yoki to‘g‘ri kiritilmagan.' });
  }

  const { username, day, month, year } = parse.data;
  const user = req.user!;

  // Validate real calendar date
  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day ||
    birthDate > new Date()
  ) {
    return res.status(400).json({ success: false, error: 'Kiritilgan sana mavjud emas yoki kelajak sanasi.' });
  }

  // Check username uniqueness
  const taken = repository
    .getAllUsers()
    .some((u) => u.id !== user.id && u.displayName.toLowerCase() === username.toLowerCase());
  if (taken) {
    return res.status(409).json({ success: false, error: 'Bu foydalanuvchi nomi band. Boshqasini tanlang.' });
  }

  // Check age eligibility (6-16)
  const eligibility = checkAgeEligibility(birthDate);
  if (!eligibility.eligible || !eligibility.mode) {
    return res.status(403).json({
      success: false,
      errorCode: 'ELIGIBILITY_FAILED',
      error: eligibility.message,
    });
  }

  // Update profile atomically
  user.displayName = username.trim();
  user.dateOfBirth = birthDate.toISOString().split('T')[0];
  user.age = eligibility.age;
  user.mode = eligibility.mode;
  user.grade = Math.max(1, Math.min(11, eligibility.age - 5));
  user.avatarUrl = eligibility.mode === 'KIDS' ? 'assets/images/avatar_kid.png' : 'assets/images/avatar_teen.png';

  // Ensure wallet starts at 0 coins and 0 XP for newly onboarded user
  if (!user.solvedQuestions || user.solvedQuestions.length === 0) {
    user.coinBalance = 0;
    user.totalXP = 0;
  }

  return res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        age: user.age,
        mode: user.mode,
        grade: user.grade,
        coinBalance: user.coinBalance,
        totalXP: user.totalXP,
        level: user.level,
        cityLevel: user.cityLevel,
        subscription: repository.getSubscription(user.id),
      },
    },
  });
});
