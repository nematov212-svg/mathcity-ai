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

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // 1. Allow non-browser requests (e.g. mobile apps, curl, tests) where origin is undefined
    if (!origin) return callback(null, true);
      
    // 2. Allow all localhost/127.0.0.1 ports (Flutter web dev)
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // 3. Allow origins from CORS_ORIGINS or ALLOWED_ORIGINS (comma-separated env)
    const allowed = [
      ...config.corsOrigins,
      ...config.allowedOrigins,
      ...(process.env.CORS_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean),
    ];
    if (allowed.includes('*') || allowed.includes(origin)) {
      return callback(null, true);
    }

    // 4. Allow Render and cloud domains (*.onrender.com, *.mathcity.ai)
    if (/^https?:\/\/([a-zA-Z0-9-]+\.)*(onrender\.com|mathcity\.ai)$/.test(origin)) {
      return callback(null, true);
    }

    // Fallback: in production or development, allow browser clients with credentials
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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
};

export const corsMiddleware = cors(corsOptions);

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
