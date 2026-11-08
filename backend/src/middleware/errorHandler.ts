import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error('[API Error]', {
    path: req.path,
    method: req.method,
    message: err.message,
    status: statusCode,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: isProd && statusCode === 500 ? 'An unexpected server error occurred.' : err.message,
    },
  });
};
