"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
require("express-async-errors");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("./config");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const notifications_1 = __importDefault(require("./routes/notifications"));
const templates_1 = __importDefault(require("./routes/templates"));
const preferences_1 = __importDefault(require("./routes/preferences"));
const initSchema_1 = require("./db/initSchema");
const rabbitmq_1 = require("./config/rabbitmq");
const consumers_1 = require("./events/consumers");
class NotificationServiceApp {
    constructor() {
        this.app = (0, express_1.default)();
        this.setupMiddleware();
        this.setupSwagger();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMiddleware() {
        this.app.use((0, helmet_1.default)({ crossOriginEmbedderPolicy: false }));
        this.app.use((0, cors_1.default)(config_1.config.cors));
        this.app.use(rateLimiter_1.generalRateLimit);
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.set('trust proxy', 1);
        this.app.use((req, _res, next) => {
            logger_1.logger.info('Incoming request', {
                method: req.method,
                url: req.url,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
            });
            next();
        });
    }
    setupSwagger() {
        if (!config_1.config.swagger.enabled)
            return;
        const swaggerOptions = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: config_1.config.swagger.title,
                    version: config_1.config.swagger.version,
                    description: config_1.config.swagger.description,
                },
                servers: [{ url: `http://localhost:${config_1.config.server.port}`, description: 'Development server' }],
            },
            apis: ['./src/routes/*.ts', './src/models/*.ts'],
        };
        const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
        this.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
            explorer: true,
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: 'EVDMS Notification Service API',
        }));
        this.app.get('/swagger.json', (_req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        });
    }
    setupRoutes() {
        this.app.get('/health', (_req, res) => {
            res.status(200).json({ success: true, service: 'notification-service', status: 'healthy', timestamp: new Date().toISOString() });
        });
        this.app.get('/ping', (_req, res) => res.status(200).send('pong'));
        this.app.use('/api/v1/notifications', notifications_1.default);
        this.app.use('/api/v1/notifications/templates', templates_1.default);
        this.app.use('/api/v1/notifications/preferences', preferences_1.default);
        this.app.get('/', (_req, res) => res.status(200).json({ message: 'EVDMS Notification Service', documentation: config_1.config.swagger.enabled ? '/api-docs' : 'Not available' }));
    }
    setupErrorHandling() {
        this.app.use(errorHandler_1.notFoundHandler);
        this.app.use(errorHandler_1.errorHandler);
    }
    async start() {
        try {
            const dbConnected = await database_1.database.testConnection();
            if (!dbConnected)
                throw new Error('Database connection failed');
            await (0, initSchema_1.initSchema)();
            await redis_1.redisClient.connect();
            if (!(await redis_1.redisClient.isConnected()))
                throw new Error('Redis connection failed');
            await rabbitmq_1.rabbit.connect();
            await (0, consumers_1.registerConsumers)();
            this.app.listen(config_1.config.server.port, config_1.config.server.host, () => {
                logger_1.logger.info('Notification Service started', { port: config_1.config.server.port, host: config_1.config.server.host });
            });
            this.setupGracefulShutdown();
        }
        catch (error) {
            logger_1.logger.error('Failed to start Notification Service:', error);
            process.exit(1);
        }
    }
    setupGracefulShutdown() {
        const graceful = async (signal) => {
            logger_1.logger.info(`Received ${signal}, shutting down...`);
            try {
                await rabbitmq_1.rabbit.close();
                await redis_1.redisClient.disconnect();
                await database_1.database.close();
                process.exit(0);
            }
            catch (err) {
                logger_1.logger.error('Error during shutdown', err);
                process.exit(1);
            }
        };
        process.on('SIGTERM', () => graceful('SIGTERM'));
        process.on('SIGINT', () => graceful('SIGINT'));
    }
}
exports.default = NotificationServiceApp;
