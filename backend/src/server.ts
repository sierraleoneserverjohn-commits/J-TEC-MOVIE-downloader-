import { app } from './app.js';
import { config } from './config/env.js';

const server = app.listen(config.port, () => {
  console.log(`[JTEC MOVIES API] Server listening on port ${config.port} in ${config.nodeEnv} mode`);
});

// Graceful shutdown
const shutdown = () => {
  console.log('[JTEC MOVIES API] Shutting down gracefully...');
  server.close(() => {
    console.log('[JTEC MOVIES API] HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
