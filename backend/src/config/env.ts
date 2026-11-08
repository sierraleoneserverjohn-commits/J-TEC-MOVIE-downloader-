import dotenv from 'dotenv';
dotenv.config();

export interface AppConfig {
  nodeEnv: string;
  port: number;
  allowedOrigins: string[];
  upstashRedisRestUrl?: string;
  upstashRedisRestToken?: string;
  redisTtlSeconds: number;
  rateLimitMaxRequests: number;
  rateLimitWindowMs: number;
}

const parseOrigins = (raw?: string): string[] => {
  if (!raw) return ['http://localhost:3000', 'capacitor://localhost', 'https://localhost'];
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
};

export const config: AppConfig = {
  nodeEnv: process.env.NODE_ENV || 'production',
  port: parseInt(process.env.PORT || '10000', 10),
  allowedOrigins: parseOrigins(process.env.FRONTEND_URL),
  upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL,
  upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN,
  redisTtlSeconds: parseInt(process.env.REDIS_CACHE_TTL_SECONDS || '3600', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '120', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
};
