import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { redisClient } from '../config/redis';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * General rate limiter for all requests
 */
export const generalRateLimit = rateLimit({
  windowMs: config.rateLimiting.windowMs, // 15 minutes
  max: config.rateLimiting.maxRequests, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later',
    },
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/ping';
  },
  onLimitReached: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
    });
  },
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts from this IP, please try again in 15 minutes',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  onLimitReached: (req: Request, res: Response) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
    });
  },
});

/**
 * Very strict rate limiter for password reset requests
 */
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    error: {
      code: 'PASSWORD_RESET_RATE_LIMIT_EXCEEDED',
      message: 'Too many password reset attempts from this IP, please try again in 1 hour',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  onLimitReached: (req: Request, res: Response) => {
    logger.warn('Password reset rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      email: req.body?.email,
    });
  },
});

/**
 * Custom rate limiter using Redis for more complex scenarios
 */
export class CustomRateLimiter {
  /**
   * Rate limit by user ID
   */
  static async limitByUser(
    userId: string,
    action: string,
    maxAttempts: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      const key = `rate_limit:user:${userId}:${action}`;
      const current = await redisClient.get(key);
      
      if (!current) {
        // First request
        await redisClient.set(key, '1', windowSeconds);
        return {
          allowed: true,
          remaining: maxAttempts - 1,
          resetTime: Date.now() + (windowSeconds * 1000),
        };
      }

      const count = parseInt(current, 10);
      
      if (count >= maxAttempts) {
        const ttl = await redisClient.getClient().ttl(`evdms:auth:${key}`);
        return {
          allowed: false,
          remaining: 0,
          resetTime: Date.now() + (ttl * 1000),
        };
      }

      // Increment counter
      const newCount = await redisClient.incr(key);
      
      return {
        allowed: true,
        remaining: maxAttempts - newCount,
        resetTime: Date.now() + (windowSeconds * 1000),
      };
    } catch (error) {
      logger.error('Error in custom rate limiter:', error);
      // Allow request if Redis is down
      return {
        allowed: true,
        remaining: maxAttempts - 1,
        resetTime: Date.now() + (windowSeconds * 1000),
      };
    }
  }

  /**
   * Rate limit by email for sensitive operations
   */
  static async limitByEmail(
    email: string,
    action: string,
    maxAttempts: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const emailKey = Buffer.from(email.toLowerCase()).toString('base64');
    return this.limitByUser(emailKey, action, maxAttempts, windowSeconds);
  }

  /**
   * Check and increment failed login attempts
   */
  static async handleFailedLogin(
    identifier: string, // Could be email or IP
    maxAttempts: number = 5,
    lockoutMinutes: number = 15
  ): Promise<{ locked: boolean; attempts: number; lockoutUntil?: number }> {
    try {
      const key = `failed_login:${identifier}`;
      const lockKey = `lockout:${identifier}`;
      
      // Check if already locked out
      const lockout = await redisClient.get(lockKey);
      if (lockout) {
        return {
          locked: true,
          attempts: maxAttempts,
          lockoutUntil: parseInt(lockout, 10),
        };
      }

      // Increment failed attempts
      const attempts = await redisClient.incr(key);
      
      if (attempts === 1) {
        // Set expiry for first attempt
        await redisClient.expire(key, lockoutMinutes * 60);
      }

      if (attempts >= maxAttempts) {
        // Lock account
        const lockoutUntil = Date.now() + (lockoutMinutes * 60 * 1000);
        await redisClient.set(lockKey, lockoutUntil.toString(), lockoutMinutes * 60);
        await redisClient.delete(key); // Clear attempts counter
        
        logger.warn('Account locked due to failed login attempts', {
          identifier,
          attempts,
          lockoutMinutes,
        });

        return {
          locked: true,
          attempts,
          lockoutUntil,
        };
      }

      return {
        locked: false,
        attempts,
      };
    } catch (error) {
      logger.error('Error handling failed login:', error);
      return {
        locked: false,
        attempts: 0,
      };
    }
  }

  /**
   * Clear failed login attempts on successful login
   */
  static async clearFailedAttempts(identifier: string): Promise<void> {
    try {
      const key = `failed_login:${identifier}`;
      const lockKey = `lockout:${identifier}`;
      
      await redisClient.delete(key);
      await redisClient.delete(lockKey);
    } catch (error) {
      logger.error('Error clearing failed attempts:', error);
    }
  }
}