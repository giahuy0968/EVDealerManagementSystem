import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Payment } from '../models/Payment';
import { PaymentStatus } from '../types';

export class PaymentRepository {
  private repository: Repository<Payment>;

  constructor() {
    this.repository = AppDataSource.getRepository(Payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.repository.findOneBy({ id });
  }

  async findByOrderId(orderId: string): Promise<Payment[]> {
    return this.repository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    return this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    const payment = this.repository.create(paymentData);
    return this.repository.save(payment);
  }

  async update(id: string, paymentData: Partial<Payment>): Promise<Payment | null> {
    await this.repository.update(id, paymentData);
    return this.findById(id);
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getTotalPaymentsByOrderId(orderId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.orderId = :orderId', { orderId })
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .getRawOne();
    
    return parseFloat(result?.total || '0');
  }
}
