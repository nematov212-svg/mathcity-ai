import { app } from './app.js';
import { config } from './config/env.js';
import { checkDatabaseConnection, disconnectDatabase } from './db/client.js';

const port = Number(process.env.PORT || config.port || 4000);
const host = '0.0.0.0';

const server = app.listen(port, host, async () => {
  console.log(`=================================================`);
  console.log(`🚀 MathCity AI Backend running on http://${host}:${port}`);
  console.log(`✨ Environment: ${config.nodeEnv}`);
  console.log(`📡 Production mode: ${config.isProduction ? 'YES' : 'NO'}`);
  console.log(`=================================================`);

  // Verify PostgreSQL connection
  try {
    const dbStatus = await checkDatabaseConnection();
    if (dbStatus.connected) {
      console.log(`✅ PostgreSQL Connected successfully (latency: ${dbStatus.latencyMs}ms)`);
    } else {
      console.warn(`⚠️ PostgreSQL connection notice: ${dbStatus.error}`);
      console.log(`ℹ️ Dual-mode active: In-memory/local repository available for offline testing.`);
    }
  } catch (err: any) {
    console.warn(`⚠️ PostgreSQL connection check skipped: ${err?.message}`);
  }
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
