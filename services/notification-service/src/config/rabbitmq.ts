import { connect } from 'amqplib';
import { config } from './index';
import { logger } from '../utils/logger';

class Rabbit {
  private connection?: any;
  private channel?: any;
  private static instance: Rabbit;

  public static getInstance(): Rabbit {
    if (!Rabbit.instance) Rabbit.instance = new Rabbit();
    return Rabbit.instance;
  }

  public async connect(): Promise<void> {
    this.connection = await connect(config.rabbitmq.url);
    this.channel = await this.connection.createChannel();
    logger.info('Connected to RabbitMQ');
  }

  public async assertQueue(queue: string, options: any = {}): Promise<void> {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');
    await this.channel.assertQueue(queue, { durable: true, ...options });
  }

  public async consume(queue: string, onMessage: (msg: any) => Promise<void>): Promise<void> {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');
    await this.assertQueue(queue);
    this.channel.consume(queue, async (msg: any) => {
      if (!msg) return;
      try {
        await onMessage(msg);
        this.channel!.ack(msg);
      } catch (err) {
        logger.error('Error processing message', { queue, err });
        this.channel!.nack(msg, false, false); // send to dead-letter if configured
      }
    });
  }

  public async publish(queue: string, content: any, options: any = {}): Promise<boolean> {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');
    await this.assertQueue(queue);
    return this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(content)), { persistent: true, ...options });
  }

  public async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}

export const rabbit = Rabbit.getInstance();
