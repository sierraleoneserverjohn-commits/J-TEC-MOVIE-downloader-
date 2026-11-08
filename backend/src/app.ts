import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import { rateLimitMiddleware } from './middleware/rateLimitMiddleware.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRoutes } from './routes/healthRoutes.js';
import { movieRoutes } from './routes/movieRoutes.js';
import { providerRoutes } from './routes/providerRoutes.js';

export const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Cross-Origin Resource Sharing
app.use(corsMiddleware);

// Request parsing
app.use(express.json());

// Apply rate limiter to /api
app.use('/api', rateLimitMiddleware);

// Register routes
app.use('/api', healthRoutes);
app.use('/api', movieRoutes);
app.use('/api', providerRoutes);

// Root greeting & status
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'JTEC MOVIES Production API',
    status: 'ONLINE',
    docs: '/api/health',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.path} does not exist.`,
    },
  });
});

// Central Error Handler
app.use(errorHandler);
