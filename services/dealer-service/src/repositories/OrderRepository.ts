import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Order } from '../models/Order';
import { OrderStatus } from '../types';

export class OrderRepository {
  private repository: Repository<Order>;

  constructor() {
    this.repository = AppDataSource.getRepository(Order);
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Order | null> {
    return this.repository.findOneBy({ id });
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    return this.repository.findOneBy({ orderNumber });
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    return this.repository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async create(orderData: Partial<Order>): Promise<Order> {
    const order = this.repository.create(orderData);
    return this.repository.save(order);
  }

  async update(id: string, orderData: Partial<Order>): Promise<Order | null> {
    await this.repository.update(id, orderData);
    return this.findById(id);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getTotalRevenue(): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status = :status', { status: OrderStatus.COMPLETED })
      .getRawOne();
    
    return parseFloat(result?.total || '0');
  }

  async getOrderCountByStatus(): Promise<Record<string, number>> {
    const results = await this.repository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();
    
    const counts: Record<string, number> = {};
    results.forEach((r) => {
      counts[r.status] = parseInt(r.count, 10);
    });
    
    return counts;
  }
}
