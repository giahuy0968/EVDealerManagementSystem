import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Quotation } from '../models/Quotation';
import { QuotationStatus } from '../types';

export class QuotationRepository {
  private repository: Repository<Quotation>;

  constructor() {
    this.repository = AppDataSource.getRepository(Quotation);
  }

  async findAll(): Promise<Quotation[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Quotation | null> {
    return this.repository.findOneBy({ id });
  }

  async findByCustomerId(customerId: string): Promise<Quotation[]> {
    return this.repository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: QuotationStatus): Promise<Quotation[]> {
    return this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async create(quotationData: Partial<Quotation>): Promise<Quotation> {
    const quotation = this.repository.create(quotationData);
    return this.repository.save(quotation);
  }

  async update(id: string, quotationData: Partial<Quotation>): Promise<Quotation | null> {
    await this.repository.update(id, quotationData);
    return this.findById(id);
  }

  async updateStatus(id: string, status: QuotationStatus): Promise<Quotation | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findExpiredQuotations(): Promise<Quotation[]> {
    return this.repository
      .createQueryBuilder('quotation')
      .where('quotation.validUntil < :now', { now: new Date() })
      .andWhere('quotation.status != :status', { status: QuotationStatus.EXPIRED })
      .getMany();
  }
}
