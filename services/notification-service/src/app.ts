import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { config } from './config';
import { database } from './config/database';
import { redisClient } from './config/redis';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { generalRateLimit } from './middlewares/rateLimiter';
import notificationRoutes from './routes/notifications';
import templateRoutes from './routes/templates';
import preferenceRoutes from './routes/preferences';
import { initSchema } from './db/initSchema';
import { rabbit } from './config/rabbitmq';
import { registerConsumers } from './events/consumers';

class NotificationServiceApp {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupSwagger();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(helmet({ crossOriginEmbedderPolicy: false }));
    this.app.use(cors(config.cors));
    this.app.use(generalRateLimit);
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.set('trust proxy', 1);
    this.app.use((req, _res, next) => {
      logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      next();
    });
  }

  private setupSwagger(): void {
    if (!config.swagger.enabled) return;
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: config.swagger.title,
          version: config.swagger.version,
          description: config.swagger.description,
        },
        servers: [ { url: `http://localhost:${config.server.port}`, description: 'Development server' } ],
      },
      apis: ['./src/routes/*.ts', './src/models/*.ts'],
    };
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'EVDMS Notification Service API',
    }));
    this.app.get('/swagger.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }

  private setupRoutes(): void {
    this.app.get('/health', (_req, res) => {
      res.status(200).json({ success: true, service: 'notification-service', status: 'healthy', timestamp: new Date().toISOString() });
    });
    this.app.get('/ping', (_req, res) => res.status(200).send('pong'));
    this.app.use('/api/v1/notifications', notificationRoutes);
    this.app.use('/api/v1/notifications/templates', templateRoutes);
    this.app.use('/api/v1/notifications/preferences', preferenceRoutes);
    this.app.get('/', (_req, res) => res.status(200).json({ message: 'EVDMS Notification Service', documentation: config.swagger.enabled ? '/api-docs' : 'Not available' }));
  }

  private setupErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      const dbConnected = await database.testConnection();
      if (!dbConnected) throw new Error('Database connection failed');
      await initSchema();

      await redisClient.connect();
      if (!(await redisClient.isConnected())) throw new Error('Redis connection failed');

      await rabbit.connect();
      await registerConsumers();

      this.app.listen(config.server.port, config.server.host, () => {
        logger.info('Notification Service started', { port: config.server.port, host: config.server.host });
      });

      this.setupGracefulShutdown();
    } catch (error) {
      logger.error('Failed to start Notification Service:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const graceful = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down...`);
      try {
        await rabbit.close();
        await redisClient.disconnect();
        await database.close();
        process.exit(0);
      } catch (err) {
        logger.error('Error during shutdown', err);
        process.exit(1);
      }
    };
    process.on('SIGTERM', () => graceful('SIGTERM'));
    process.on('SIGINT', () => graceful('SIGINT'));
  }
}

export default NotificationServiceApp;
