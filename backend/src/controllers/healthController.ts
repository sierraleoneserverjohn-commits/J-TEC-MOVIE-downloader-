import { Request, Response } from 'express';
import { redisService } from '../redis/redisService.js';

export const getHealth = async (req: Request, res: Response) => {
  const redisStatus = redisService.getStatus();

  res.status(200).json({
    status: 'ok',
    service: 'jtec-movies-backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    cache: {
      provider: 'Upstash Redis REST',
      status: redisStatus.mode,
      connected: redisStatus.isConfigured,
    },
    capabilities: [
      'PUBLIC_ARCHIVE_DISCOVERY',
      'DIRECT_DOWNLOAD_METADATA',
      'UPSTASH_REDIS_CACHE',
      'RATE_LIMITING',
    ],
  });
};
