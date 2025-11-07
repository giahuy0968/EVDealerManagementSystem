import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'evdms',
    user: process.env.DB_USER || 'evdms_user',
    password: process.env.DB_PASSWORD || 'evdms_password',
    logging: process.env.DB_LOGGING === 'true',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  },
  
  services: {
    authService: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    customerService: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3003',
    manufacturerService: process.env.MANUFACTURER_SERVICE_URL || 'http://localhost:3004',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'evdms-jwt-secret-key-2024',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
