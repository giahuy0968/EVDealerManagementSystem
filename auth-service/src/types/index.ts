export enum UserRole {
  ADMIN = 'ADMIN',
  DEALER_MANAGER = 'DEALER_MANAGER',
  DEALER_STAFF = 'DEALER_STAFF',
  EVM_STAFF = 'EVM_STAFF'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  PENDING = 'PENDING'
}

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED'
}

export interface UserAttributes {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  dealerId?: string;
  manufacturerId?: string;
  isActive: boolean;
  lastLogin?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionAttributes {
  id: string;
  userId: string;
  refreshToken: string;
  deviceInfo: Record<string, any>;
  ipAddress: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface PasswordResetTokenAttributes {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

// DTOs for API requests and responses
export interface RegisterRequestDTO {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  dealerId?: string;
  manufacturerId?: string;
}

export interface LoginRequestDTO {
  username: string;
  password: string;
  deviceInfo?: Record<string, any>;
}

export interface LoginResponseDTO {
  user: UserPublicDTO;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  sessionId: string;
}

export interface UserPublicDTO {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  dealerId?: string;
  manufacturerId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserDTO {
  fullName?: string;
  email?: string;
  dealerId?: string;
  manufacturerId?: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ChangeRoleDTO {
  role: UserRole;
  dealerId?: string;
  manufacturerId?: string;
}

export interface ChangeStatusDTO {
  isActive: boolean;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  username: string;
  role: UserRole;
  sessionId: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
  tokenVersion: number;
  iat: number;
  exp: number;
}

export interface SessionInfoDTO {
  id: string;
  deviceInfo: Record<string, any>;
  ipAddress: string;
  createdAt: Date;
  expiresAt: Date;
  isCurrent: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface UserFilterOptions extends PaginationOptions {
  role?: UserRole;
  isActive?: boolean;
  dealerId?: string;
  manufacturerId?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  timestamp: string;
}

export interface DeviceInfo {
  userAgent?: string;
  platform?: string;
  browser?: string;
  version?: string;
  mobile?: boolean;
  fingerprint?: string;
}

// Express Request extension
declare global {
  namespace Express {
    interface Request {
      user?: UserPublicDTO;
      sessionId?: string;
      deviceInfo?: DeviceInfo;
    }
  }
}

// Error types
export class AuthError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends Error {
  public readonly code: string = 'VALIDATION_ERROR';
  public readonly statusCode: number = 400;
  public readonly details: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class DatabaseError extends Error {
  public readonly code: string = 'DATABASE_ERROR';
  public readonly statusCode: number = 500;

  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class RateLimitError extends Error {
  public readonly code: string = 'RATE_LIMIT_EXCEEDED';
  public readonly statusCode: number = 429;

  constructor(message: string = 'Too many requests') {
    super(message);
    this.name = 'RateLimitError';
  }
}