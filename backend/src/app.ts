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
import { subscriptionsRouter } from './modules/subscriptions/subscriptions.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { paymentsRouter } from './modules/payments/click.routes.js';
import { mediaRouter } from './modules/media/media.routes.js';
import { isDatabaseHealthy } from './db/client.js';

const adminStaticPath = path.resolve(process.cwd(), 'public/admin');

export const app = express();

// 1. Core Security & Transport Middleware
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(requestTimeoutMiddleware(25000));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalRateLimiter);

// 2. Health & Orchestration Probes (Render & Cloud compatible)
// Standard Render root health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'mathcity-ai-api',
    db: isDatabaseHealthy() ? 'postgres' : 'in-memory',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/ready', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ready',
    database: isDatabaseHealthy() ? 'connected' : 'standby',
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
    database: isDatabaseHealthy() ? 'connected' : 'standby',
    timestamp: new Date().toISOString(),
  });
});

// Legacy / Backward-compatible health
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    name: 'MathCity AI Backend API',
    version: '1.0.0',
    db: isDatabaseHealthy() ? 'postgres' : 'in-memory',
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
app.use('/api/achievements', achievementsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/media', mediaRouter);

// 4. Standalone Admin Dashboard Static Portal
app.use('/admin', express.static(adminStaticPath));
app.get('/admin/*', (req: Request, res: Response) => {
  res.sendFile(path.join(adminStaticPath, 'index.html'));
});

// 5. Centralized Production Error Handler (Phase 3)
app.use(errorHandler);
