import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  logger.error('API Error: [%s] %s %s', status, req.method, req.url, {
    message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
