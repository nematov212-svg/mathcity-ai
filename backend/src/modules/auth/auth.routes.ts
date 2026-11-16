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
    coinBalance: 100, // 100 coins for testing building purchase
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
    placedBuildings: [
      {
        buildingKey: 'house_basic',
        gridX: 1,
        gridY: 1,
        constructedAt: now.toISOString(),
      },
    ],
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
      placedBuildings: [
        {
          buildingKey: 'house_basic',
          gridX: 1,
          gridY: 1,
          constructedAt: now.toISOString(),
        },
      ],
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
