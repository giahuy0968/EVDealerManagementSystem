import { v4 as uuidv4 } from 'uuid';
import { database } from '../config/database';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';
import { JWTUtils } from '../utils/jwt';
import { PasswordUtils } from '../utils/password';
import { User, CreateUserData, UpdateUserData, LoginCredentials, AuthTokens, LoginAttempt } from '../models/User';
import { UserRole, UserStatus, IUser } from '../../../shared/types';
import { config } from '../config';

export class AuthService {
  /**
   * Register a new user
   */
  async register(userData: CreateUserData): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.findUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Validate business rules
      await this.validateUserRoleConstraints(userData);

      // Hash password
      const hashedPassword = await PasswordUtils.hashPassword(userData.password);

      // Create user in database
      const query = `
        INSERT INTO users (id, email, password_hash, first_name, last_name, role, dealer_id, manufacturer_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, email, first_name, last_name, role, status, dealer_id, manufacturer_id, created_at, updated_at
      `;

      const values = [
        uuidv4(),
        userData.email.toLowerCase(),
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.role,
        userData.dealerId || null,
        userData.manufacturerId || null,
      ];

      const result = await database.query(query, values);
      const userRow = result.rows[0];

      const user = new User({
        id: userRow.id,
        email: userRow.email,
        firstName: userRow.first_name,
        lastName: userRow.last_name,
        role: userRow.role as UserRole,
        status: userRow.status as UserStatus,
        dealerId: userRow.dealer_id,
        manufacturerId: userRow.manufacturer_id,
        createdAt: userRow.created_at,
        updatedAt: userRow.updated_at,
      });

      logger.info('User registered successfully', { userId: user.id, email: user.email });
      return user;
    } catch (error) {
      logger.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Authenticate user and return tokens
   */
  async login(credentials: LoginCredentials, ipAddress: string, userAgent: string): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      // Find user by email
      const user = await this.findUserByEmail(credentials.email);
      if (!user) {
        await this.recordLoginAttempt(null, ipAddress, userAgent, false, 'User not found');
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        await this.recordLoginAttempt(user.id, ipAddress, userAgent, false, 'User account is inactive');
        throw new Error('Account is inactive or suspended');
      }

      // Check for account lockout
      const isLocked = await this.isAccountLocked(user.id);
      if (isLocked) {
        await this.recordLoginAttempt(user.id, ipAddress, userAgent, false, 'Account locked');
        throw new Error('Account is temporarily locked due to multiple failed login attempts');
      }

      // Get password hash from database
      const passwordHash = await this.getUserPasswordHash(user.id);
      if (!passwordHash) {
        throw new Error('Invalid user data');
      }

      // Verify password
      const isPasswordValid = await PasswordUtils.comparePassword(credentials.password, passwordHash);
      if (!isPasswordValid) {
        await this.handleFailedLogin(user.id, ipAddress, userAgent);
        throw new Error('Invalid email or password');
      }

      // Update last login time
      await this.updateLastLogin(user.id);

      // Generate tokens
      const tokens = JWTUtils.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
        dealerId: user.dealerId,
        manufacturerId: user.manufacturerId,
      });

      // Store refresh token in Redis
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      // Clear failed login attempts
      await this.clearFailedLoginAttempts(user.id);

      // Record successful login
      await this.recordLoginAttempt(user.id, ipAddress, userAgent, true);

      logger.info('User logged in successfully', { userId: user.id, email: user.email });

      return { user, tokens };
    } catch (error) {
      logger.error('Error during login:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = JWTUtils.verifyRefreshToken(refreshToken);

      // Check if refresh token exists in Redis
      const storedToken = await redisClient.get(`refresh_token:${payload.userId}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Get user information
      const user = await this.findUserById(payload.userId);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Generate new tokens
      const tokens = JWTUtils.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
        dealerId: user.dealerId,
        manufacturerId: user.manufacturerId,
      });

      // Store new refresh token
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      logger.info('Tokens refreshed successfully', { userId: user.id });

      return tokens;
    } catch (error) {
      logger.error('Error refreshing tokens:', error);
      throw error;
    }
  }

  /**
   * Logout user and invalidate tokens
   */
  async logout(userId: string): Promise<void> {
    try {
      // Remove refresh token from Redis
      await redisClient.delete(`refresh_token:${userId}`);

      logger.info('User logged out successfully', { userId });
    } catch (error) {
      logger.error('Error during logout:', error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Get current password hash
      const currentPasswordHash = await this.getUserPasswordHash(userId);
      if (!currentPasswordHash) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await PasswordUtils.comparePassword(currentPassword, currentPasswordHash);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password strength
      const passwordValidation = PasswordUtils.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      // Hash new password
      const newPasswordHash = await PasswordUtils.hashPassword(newPassword);

      // Update password in database
      const query = `
        UPDATE users 
        SET password_hash = $1, updated_at = NOW()
        WHERE id = $2
      `;

      await database.query(query, [newPasswordHash, userId]);

      // Invalidate all refresh tokens for this user
      await redisClient.delete(`refresh_token:${userId}`);

      logger.info('Password changed successfully', { userId });
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const query = `
        SELECT id, email, first_name, last_name, role, status, dealer_id, manufacturer_id, created_at, updated_at, last_login_at
        FROM users 
        WHERE email = $1
      `;

      const result = await database.query(query, [email.toLowerCase()]);
      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return new User({
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role as UserRole,
        status: row.status as UserStatus,
        dealerId: row.dealer_id,
        manufacturerId: row.manufacturer_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        lastLoginAt: row.last_login_at,
      });
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findUserById(userId: string): Promise<User | null> {
    try {
      const query = `
        SELECT id, email, first_name, last_name, role, status, dealer_id, manufacturer_id, created_at, updated_at, last_login_at
        FROM users 
        WHERE id = $1
      `;

      const result = await database.query(query, [userId]);
      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return new User({
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role as UserRole,
        status: row.status as UserStatus,
        dealerId: row.dealer_id,
        manufacturerId: row.manufacturer_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        lastLoginAt: row.last_login_at,
      });
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Update user information
   */
  async updateUser(userId: string, updateData: UpdateUserData): Promise<User> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (updateData.firstName) {
        updates.push(`first_name = $${paramCount++}`);
        values.push(updateData.firstName);
      }

      if (updateData.lastName) {
        updates.push(`last_name = $${paramCount++}`);
        values.push(updateData.lastName);
      }

      if (updateData.status) {
        updates.push(`status = $${paramCount++}`);
        values.push(updateData.status);
      }

      if (updateData.dealerId !== undefined) {
        updates.push(`dealer_id = $${paramCount++}`);
        values.push(updateData.dealerId);
      }

      if (updateData.manufacturerId !== undefined) {
        updates.push(`manufacturer_id = $${paramCount++}`);
        values.push(updateData.manufacturerId);
      }

      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      updates.push(`updated_at = NOW()`);
      values.push(userId);

      const query = `
        UPDATE users 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, email, first_name, last_name, role, status, dealer_id, manufacturer_id, created_at, updated_at, last_login_at
      `;

      const result = await database.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const row = result.rows[0];
      const user = new User({
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role as UserRole,
        status: row.status as UserStatus,
        dealerId: row.dealer_id,
        manufacturerId: row.manufacturer_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        lastLoginAt: row.last_login_at,
      });

      logger.info('User updated successfully', { userId, updateData });
      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  // Private helper methods

  private async validateUserRoleConstraints(userData: CreateUserData): Promise<void> {
    // Validate dealer relationship
    if ((userData.role === UserRole.DEALER_MANAGER || userData.role === UserRole.DEALER_STAFF) && !userData.dealerId) {
      throw new Error('Dealer ID is required for dealer roles');
    }

    // Validate manufacturer relationship
    if (userData.role === UserRole.MANUFACTURER_STAFF && !userData.manufacturerId) {
      throw new Error('Manufacturer ID is required for manufacturer staff role');
    }

    // Validate dealer exists if dealerId is provided
    if (userData.dealerId) {
      const dealerQuery = 'SELECT id FROM dealers WHERE id = $1';
      const dealerResult = await database.query(dealerQuery, [userData.dealerId]);
      if (dealerResult.rows.length === 0) {
        throw new Error('Invalid dealer ID');
      }
    }

    // Validate manufacturer exists if manufacturerId is provided
    if (userData.manufacturerId) {
      const manufacturerQuery = 'SELECT id FROM manufacturers WHERE id = $1';
      const manufacturerResult = await database.query(manufacturerQuery, [userData.manufacturerId]);
      if (manufacturerResult.rows.length === 0) {
        throw new Error('Invalid manufacturer ID');
      }
    }
  }

  private async getUserPasswordHash(userId: string): Promise<string | null> {
    try {
      const query = 'SELECT password_hash FROM users WHERE id = $1';
      const result = await database.query(query, [userId]);
      return result.rows.length > 0 ? result.rows[0].password_hash : null;
    } catch (error) {
      logger.error('Error getting user password hash:', error);
      return null;
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      const query = 'UPDATE users SET last_login_at = NOW() WHERE id = $1';
      await database.query(query, [userId]);
    } catch (error) {
      logger.error('Error updating last login:', error);
    }
  }

  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    try {
      const expiresIn = JWTUtils.getTokenExpirationTime ? 604800 : 604800; // 7 days
      await redisClient.set(`refresh_token:${userId}`, refreshToken, expiresIn);
    } catch (error) {
      logger.error('Error storing refresh token:', error);
    }
  }

  private async recordLoginAttempt(userId: string | null, ipAddress: string, userAgent: string, success: boolean, reason?: string): Promise<void> {
    // This could be stored in database or just logged for security monitoring
    const attempt: LoginAttempt = {
      userId: userId || 'unknown',
      ipAddress,
      userAgent,
      success,
      timestamp: new Date(),
      reason,
    };

    logger.info('Login attempt recorded', attempt);
    
    // You could also store this in a dedicated login_attempts table for detailed security monitoring
  }

  private async handleFailedLogin(userId: string, ipAddress: string, userAgent: string): Promise<void> {
    try {
      const key = `failed_login:${userId}`;
      const attempts = await redisClient.incr(key);
      
      if (attempts === 1) {
        // Set expiration on first failed attempt
        await redisClient.expire(key, config.security.lockoutDuration / 1000);
      }

      if (attempts >= config.security.maxLoginAttempts) {
        // Lock the account
        await redisClient.set(`account_locked:${userId}`, 'true', config.security.lockoutDuration / 1000);
        logger.warn('Account locked due to multiple failed login attempts', { userId, attempts });
      }

      await this.recordLoginAttempt(userId, ipAddress, userAgent, false, `Failed attempt ${attempts}`);
    } catch (error) {
      logger.error('Error handling failed login:', error);
    }
  }

  private async isAccountLocked(userId: string): Promise<boolean> {
    try {
      return await redisClient.exists(`account_locked:${userId}`);
    } catch (error) {
      logger.error('Error checking account lock status:', error);
      return false;
    }
  }

  private async clearFailedLoginAttempts(userId: string): Promise<void> {
    try {
      await redisClient.delete(`failed_login:${userId}`);
      await redisClient.delete(`account_locked:${userId}`);
    } catch (error) {
      logger.error('Error clearing failed login attempts:', error);
    }
  }
}