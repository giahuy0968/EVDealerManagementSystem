import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';

export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
    })
  );

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      query: req.query,
      ip: req.ip,
    });
    next();
  });

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      service: 'dealer-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  });

  // API routes
  app.use('/api/v1', routes);

  // Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
