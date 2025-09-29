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

// Import routes
import authRoutes from './routes/auth';

class AuthServiceApp {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupSwagger();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    this.app.use(cors(config.cors));

    // Rate limiting
    this.app.use(generalRateLimit);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Trust proxy for accurate IP addresses
    this.app.set('trust proxy', 1);

    // Request logging middleware
    this.app.use((req, res, next) => {
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
        servers: [
          {
            url: `http://localhost:${config.server.port}`,
            description: 'Development server',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      apis: ['./src/routes/*.ts', './src/models/*.ts'],
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'EVDMS Auth Service API',
    }));

    // Serve swagger spec as JSON
    this.app.get('/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        service: 'auth-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      });
    });

    // Ping endpoint for basic connectivity check
    this.app.get('/ping', (req, res) => {
      res.status(200).send('pong');
    });

    // API routes
    this.app.use('/api/v1/auth', authRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.status(200).json({
        message: 'EVDMS Authentication Service',
        version: '1.0.0',
        documentation: config.swagger.enabled ? '/api-docs' : 'Not available',
      });
    });
  }

  private setupErrorHandling(): void {
    // 404 handler - must be after all routes
    this.app.use(notFoundHandler);

    // Global error handler - must be last
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Test database connection
      const dbConnected = await database.testConnection();
      if (!dbConnected) {
        throw new Error('Database connection failed');
      }

      // Connect to Redis
      await redisClient.connect();
      const redisConnected = await redisClient.isConnected();
      if (!redisConnected) {
        throw new Error('Redis connection failed');
      }

      // Start the server
      this.app.listen(config.server.port, config.server.host, () => {
        logger.info(`Auth Service started successfully`, {
          port: config.server.port,
          host: config.server.host,
          environment: config.server.nodeEnv,
          swagger: config.swagger.enabled ? `http://${config.server.host}:${config.server.port}/api-docs` : 'disabled',
        });
      });

      // Graceful shutdown handlers
      this.setupGracefulShutdown();
    } catch (error) {
      logger.error('Failed to start Auth Service:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);

      try {
        // Close database connections
        await database.close();
        logger.info('Database connections closed');

        // Close Redis connection
        await redisClient.disconnect();
        logger.info('Redis connection closed');

        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection:', { reason, promise });
      gracefulShutdown('unhandledRejection');
    });
  }
}

export default AuthServiceApp;