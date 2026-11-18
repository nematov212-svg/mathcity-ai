import { PrismaClient } from '@prisma/client';
import { config } from '../config/env.js';

let prismaInstance: PrismaClient | null = null;
let isDbConnected = false;

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

export async function checkDatabaseConnection(): Promise<{ connected: boolean; latencyMs?: number; error?: string }> {
  const start = Date.now();
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1 as health_check`;
    isDbConnected = true;
    return { connected: true, latencyMs: Date.now() - start };
  } catch (error: any) {
    isDbConnected = false;
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
