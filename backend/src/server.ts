import { app } from './app.js';
import { config } from './config/env.js';
import { checkDatabaseConnection, disconnectDatabase, onDatabaseConnected } from './db/client.js';
import { repository } from './utils/repository.js';
import { backupPostgresDatabase } from './db/backupPostgres.js';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

const port = Number(process.env.PORT || config.port || (config.isProduction ? 10000 : 4000));
const host = '0.0.0.0';

const server = app.listen(port, host, async () => {
  console.log(`=================================================`);
  console.log(`🚀 MathCity AI Backend running on http://${host}:${port}`);
  console.log(`✨ Environment: ${config.nodeEnv}`);
  console.log(`📡 Production mode: ${config.isProduction ? 'YES' : 'NO'}`);
  console.log(`=================================================`);

  // Asynchronously run migrations and verify PostgreSQL without blocking HTTP server
  if (process.env.DATABASE_URL) {
    try {
      console.log('⏳ Running Prisma migrations in background...');
      await execAsync('npx prisma migrate deploy', { timeout: 25000 });
      console.log('✅ Prisma migrations applied successfully.');
    } catch (err: any) {
      console.warn('⚠️ `prisma migrate deploy` notice:', err.message);
      if (err.message?.includes('P3005') || err.message?.includes('20261119000000_init')) {
        try {
          console.log('🔄 Resolving baseline migration 20261119000000_init...');
          await execAsync('npx prisma migrate resolve --applied 20261119000000_init', { timeout: 15000 });
          await execAsync('npx prisma migrate deploy', { timeout: 25000 });
          console.log('✅ Baseline resolved and migrations deployed.');
        } catch (resolveErr: any) {
          console.warn('⚠️ Baseline resolution notice:', resolveErr.message);
        }
      }
    }
  }

  // Automatically load repository data whenever DB connects/reconnects
  onDatabaseConnected(async () => {
    try {
      await repository.initFromDatabase();
    } catch (e: any) {
      console.error('Error syncing repository from database:', e?.message);
    }
  });

  // Verify PostgreSQL connection
  try {
    const dbStatus = await checkDatabaseConnection();
    if (dbStatus.connected) {
      console.log(`✅ PostgreSQL Connected successfully (latency: ${dbStatus.latencyMs}ms)`);
      await repository.initFromDatabase();
    } else {
      console.error(`❌ [DATABASE ERROR] PostgreSQL connection check failed: ${dbStatus.error}`);
      if (config.isProduction) {
        console.error('🚨 [CRITICAL ALERT] Production environment requires an active PostgreSQL database! Users and states will not persist if PostgreSQL is unreachable.');
      } else {
        console.log(`ℹ️ Development dual-mode active: In-memory/local repository available for offline testing.`);
      }
    }
  } catch (err: any) {
    console.error(`❌ PostgreSQL connection check error: ${err?.message}`);
  }

  // Background subscription scheduler: automatically transitions expired Pro to FREE
  setInterval(() => {
    try {
      const allUsers = repository.getAllUsers();
      const now = new Date();
      for (const u of allUsers) {
        if (u.subscription.status === 'PRO_ACTIVE' && u.subscription.proExpiresAt) {
          if (new Date(u.subscription.proExpiresAt) < now) {
            u.subscription.status = 'PRO_EXPIRED';
            repository.updateUser(u.id, u);
            console.log(`⏱️ Foydalanuvchi ${u.id} Pro obunasi muddati tugadi, avtomatik bepul tarifga o‘tkazildi.`);
          }
        }
      }
    } catch (err: any) {
      console.error('Subscription scheduler error:', err?.message);
    }
  }, 60 * 1000); // 1 daqiqalik davriy tekshiruv

  // Daily automated PostgreSQL backup (every 24 hours)
  setInterval(async () => {
    try {
      if (process.env.DATABASE_URL) {
        await backupPostgresDatabase();
      }
    } catch (bErr: any) {
      console.warn('⚠️ Automated backup notice:', bErr.message);
    }
  }, 24 * 60 * 60 * 1000);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    await disconnectDatabase();
    process.exit(0);
  });

  // Force shutdown after 10 seconds if hanging
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Global error handlers: prevent unexpected server crashes and log full stack traces
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('💥 [Server Crash Guard] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err: Error) => {
  console.error('💥 [Server Crash Guard] Uncaught Exception thrown:', err.message, err.stack);
});
