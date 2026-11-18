import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { repository, UserAccount } from '../utils/repository.js';
import { calculateAge } from '../utils/age.js';

export interface AuthenticatedRequest extends Request {
  user?: UserAccount;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Avtorizatsiyadan o‘tilmagan. Iltimos, hisobingizga kiring.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    const user = repository.getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Foydalanuvchi hisobi topilmadi.',
      });
    }

    // Strict dynamic age verification only for completed profiles with dateOfBirth
    if (user.dateOfBirth) {
      const dobDate = new Date(user.dateOfBirth);
      if (!isNaN(dobDate.getTime())) {
        const currentAge = calculateAge(dobDate);
        if (currentAge >= 17) {
          return res.status(403).json({
            success: false,
            errorCode: 'ELIGIBILITY_FAILED',
            error:
              'MathCity AI faqat 16 yoshgacha bo‘lgan o‘quvchilar uchun mo‘ljallangan. Afsuski, siz kira olmaysiz.',
          });
        }
        // Auto-update age and mode if turned 13
        if (currentAge >= 13 && user.mode === 'KIDS') {
          user.mode = 'TEEN';
        }
        user.age = currentAge;
      }
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Token yaroqsiz yoki muddati o‘tgan.',
    });
  }
}

/**
 * Middleware: Blocks access to core features if user profile (username & birthdate) is incomplete
 */
export function requireCompletedProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user && req.user.profileCompleted === false) {
    return res.status(403).json({
      success: false,
      code: 'PROFILE_INCOMPLETE',
      error: 'Ilovadan to‘liq foydalanish uchun profilingizni to‘ldiring.',
    });
  }
  next();
}
