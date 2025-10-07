import dotenv from 'dotenv';

dotenv.config();

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  logging: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string | undefined;
  db: number;
}

export interface JWTConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpiry: string;
  refreshExpiry: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    email: string;
    name: string;
  };
}

export interface SecurityConfig {
  bcryptRounds: number;
  maxLoginAttempts: number;
  lockoutTimeMinutes: number;
  passwordResetExpiryHours: number;
  rateLimitMax: number;
  rateLimitWindowMs: number;
  corsOrigins: string[];
  cookieSecret: string;
}

export interface SessionConfig {
  expiryDays: number;
  maxSessionsPerUser: number;
}

class Config {
  public readonly server = {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
  };

  public readonly database: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'evdms_auth',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.DB_SSL === 'true',
    logging: process.env.NODE_ENV === 'development',
  };

  public readonly redis: RedisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  };

  public readonly jwt: JWTConfig = {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  };

  public readonly email: EmailConfig = {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || '',
    },
    from: {
      email: process.env.FROM_EMAIL || 'noreply@evdms.com',
      name: process.env.FROM_NAME || 'EV Dealer Management System',
    },
  };

  public readonly security: SecurityConfig = {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    lockoutTimeMinutes: parseInt(process.env.LOCKOUT_TIME_MINUTES || '15', 10),
    passwordResetExpiryHours: parseInt(process.env.PASSWORD_RESET_EXPIRY_HOURS || '1', 10),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    corsOrigins: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    cookieSecret: process.env.COOKIE_SECRET || 'your-cookie-secret',
  };

  public readonly session: SessionConfig = {
    expiryDays: parseInt(process.env.SESSION_EXPIRY_DAYS || '7', 10),
    maxSessionsPerUser: parseInt(process.env.MAX_SESSIONS_PER_USER || '5', 10),
  };

  public readonly logging = {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/auth-service.log',
  };

  // Validate required environment variables
  public validateConfig(): void {
    const requiredVars = [
      'JWT_ACCESS_SECRET',
      'JWT_REFRESH_SECRET',
      'COOKIE_SECRET'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0 && this.server.nodeEnv === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Validate JWT secrets are strong enough in production
    if (this.server.nodeEnv === 'production') {
      if (this.jwt.accessSecret.length < 32) {
        throw new Error('JWT_ACCESS_SECRET must be at least 32 characters in production');
      }
      if (this.jwt.refreshSecret.length < 32) {
        throw new Error('JWT_REFRESH_SECRET must be at least 32 characters in production');
      }
    }
  }
}

export const config = new Config();

// Validate configuration on import
config.validateConfig();