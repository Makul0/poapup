// src/lib/cache.ts
type CacheData = {
  value: any
  expiresAt: number | null
}

export class Cache {
  private static cache: Map<string, CacheData> = new Map()
  private prefix: string

  constructor(prefix = 'cache:') {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.getKey(key)
    const data = Cache.cache.get(fullKey)

    if (!data) return null

    // Check if data has expired
    if (data.expiresAt && data.expiresAt < Date.now()) {
      Cache.cache.delete(fullKey)
      return null
    }

    return data.value as T
  }

  async set(key: string, value: any, expirationInSeconds?: number): Promise<void> {
    const fullKey = this.getKey(key)
    Cache.cache.set(fullKey, {
      value,
      expiresAt: expirationInSeconds ? Date.now() + (expirationInSeconds * 1000) : null
    })
  }

  async delete(key: string): Promise<void> {
    const fullKey = this.getKey(key)
    Cache.cache.delete(fullKey)
  }

  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    expirationInSeconds?: number
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached) return cached

    const fresh = await fn()
    await this.set(key, fresh, expirationInSeconds)
    return fresh
  }
}