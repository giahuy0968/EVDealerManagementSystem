import jwt from 'jsonwebtoken';
import { config } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/config';
import { TokenPayload, RefreshTokenPayload, UserRole } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/types';

export class JWTService {
  /**
   * Generate access token
   */
  static generateAccessToken(payload: {
    userId: string;
    username: string;
    role: UserRole;
    sessionId: string;
  }): string {
    return jwt.sign(
      {
        userId: payload.userId,
        username: payload.username,
        role: payload.role,
        sessionId: payload.sessionId,
        iat: Math.floor(Date.now() / 1000),
      },
      config.jwt.accessSecret as string
    );
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: {
    userId: string;
    sessionId: string;
    tokenVersion?: number;
  }): string {
    return jwt.sign(
      {
        userId: payload.userId,
        sessionId: payload.sessionId,
        tokenVersion: payload.tokenVersion || 1,
        iat: Math.floor(Date.now() / 1000),
      },
      config.jwt.refreshSecret as string
    );
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret, {
        issuer: 'evdms-auth',
        audience: 'evdms-api',
      }) as TokenPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid access token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret, {
        issuer: 'evdms-auth',
        audience: 'evdms-refresh',
      }) as RefreshTokenPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7); // Remove "Bearer " prefix
  }

  /**
   * Generate token pair
   */
  static generateTokenPair(payload: {
    userId: string;
    username: string;
    role: UserRole;
    sessionId: string;
  }) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken({
      userId: payload.userId,
      sessionId: payload.sessionId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Get token expiry date
   */
  static getTokenExpiry(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return true;
    return expiry < new Date();
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch {
      return null;
    }
  }
}