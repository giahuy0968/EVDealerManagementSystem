import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { StockRequest } from '../models/StockRequest';
import { StockRequestStatus } from '../types';

export class StockRequestRepository {
  private repository: Repository<StockRequest>;

  constructor() {
    this.repository = AppDataSource.getRepository(StockRequest);
  }

  async findAll(): Promise<StockRequest[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<StockRequest | null> {
    return this.repository.findOneBy({ id });
  }

  async findByRequestNumber(requestNumber: string): Promise<StockRequest | null> {
    return this.repository.findOneBy({ requestNumber });
  }

  async findByDealerId(dealerId: string): Promise<StockRequest[]> {
    return this.repository.find({
      where: { dealerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: StockRequestStatus): Promise<StockRequest[]> {
    return this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async create(requestData: Partial<StockRequest>): Promise<StockRequest> {
    const request = this.repository.create(requestData);
    return this.repository.save(request);
  }

  async update(id: string, requestData: Partial<StockRequest>): Promise<StockRequest | null> {
    await this.repository.update(id, requestData);
    return this.findById(id);
  }

  async updateStatus(id: string, status: StockRequestStatus): Promise<StockRequest | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
