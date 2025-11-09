import bcrypt from 'bcryptjs';
import { config } from '../config';
import { logger } from './logger';

export class PasswordUtils {
  /**
   * Hash a plain text password
   */
  static async hashPassword(plainPassword: string): Promise<string> {
    try {
      const saltRounds = config.bcrypt.saltRounds;
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
      
      logger.debug('Password hashed successfully');
      return hashedPassword;
    } catch (error) {
      logger.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Compare a plain text password with a hashed password
   */
  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      logger.debug('Password comparison completed', { isMatch });
      return isMatch;
    } catch (error) {
      logger.error('Error comparing passwords:', error);
      throw new Error('Failed to compare passwords');
    }
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
  } {
    const errors: string[] = [];
    let score = 0;

    // Check minimum length
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else {
      score += 1;
    }

    // Check for uppercase letters
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    // Check for lowercase letters
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    // Check for numbers
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    // Check for special characters
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    // Check for maximum length (prevent DoS attacks)
    if (password.length > 128) {
      errors.push('Password must not exceed 128 characters');
      score = 0;
    }

    // Check for common passwords
    const commonPasswords = [
      'password', 'password123', '123456', '123456789', 'qwerty',
      'abc123', 'password1', 'admin', 'letmein', 'welcome'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common, please choose a more secure password');
      score = Math.max(0, score - 2);
    }

    return {
      isValid: errors.length === 0,
      errors,
      score: Math.min(5, score), // Maximum score of 5
    };
  }

  /**
   * Generate a secure random password
   */
  static generateSecurePassword(length: number = 12): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  /**
   * Generate a temporary password for new users
   */
  static generateTemporaryPassword(): string {
    return this.generateSecurePassword(10);
  }

  /**
   * Check if password needs to be rehashed (e.g., if bcrypt rounds have changed)
   */
  static async needsRehash(hashedPassword: string): Promise<boolean> {
    try {
      const saltRounds = config.bcrypt.saltRounds;
      
      // Extract rounds from existing hash
      const rounds = bcrypt.getRounds(hashedPassword);
      
      return rounds < saltRounds;
    } catch (error) {
      logger.error('Error checking if password needs rehash:', error);
      return false;
    }
  }

  /**
   * Securely compare timing-safe strings
   */
  static timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}