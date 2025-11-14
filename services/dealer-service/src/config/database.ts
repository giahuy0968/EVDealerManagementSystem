import { DataSource } from 'typeorm';
import { config } from './index';
import { Car } from '../models/Car';
import { Quotation } from '../models/Quotation';
import { Order } from '../models/Order';
import { StockRequest } from '../models/StockRequest';
import { Contract } from '../models/Contract';
import { Payment } from '../models/Payment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.nodeEnv === 'development', // Auto-create tables in dev
  logging: config.database.logging,
  entities: [Car, Quotation, Order, StockRequest, Contract, Payment],
  migrations: [],
  subscribers: [],
  ssl: false, // No SSL for local Docker PostgreSQL
  extra: {
    max: 10, // Maximum connection pool size
    min: 2, // Minimum connection pool size
    idleTimeoutMillis: 30000, // Close idle connections after 30s
    connectionTimeoutMillis: 5000, // Connection timeout 5s
  },
});

export async function initializeDatabase(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    throw error;
  }
}
