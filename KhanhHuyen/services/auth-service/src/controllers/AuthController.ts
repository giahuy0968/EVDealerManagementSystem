import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { validateRequest, registerSchema, loginSchema, changePasswordSchema, refreshTokenSchema } from '../utils/validation';
import { PasswordUtils } from '../utils/password';
import { logger } from '../utils/logger';
import { ApiResponse } from '../../../shared/types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const validation = validateRequest(registerSchema, req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: validation.errors,
          },
        } as ApiResponse);
        return;
      }

      // Validate password strength
      const passwordValidation = PasswordUtils.validatePasswordStrength(validation.value.password);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Password does not meet security requirements',
            details: passwordValidation.errors,
          },
        } as ApiResponse);
        return;
      }

      // Register user
      const user = await this.authService.register(validation.value);

      logger.info('User registration successful', { userId: user.id, email: user.email });

      res.status(201).json({
        success: true,
        data: {
          user: user.toJSON(),
          message: 'User registered successfully',
        },
      } as ApiResponse);
    } catch (error) {
      logger.error('Registration error:', error);

      const message = error instanceof Error ? error.message : 'Registration failed';
      const statusCode = message.includes('already exists') ? 409 : 500;

      res.status(statusCode).json({
        success: false,
        error: {
          code: statusCode === 409 ? 'USER_EXISTS' : 'REGISTRATION_ERROR',
          message,
        },
      } as ApiResponse);
    }
  };

  /**
   * Login user
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const validation = validateRequest(loginSchema, req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: validation.errors,
          },
        } as ApiResponse);
        return;
      }

      // Get IP address and user agent
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';

      // Authenticate user
      const { user, tokens } = await this.authService.login(
        validation.value,
        ipAddress,
        userAgent
      );

      logger.info('User login successful', { userId: user.id, email: user.email });

      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON(),
          tokens,
          message: 'Login successful',
        },
      } as ApiResponse);
    } catch (error) {
      logger.error('Login error:', error);

      const message = error instanceof Error ? error.message : 'Login failed';
      const statusCode = message.includes('Invalid email or password') ? 401 : 
                        message.includes('locked') ? 423 :
                        message.includes('inactive') ? 403 : 500;

      res.status(statusCode).json({
        success: false,
        error: {
          code: statusCode === 401 ? 'INVALID_CREDENTIALS' :
                statusCode === 423 ? 'ACCOUNT_LOCKED' :
                statusCode === 403 ? 'ACCOUNT_INACTIVE' : 'LOGIN_ERROR',
          message,
        },
      } as ApiResponse);
    }
  };

  /**
   * Refresh access token
   */
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const validation = validateRequest(refreshTokenSchema, req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: validation.errors,
          },
        } as ApiResponse);
        return;
      }

      // Refresh tokens
      const tokens = await this.authService.refreshTokens(validation.value.refreshToken);

      logger.info('Token refresh successful');

      res.status(200).json({
        success: true,
        data: {
          tokens,
          message: 'Tokens refreshed successfully',
        },
      } as ApiResponse);
    } catch (error) {
      logger.error('Token refresh error:', error);

      const message = error instanceof Error ? error.message : 'Token refresh failed';

      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_REFRESH_ERROR',
          message,
        },
      } as ApiResponse);
    }
  };

  /**
   * Logout user
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        } as ApiResponse);
        return;
      }

      // Logout user
      await this.authService.logout(userId);

      logger.info('User logout successful', { userId });

      res.status(200).json({
        success: true,
        data: {
          message: 'Logout successful',
        },
      } as ApiResponse);
    } catch (error) {
      logger.error('Logout error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: 'Logout failed',
        },
      } as ApiResponse);
    }
  };

  /**
   * Get current user profile
   */
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        } as ApiResponse);
        return;
      }

      const user = await this.authService.findUserById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON(),
        },
      } as ApiResponse);
    } catch (error) {
      logger.error('Get profile error:', error);

      res.status(500).json({
        success: false,
        error: {
          code: 'PROFILE_ERROR',
          message: 'Failed to retrieve profile',
        },
      } as ApiResponse);
    }
  };

  /**
   * Change user password
   */
  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        } as ApiResponse);
        return;
      }

      // Validate request body
      const validation = validateRequest(changePasswordSchema, req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: validation.errors,
          },
        } as ApiResponse);
        return;
      }

      // Validate new password strength
      const passwordValidation = PasswordUtils.validatePasswordStrength(validation.value.newPassword);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'New password does not meet security requirements',
            details: passwordValidation.errors,
          },
        } as ApiResponse);
        return;
      }

      // Change password
      await this.authService.changePassword(
        userId,
        validation.value.currentPassword,
        validation.value.newPassword
      );

      logger.info('Password change successful', { userId });

      res.status(200).json({
        success: true,
        data: {
          message: 'Password changed successfully',
        },
      } as ApiResponse);
    } catch (error) {
      logger.error('Change password error:', error);

      const message = error instanceof Error ? error.message : 'Password change failed';
      const statusCode = message.includes('Current password is incorrect') ? 400 : 500;

      res.status(statusCode).json({
        success: false,
        error: {
          code: statusCode === 400 ? 'INVALID_CURRENT_PASSWORD' : 'PASSWORD_CHANGE_ERROR',
          message,
        },
      } as ApiResponse);
    }
  };

  /**
   * Verify token validity
   */
  verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Token is invalid or expired',
          },
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          valid: true,
          user: req.user,
          message: 'Token is valid',
        },
      } as ApiResponse);
    } catch (error) {
      logger.error('Token verification error:', error);

      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_VERIFICATION_ERROR',
          message: 'Token verification failed',
        },
      } as ApiResponse);
    }
  };
}