import cors from 'cors';
import { config } from '../config/env.js';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile native Capacitor, server-to-server, curl)
    if (!origin) {
      return callback(null, true);
    }

    // Match exact configured origins
    if (config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Support GitHub Pages domains (*.github.io)
    if (/^https:\/\/[a-zA-Z0-9-]+\.github\.io$/.test(origin)) {
      return callback(null, true);
    }

    // Support Capacitor local schemes
    if (origin === 'capacitor://localhost' || origin === 'https://localhost' || origin === 'http://localhost') {
      return callback(null, true);
    }

    // Support local development ports
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Reject unverified origin in production
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
