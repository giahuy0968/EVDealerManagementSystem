import { User, Session, PasswordResetToken } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/models';
import { JWTService } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/services/JWTService';
import { redisService } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/services/RedisService';
import { EmailService } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/services/EmailService';
import {
  LoginRequestDTO,
  LoginResponseDTO,
  RegisterRequestDTO,
  UserPublicDTO,
  RefreshTokenDTO,
  ChangePasswordDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  AuthError,
  ValidationError,
  DeviceInfo,
  SessionInfoDTO
} from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/types';
import { config } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/config';
import { Op } from 'sequelize';
import crypto from 'crypto';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData: RegisterRequestDTO): Promise<UserPublicDTO> {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username: userData.username },
          { email: userData.email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === userData.username) {
        throw new ValidationError('Username already exists');
      }
      if (existingUser.email === userData.email) {
        throw new ValidationError('Email already exists');
      }
    }

    // Validate password strength
    this.validatePassword(userData.password);

    // Create user
    const user = await User.createUser({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      role: userData.role,
      dealerId: userData.dealerId || null,
      manufacturerId: userData.manufacturerId || null,
    });

    return user.toPublicJSON();
  }

  /**
   * Login user with username/email and password
   */
  static async login(
    credentials: LoginRequestDTO,
    ipAddress: string,
    deviceInfo: DeviceInfo
  ): Promise<LoginResponseDTO> {
    // Check rate limiting
    await this.checkRateLimit(ipAddress);

    // Find user by username or email
    const user = await User.findByUsernameOrEmail(credentials.username);
    
    if (!user) {
      await this.incrementRateLimit(ipAddress);
      throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    // Check if account is locked
    if (user.isLocked()) {
      throw new AuthError('Account is temporarily locked', 'ACCOUNT_LOCKED');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AuthError('Account is deactivated', 'ACCOUNT_INACTIVE');
    }

    // Verify password
    const isValidPassword = await user.comparePassword(credentials.password);
    
    if (!isValidPassword) {
      await user.incrementFailedAttempts();
      await this.incrementRateLimit(ipAddress);
      throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    // Reset failed attempts on successful login
    await user.resetFailedAttempts();

    // Clean up old sessions if user has too many
    await this.cleanupUserSessions(user.id);

    // Generate tokens
    const sessionId = crypto.randomUUID();
    const tokens = JWTService.generateTokenPair({
      userId: user.id,
      username: user.username,
      role: user.role,
      sessionId,
    });

    // Create session
    const expiresAt = new Date(Date.now() + config.session.expiryDays * 24 * 60 * 60 * 1000);
    
    await Session.createSession({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      deviceInfo: credentials.deviceInfo || deviceInfo,
      ipAddress,
      expiresAt,
    });

    // Cache session data
    await redisService.cacheSession(
      sessionId,
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        ipAddress,
        deviceInfo,
      },
      config.session.expiryDays * 24 * 60 * 60
    );

    return {
      user: user.toPublicJSON(),
      tokens,
      sessionId,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshTokenDTO: RefreshTokenDTO): Promise<{
    accessToken: string;
    user: UserPublicDTO;
  }> {
    try {
      // Verify refresh token
      const payload = JWTService.verifyRefreshToken(refreshTokenDTO.refreshToken);

      // Find session
      const session = await Session.findByRefreshToken(refreshTokenDTO.refreshToken);
      
      if (!session || !session.user) {
        throw new AuthError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
      }

      // Check if session is valid
      if (!session.isValid()) {
        await session.revoke();
        throw new AuthError('Session expired', 'SESSION_EXPIRED');
      }

      // Check if user is still active
      if (!session.user.isActive) {
        await session.revoke();
        throw new AuthError('Account is deactivated', 'ACCOUNT_INACTIVE');
      }

      // Generate new access token
      const accessToken = JWTService.generateAccessToken({
        userId: session.user.id,
        username: session.user.username,
        role: session.user.role,
        sessionId: payload.sessionId,
      });

      return {
        accessToken,
        user: session.user.toPublicJSON(),
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Token refresh failed', 'REFRESH_FAILED');
    }
  }

  /**
   * Logout user (revoke session)
   */
  static async logout(sessionId: string, accessToken: string): Promise<void> {
    // Blacklist access token
    const tokenExpiry = JWTService.getTokenExpiry(accessToken);
    if (tokenExpiry) {
      const secondsUntilExpiry = Math.ceil((tokenExpiry.getTime() - Date.now()) / 1000);
      if (secondsUntilExpiry > 0) {
        await redisService.blacklistToken(accessToken, secondsUntilExpiry);
      }
    }

    // Find and revoke session
    const session = await Session.findValidSession(sessionId);
    if (session) {
      await session.revoke();
    }

    // Remove session from cache
    await redisService.invalidateSession(sessionId);
  }

  /**
   * Logout from all devices
   */
  static async logoutAll(userId: string): Promise<void> {
    // Get all user sessions and revoke them
    await Session.findUserSessions(userId);

    // Blacklist all access tokens (assuming they follow a pattern)
    // In a real implementation, you'd need to track all issued tokens
    
    // Revoke all sessions
    await Session.revokeUserSessions(userId);

    // Clear session cache
    await redisService.invalidateUserSessions(userId);
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(
    userId: string,
    changePasswordDTO: ChangePasswordDTO
  ): Promise<void> {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AuthError('User not found', 'USER_NOT_FOUND');
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(changePasswordDTO.currentPassword);
    
    if (!isValidPassword) {
      throw new AuthError('Current password is incorrect', 'INVALID_CURRENT_PASSWORD');
    }

    // Validate new password
    this.validatePassword(changePasswordDTO.newPassword);

    // Set new password
    await user.setPassword(changePasswordDTO.newPassword);
    await user.save();

    // Revoke all sessions except current one
    // This forces re-login on all other devices
    await Session.revokeUserSessions(userId);
    await redisService.invalidateUserSessions(userId);
  }

  /**
   * Request password reset
   */
  static async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): Promise<void> {
    const user = await User.findByEmail(forgotPasswordDTO.email);
    
    if (!user) {
      // Don't reveal if email exists or not
      return;
    }

    // Check rate limit for password reset requests
    const rateLimitKey = `password_reset:${forgotPasswordDTO.email}`;
    const attempts = await redisService.getRateLimitCount(rateLimitKey);
    
    if (attempts >= 3) { // Max 3 requests per 15 minutes
      throw new AuthError('Too many password reset requests', 'RATE_LIMIT_EXCEEDED');
    }

    // Create reset token
    const resetToken = await PasswordResetToken.createResetToken(user.id);

    // Increment rate limit
    await redisService.incrementRateLimit(rateLimitKey, 15 * 60); // 15 minutes

    // Send reset email
    await EmailService.sendPasswordResetEmail(user.email, user.fullName, resetToken.token);
  }

  /**
   * Reset password using token
   */
  static async resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<void> {
    // Find valid reset token
    const resetToken = await PasswordResetToken.findValidToken(resetPasswordDTO.token);
    
    if (!resetToken || !resetToken.user) {
      throw new AuthError('Invalid or expired reset token', 'INVALID_RESET_TOKEN');
    }

    // Validate new password
    this.validatePassword(resetPasswordDTO.newPassword);

    // Set new password
    await resetToken.user.setPassword(resetPasswordDTO.newPassword);
    await resetToken.user.save();

    // Mark token as used
    await resetToken.markAsUsed();

    // Revoke all user sessions
    await Session.revokeUserSessions(resetToken.user.id);
    await redisService.invalidateUserSessions(resetToken.user.id);
  }

  /**
   * Verify if token is valid and not blacklisted
   */
  static async verifyToken(token: string): Promise<UserPublicDTO> {
    // Check if token is blacklisted
    const isBlacklisted = await redisService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new AuthError('Token has been revoked', 'TOKEN_REVOKED');
    }

    try {
      // Verify token
      const payload = JWTService.verifyAccessToken(token);

      // Get session from cache or database
      let sessionData = await redisService.getSession(payload.sessionId);
      
      if (!sessionData) {
        // Fallback to database
        const session = await Session.findValidSession(payload.sessionId);
        if (!session || !session.user) {
          throw new AuthError('Session not found', 'SESSION_NOT_FOUND');
        }
        
        sessionData = {
          userId: session.user.id,
          username: session.user.username,
          role: session.user.role,
        };

        // Cache for next time
        await redisService.cacheSession(
          payload.sessionId,
          sessionData,
          config.session.expiryDays * 24 * 60 * 60
        );
      }

      // Get fresh user data
      const user = await User.findByPk(sessionData.userId);
      if (!user || !user.isActive) {
        throw new AuthError('User not found or inactive', 'USER_INACTIVE');
      }

      return user.toPublicJSON();
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Token verification failed', 'INVALID_TOKEN');
    }
  }

  /**
   * Get user's active sessions
   */
  static async getUserSessions(userId: string): Promise<SessionInfoDTO[]> {
    const sessions = await Session.findUserSessions(userId);
    
    return sessions.map(session => ({
      id: session.id,
      deviceInfo: session.deviceInfo,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      isCurrent: false, // This would need to be determined by comparing with current session
    }));
  }

  /**
   * Revoke specific session
   */
  static async revokeSession(sessionId: string, userId: string): Promise<void> {
    const session = await Session.findOne({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (session) {
      await session.revoke();
      await redisService.invalidateSession(sessionId);
    }
  }

  // Private helper methods

  private static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      throw new ValidationError('Password must contain at least one uppercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      throw new ValidationError('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new ValidationError('Password must contain at least one special character');
    }
  }

  private static async checkRateLimit(ipAddress: string): Promise<void> {
    const key = `login:${ipAddress}`;
    const attempts = await redisService.getRateLimitCount(key);
    
    if (attempts >= config.security.rateLimitMax) {
      throw new AuthError('Too many login attempts', 'RATE_LIMIT_EXCEEDED');
    }
  }

  private static async incrementRateLimit(ipAddress: string): Promise<void> {
    const key = `login:${ipAddress}`;
    await redisService.incrementRateLimit(key, config.security.rateLimitWindowMs / 1000);
  }

  private static async cleanupUserSessions(userId: string): Promise<void> {
    const sessions = await Session.findUserSessions(userId);
    
    if (sessions.length >= config.session.maxSessionsPerUser) {
      // Remove oldest sessions
      const sessionsToRemove = sessions
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .slice(0, sessions.length - config.session.maxSessionsPerUser + 1);

      for (const session of sessionsToRemove) {
        await session.revoke();
        await redisService.invalidateSession(session.id);
      }
    }
  }
}