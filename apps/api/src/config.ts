import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  WEB_ORIGIN: z.string().url().default('http://127.0.0.1:5173'),
  DATABASE_URL: z.string().default('postgres://stnk:stnk_dev_pass@127.0.0.1:5432/stnk_jasa'),
  JWT_SECRET: z.string().default('dev-jwt-secret-change-in-production'),
  JWT_REFRESH_SECRET: z.string().default('dev-refresh-secret-change-in-production'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(4).max(14).default(10),
  BASE_URL: z.string().default('http://127.0.0.1:4000'),
})

export type AppConfig = z.infer<typeof envSchema>

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  return envSchema.parse(environment)
}
