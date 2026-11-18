import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z
  .object({
    PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().optional(),
    JWT_SECRET: z.string().optional(),
    ADMIN_API_KEY: z.string().optional(),
    JWT_EXPIRES_IN: z.string().default('7d'),
    ALLOWED_ORIGINS: z
      .string()
      .default(
        'http://localhost:8080,http://localhost:8085,http://localhost:3000,http://localhost:3001,http://localhost:7357,https://mathcity-ai-admin.onrender.com,https://mathcity-ai-web.onrender.com'
      ),
    GEMINI_API_KEY: z.string().optional().default(''),
    GEMINI_MODEL: z.string().optional(),
    AI_MODEL_NAME: z.string().default('gemini-2.5-flash'),
    GOOGLE_CLIENT_ID: z.string().optional().default(''),
    APP_NAME: z.string().default('MathCity AI'),
    APP_VERSION: z.string().default('1.0.0'),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'production') {
      if (!data.DATABASE_URL || data.DATABASE_URL.includes('localhost') || data.DATABASE_URL.includes('127.0.0.1')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Production muhitida haqiqiy va masofaviy DATABASE_URL talab qilinadi (localhost bo‘lishi mumkin emas).',
          path: ['DATABASE_URL'],
        });
      }
      if (!data.JWT_SECRET || data.JWT_SECRET === 'mathcity-ai-super-secret-jwt-key-32-chars-long' || data.JWT_SECRET.length < 16) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Production muhitida xavfsiz JWT_SECRET muhit o‘zgaruvchisi kiritilishi shart (kamida 16 belgi). Standart kalitga tayanib bo‘lmaydi.',
          path: ['JWT_SECRET'],
        });
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
  geminiApiKey: env.GEMINI_API_KEY,
  geminiModel: env.GEMINI_MODEL || env.AI_MODEL_NAME || 'gemini-2.5-flash',
  aiModelName: env.GEMINI_MODEL || env.AI_MODEL_NAME || 'gemini-2.5-flash',
  googleClientId: env.GOOGLE_CLIENT_ID,
  appName: env.APP_NAME,
  appVersion: env.APP_VERSION,
  isProduction: env.NODE_ENV === 'production',
};
