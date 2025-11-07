import { createClient } from 'redis';
import { config } from './index';
import { logger } from '../utils/logger';

export const redisClient = createClient({
  url: config.redis.url,
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('✅ Redis connected successfully');
});

export async function initializeRedis(): Promise<void> {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('❌ Failed to connect to Redis:', error);
    throw error;
  }
}

export async function closeRedis(): Promise<void> {
  await redisClient.quit();
}
