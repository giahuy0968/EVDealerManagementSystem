"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    server: {
        port: parseInt(process.env.PORT || '3006', 10),
        host: process.env.HOST || '0.0.0.0',
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    database: {
        host: process.env.DB_HOST || 'postgres',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'evdms',
        username: process.env.DB_USER || 'evdms_user',
        password: process.env.DB_PASSWORD || 'evdms_password',
        ssl: process.env.DB_SSL === 'true',
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        keyPrefix: process.env.REDIS_KEY_PREFIX || 'evdms:notification:',
        ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
        exchange: process.env.RABBITMQ_EXCHANGE || 'evdms.events',
    },
    email: {
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
        smtpUser: process.env.SMTP_USER || '',
        smtpPass: process.env.SMTP_PASS || '',
        from: process.env.EMAIL_FROM || process.env.SMTP_USER || 'noreply@evdms.local',
        unsubscribeBaseUrl: process.env.UNSUBSCRIBE_BASE_URL || 'http://localhost:3000/api/v1/notifications/unsubscribe',
    },
    sms: {
        provider: process.env.SMS_PROVIDER || 'twilio',
        twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
        twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
        twilioFrom: process.env.TWILIO_FROM || '',
        rateLimitPerHour: parseInt(process.env.SMS_RATE_LIMIT_PER_HOUR || '100', 10),
    },
    push: {
        fcmKey: process.env.FCM_SERVER_KEY || '',
    },
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        credentials: true,
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || 'logs/notification-service.log',
    },
    swagger: {
        enabled: process.env.SWAGGER_ENABLED !== 'false',
        title: 'EVDMS Notification Service API',
        version: '1.0.0',
        description: 'Email, SMS, Push notifications with templates and preferences',
    },
};
