import amqp, { Connection, Channel } from 'amqplib';

export class RabbitMQConfig {
  private static instance: RabbitMQConfig;
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): RabbitMQConfig {
    if (!RabbitMQConfig.instance) {
      RabbitMQConfig.instance = new RabbitMQConfig();
    }
    return RabbitMQConfig.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
      
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      
      await this.setupQueues();
      
      this.isConnected = true;
      console.log('✅ Connected to RabbitMQ');

      this.connection.on('error', (error) => {
        console.error('❌ RabbitMQ connection error:', error);
        this.isConnected = false;
      });

      this.connection.on('close', () => {
        console.log('❌ RabbitMQ connection closed');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ RabbitMQ connection error:', error);
      throw error;
    }
  }

  private async setupQueues(): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await this.channel.assertQueue('order.completed', { durable: true });
    await this.channel.assertQueue('inventory.changed', { durable: true });
    await this.channel.assertQueue('customer.created', { durable: true });
    await this.channel.assertQueue('payment.received', { durable: true });
    await this.channel.assertQueue('forecast.generated', { durable: true });
    await this.channel.assertQueue('report.alert', { durable: true });

    console.log('✅ RabbitMQ queues initialized');
  }

  public getChannel(): Channel {
    if (!this.channel || !this.isConnected) {
      throw new Error('RabbitMQ channel not available');
    }
    return this.channel;
  }

  public async disconnect(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.isConnected = false;
    console.log('✅ RabbitMQ disconnected');
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
