import amqp from 'amqplib';
import { config } from './index';
import { logger } from '../utils/logger';

let connection: any = null;
let channel: any = null;

export async function initializeRabbitMQ(): Promise<void> {
  try {
    connection = await amqp.connect(config.rabbitmq.url);
    if (connection) {
      channel = await connection.createChannel();
      
      // Declare exchanges
      if (channel) {
        await channel.assertExchange('dealer.events', 'topic', { durable: true });
      }
    }
    
    logger.info('✅ RabbitMQ connected successfully');
  } catch (error) {
    logger.error('❌ Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

export function getChannel(): any {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
}

export async function publishEvent(routingKey: string, data: any): Promise<void> {
  try {
    const ch = getChannel();
    ch.publish(
      'dealer.events',
      routingKey,
      Buffer.from(JSON.stringify(data)),
      { persistent: true }
    );
    logger.info(`📤 Event published: ${routingKey}`);
  } catch (error) {
    logger.error('Failed to publish event:', error);
    throw error;
  }
}

export async function closeRabbitMQ(): Promise<void> {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    logger.info('RabbitMQ connection closed');
  } catch (error) {
    logger.error('Error closing RabbitMQ:', error);
  }
}
