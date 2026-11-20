import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z
  .object({
    PORT: z.string().default(process.env.NODE_ENV === 'production' ? '10000' : '4000').transform((val) => parseInt(val, 10)),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().optional(),
    JWT_SECRET: z.string().optional(),
    ADMIN_API_KEY: z.string().optional(),
    JWT_EXPIRES_IN: z.string().default('7d'),
    ALLOWED_ORIGINS: z
      .string()
      .default(
        'http://localhost:8085,https://mathcity-ai-admin.onrender.com,https://mathcity-ai-web.onrender.com'
      ),
    ALLOW_LOCALHOST_ORIGINS: z
      .string()
      .optional()
      .default('false')
      .transform((val) => val === 'true' || val === '1'),
    GOOGLE_CLIENT_ID: z.string().optional().default(''),
    APP_NAME: z.string().default('MathCity AI'),
    APP_VERSION: z.string().default('1.0.0'),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'production') {
      if (!data.DATABASE_URL || data.DATABASE_URL.includes('localhost') || data.DATABASE_URL.includes('127.0.0.1')) {
        console.warn(
          '⚠️ [OGOHLANTIRISH / WARNING]: Production muhitida DATABASE_URL ko‘rsatilmagan yoki localhost ko‘rsatilgan! Server in-memory rejimiga o‘tadi (PostgreSQL ulanmagan).'
        );
      }
      if (!data.JWT_SECRET || data.JWT_SECRET === 'mathcity-ai-super-secret-jwt-key-32-chars-long' || data.JWT_SECRET.length < 16) {
        console.warn(
          '⚠️ [OGOHLANTIRISH / WARNING]: Production muhitida xavfsiz JWT_SECRET o‘rnatilmagan. Standart kalit xavfsizlik uchun tavsiya etilmaydi.'
        );
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Noto‘g‘ri muhit o‘zgaruvchilari (Environment Variables):', parsed.error.format());
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Ishlab chiqarish muhitida konfiguratsiya xatosi.');
  }
}

const env = parsed.success ? parsed.data : envSchema.parse({});

export const config = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  databaseUrl:
    env.DATABASE_URL ||
    (env.NODE_ENV === 'production'
      ? ''
      : 'postgresql://postgres:postgres@localhost:5432/mathcity_db?schema=public'),
  jwtSecret:
    env.JWT_SECRET ||
    (env.NODE_ENV === 'production'
      ? ''
      : 'mathcity-ai-super-secret-jwt-key-32-chars-long'),
  adminApiKey:
    env.ADMIN_API_KEY ||
    (env.NODE_ENV === 'production'
      ? 'mathcity_admin_master_secret_2026'
      : 'mathcity_admin_master_secret_2026'),
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  allowedOrigins: env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
  allowLocalhostOrigins: env.ALLOW_LOCALHOST_ORIGINS,
  googleClientId: env.GOOGLE_CLIENT_ID,
  appName: env.APP_NAME,
  appVersion: env.APP_VERSION,
  isProduction: env.NODE_ENV === 'production',
};
