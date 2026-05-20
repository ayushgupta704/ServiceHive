import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRE: z.string().default('15m'),
  JWT_REFRESH_EXPIRE: z.string().default('7d'),
  JWT_COOKIE_EXPIRE: z.string().default('7').transform(Number),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error('❌ Invalid environment variables:', envServer.error.format());
  process.exit(1);
}

export const env = envServer.data;
