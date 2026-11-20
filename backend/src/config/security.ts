import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './env.js';

export const securityHeaders = helmet({
  contentSecurityPolicy: config.isProduction
    ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://accounts.google.com'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", ...config.allowedOrigins, 'https://accounts.google.com'],
      },
    }
    : false,
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, tests) where origin is undefined
    if (!origin) return callback(null, true);

    // Allow all localhost/127.0.0.1 ports (e.g. :8085, :4000, :3000)
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Allow Render and cloud domains (*.onrender.com, *.mathcity.ai)
    if (/^https?:\/\/([a-zA-Z0-9-]+\.)*(onrender\.com|mathcity\.ai)$/.test(origin)) {
      return callback(null, true);
    }

    // Allow explicit allowedOrigins from config or wildcard
    if (config.allowedOrigins.includes('*') || config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Fallback: in production or development, allow browser clients with credentials
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Idempotency-Key',
    'x-admin-key',
    'X-Admin-Key',
    'Accept',
    'Origin',
    'x-warmup',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours preflight cache
});

export function requestTimeoutMiddleware(timeoutMs: number = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          error: 'So‘rov vaqti tugadi (Gateway Timeout). Server uyg‘onmoqda yoki yuklama ostida.',
        });
      }
    }, timeoutMs);

    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));
    next();
  };
}
