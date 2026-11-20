const { execSync } = require('child_process');
const path = require('path');

console.log('=================================================');
console.log('🚀 [Render Startup] MathCity AI Backend Bootstrapping');
console.log('=================================================');

if (process.env.DATABASE_URL) {
  console.log('📦 [Render Startup] DATABASE_URL is set. Checking Prisma migrations...');
  try {
    console.log('⏳ Running `npx prisma migrate deploy`...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations applied successfully.');
  } catch (err) {
    console.warn('⚠️ `prisma migrate deploy` failed or returned error:', err.message);
    console.log('🔄 Checking if baseline resolution is needed for 20261119000000_init (P3005)...');
    try {
      execSync('npx prisma migrate resolve --applied 20261119000000_init', { stdio: 'inherit' });
      console.log('✅ Baseline 20261119000000_init marked as applied. Retrying deploy...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migrations deployed successfully.');
    } catch (resolveErr) {
      console.warn('⚠️ Migration resolve / deploy retry notice:', resolveErr.message);
      console.log('ℹ️ Proceeding with server startup (dual-mode / existing schema supported).');
    }
  }
} else {
  console.log('ℹ️ [Render Startup] No DATABASE_URL provided. Running in memory / offline mode.');
}

console.log('✨ [Render Startup] Starting server process...');
require(path.join(__dirname, '..', 'dist', 'server.js'));
