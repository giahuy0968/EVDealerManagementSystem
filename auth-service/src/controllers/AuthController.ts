import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/services/AuthService';
import {
  LoginRequestDTO,
  RegisterRequestDTO,
  ChangePasswordDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  ApiResponse,
  DeviceInfo
} from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/types';
import { validationResult } from 'express-validator';

export class AuthController {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: errors.array()
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const userData: RegisterRequestDTO = req.body;
      const user = await AuthService.register(userData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * User login
   * POST /api/v1/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: errors.array()
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const credentials: LoginRequestDTO = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const deviceInfo: DeviceInfo = {
        userAgent: req.get('User-Agent'),
        platform: req.get('Sec-CH-UA-Platform'),
        browser: req.get('Sec-CH-UA'),
        mobile: req.get('Sec-CH-UA-Mobile') === '?1',
        fingerprint: req.get('X-Fingerprint'),
      };

      const loginResult = await AuthService.login(credentials, ipAddress, deviceInfo);

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', loginResult.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: loginResult.user,
          accessToken: loginResult.tokens.accessToken,
          sessionId: loginResult.sessionId,
        },
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let refreshToken = req.cookies.refreshToken;
      
      // Fallback to body if cookie not present
      if (!refreshToken && req.body.refreshToken) {
        refreshToken = req.body.refreshToken;
      }

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: 'Refresh token not provided',
          error: {
            code: 'REFRESH_TOKEN_MISSING',
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const result = await AuthService.refreshToken({ refreshToken });

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result,
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * User logout
   * POST /api/v1/auth/logout
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.sessionId;
      const accessToken = req.get('Authorization')?.replace('Bearer ', '') || '';

      if (sessionId) {
        await AuthService.logout(sessionId, accessToken);
      }

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logout successful',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout from all devices
   * POST /api/v1/auth/logout-all
   */
  static async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: {
            code: 'USER_NOT_AUTHENTICATED',
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      await AuthService.logoutAll(userId);

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logged out from all devices successfully',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify token
   * GET /api/v1/auth/verify
   */
  static async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.get('Authorization')?.replace('Bearer ', '');

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Token not provided',
          error: {
            code: 'TOKEN_MISSING',
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const user = await AuthService.verifyToken(token);

      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: { user },
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: errors.array()
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: {
            code: 'USER_NOT_AUTHENTICATED',
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const changePasswordData: ChangePasswordDTO = req.body;
      await AuthService.changePassword(userId, changePasswordData);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Forgot password
   * POST /api/v1/auth/forgot-password
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: errors.array()
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const forgotPasswordData: ForgotPasswordDTO = req.body;
      await AuthService.forgotPassword(forgotPasswordData);

      res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password
   * POST /api/v1/auth/reset-password
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: errors.array()
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const resetPasswordData: ResetPasswordDTO = req.body;
      await AuthService.resetPassword(resetPasswordData);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user profile
   * GET /api/v1/auth/profile
   */
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: {
            code: 'USER_NOT_AUTHENTICATED',
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: { user },
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user sessions
   * GET /api/v1/auth/sessions
   */
  static async getSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: {
            code: 'USER_NOT_AUTHENTICATED',
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const sessions = await AuthService.getUserSessions(userId);

      res.status(200).json({
        success: true,
        message: 'Sessions retrieved successfully',
        data: { sessions },
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Revoke specific session
   * DELETE /api/v1/auth/sessions/:sessionId
   */
  static async revokeSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const sessionId = req.params.sessionId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: {
            code: 'USER_NOT_AUTHENTICATED',
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      if (!sessionId) {
        res.status(400).json({
          success: false,
          message: 'Session ID is required',
          error: {
            code: 'SESSION_ID_REQUIRED',
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      await AuthService.revokeSession(sessionId, userId);

      res.status(200).json({
        success: true,
        message: 'Session revoked successfully',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}