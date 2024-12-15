// src/lib/env.ts
function requireEnv(key: string): string {
    const value = process.env[key]
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
    return value
  }
  
  function optionalEnv(key: string, defaultValue: string = ''): string {
    return process.env[key] || defaultValue
  }
  
  export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: requireEnv('DATABASE_URL'),
    HELIUS_API_KEY: requireEnv('NEXT_PUBLIC_HELIUS_API_KEY'),
    
    // Optional Redis configuration
    REDIS_ENABLED: process.env.REDIS_ENABLED === 'true',
    UPSTASH_REDIS_URL: optionalEnv('UPSTASH_REDIS_URL'),
    UPSTASH_REDIS_TOKEN: optionalEnv('UPSTASH_REDIS_TOKEN'),
  } as const