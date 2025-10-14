import { Request, Response, NextFunction } from 'express';
import { JWTService } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/services/JWTService';
import { AuthService } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/services/AuthService';
import { redisService } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/services/RedisService';
import { UserRole, ApiResponse, AuthError } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/types';

/**
 * Authentication middleware
 * Verifies JWT token and sets user in request
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.get('Authorization');
    const token = JWTService.extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token is required',
        error: {
          code: 'TOKEN_MISSING',
        },
        timestamp: new Date().toISOString()
      } as ApiResponse);
      return;
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      res.status(401).json({
        success: false,
        message: 'Token has been revoked',
        error: {
          code: 'TOKEN_REVOKED',
        },
        timestamp: new Date().toISOString()
      } as ApiResponse);
      return;
    }

    // Verify token and get user
    const user = await AuthService.verifyToken(token);
    const payload = JWTService.verifyAccessToken(token);

    // Set user and session info in request
    req.user = user;
    req.sessionId = payload.sessionId;

    next();
  } catch (error) {
    if (error instanceof AuthError || error instanceof Error) {
      res.status(401).json({
        success: false,
        message: error.message,
        error: {
          code: error instanceof AuthError ? error.code : 'AUTHENTICATION_FAILED',
        },
        timestamp: new Date().toISOString()
      } as ApiResponse);
      return;
    }

    next(error);
  }
};

/**
 * Optional authentication middleware
 * Sets user if token is provided and valid, but doesn't fail if no token
 */
export const optionalAuthenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.get('Authorization');
    const token = JWTService.extractTokenFromHeader(authHeader);

    if (token) {
      // Check if token is blacklisted
      const isBlacklisted = await redisService.isTokenBlacklisted(token);
      if (!isBlacklisted) {
        try {
          const user = await AuthService.verifyToken(token);
          const payload = JWTService.verifyAccessToken(token);

          req.user = user;
          req.sessionId = payload.sessionId;
        } catch {
          // Ignore errors for optional authentication
        }
      }
    }

    next();
  } catch (error) {
    // Ignore errors for optional authentication
    next();
  }
};

/**
 * Role-based authorization middleware factory
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: {
          code: 'AUTHENTICATION_REQUIRED',
        },
        timestamp: new Date().toISOString()
      } as ApiResponse);
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          details: {
            required: allowedRoles,
            current: user.role,
          },
        },
        timestamp: new Date().toISOString()
      } as ApiResponse);
      return;
    }

    next();
  };
};

/**
 * Admin only authorization
 */
export const adminOnly = authorize([UserRole.ADMIN]);

/**
 * Manager and above authorization
 */
export const managerAndAbove = authorize([UserRole.ADMIN, UserRole.DEALER_MANAGER]);

/**
 * EVM Staff authorization
 */
export const evmStaffOnly = authorize([UserRole.ADMIN, UserRole.EVM_STAFF]);

/**
 * Dealer staff and above authorization
 */
export const dealerStaffAndAbove = authorize([
  UserRole.ADMIN,
  UserRole.DEALER_MANAGER,
  UserRole.DEALER_STAFF
]);

/**
 * Self or admin authorization
 * Allows users to access their own resources or admins to access any
 */
export const selfOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user;
  const targetUserId = req.params.id || req.params.userId;

  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: {
        code: 'AUTHENTICATION_REQUIRED',
      },
      timestamp: new Date().toISOString()
    } as ApiResponse);
    return;
  }

  // Admin can access anything
  if (user.role === UserRole.ADMIN) {
    next();
    return;
  }

  // User can only access their own resources
  if (user.id === targetUserId) {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    message: 'Access denied',
    error: {
      code: 'ACCESS_DENIED',
    },
    timestamp: new Date().toISOString()
  } as ApiResponse);
};

/**
 * Dealer context authorization
 * Ensures users can only access resources within their dealer context
 */
export const dealerContext = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user;
  const targetDealerId = req.params.dealerId || req.body.dealerId || req.query.dealerId;

  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: {
        code: 'AUTHENTICATION_REQUIRED',
      },
      timestamp: new Date().toISOString()
    } as ApiResponse);
    return;
  }

  // Admin and EVM staff can access any dealer
  if (user.role === UserRole.ADMIN || user.role === UserRole.EVM_STAFF) {
    next();
    return;
  }

  // Dealer users can only access their own dealer
  if (user.dealerId && user.dealerId === targetDealerId) {
    next();
    return;
  }

  // If no specific dealer is targeted, allow if user belongs to a dealer
  if (!targetDealerId && user.dealerId) {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    message: 'Access denied: Invalid dealer context',
    error: {
      code: 'INVALID_DEALER_CONTEXT',
    },
    timestamp: new Date().toISOString()
  } as ApiResponse);
};

/**
 * Manufacturer context authorization
 * Ensures EVM staff can only access resources within their manufacturer context
 */
export const manufacturerContext = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user;
  const targetManufacturerId = req.params.manufacturerId || req.body.manufacturerId || req.query.manufacturerId;

  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: {
        code: 'AUTHENTICATION_REQUIRED',
      },
      timestamp: new Date().toISOString()
    } as ApiResponse);
    return;
  }

  // Admin can access any manufacturer
  if (user.role === UserRole.ADMIN) {
    next();
    return;
  }

  // EVM staff can only access their own manufacturer
  if (user.role === UserRole.EVM_STAFF && user.manufacturerId === targetManufacturerId) {
    next();
    return;
  }

  // If no specific manufacturer is targeted, allow if user belongs to a manufacturer
  if (!targetManufacturerId && user.manufacturerId) {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    message: 'Access denied: Invalid manufacturer context',
    error: {
      code: 'INVALID_MANUFACTURER_CONTEXT',
    },
    timestamp: new Date().toISOString()
  } as ApiResponse);
};