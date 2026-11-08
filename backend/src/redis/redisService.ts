import { Redis } from '@upstash/redis';
import { config } from '../config/env.js';

interface InMemoryCacheEntry {
  value: string;
  expiresAt: number;
}

export class RedisService {
  private client: Redis | null = null;
  private isConfigured: boolean = false;
  private memoryCache: Map<string, InMemoryCacheEntry> = new Map();

  constructor() {
    if (config.upstashRedisRestUrl && config.upstashRedisRestToken) {
      try {
        this.client = new Redis({
          url: config.upstashRedisRestUrl,
          token: config.upstashRedisRestToken,
        });
        this.isConfigured = true;
      } catch (err) {
        console.warn('[RedisService] Failed to initialize Upstash Redis client. Falling back to memory cache.', err);
        this.client = null;
        this.isConfigured = false;
      }
    } else {
      // In development or when credentials are not yet entered by user
      this.isConfigured = false;
    }
  }

  public getStatus(): { isConfigured: boolean; mode: 'upstash' | 'in-memory-fallback' } {
    return {
      isConfigured: this.isConfigured,
      mode: this.isConfigured ? 'upstash' : 'in-memory-fallback',
    };
  }

  public async get<T>(key: string): Promise<T | null> {
    if (this.client) {
      try {
        const data = await this.client.get<T>(key);
        return data;
      } catch (err) {
        console.warn(`[RedisService] Upstash GET error for key: ${key}. Falling back to memory cache.`, err);
      }
    }

    // In-memory fallback
    const entry = this.memoryCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    try {
      return JSON.parse(entry.value) as T;
    } catch {
      return null;
    }
  }

  public async set(key: string, value: any, ttlSeconds: number = config.redisTtlSeconds): Promise<boolean> {
    const stringified = JSON.stringify(value);

    // Save in memory cache as fast backup
    this.memoryCache.set(key, {
      value: stringified,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });

    if (this.client) {
      try {
        await this.client.set(key, value, { ex: ttlSeconds });
        return true;
      } catch (err) {
        console.warn(`[RedisService] Upstash SET error for key: ${key}. Cached in memory instead.`, err);
        return false;
      }
    }

    return true;
  }

  public async incrementRateLimit(key: string, windowMs: number): Promise<{ count: number; allowed: boolean }> {
    const now = Date.now();
    const rateLimitKey = `rate:${key}:${Math.floor(now / windowMs)}`;

    if (this.client) {
      try {
        const count = await this.client.incr(rateLimitKey);
        if (count === 1) {
          // Set expiry slightly larger than window
          await this.client.expire(rateLimitKey, Math.ceil(windowMs / 1000) + 5);
        }
        return {
          count,
          allowed: count <= config.rateLimitMaxRequests,
        };
      } catch (err) {
        // Fallback to local memory limiter on error
      }
    }

    const entry = this.memoryCache.get(rateLimitKey);
    let count = 1;
    if (entry && Date.now() <= entry.expiresAt) {
      count = parseInt(entry.value, 10) + 1;
    }
    this.memoryCache.set(rateLimitKey, {
      value: count.toString(),
      expiresAt: now + windowMs,
    });

    return {
      count,
      allowed: count <= config.rateLimitMaxRequests,
    };
  }
}

export const redisService = new RedisService();
