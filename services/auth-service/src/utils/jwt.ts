import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { logger } from './logger';
import { JWTPayload, RefreshTokenPayload, AuthTokens } from '../models/User';

export class JWTUtils {
  /**
   * Generate access token
   */
  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'iss' | 'aud'>): string {
    try {
      const tokenPayload: JWTPayload = {
        ...payload,
        iss: config.jwt.issuer,
        aud: config.jwt.audience,
      };

      return jwt.sign(tokenPayload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });
    } catch (error) {
      logger.error('Error generating access token:', error);
      throw new Error('Failed to generate access token');
    }
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(userId: string): string {
    try {
      const tokenPayload: RefreshTokenPayload = {
        userId,
        tokenId: uuidv4(),
        iss: config.jwt.issuer,
        aud: config.jwt.audience,
      };

      return jwt.sign(tokenPayload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
      });
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw new Error('Failed to generate refresh token');
    }
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp' | 'iss' | 'aud'>): AuthTokens {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload.userId);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getTokenExpirationTime(config.jwt.expiresIn),
      tokenType: 'Bearer',
    };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
      logger.error('Error verifying access token:', error);
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
    } catch (error) {
      logger.error('Error verifying refresh token:', error);
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      logger.error('Error decoding token:', error);
      throw new Error('Invalid token format');
    }
  }

  /**
   * Get token expiration time in seconds
   */
  private static getTokenExpirationTime(expiresIn: string): number {
    // Convert common JWT expiration formats to seconds
    const timeMap: Record<string, number> = {
      '1h': 3600,
      '24h': 86400,
      '7d': 604800,
      '30d': 2592000,
    };

    if (timeMap[expiresIn]) {
      return timeMap[expiresIn];
    }

    // Try to parse as seconds
    const seconds = parseInt(expiresIn, 10);
    return isNaN(seconds) ? 86400 : seconds; // Default to 24 hours
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token) as any;
      if (!decoded.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Get token expiration date
   */
  static getTokenExpirationDate(token: string): Date | null {
    try {
      const decoded = this.decodeToken(token) as any;
      if (!decoded.exp) return null;

      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  }

  /**
   * Generate password reset token
   */
  static generatePasswordResetToken(userId: string, email: string): string {
    try {
      const payload = {
        userId,
        email,
        purpose: 'password_reset',
        iss: config.jwt.issuer,
        aud: config.jwt.audience,
      };

      return jwt.sign(payload, config.jwt.secret, {
        expiresIn: '1h', // Password reset tokens expire in 1 hour
      });
    } catch (error) {
      logger.error('Error generating password reset token:', error);
      throw new Error('Failed to generate password reset token');
    }
  }

  /**
   * Verify password reset token
   */
  static verifyPasswordResetToken(token: string): { userId: string; email: string } {
    try {
      const payload = jwt.verify(token, config.jwt.secret) as any;
      
      if (payload.purpose !== 'password_reset') {
        throw new Error('Invalid token purpose');
      }

      return {
        userId: payload.userId,
        email: payload.email,
      };
    } catch (error) {
      logger.error('Error verifying password reset token:', error);
      throw new Error('Invalid or expired password reset token');
    }
  }
}