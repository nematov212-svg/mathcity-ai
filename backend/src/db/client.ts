import { PrismaClient } from '@prisma/client';
import { config } from '../config/env.js';

let prismaInstance: PrismaClient | null = null;
let isDbConnected = false;
let reconnectTimer: NodeJS.Timeout | null = null;
let onConnectedCallbacks: Array<() => Promise<void> | void> = [];

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: config.isProduction ? ['error', 'warn'] : ['warn', 'error'],
      datasources: {
        db: {
          url: config.databaseUrl,
        },
      },
    });
  }
  return prismaInstance;
}

export const prisma = getPrismaClient();

export function onDatabaseConnected(callback: () => Promise<void> | void): void {
  onConnectedCallbacks.push(callback);
  if (isDbConnected) {
    callback();
  }
}

export async function checkDatabaseConnection(): Promise<{ connected: boolean; latencyMs?: number; error?: string }> {
  const start = Date.now();
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1 as health_check`;
    const wasConnected = isDbConnected;
    isDbConnected = true;

    if (!wasConnected) {
      console.log('✅ [Database Client] PostgreSQL bilan barqaror ulanish o‘rnatildi.');
      for (const cb of onConnectedCallbacks) {
        try {
          await cb();
        } catch (e: any) {
          console.error('Error in onDatabaseConnected callback:', e?.message);
        }
      }
    }

    if (reconnectTimer) {
      clearInterval(reconnectTimer);
      reconnectTimer = null;
    }

    return { connected: true, latencyMs: Date.now() - start };
  } catch (error: any) {
    isDbConnected = false;
    // Set up continuous reconnect if in production or DATABASE_URL is defined
    if (config.databaseUrl && !reconnectTimer) {
      reconnectTimer = setInterval(async () => {
        try {
          const client = getPrismaClient();
          await client.$queryRaw`SELECT 1 as health_check`;
          console.log('🔄 [Database Client] PostgreSQL qayta ulandi!');
          isDbConnected = true;
          if (reconnectTimer) {
            clearInterval(reconnectTimer);
            reconnectTimer = null;
          }
          for (const cb of onConnectedCallbacks) {
            try {
              await cb();
            } catch (cbErr: any) {
              console.error('Callback error on reconnect:', cbErr?.message);
            }
          }
        } catch (_) {}
      }, 5000);
    }

    return {
      connected: false,
      error: error?.message || 'Database connection error',
    };
  }
}

export function isDatabaseHealthy(): boolean {
  return isDbConnected;
}

export async function disconnectDatabase(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    isDbConnected = false;
    console.log('🔌 PostgreSQL database connection closed cleanly.');
  }
}
