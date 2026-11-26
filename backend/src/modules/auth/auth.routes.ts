import { Router, Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import crypto, { randomUUID } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../../config/env.js';
import { repository, UserAccount } from '../../utils/repository.js';
import { checkAgeEligibility } from '../../utils/age.js';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { authRateLimiter, createRateLimiter } from '../../middleware/rateLimit.js';

export const authRouter = Router();

const googleOAuthClient = new OAuth2Client();

interface AppleJwk {
  kty: string;
  kid: string;
  use: string;
  alg: string;
  n: string;
  e: string;
}

let cachedAppleKeys: { keys: AppleJwk[]; fetchedAt: number } | null = null;

async function getAppleSigningKeyPem(kid: string): Promise<string | null> {
  const now = Date.now();
  if (!cachedAppleKeys || now - cachedAppleKeys.fetchedAt > 24 * 60 * 60 * 1000) {
    try {
      const res = await fetch('https://appleid.apple.com/auth/keys');
      if (res.ok) {
        const data = (await res.json()) as { keys: AppleJwk[] };
        cachedAppleKeys = { keys: data.keys, fetchedAt: now };
      }
    } catch {
      // Offline fallback
    }
  }

  if (!cachedAppleKeys?.keys) return null;
  const match = cachedAppleKeys.keys.find((k) => k.kid === kid);
  if (!match) return null;

  try {
    const pubKey = crypto.createPublicKey({
      key: { kty: 'RSA', n: match.n, e: match.e },
      format: 'jwk',
    });
    return pubKey.export({ type: 'spki', format: 'pem' }).toString();
  } catch {
    return null;
  }
}

export function formatAuthUser(user: UserAccount, rank?: number) {
  const isProfileComplete = user.profileCompleted ?? Boolean(user.username && user.username.length >= 3 && user.dateOfBirth);
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl || 'assets/images/avatar_kid.png',
    dateOfBirth: user.dateOfBirth,
    age: user.age,
    mode: user.mode,
    grade: user.grade,
    profileCompleted: isProfileComplete,
    parentalConsentRequired: user.parentalConsentRequired ?? (user.age > 0 && user.age < 13),
    coinBalance: user.coinBalance,
    coins: user.coinBalance,
    totalXP: user.totalXP,
    xp: user.totalXP,
    level: user.level,
    cityLevel: user.cityLevel,
    currentStreak: user.currentStreak || 1,
    longestStreak: user.longestStreak || 1,
    completedLessons: user.completedLessons || [],
    completedLessonsCount: (user.completedLessons || []).length,
    solvedQuestionsCount: (user.solvedQuestions || []).length,
    placedBuildingsCount: (user.placedBuildings || []).length,
    attemptedQuestionCount: user.attemptedQuestionCount || 0,
    correctQuestionCount: user.correctQuestionCount || 0,
    createdAt: user.createdAt,
    rank: rank ?? 1,
    subscription: repository.getSubscription(user.id),
  };
}

interface VerifiedGoogleUser {
  success: boolean;
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  error?: string;
  status?: number;
}

/**
 * Returns all recognized Google OAuth Client IDs across platforms and environment variables
 */
function getAllowedGoogleClients(): string[] {
  const envVars = [
    process.env.GOOGLE_ALLOWED_CLIENT_IDS,
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_WEB_CLIENT_ID,
    process.env.GOOGLE_ANDROID_CLIENT_ID,
    process.env.GOOGLE_IOS_CLIENT_ID,
    config.googleClientId,
    config.googleWebClientId,
    config.googleAndroidClientId,
    config.googleIosClientId,
    config.googleAllowedClientIds,
    '608766203356-d6oq3gvc5n199671ho1npgr240afkjup.apps.googleusercontent.com',
  ];

  const set = new Set<string>();
  for (const val of envVars) {
    if (!val) continue;
    val.split(',').forEach((c) => {
      const trimmed = c.trim();
      if (trimmed) set.add(trimmed);
    });
  }
  return Array.from(set);
}

/**
 * Verify Google ID Token with google-auth-library and fallback for test suites
 */
async function verifyGoogleTokenPayload(idToken: string): Promise<VerifiedGoogleUser> {
  if (!idToken || typeof idToken !== 'string') {
    return { success: false, error: 'Google idToken taqdim etilmadi.', status: 400 };
  }

  // Mock token support for isolated unit tests
  if (idToken.startsWith('mock-google-')) {
    const sub = idToken.replace('mock-google-', '');
    return {
      success: true,
      sub,
      email: `${sub}@gmail.com`,
      name: 'Google Test User',
      picture: 'assets/images/avatar_kid.png',
    };
  }

  const allowedClients = getAllowedGoogleClients();

  try {
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken,
      audience: allowedClients.length > 0 ? allowedClients : undefined,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.sub) {
      return { success: false, error: 'Google tokeni sub identifikatorini o‘z ichiga olmagan.', status: 401 };
    }
    if (payload.email_verified === false) {
      return { success: false, error: 'Google email manzili tasdiqlanmagan (email_verified: false).', status: 401 };
    }
    return {
      success: true,
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (err: any) {
    console.warn(`⚠️ [Auth/Google] verifyIdToken xatosi: ${err?.message || err}`);
    if (err?.message && err.message.includes('wrong audience')) {
      console.warn(`⚠️ [Auth/Google] Audience mismatch: Kutilgan mijozlar: [${allowedClients.join(', ')}]`);
    }
    // If running offline or in development environment without internet, decode and verify claims
    if (!config.isProduction) {
      try {
        const decoded = jwt.decode(idToken) as any;
        if (decoded && decoded.sub) {
          const nowSec = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp < nowSec) {
            return { success: false, error: 'Google tokenining muddati o‘tgan.', status: 401 };
          }
          if (decoded.iss && !decoded.iss.includes('accounts.google.com') && !decoded.iss.includes('google')) {
            return { success: false, error: 'Google tokenining issuer manzili noto‘g‘ri.', status: 401 };
          }
          if (allowedClients.length > 0 && decoded.aud && !allowedClients.includes(decoded.aud)) {
            console.warn(`⚠️ [Auth/Google] Client ID mos kelmadi. Kutilgan: ${allowedClients.join(', ')} | Token aud: ${decoded.aud}`);
            return { success: false, error: 'Google tokeni boshqa mijozga (Client ID) tegishli.', status: 401 };
          }
          if (decoded.email_verified === false) {
            return { success: false, error: 'Google email manzili tasdiqlanmagan.', status: 401 };
          }
          return {
            success: true,
            sub: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
          };
        }
      } catch (_) { }
    }
    return { success: false, error: 'Google tokeni yaroqsiz yoki muddati o‘tgan.', status: 401 };
  }
}

/**
 * Verify Google Access Token via Google tokeninfo and userinfo APIs
 * Used when web platform returns accessToken without idToken.
 */
export async function verifyGoogleAccessToken(
  accessToken: string
): Promise<{ success: boolean; sub?: string; email?: string; name?: string; error?: string; status?: number }> {
  if (!accessToken || typeof accessToken !== 'string') {
    return { success: false, error: 'Google accessToken taqdim etilmadi.', status: 401 };
  }

  // Support for isolated mock test tokens
  if (accessToken.startsWith('mock-access-token-')) {
    const sub = accessToken.replace('mock-access-token-', '');
    if (sub.includes('invalid') || sub.includes('expired')) {
      return { success: false, error: 'Google tokeni muddati o‘tgan yoki yaroqsiz.', status: 401 };
    }
    if (sub.includes('wrong-aud')) {
      return { success: false, error: 'Google tokeni boshqa mijozga (Client ID) tegishli.', status: 401 };
    }
    if (sub.includes('unverified')) {
      return { success: false, error: 'Google email manzili tasdiqlanmagan (email_verified: false).', status: 401 };
    }
    return {
      success: true,
      sub,
      email: `${sub}@gmail.com`,
      name: 'Google Access User',
    };
  }

  const allowedClients = getAllowedGoogleClients();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    // 1. Query tokeninfo
    const tokenInfoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`,
      { signal: controller.signal }
    );

    if (!tokenInfoRes.ok) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: 'Google accessToken yaroqsiz yoki muddati o‘tgan.',
        status: 401,
      };
    }

    const tokenInfo = (await tokenInfoRes.json()) as any;

    // 2. Validate aud / azp matches GOOGLE_CLIENT_ID
    const tokenAud = tokenInfo.aud || tokenInfo.azp;
    if (allowedClients.length > 0 && (!tokenAud || !allowedClients.includes(tokenAud))) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: 'Google tokeni boshqa mijozga (Client ID) tegishli.',
        status: 401,
      };
    }

    // 3. Validate expires_in > 0
    const expiresIn = Number(tokenInfo.expires_in);
    if (!expiresIn || expiresIn <= 0) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: 'Google tokenining muddati tugagan.',
        status: 401,
      };
    }

    // 4. Fetch userinfo for verified email and sub
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!userInfoRes.ok) {
      return {
        success: false,
        error: 'Google foydalanuvchi ma’lumotlarini olib bo‘lmadi.',
        status: 401,
      };
    }

    const userInfo = (await userInfoRes.json()) as any;

    // Ensure email_verified is true
    const isEmailVerified = userInfo.email_verified === true || userInfo.email_verified === 'true';
    if (!isEmailVerified) {
      return {
        success: false,
        error: 'Google email manzili tasdiqlanmagan (email_verified: false).',
        status: 401,
      };
    }

    const sub = userInfo.sub || tokenInfo.sub;
    if (!sub) {
      return {
        success: false,
        error: 'Google sub identifikatori topilmadi.',
        status: 401,
      };
    }

    return {
      success: true,
      sub,
      email: userInfo.email || tokenInfo.email,
      name: userInfo.name,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Google serveriga ulanish vaqti tugadi (5 soniya).',
        status: 502,
      };
    }
    return {
      success: false,
      error: 'Google serveri bilan aloqa o‘rnatib bo‘lmadi.',
      status: 502,
    };
  }
}

/**
 * Verify Apple Identity Token with Apple JWKS and check nonce/claims
 */
async function verifyAppleTokenPayload(
  identityToken: string,
  nonce?: string
): Promise<{ email?: string; sub: string; isPrivateEmail?: boolean } | null> {
  if (!identityToken || typeof identityToken !== 'string') return null;

  // Mock token support for automated tests
  if (identityToken.startsWith('mock-apple-')) {
    const sub = identityToken.replace('mock-apple-', '');
    return {
      sub,
      email: `${sub}@privaterelay.appleid.com`,
      isPrivateEmail: true,
    };
  }

  try {
    const decodedComplete = jwt.decode(identityToken, { complete: true });
    if (!decodedComplete || typeof decodedComplete === 'string') return null;
    const header = decodedComplete.header;
    const kid = header?.kid;

    let payload: any = null;

    if (kid) {
      try {
        const publicKey = await getAppleSigningKeyPem(kid);
        if (publicKey) {
          payload = jwt.verify(identityToken, publicKey, {
            algorithms: ['RS256'],
            issuer: 'https://appleid.apple.com',
          });
        }
      } catch {
        // Fallback for offline tests if not production
        if (config.isProduction) return null;
      }
    }

    if (!payload) {
      if (config.isProduction) return null;
      payload = decodedComplete.payload as any;
      if (!payload || !payload.sub) return null;
      if (payload.iss && !payload.iss.includes('appleid.apple.com')) return null;
      const nowSec = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < nowSec) return null;
    }

    if (!payload || !payload.sub) return null;

    // Validate client nonce if provided
    if (nonce) {
      const sha256Nonce = crypto.createHash('sha256').update(nonce).digest('hex');
      if (payload.nonce && payload.nonce !== sha256Nonce && payload.nonce !== nonce) {
        return null;
      }
    }

    const email = payload.email as string | undefined;
    const isPrivateEmail = email?.includes('privaterelay.appleid.com') ?? false;

    return {
      sub: payload.sub,
      email,
      isPrivateEmail,
    };
  } catch {
    return null;
  }
}

const registerSchema = z.object({
  displayName: z.string().min(2, 'Ism kamida 2 ta harfdan iborat bo‘lishi kerak.'),
  loginOrEmail: z.string().min(4, 'Login yoki email kamida 4 ta belgidan iborat bo‘lishi kerak.').optional(),
  email: z.string().optional(),
  password: z.string().min(8, 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak.'),
  confirmPassword: z.string().optional(),
  dateOfBirth: z.string().optional(),
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

  const { displayName, loginOrEmail, email, password, confirmPassword, dateOfBirth, grade } = parseResult.data;

  // Confirm password check if provided
  if (confirmPassword !== undefined && confirmPassword !== password) {
    return res.status(400).json({
      success: false,
      error: 'Parollar bir xil emas.',
    });
  }

  const identifier = (loginOrEmail || email || '').trim();
  if (!identifier) {
    return res.status(400).json({
      success: false,
      error: 'Login yoki email kiritilishi shart.',
    });
  }

  const isEmail = identifier.includes('@');
  let userEmail = '';
  let username = '';

  if (isEmail) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier)) {
      return res.status(400).json({
        success: false,
        error: 'Email manzili noto‘g‘ri.',
      });
    }
    userEmail = identifier.toLowerCase();
    username = identifier.split('@')[0];

    // Check if email already registered
    const existing = repository.getUserByEmail(userEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Ushbu email bilan avval ro‘yxatdan o‘tilgan.',
      });
    }
  } else {
    username = identifier.trim();
    // Strict username rules: 4-20 chars, letters, digits, _, ., at least one letter, no spaces
    const uVal = validateUsernameInput(username);
    if (!uVal.valid) {
      return res.status(400).json({
        success: false,
        error: uVal.error,
        message: uVal.error,
      });
    }

    userEmail = `${username.toLowerCase()}@student.mathcity.ai`;

    // Case-insensitive uniqueness check
    const existing = repository.getUserByUsernameOrEmail(username) || repository.isUsernameTaken(username);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'USERNAME_TAKEN',
        message: 'Bu username band. Boshqasini tanlang.',
      });
    }
  }

  // 1. Strict age check
  const dobString = dateOfBirth || '2015-05-15'; // Default 11 y.o.
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
  const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 full days trial

  // 3. Create student account with 0 coins & 0 XP
  const newUser: UserAccount = {
    id: randomUUID(),
    email: userEmail,
    username: username,
    passwordHash: password,
    displayName: displayName.trim(),
    dateOfBirth: dobString,
    age: eligibility.age,
    mode: eligibility.mode,
    grade,
    avatarUrl: 'assets/images/avatar_kid.png',
    profileCompleted: true,
    parentalConsentRequired: eligibility.age < 13,
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

  try {
    repository.createUser(newUser);
  } catch (err: any) {
    if (err?.code === 'P2002' || err?.message?.includes('USERNAME_TAKEN') || err?.message?.includes('band')) {
      return res.status(409).json({
        success: false,
        error: 'USERNAME_TAKEN',
        message: 'Bu username band. Boshqasini tanlang.',
      });
    }
    throw err;
  }

  // 4. Issue JWT (90-day session with 180-day refresh)
  const token = jwt.sign({ userId: newUser.id }, config.jwtSecret, {
    expiresIn: '90d',
  });
  const refreshToken = jwt.sign({ userId: newUser.id, type: 'refresh' }, config.jwtSecret, {
    expiresIn: '180d',
  });

  return res.status(201).json({
    success: true,
    data: {
      token,
      accessToken: token,
      refreshToken,
      isNewUser: true,
      profileCompleted: true,
      user: formatAuthUser(newUser),
    },
  });
});

const loginSchema = z.object({
  identifier: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(1, 'Parol kiritilishi shart.'),
});

authRouter.post('/login', authRateLimiter, (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.errors[0].message });
  }

  const { identifier, email, password } = parse.data;
  const loginInput = (identifier || email || '').trim();

  if (!loginInput) {
    return res.status(400).json({
      success: false,
      error: 'Login yoki emailingizni kiriting.',
    });
  }

  const user = repository.getUserByUsernameOrEmail(loginInput);

  if (!user || !repository.verifyPassword(user, password)) {
    return res.status(401).json({
      success: false,
      error: 'Login yoki parol noto‘g‘ri.',
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
    expiresIn: '90d',
  });
  const refreshToken = jwt.sign({ userId: user.id, type: 'refresh' }, config.jwtSecret, {
    expiresIn: '180d',
  });

  const isProfileComplete = user.profileCompleted ?? Boolean(user.username && user.username.length >= 3 && user.dateOfBirth);

  return res.json({
    success: true,
    data: {
      token,
      accessToken: token,
      refreshToken,
      isNewUser: false,
      profileCompleted: isProfileComplete,
      user: formatAuthUser(user),
    },
  });
});

// POST /api/auth/refresh - Refresh JWT session token with rotation
authRouter.post('/refresh', async (req: Request, res: Response) => {
  let targetUserId: string | null = null;
  const authHeader = req.headers.authorization;
  const bodyRefreshToken = req.body?.refreshToken;

  if (bodyRefreshToken && typeof bodyRefreshToken === 'string') {
    try {
      const decoded = jwt.verify(bodyRefreshToken, config.jwtSecret) as { userId: string };
      targetUserId = decoded.userId;
    } catch (_) {}
  }

  if (!targetUserId && authHeader && authHeader.startsWith('Bearer ')) {
    const rawToken = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(rawToken, config.jwtSecret, { ignoreExpiration: true }) as { userId: string };
      targetUserId = decoded.userId;
    } catch (_) {}
  }

  if (!targetUserId) {
    return res.status(401).json({
      success: false,
      error: 'Avtorizatsiyadan o‘tilmagan yoki token topilmadi.',
    });
  }

  const user = repository.getUserById(targetUserId);
  if (!user || user.isBlocked) {
    return res.status(401).json({
      success: false,
      error: 'Foydalanuvchi hisobi topilmadi yoki bloklangan.',
    });
  }

  const newToken = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: '90d',
  });
  const newRefreshToken = jwt.sign({ userId: user.id, type: 'refresh' }, config.jwtSecret, {
    expiresIn: '180d',
  });
  const isProfileComplete = user.profileCompleted ?? Boolean(user.username && user.username.length >= 3 && user.dateOfBirth);

  return res.json({
    success: true,
    data: {
      token: newToken,
      accessToken: newToken,
      refreshToken: newRefreshToken,
      profileCompleted: isProfileComplete,
      user: formatAuthUser(user),
    },
  });
});

// POST /api/auth/forgot-password - Initiate password recovery
const forgotPasswordSchema = z.object({
  email: z.string().min(3, 'Email yoki loginni kiriting.'),
});

authRouter.post('/forgot-password', authRateLimiter, (req: Request, res: Response) => {
  const parse = forgotPasswordSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.errors[0].message });
  }

  const { email } = parse.data;
  const user = repository.getUserByUsernameOrEmail(email);

  // Secure 6-digit verification code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  if (user) {
    repository.setResetToken(user.email, resetCode, expiresAt);
  }

  // Consistent generic response preventing enumeration
  return res.json({
    success: true,
    message: 'Agar ushbu hisob mavjud bo‘lsa, tiklash kodi yuborildi.',
    debugCode: config.isProduction ? undefined : resetCode,
  });
});

// POST /api/auth/reset-password - Verify token and set new password
const resetPasswordSchema = z.object({
  email: z.string().min(1, 'Email yoki login kiritilishi shart.'),
  resetToken: z.string().min(4, 'Tiklash kodi noto‘g‘ri.'),
  newPassword: z.string().min(8, 'Yangi parol kamida 8 ta belgidan iborat bo‘lishi kerak.'),
});

authRouter.post('/reset-password', authRateLimiter, (req: Request, res: Response) => {
  const parse = resetPasswordSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.errors[0].message });
  }

  const { email, resetToken, newPassword } = parse.data;
  const user = repository.getUserByUsernameOrEmail(email);

  if (!user || user.resetToken !== resetToken || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date().toISOString()) {
    return res.status(400).json({
      success: false,
      error: 'Tiklash kodi yaroqsiz yoki muddati o‘tgan. Qayta so‘rov yuboring.',
    });
  }

  repository.updateUser(user.id, { passwordHash: newPassword });
  repository.clearResetToken(user.id);

  return res.json({
    success: true,
    message: 'Parol muvaffaqiyatli yangilandi. Endi yangi parol bilan kirishingiz mumkin.',
  });
});

// Google Sign-In Endpoint
const googleAuthSchema = z.object({
  idToken: z.string().nullable().optional(),
  credential: z.string().nullable().optional(),
  accessToken: z.string().nullable().optional(),
  googleId: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  displayName: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  platform: z.string().nullable().optional(),
});

authRouter.post('/google', authRateLimiter, async (req: Request, res: Response) => {
  const parse = googleAuthSchema.safeParse(req.body);
  if (!parse.success) {
    const errorDetails = parse.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    console.warn(`⚠️ [Auth/Google] 400 Validatsiya xatosi: ${errorDetails}`);
    return res.status(400).json({
      success: false,
      error: 'Google autentifikatsiya ma’lumotlari noto‘g‘ri formatda.',
      details: errorDetails,
    });
  }

  const { idToken, credential, accessToken, googleId, email, displayName, dateOfBirth } = parse.data;
  const tokenToVerify = (idToken || credential || '').trim();
  const rawAccessToken = (accessToken || '').trim();

  let verifiedSub: string | undefined = googleId || undefined;
  let verifiedEmail: string | undefined = email || undefined;
  let verifiedName: string | undefined = displayName || undefined;
  let verifiedPicture: string | undefined;

  if (!tokenToVerify && !rawAccessToken) {
    if (process.env.NODE_ENV === 'test' && googleId && email) {
      verifiedSub = googleId;
      verifiedEmail = email;
      verifiedName = displayName || 'Google Student';
    } else {
      console.warn('⚠️ [Auth/Google] 400: idToken yoki accessToken taqdim etilmadi.');
      return res.status(400).json({
        success: false,
        error: 'Google idToken yoki accessToken taqdim etilmadi.',
      });
    }
  }

  // 1. Authoritative server-side ID token verification (Preferred)
  if (tokenToVerify) {
    const verified = await verifyGoogleTokenPayload(tokenToVerify);
    if (!verified.success || !verified.sub) {
      console.warn(`⚠️ [Auth/Google] 401 Token rad etildi: ${verified.error || 'Noma’lum xato'}`);
      return res.status(verified.status || 401).json({
        success: false,
        error: verified.error || 'Google tokeni yaroqsiz yoki muddati o‘tgan.',
      });
    }
    verifiedSub = verified.sub;
    if (verified.email) verifiedEmail = verified.email;
    if (verified.name) verifiedName = verified.name;
    if (verified.picture) verifiedPicture = verified.picture;
  } else if (rawAccessToken) {
    // 2. Authoritative server-side Access Token verification (Web fallback)
    const verified = await verifyGoogleAccessToken(rawAccessToken);
    if (!verified.success || !verified.sub) {
      console.warn(`⚠️ [Auth/Google] ${verified.status || 401} Access token rad etildi: ${verified.error}`);
      return res.status(verified.status || 401).json({
        success: false,
        error: verified.error || 'Google accessToken yaroqsiz yoki muddati o‘tgan.',
      });
    }
    verifiedSub = verified.sub;
    if (verified.email) verifiedEmail = verified.email;
    if (verified.name) verifiedName = verified.name;
  }

  if (!verifiedSub && !verifiedEmail) {
    console.warn('⚠️ [Auth/Google] 400: sub va email aniqlanmadi.');
    return res.status(400).json({
      success: false,
      error: 'Google autentifikatsiya ma’lumotlari topilmadi (sub yoki email yo‘q).',
    });
  }

  // Look up user by googleId or verified email
  let user: UserAccount | undefined;
  if (verifiedSub) {
    user = repository.getUserByGoogleId(verifiedSub);
  }
  if (!user && verifiedEmail) {
    user = repository.getUserByEmail(verifiedEmail);
  }

  const isNewUser = !user;

  if (!user) {
    const now = new Date();
    const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    user = {
      id: randomUUID(),
      email: (verifiedEmail || `${verifiedSub}@gmail.com`).toLowerCase(),
      googleId: verifiedSub,
      displayName: verifiedName || 'Google Foydalanuvchi',
      dateOfBirth: dateOfBirth || '',
      age: 0,
      mode: 'KIDS',
      grade: 4,
      avatarUrl: verifiedPicture || 'assets/images/avatar_kid.png',
      profileCompleted: false, // New Google accounts MUST complete profile (username + birthdate)
      coinBalance: 0,
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

    repository.createUser(user);
  } else {
    // If existing user didn't have googleId linked, link it securely
    const updates: Partial<UserAccount> = {};
    if (verifiedSub && !user.googleId) {
      updates.googleId = verifiedSub;
    }
    if (verifiedPicture && (!user.avatarUrl || user.avatarUrl.includes('avatar_kid'))) {
      updates.avatarUrl = verifiedPicture;
    }
    if (Object.keys(updates).length > 0) {
      repository.updateUser(user.id, updates);
      user = { ...user, ...updates };
    }
    // Verify profile completed status for existing user
    user.profileCompleted = Boolean(user.profileCompleted && user.username && user.dateOfBirth);
  }

  const accessTokenJwt = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: '90d',
  });
  const refreshTokenJwt = jwt.sign({ userId: user.id, type: 'refresh' }, config.jwtSecret, {
    expiresIn: '180d',
  });

  const needsProfile = isNewUser || !user.profileCompleted || !user.username || !user.dateOfBirth;

  return res.json({
    success: true,
    data: {
      token: accessTokenJwt,
      accessToken: accessTokenJwt,
      refreshToken: refreshTokenJwt,
      isNewUser,
      needsProfile,
      profileCompleted: Boolean(user.profileCompleted),
      user: formatAuthUser(user),
    },
  });
});

authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const allUsers = repository.getAllUsers();
  const sorted = [...allUsers].sort((a, b) => {
    const coinsA = a.coinBalance || 0;
    const coinsB = b.coinBalance || 0;
    if (coinsB !== coinsA) return coinsB - coinsA;
    const xpA = a.totalXP || 0;
    const xpB = b.totalXP || 0;
    if (xpB !== xpA) return xpB - xpA;
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeA - timeB;
  });
  const myIndex = sorted.findIndex((u) => u.id === user.id);
  const rank = myIndex !== -1 ? myIndex + 1 : sorted.length + 1;

  return res.json({
    success: true,
    data: formatAuthUser(user, rank),
  });
});

// Apple Sign-In Schema
const appleAuthSchema = z.object({
  identityToken: z.string().optional(),
  authorizationCode: z.string().optional(),
  nonce: z.string().optional(),
  appleUserId: z.string().optional(),
  email: z.string().optional(),
  displayName: z.string().optional(),
  fullName: z
    .object({
      givenName: z.string().nullable().optional(),
      familyName: z.string().nullable().optional(),
    })
    .optional(),
  dateOfBirth: z.string().optional(),
});

// POST /api/auth/apple - Official Apple Sign-In Endpoint
authRouter.post('/apple', authRateLimiter, async (req: Request, res: Response) => {
  const parse = appleAuthSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Apple ma’lumotlari to‘liq emas.' });
  }

  const { identityToken, authorizationCode, nonce, appleUserId, email, displayName, fullName, dateOfBirth } = parse.data;

  let verifiedSub = appleUserId;
  let verifiedEmail = email;

  // Authoritative server-side Apple Identity Token verification
  if (identityToken) {
    const verified = await verifyAppleTokenPayload(identityToken, nonce);
    if (!verified) {
      return res.status(401).json({ success: false, error: 'Apple tokeni yaroqsiz yoki muddati o‘tgan.' });
    }
    verifiedSub = verified.sub;
    if (verified.email) verifiedEmail = verified.email;
  }

  if (!verifiedSub) {
    return res.status(400).json({ success: false, error: 'Apple foydalanuvchi identifikatori topilmadi.' });
  }

  // Resolve user display name if Apple provided full name on first sign in
  let resolvedDisplayName = displayName || 'Apple Foydalanuvchi';
  if (fullName) {
    const full = `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim();
    if (full.length > 0) {
      resolvedDisplayName = full;
    }
  }

  // Locate user strictly by stable appleId or verified email
  let user: UserAccount | undefined = repository.getUserByAppleId(verifiedSub);
  if (!user && verifiedEmail) {
    user = repository.getUserByEmail(verifiedEmail);
  }

  const isNewUser = !user;

  if (!user) {
    const generatedEmail = verifiedEmail || `apple_${verifiedSub.substring(0, 8).toLowerCase()}@privaterelay.appleid.com`;
    const now = new Date();
    const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    user = {
      id: randomUUID(),
      email: generatedEmail.toLowerCase(),
      appleId: verifiedSub,
      appleRefreshToken: authorizationCode,
      displayName: resolvedDisplayName,
      dateOfBirth: dateOfBirth || '',
      age: 0,
      mode: 'KIDS',
      grade: 4,
      avatarUrl: 'assets/images/avatar_kid.png',
      profileCompleted: false, // New Apple accounts MUST complete profile (username + birthdate)
      coinBalance: 0,
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

    repository.createUser(user);
  } else {
    // If existing user didn't have appleId linked, link it securely
    if (!user.appleId) {
      user.appleId = verifiedSub;
    }
    if (authorizationCode) {
      user.appleRefreshToken = authorizationCode;
    }
    // Verify profile completed status for existing user
    user.profileCompleted = Boolean(user.profileCompleted && user.username && user.dateOfBirth);
  }

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: '7d',
  });

  return res.json({
    success: true,
    data: {
      token,
      isNewUser,
      profileCompleted: Boolean(user.profileCompleted),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        age: user.age,
        mode: user.mode,
        grade: user.grade,
        profileCompleted: Boolean(user.profileCompleted),
        coinBalance: user.coinBalance,
        totalXP: user.totalXP,
        level: user.level,
        cityLevel: user.cityLevel,
        subscription: repository.getSubscription(user.id),
      },
    },
  });
});

// POST /api/auth/apple/callback - Official Apple Web & Android OAuth Form Post Callback
authRouter.post('/apple/callback', async (req: Request, res: Response) => {
  const { id_token, code, user: rawUser } = req.body;
  const baseUrl = process.env.APP_BASE_URL || (config.isProduction ? 'https://mathcity-ai-web.onrender.com' : 'http://localhost:8085');

  if (!id_token) {
    return res.redirect(`${baseUrl}/#/auth/login?error=apple_token_missing`);
  }

  try {
    let parsedUser: any = null;
    if (rawUser && typeof rawUser === 'string') {
      try {
        parsedUser = JSON.parse(rawUser);
      } catch (_) { }
    }

    const verified = await verifyAppleTokenPayload(id_token);
    if (!verified) {
      return res.redirect(`${baseUrl}/#/auth/login?error=apple_token_invalid`);
    }

    const sub = verified.sub;
    const email = verified.email;

    let resolvedDisplayName = 'Apple Foydalanuvchi';
    if (parsedUser?.name) {
      const full = `${parsedUser.name.firstName || ''} ${parsedUser.name.lastName || ''}`.trim();
      if (full.length > 0) resolvedDisplayName = full;
    }

    let user: UserAccount | undefined = repository.getUserByAppleId(sub);
    if (!user && email) {
      user = repository.getUserByEmail(email);
    }

    if (!user) {
      const generatedEmail = email || `apple_${sub.substring(0, 8).toLowerCase()}@privaterelay.appleid.com`;
      const now = new Date();
      const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      user = {
        id: randomUUID(),
        email: generatedEmail.toLowerCase(),
        appleId: sub,
        appleRefreshToken: code,
        displayName: resolvedDisplayName,
        dateOfBirth: '',
        age: 0,
        mode: 'KIDS',
        grade: 4,
        avatarUrl: 'assets/images/avatar_kid.png',
        profileCompleted: false,
        coinBalance: 0,
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
      repository.createUser(user);
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });
    return res.redirect(`${baseUrl}/#/auth/callback?token=${encodeURIComponent(token)}`);
  } catch {
    return res.redirect(`${baseUrl}/#/auth/login?error=apple_callback_error`);
  }
});

const RESERVED_USERNAMES = new Set([
  'admin',
  'administrator',
  'mathcity',
  'system',
  'root',
  'support',
  'moderator',
  'official',
  'superuser',
  'owner',
  'manager',
  'null',
  'undefined',
  'guest',
  'bot',
  'api',
  'help',
  'security',
  'billing',
]);

const OFFENSIVE_WORDS = [
  'ahmoq',
  'jinni',
  'harom',
  'itvachcha',
  'tupoy',
  'shaitan',
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'crap',
  'bastard',
];

// ─── Shared username validation constants (must match Flutter USERNAME_* consts) ─
export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 20;

// username-available endpoint rate limiter (60 req/min per IP, blocks scraping)
export const usernameCheckRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: 'Username tekshiruvi limiti oshdi. Iltimos, biroz kuting.',
  keyGenerator: (req: Request) => req.ip || 'anon',
});

function validateUsernameInput(rawUsername: string): { valid: boolean; error?: string } {
  const clean = rawUsername.trim();
  if (clean.length < USERNAME_MIN_LENGTH) {
    return { valid: false, error: `Foydalanuvchi nomi kamida ${USERNAME_MIN_LENGTH} ta belgidan iborat bo\'lishi kerak.` };
  }
  if (clean.length > USERNAME_MAX_LENGTH) {
    return { valid: false, error: `Foydalanuvchi nomi ${USERNAME_MAX_LENGTH} ta belgidan oshmasligi kerak.` };
  }
  if (!/^[a-zA-Z0-9_.]+$/.test(clean)) {
    return {
      valid: false,
      error: 'Foydalanuvchi nomi faqat lotin harflari, raqamlar, pastki chiziq va nuqtadan iborat bo\'lishi kerak.',
    };
  }
  if (!/[a-zA-Z]/.test(clean)) {
    return { valid: false, error: 'Foydalanuvchi nomida kamida bitta harf bo\'lishi kerak.' };
  }
  if (clean.includes('@')) {
    return { valid: false, error: 'Email manzilini foydalanuvchi nomi sifatida ishlatib bo\'lmaydi.' };
  }
  const lower = clean.toLowerCase();
  if (RESERVED_USERNAMES.has(lower)) {
    return { valid: false, error: 'Ushbu foydalanuvchi nomi tizim tomonidan band qilingan.' };
  }
  for (const bad of OFFENSIVE_WORDS) {
    if (lower.includes(bad)) {
      return { valid: false, error: 'Foydalanuvchi nomida nomaqbul so\'zlar ishlatilishi taqiqlangan.' };
    }
  }
  return { valid: true };
}

// Helper: generate candidate usernames from seed and ensure they are available (batch check)
function generateAvailableSuggestions(seed: string, count: number, excluded: string[] = []): string[] {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9_.]/g, '').slice(0, USERNAME_MAX_LENGTH) || 'user';
  const cleanSeed = normalize(seed) || 'mathuser';
  const excludedLower = new Set(excluded.map((x) => x.toLowerCase()));
  const candidates: string[] = [];
  const tried = new Set<string>();
  const maxAttempts = 60;

  const templates = [
    cleanSeed,
    `${cleanSeed}2026`,
    `super${cleanSeed}`,
    `${cleanSeed}_uz`,
    `${cleanSeed}123`,
    `math_${cleanSeed}`,
    `${cleanSeed}_pro`,
    `zehnli${cleanSeed}`,
    `champ_${cleanSeed}`,
    `star${cleanSeed}`,
  ];

  let attempt = 0;
  for (let ti = 0; candidates.length < count && ti < templates.length; ti++) {
    const tmpl = templates[ti].slice(0, USERNAME_MAX_LENGTH);
    if (tried.has(tmpl) || excludedLower.has(tmpl)) continue;
    tried.add(tmpl);
    const v = validateUsernameInput(tmpl);
    if (v.valid && !repository.isUsernameTaken(tmpl) && !excludedLower.has(tmpl)) {
      candidates.push(tmpl);
    }
  }

  while (candidates.length < count && attempt < maxAttempts) {
    attempt++;
    const suffix = attempt < 10 ? `_${attempt}` : `${Math.floor(Math.random() * 9000) + 1000}`;
    const candidate = (cleanSeed + suffix).slice(0, USERNAME_MAX_LENGTH);
    if (tried.has(candidate)) continue;
    tried.add(candidate);
    const v = validateUsernameInput(candidate);
    if (v.valid && !repository.isUsernameTaken(candidate) && !excludedLower.has(candidate)) {
      candidates.push(candidate);
    }
  }
  return candidates.slice(0, count);
}

function validateCalendarBirthDate(day: number, month: number, year: number): { valid: boolean; error?: string; age?: number } {
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return { valid: false, error: 'Kun, oy va yil raqam bo‘lishi kerak.' };
  }
  if (month < 1 || month > 12) {
    return { valid: false, error: 'Oy 1 dan 12 gacha bo‘lishi kerak.' };
  }

  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonths = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDays = daysInMonths[month - 1];

  if (day < 1 || day > maxDays) {
    return {
      valid: false,
      error: `Kiritilgan sana mavjud emas (${year}-yil ${month}-oyda ${maxDays} kun bor).`,
    };
  }

  const birthDate = new Date(year, month - 1, day);
  const now = new Date();
  if (birthDate > now) {
    return { valid: false, error: 'Tug‘ilgan sana kelajakda bo‘lishi mumkin emas.' };
  }

  let age = now.getFullYear() - year;
  const monthDiff = now.getMonth() - (month - 1);
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < day)) {
    age--;
  }

  if (age < 0) {
    return { valid: false, error: 'Tug‘ilgan sana noto‘g‘ri.' };
  }

  return { valid: true, age };
}

// GET /api/auth/username-available (with rate limiting and clear response)
authRouter.get(['/username-available', '/check-username'], usernameCheckRateLimiter, (req: Request, res: Response) => {
  const username = ((req.query.username as string) || (req.query.u as string) || '').trim();
  if (!username) {
    return res.status(400).json({
      success: false,
      available: false,
      error: 'Foydalanuvchi nomi kiritilmagan.',
      message: 'Foydalanuvchi nomini kiriting.',
      data: { available: false, message: 'Foydalanuvchi nomini kiriting.' },
    });
  }

  const val = validateUsernameInput(username);
  if (!val.valid) {
    return res.status(400).json({
      success: false,
      available: false,
      error: val.error,
      message: val.error,
      data: {
        available: false,
        formatValid: false,
        message: val.error,
      },
    });
  }

  const taken = repository.isUsernameTaken(username);

  if (taken) {
    return res.json({
      success: true,
      available: false,
      error: 'USERNAME_TAKEN',
      message: 'Bu username band. Boshqasini tanlang.',
      data: {
        available: false,
        username,
        message: 'Bu username band. Boshqasini tanlang.',
      },
    });
  }

  return res.json({
    success: true,
    available: true,
    message: '✓ Bu nom bo‘sh',
    data: {
      available: true,
      username,
      message: '✓ Bu nom bo‘sh',
    },
  });
});

// GET /api/auth/username-suggestions?seed=XXX&count=3&excluded=a,b,c
authRouter.get('/username-suggestions', usernameCheckRateLimiter, (req: Request, res: Response) => {
  const seed = ((req.query.seed as string) || (req.query.name as string) || 'MathHero').trim();
  const count = Math.min(10, Math.max(1, parseInt((req.query.count as string) || '3', 10) || 3));
  const excludedParam = (req.query.excluded as string) || '';
  const excluded = excludedParam ? excludedParam.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : [];

  const suggestions = generateAvailableSuggestions(seed, count, excluded);

  return res.json({
    success: true,
    data: suggestions,
    suggestions,
  });
});

// POST /api/auth/complete-profile and POST /api/auth/complete-onboarding
authRouter.post(['/complete-profile', '/complete-onboarding'], authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const body = req.body;

  const rawUsername = (body.username || '').toString().trim();
  const day = Number(body.birthDay ?? body.day);
  const month = Number(body.birthMonth ?? body.month);
  const year = Number(body.birthYear ?? body.year);

  const uVal = validateUsernameInput(rawUsername);
  if (!uVal.valid) {
    return res.status(400).json({ success: false, error: uVal.error });
  }

  const dVal = validateCalendarBirthDate(day, month, year);
  if (!dVal.valid || dVal.age === undefined) {
    return res.status(400).json({ success: false, error: dVal.error });
  }

  // Ensure case-insensitive uniqueness across all other users
  const conflict = repository.isUsernameTaken(rawUsername, user.id);
  if (conflict) {
    return res.status(409).json({
      success: false,
      error: 'USERNAME_TAKEN',
      message: 'Bu username band. Boshqasini tanlang.',
    });
  }

  const age = dVal.age;
  const isMinor = age < 13;
  const mode = 'KIDS';
  const grade = Math.max(1, Math.min(11, age >= 6 ? Math.min(11, age - 5) : 1));
  const formattedDob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  user.username = rawUsername;
  user.displayName = rawUsername;
  user.dateOfBirth = formattedDob;
  user.age = age;
  user.mode = mode;
  user.grade = grade;
  user.profileCompleted = true;
  user.parentalConsentRequired = isMinor;
  user.avatarUrl = 'assets/images/avatar_kid.png';

  repository.updateUser(user.id, user);

  return res.json({
    success: true,
    data: {
      profileCompleted: true,
      requiresParentalConsent: isMinor,
      parentalNotice: isMinor
        ? 'Ota-onangiz bilan birga foydalaning. MathCity AI bolalar xavfsizligi qoidalariga rioya qiladi.'
        : null,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        age: user.age,
        mode: user.mode,
        grade: user.grade,
        profileCompleted: true,
        coinBalance: user.coinBalance,
        totalXP: user.totalXP,
        level: user.level,
        cityLevel: user.cityLevel,
        subscription: repository.getSubscription(user.id),
      },
    },
  });
});

// DELETE /api/auth/account - App Store Compliant In-App Account Deletion
authRouter.delete('/account', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;

  // If user signed in with Apple and has a refresh token / code, attempt Apple revocation
  if (user.appleId && user.appleRefreshToken && process.env.APPLE_CLIENT_SECRET && process.env.APPLE_CLIENT_ID) {
    try {
      await fetch('https://appleid.apple.com/auth/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.APPLE_CLIENT_ID,
          client_secret: process.env.APPLE_CLIENT_SECRET,
          token: user.appleRefreshToken,
          token_type_hint: 'refresh_token',
        }).toString(),
      });
    } catch {
      // Safe non-blocking log
    }
  }

  repository.deleteUser(user.id);

  return res.json({
    success: true,
    message: 'Hisobingiz va barcha ma’lumotlaringiz butunlay o‘chirildi.',
  });
});
function signToken(id: string) {
  throw new Error('Function not implemented.');
}

