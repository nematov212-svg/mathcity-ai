import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}) {
  const store: RateLimitStore = {};
  const {
    windowMs,
    maxRequests,
    message = 'Juda ko‘p so‘rov yuborildi. Iltimos, birozdan so‘ng qayta urinib ko‘ring.',
    keyGenerator = (req) => {
      const authReq = req as AuthenticatedRequest;
      return authReq.user?.id || req.ip || req.socket.remoteAddress || 'anonymous';
    },
  } = options;

  // Cleanup expired entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const key in store) {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    }
  }, Math.max(60000, windowMs));

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip rate limiter in test environment
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const key = keyGenerator(req);
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    store[key].count++;

    if (store[key].count > maxRequests) {
      const retryAfterSeconds = Math.ceil((store[key].resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        error: message,
        retryAfterSeconds,
      });
    }

    next();
  };
}

// 1. Auth Rate Limiter (Brute-force protection: 10 attempts per minute)
export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
  message: 'Kirish urinishlari soni cheklandi. Iltimos, 1 daqiqadan so‘ng qayta urinib ko‘ring.',
  keyGenerator: (req) => req.ip || 'anonymous-auth',
});

// 2. AI Tutor Rate Limiter (Cost protection: 25 requests per hour)
export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 25,
  message: 'Ziyo AI ustoz uchun soatlik savollar limiti tugadi. Iltimos, birozdan keyin murojaat qiling.',
});

// 3. Practice Submission Rate Limiter (Anti-farming: 60 per minute)
export const practiceRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: 'Javoblarni yuborish tezligi juda yuqori. Iltimos, sekinroq yuboring.',
});

// 4. General API Rate Limiter
export const generalRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 300,
  message: 'Serverga haddan tashqari ko‘p so‘rov yuborildi.',
});
