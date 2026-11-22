import express, { Request, Response } from 'express';
import path from 'path';
import { securityHeaders, corsMiddleware, requestTimeoutMiddleware } from './config/security.js';
import { generalRateLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';

import { authRouter } from './modules/auth/auth.routes.js';
import { eligibilityRouter } from './modules/eligibility/eligibility.routes.js';
import { lessonsRouter } from './modules/lessons/lessons.routes.js';
import { practiceRouter } from './modules/practice/practice.routes.js';
import { gamesRouter } from './modules/games/games.routes.js';
import { aiRouter } from './modules/ai_teacher/ai.routes.js';
import { cityRouter } from './modules/city/city.routes.js';
import { coinsRouter } from './modules/coins/coins.routes.js';
import { xpRouter } from './modules/xp/xp.routes.js';
import { tasksRouter } from './modules/daily_tasks/tasks.routes.js';
import { achievementsRouter } from './modules/achievements/achievements.routes.js';
import { analyticsRouter } from './modules/analytics/analytics.routes.js';
import { studentsRouter } from './modules/students/profile.routes.js';
import { profileRouter } from './modules/profile/profile.routes.js';
import { settingsRouter } from './modules/settings/settings.routes.js';
import { subscriptionsRouter } from './modules/subscriptions/subscriptions.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { paymentsRouter } from './modules/payments/click.routes.js';
import { mediaRouter } from './modules/media/media.routes.js';
import { isDatabaseHealthy, checkDatabaseConnection } from './db/client.js';

const adminStaticPath = path.resolve(process.cwd(), 'public/admin');

export const app = express();

// 1. CORS Preflight & Transport Middleware (MUST be before helmet, rate-limit, and all routes)
app.use(corsMiddleware);
app.options('*', corsMiddleware);
app.use(securityHeaders);
app.use(requestTimeoutMiddleware(65000));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalRateLimiter);

// 2. Health & Orchestration Probes (Render & Cloud compatible)
// Standard Render root health check
app.get('/health', async (req: Request, res: Response) => {
  let dbStatus = 'error';
  try {
    const dbCheck = await Promise.race([
      checkDatabaseConnection(),
      new Promise<{ connected: boolean }>((resolve) => setTimeout(() => resolve({ connected: false }), 2500)),
    ]);
    dbStatus = dbCheck.connected ? 'connected' : 'error';
  } catch (_) {
    dbStatus = 'error';
  }

  // Render health check expects HTTP 200 to keep the deployment alive,
  // while the payload explicitly reports the true database connection state.
  res.status(200).json({
    ok: true,
    time: Date.now(),
    status: 'healthy',
    service: 'mathcity-ai-api',
    db: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/ready', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ready',
    database: isDatabaseHealthy() ? 'connected' : 'error',
    timestamp: new Date().toISOString(),
  });
});

// Liveness probe (Kubernetes / Docker)
app.get('/health/live', (req: Request, res: Response) => {
  res.status(200).json({ status: 'alive', uptime: process.uptime() });
});

// Readiness probe
app.get('/health/ready', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ready',
    database: isDatabaseHealthy() ? 'connected' : 'error',
    timestamp: new Date().toISOString(),
  });
});

// Legacy / Backward-compatible health
app.get('/api/health', async (req: Request, res: Response) => {
  let dbStatus = 'error';
  try {
    const dbCheck = await Promise.race([
      checkDatabaseConnection(),
      new Promise<{ connected: boolean }>((resolve) => setTimeout(() => resolve({ connected: false }), 2500)),
    ]);
    dbStatus = dbCheck.connected ? 'connected' : 'error';
  } catch (_) {
    dbStatus = 'error';
  }

  res.status(200).json({
    ok: true,
    time: Date.now(),
    status: 'healthy',
    name: 'MathCity AI Backend API',
    version: '1.0.0',
    db: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// 3. Domain Routes
app.use('/api/auth', authRouter);
app.use('/api/eligibility', eligibilityRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/practice', practiceRouter);
app.use('/api/games', gamesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/city', cityRouter);
app.use('/api/coins', coinsRouter);
app.use('/api/xp', xpRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/daily-tasks', tasksRouter);
app.use('/api/missions', tasksRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/stats', analyticsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/activity', profileRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/media', mediaRouter);

// Global aliases for /me, /leaderboard, and /users/me/avatar
app.get(['/api/me', '/me', '/api/users/me'], (req, res, next) => {
  req.url = '/me';
  studentsRouter(req, res, next);
});

// Endpoint: /api/users/check-username
app.get(['/api/users/check-username', '/api/users/username-available'], (req, res, next) => {
  req.url = '/check-username';
  authRouter(req, res, next);
});

app.get(['/api/leaderboard', '/leaderboard'], (req, res, next) => {
  req.url = '/leaderboard';
  studentsRouter(req, res, next);
});

// Forward /api/users/me/avatar directly to studentsRouter patch
app.patch(['/api/users/me/avatar', '/api/students/avatar'], (req, res, next) => {
  req.url = '/avatar';
  studentsRouter(req, res, next);
});

// Privacy & Account endpoints: /api/me/export and /api/me (DELETE)
app.get(['/api/me/export', '/api/me/export-data'], (req, res, next) => {
  req.url = '/export';
  settingsRouter(req, res, next);
});

app.delete(['/api/me', '/api/users/me'], (req, res, next) => {
  req.url = '/';
  settingsRouter(req, res, next);
});

// 4. Standalone Admin Dashboard Static Portal
app.use('/admin', express.static(adminStaticPath));
app.get('/admin/*', (req: Request, res: Response) => {
  res.sendFile(path.join(adminStaticPath, 'index.html'));
});

// 5. Centralized Production Error Handler (Phase 3)
app.use(errorHandler);
