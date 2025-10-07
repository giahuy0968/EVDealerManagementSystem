import { createClient, RedisClientType } from 'redis';
import { config } from './index';
import { logger } from '../utils/logger';

class RedisClient {
  private client: RedisClientType;
  private static instance: RedisClient;

  private constructor() {
    this.client = createClient({
      url: config.redis.url,
    });

    this.client.on('connect', () => {
      logger.info('Connected to Redis server');
    });

    this.client.on('error', (err: Error) => {
      logger.error('Redis client error:', err);
    });

    this.client.on('ready', () => {
      logger.info('Redis client is ready');
    });

    this.client.on('end', () => {
      logger.info('Redis client disconnected');
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      logger.info('Redis client connected successfully');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.quit();
      logger.info('Redis client disconnected successfully');
    } catch (error) {
      logger.error('Failed to disconnect from Redis:', error);
      throw error;
    }
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  public async set(key: string, value: string, expireInSeconds?: number): Promise<void> {
    try {
      const prefixedKey = `${config.redis.keyPrefix}${key}`;
      if (expireInSeconds) {
        await this.client.setEx(prefixedKey, expireInSeconds, value);
      } else {
        await this.client.set(prefixedKey, value);
      }
      logger.debug('Redis SET operation successful', { key: prefixedKey });
    } catch (error) {
      logger.error('Redis SET operation failed', { key, error });
      throw error;
    }
  }

  public async get(key: string): Promise<string | null> {
    try {
      const prefixedKey = `${config.redis.keyPrefix}${key}`;
      const value = await this.client.get(prefixedKey);
      logger.debug('Redis GET operation successful', { key: prefixedKey, found: !!value });
      return value;
    } catch (error) {
      logger.error('Redis GET operation failed', { key, error });
      throw error;
    }
  }

  public async delete(key: string): Promise<number> {
    try {
      const prefixedKey = `${config.redis.keyPrefix}${key}`;
      const result = await this.client.del(prefixedKey);
      logger.debug('Redis DELETE operation successful', { key: prefixedKey, deleted: result });
      return result;
    } catch (error) {
      logger.error('Redis DELETE operation failed', { key, error });
      throw error;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const prefixedKey = `${config.redis.keyPrefix}${key}`;
      const result = await this.client.exists(prefixedKey);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS operation failed', { key, error });
      throw error;
    }
  }

  public async incr(key: string): Promise<number> {
    try {
      const prefixedKey = `${config.redis.keyPrefix}${key}`;
      const result = await this.client.incr(prefixedKey);
      logger.debug('Redis INCR operation successful', { key: prefixedKey, value: result });
      return result;
    } catch (error) {
      logger.error('Redis INCR operation failed', { key, error });
      throw error;
    }
  }

  public async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const prefixedKey = `${config.redis.keyPrefix}${key}`;
      const result = await this.client.expire(prefixedKey, seconds);
      return result;
    } catch (error) {
      logger.error('Redis EXPIRE operation failed', { key, error });
      throw error;
    }
  }

  public async isConnected(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }
}

export const redisClient = RedisClient.getInstance();