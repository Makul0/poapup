// src/lib/env.ts
function requireEnv(key: string): string {
    const value = process.env[key]
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
    return value
  }
  
  export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: requireEnv('DATABASE_URL'),
    UPSTASH_REDIS_URL: requireEnv('UPSTASH_REDIS_URL'),
    UPSTASH_REDIS_TOKEN: requireEnv('UPSTASH_REDIS_TOKEN'),
    HELIUS_API_KEY: requireEnv('NEXT_PUBLIC_HELIUS_API_KEY'),
  } as const