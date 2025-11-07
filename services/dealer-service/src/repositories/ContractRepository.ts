import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Contract } from '../models/Contract';
import { ContractStatus } from '../types';

export class ContractRepository {
  private repository: Repository<Contract>;

  constructor() {
    this.repository = AppDataSource.getRepository(Contract);
  }

  async findAll(): Promise<Contract[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Contract | null> {
    return this.repository.findOneBy({ id });
  }

  async findByContractNumber(contractNumber: string): Promise<Contract | null> {
    return this.repository.findOneBy({ contractNumber });
  }

  async findByOrderId(orderId: string): Promise<Contract[]> {
    return this.repository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCustomerId(customerId: string): Promise<Contract[]> {
    return this.repository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: ContractStatus): Promise<Contract[]> {
    return this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async create(contractData: Partial<Contract>): Promise<Contract> {
    const contract = this.repository.create(contractData);
    return this.repository.save(contract);
  }

  async update(id: string, contractData: Partial<Contract>): Promise<Contract | null> {
    await this.repository.update(id, contractData);
    return this.findById(id);
  }

  async updateStatus(id: string, status: ContractStatus): Promise<Contract | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
