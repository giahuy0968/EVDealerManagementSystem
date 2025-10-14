import { createClient, RedisClientType } from 'redis';
import { config } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/config';

export class RedisService {
  private static instance: RedisService;
  private client: RedisClientType;
  private connected: boolean = false;

  private constructor() {
    const clientOptions: any = {
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      database: config.redis.db,
    };
    
    if (config.redis.password) {
      clientOptions.password = config.redis.password;
    }
    
    this.client = createClient(clientOptions);

    this.setupEventListeners();
  }

  static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  private setupEventListeners(): void {
    this.client.on('connect', () => {
      console.log('✅ Redis client connected');
      this.connected = true;
    });

    this.client.on('error', (error) => {
      console.error('❌ Redis client error:', error);
      this.connected = false;
    });

    this.client.on('disconnect', () => {
      console.log('🔌 Redis client disconnected');
      this.connected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.quit();
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  // Token blacklist methods
  async blacklistToken(token: string, expiryInSeconds: number): Promise<void> {
    const key = `token:blacklist:${token}`;
    await this.client.setEx(key, expiryInSeconds, 'true');
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `token:blacklist:${token}`;
    const result = await this.client.get(key);
    return result === 'true';
  }

  // Rate limiting methods
  async incrementRateLimit(key: string, windowInSeconds: number): Promise<number> {
    const rateLimitKey = `rate_limit:${key}`;
    const current = await this.client.incr(rateLimitKey);
    
    // Set expiry only on first increment
    if (current === 1) {
      await this.client.expire(rateLimitKey, windowInSeconds);
    }
    
    return current;
  }

  async getRateLimitCount(key: string): Promise<number> {
    const rateLimitKey = `rate_limit:${key}`;
    const count = await this.client.get(rateLimitKey);
    return count ? parseInt(count, 10) : 0;
  }

  async resetRateLimit(key: string): Promise<void> {
    const rateLimitKey = `rate_limit:${key}`;
    await this.client.del(rateLimitKey);
  }

  // Session cache methods
  async cacheSession(sessionId: string, data: any, expiryInSeconds: number): Promise<void> {
    const key = `session:${sessionId}`;
    await this.client.setEx(key, expiryInSeconds, JSON.stringify(data));
  }

  async getSession(sessionId: string): Promise<any | null> {
    const key = `session:${sessionId}`;
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async invalidateSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.client.del(key);
  }

  async invalidateUserSessions(userId: string): Promise<void> {
    const pattern = `session:*`;
    const keys = await this.client.keys(pattern);
    
    for (const key of keys) {
      const session = await this.getSession(key.replace('session:', ''));
      if (session && session.userId === userId) {
        await this.client.del(key);
      }
    }
  }

  // Generic cache methods
  async set(key: string, value: string | number | object, expiryInSeconds?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (expiryInSeconds) {
      await this.client.setEx(key, expiryInSeconds, stringValue);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async getObject(key: string): Promise<any | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const count = await this.client.exists(key);
    return count > 0;
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  // Password reset token cache
  async cachePasswordResetToken(email: string, token: string, expiryInSeconds: number): Promise<void> {
    const key = `password_reset:${email}`;
    await this.client.setEx(key, expiryInSeconds, token);
  }

  async getPasswordResetToken(email: string): Promise<string | null> {
    const key = `password_reset:${email}`;
    return await this.client.get(key);
  }

  async invalidatePasswordResetToken(email: string): Promise<void> {
    const key = `password_reset:${email}`;
    await this.client.del(key);
  }

  // Health check
  async ping(): Promise<string> {
    return await this.client.ping();
  }

  async info(): Promise<string> {
    return await this.client.info();
  }

  // Cleanup expired keys (manual cleanup for debugging)
  async cleanupExpiredKeys(): Promise<number> {
    const patterns = [
      'token:blacklist:*',
      'rate_limit:*',
      'session:*',
      'password_reset:*'
    ];

    let deletedCount = 0;

    for (const pattern of patterns) {
      const keys = await this.client.keys(pattern);
      for (const key of keys) {
        const ttl = await this.client.ttl(key);
        if (ttl === -2) { // Key doesn't exist or expired
          await this.client.del(key);
          deletedCount++;
        }
      }
    }

    return deletedCount;
  }
}

// Export singleton instance
export const redisService = RedisService.getInstance();