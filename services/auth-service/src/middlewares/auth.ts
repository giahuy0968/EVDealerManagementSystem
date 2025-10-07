import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwt';
import { AuthService } from '../services/AuthService';
import { logger } from '../utils/logger';
import { UserRole } from '../../../shared/types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
        dealerId?: string;
        manufacturerId?: string;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Authorization token is required',
        },
      });
      return;
    }

    const token = JWTUtils.extractTokenFromHeader(authHeader);
    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN_FORMAT',
          message: 'Invalid token format',
        },
      });
      return;
    }

    // Verify token
    const payload = JWTUtils.verifyAccessToken(token);

    // Check if user still exists and is active
    const authService = new AuthService();
    const user = await authService.findUserById(payload.userId);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: {
          code: 'USER_INACTIVE',
          message: 'User account is inactive or not found',
        },
      });
      return;
    }

    // Add user info to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      dealerId: payload.dealerId,
      manufacturerId: payload.manufacturerId,
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);

    const message = error instanceof Error ? error.message : 'Authentication failed';
    
    res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message,
      },
    });
  }
};

/**
 * Middleware to authorize user roles
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_PERMISSIONS',
            message: 'Insufficient permissions to access this resource',
          },
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('Authorization error:', error);

      res.status(403).json({
        success: false,
        error: {
          code: 'AUTHORIZATION_ERROR',
          message: 'Authorization failed',
        },
      });
    }
  };
};

/**
 * Middleware to ensure user belongs to the same dealer
 */
export const authorizeDealer = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
      });
      return;
    }

    // Admin can access any dealer's data
    if (req.user.role === UserRole.ADMIN) {
      next();
      return;
    }

    // Check if user has dealer access
    if (!req.user.dealerId) {
      res.status(403).json({
        success: false,
        error: {
          code: 'NO_DEALER_ACCESS',
          message: 'User does not belong to any dealer',
        },
      });
      return;
    }

    // Get dealer ID from request (could be in params, query, or body)
    const requestedDealerId = req.params.dealerId || req.query.dealerId || req.body.dealerId;

    if (requestedDealerId && requestedDealerId !== req.user.dealerId) {
      res.status(403).json({
        success: false,
        error: {
          code: 'DEALER_ACCESS_DENIED',
          message: 'Access denied to this dealer\'s data',
        },
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Dealer authorization error:', error);

    res.status(403).json({
      success: false,
      error: {
        code: 'AUTHORIZATION_ERROR',
        message: 'Dealer authorization failed',
      },
    });
  }
};

/**
 * Middleware to ensure user belongs to the same manufacturer
 */
export const authorizeManufacturer = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
      });
      return;
    }

    // Admin can access any manufacturer's data
    if (req.user.role === UserRole.ADMIN) {
      next();
      return;
    }

    // Check if user has manufacturer access
    if (!req.user.manufacturerId) {
      res.status(403).json({
        success: false,
        error: {
          code: 'NO_MANUFACTURER_ACCESS',
          message: 'User does not belong to any manufacturer',
        },
      });
      return;
    }

    // Get manufacturer ID from request
    const requestedManufacturerId = req.params.manufacturerId || req.query.manufacturerId || req.body.manufacturerId;

    if (requestedManufacturerId && requestedManufacturerId !== req.user.manufacturerId) {
      res.status(403).json({
        success: false,
        error: {
          code: 'MANUFACTURER_ACCESS_DENIED',
          message: 'Access denied to this manufacturer\'s data',
        },
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Manufacturer authorization error:', error);

    res.status(403).json({
      success: false,
      error: {
        code: 'AUTHORIZATION_ERROR',
        message: 'Manufacturer authorization failed',
      },
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token is provided
 */
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next();
      return;
    }

    const token = JWTUtils.extractTokenFromHeader(authHeader);
    if (!token) {
      next();
      return;
    }

    // Try to verify token
    const payload = JWTUtils.verifyAccessToken(token);

    // Check if user still exists and is active
    const authService = new AuthService();
    const user = await authService.findUserById(payload.userId);

    if (user && user.isActive) {
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        dealerId: payload.dealerId,
        manufacturerId: payload.manufacturerId,
      };
    }

    next();
  } catch (error) {
    // Silently fail and continue without user context
    logger.debug('Optional authentication failed:', error);
    next();
  }
};