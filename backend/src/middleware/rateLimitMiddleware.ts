import { Request, Response, NextFunction } from 'express';
import { redisService } from '../redis/redisService.js';
import { config } from '../config/env.js';

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-client';
  const clientKey = Array.isArray(ip) ? ip[0] : (ip as string).split(',')[0].trim();

  try {
    const { allowed, count } = await redisService.incrementRateLimit(clientKey, config.rateLimitWindowMs);
    
    res.setHeader('X-RateLimit-Limit', config.rateLimitMaxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, config.rateLimitMaxRequests - count));

    if (!allowed) {
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please retry in a few moments.',
        },
      });
      return;
    }

    next();
  } catch (err) {
    // Fail open if rate limiter errors so service stays available
    next();
  }
};
