import { createClient, RedisClientType } from 'redis';
import { config } from './index';
import { logger } from '../utils/logger';

class RedisClient {
  private client: RedisClientType;
  private static instance: RedisClient;

  private constructor() {
    this.client = createClient({ url: config.redis.url });
    this.client.on('connect', () => logger.info('Connected to Redis'));
    this.client.on('error', (err: Error) => logger.error('Redis client error:', err));
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) RedisClient.instance = new RedisClient();
    return RedisClient.instance;
  }

  public async connect(): Promise<void> { await this.client.connect(); }
  public async disconnect(): Promise<void> { await this.client.quit(); }
  public getClient(): RedisClientType { return this.client; }

  private key(k: string) { return `${config.redis.keyPrefix}${k}`; }

  public async set(key: string, value: string, expireInSeconds?: number): Promise<void> {
    const k = this.key(key);
    if (expireInSeconds) await this.client.setEx(k, expireInSeconds, value);
    else await this.client.set(k, value);
  }
  public async get(key: string): Promise<string | null> { return this.client.get(this.key(key)); }
  public async delete(key: string): Promise<number> { return this.client.del(this.key(key)); }
  public async exists(key: string): Promise<boolean> { return (await this.client.exists(this.key(key))) === 1; }
  public async incr(key: string): Promise<number> { return this.client.incr(this.key(key)); }
  public async expire(key: string, seconds: number): Promise<boolean> { return this.client.expire(this.key(key), seconds); }
  public async isConnected(): Promise<boolean> { try { await this.client.ping(); return true; } catch { return false; } }
}

export const redisClient = RedisClient.getInstance();
