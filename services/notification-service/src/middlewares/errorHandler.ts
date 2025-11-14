import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  logger.error('Unhandled error', { err });
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal Server Error' });
}
