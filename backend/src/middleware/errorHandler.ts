import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';

export interface AppError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || err.statusCode || 500;
  const isProd = config.isProduction;

  // Structured security logging
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    status,
    ip: req.ip,
    message: err.message,
    ...(isProd ? {} : { stack: err.stack }),
  };

  console.error('[MathCity Security Log]:', JSON.stringify(errorLog));

  // Sanitize message in production to prevent information disclosure (OWASP ASVS)
  let clientMessage = err.message;
  if (isProd && status === 500) {
    clientMessage = 'Ichki server xatoligi yuz berdi. Iltimos, qayta urinib ko‘ring.';
  }

  return res.status(status).json({
    success: false,
    error: clientMessage || 'Kutilmagan xatolik yuz berdi.',
    ...(isProd ? {} : { code: err.code }),
  });
}
