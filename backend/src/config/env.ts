import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/mathcity_db?schema=public'),
  JWT_SECRET: z
    .string()
    .min(16, 'JWT_SECRET kamida 16 belgidan iborat bo‘lishi kerak.')
    .default('mathcity-ai-super-secret-jwt-key-32-chars-long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:8080,http://localhost:8085,http://localhost:3000,http://localhost:3001,http://localhost:7357,https://mathcity-ai-admin.onrender.com,https://mathcity-ai-web.onrender.com'),
  GEMINI_API_KEY: z.string().optional().default(''),
  AI_MODEL_NAME: z.string().default('gemini-1.5-flash'),
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  APP_NAME: z.string().default('MathCity AI'),
  APP_VERSION: z.string().default('1.0.0'),
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
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  allowedOrigins: env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
  geminiApiKey: env.GEMINI_API_KEY,
  aiModelName: env.AI_MODEL_NAME,
  googleClientId: env.GOOGLE_CLIENT_ID,
  appName: env.APP_NAME,
  appVersion: env.APP_VERSION,
  isProduction: env.NODE_ENV === 'production',
};
