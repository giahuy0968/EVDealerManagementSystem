import { ContractRepository } from '../repositories/ContractRepository';
import { OrderRepository } from '../repositories/OrderRepository';
import { Contract } from '../models/Contract';
import { ContractCreateDTO, ContractResponseDTO, ContractStatus } from '../types';
import { logger } from '../utils/logger';

export class ContractService {
  private contractRepository: ContractRepository;
  private orderRepository: OrderRepository;

  constructor() {
    this.contractRepository = new ContractRepository();
    this.orderRepository = new OrderRepository();
  }

  async getAllContracts(): Promise<ContractResponseDTO[]> {
    const contracts = await this.contractRepository.findAll();
    return contracts.map(this.toResponseDTO);
  }

  async getContractById(id: string): Promise<ContractResponseDTO | null> {
    const contract = await this.contractRepository.findById(id);
    return contract ? this.toResponseDTO(contract) : null;
  }

  async getContractsByOrderId(orderId: string): Promise<ContractResponseDTO[]> {
    const contracts = await this.contractRepository.findByOrderId(orderId);
    return contracts.map(this.toResponseDTO);
  }

  async getContractsByCustomerId(customerId: string): Promise<ContractResponseDTO[]> {
    const contracts = await this.contractRepository.findByCustomerId(customerId);
    return contracts.map(this.toResponseDTO);
  }

  async createContract(data: ContractCreateDTO, customerName: string): Promise<ContractResponseDTO> {
    // Verify order exists
    const order = await this.orderRepository.findById(data.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const contract = await this.contractRepository.create({
      orderId: data.orderId,
      customerId: data.customerId,
      customerName,
      contractType: data.contractType,
      terms: data.terms,
      validFrom: new Date(data.validFrom),
      validTo: new Date(data.validTo),
      status: ContractStatus.DRAFT,
    });

    logger.info(`Contract created: ${contract.contractNumber} for customer ${customerName}`);
    return this.toResponseDTO(contract);
  }

  async updateContract(id: string, data: Partial<ContractCreateDTO>): Promise<ContractResponseDTO | null> {
    const updateData: Partial<Contract> = {};

    if (data.contractType) updateData.contractType = data.contractType;
    if (data.terms) updateData.terms = data.terms;
    if (data.validFrom) updateData.validFrom = new Date(data.validFrom);
    if (data.validTo) updateData.validTo = new Date(data.validTo);

    const contract = await this.contractRepository.update(id, updateData);
    if (contract) {
      logger.info(`Contract updated: ${id}`);
      return this.toResponseDTO(contract);
    }
    return null;
  }

  async updateContractStatus(id: string, status: ContractStatus): Promise<ContractResponseDTO | null> {
    const updateData: Partial<Contract> = { status };

    if (status === ContractStatus.ACTIVE) {
      updateData.signedDate = new Date();
    }

    const contract = await this.contractRepository.update(id, updateData);
    if (contract) {
      logger.info(`Contract status updated: ${id} -> ${status}`);
      return this.toResponseDTO(contract);
    }
    return null;
  }

  async deleteContract(id: string): Promise<boolean> {
    const result = await this.contractRepository.delete(id);
    if (result) {
      logger.info(`Contract deleted: ${id}`);
    }
    return result;
  }

  private toResponseDTO(contract: Contract): ContractResponseDTO {
    const validFrom = contract.validFrom instanceof Date 
      ? contract.validFrom 
      : new Date(contract.validFrom);
    const validTo = contract.validTo instanceof Date 
      ? contract.validTo 
      : new Date(contract.validTo);
    
    return {
      id: contract.id,
      contractNumber: contract.contractNumber,
      orderId: contract.orderId,
      customerId: contract.customerId,
      customerName: contract.customerName,
      contractType: contract.contractType,
      terms: contract.terms,
      validFrom: validFrom.toISOString().split('T')[0],
      validTo: validTo.toISOString().split('T')[0],
      status: contract.status,
      signedDate: contract.signedDate?.toISOString(),
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString(),
    };
  }
}
