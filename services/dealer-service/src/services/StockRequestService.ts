import { StockRequestRepository } from '../repositories/StockRequestRepository';
import { CarRepository } from '../repositories/CarRepository';
import { StockRequest } from '../models/StockRequest';
import { StockRequestCreateDTO, StockRequestResponseDTO, StockRequestStatus } from '../types';
import { logger } from '../utils/logger';
import { publishEvent } from '../config/rabbitmq';

export class StockRequestService {
  private stockRequestRepository: StockRequestRepository;
  private carRepository: CarRepository;

  constructor() {
    this.stockRequestRepository = new StockRequestRepository();
    this.carRepository = new CarRepository();
  }

  async getAllStockRequests(): Promise<StockRequestResponseDTO[]> {
    const requests = await this.stockRequestRepository.findAll();
    return requests.map(this.toResponseDTO);
  }

  async getStockRequestById(id: string): Promise<StockRequestResponseDTO | null> {
    const request = await this.stockRequestRepository.findById(id);
    return request ? this.toResponseDTO(request) : null;
  }

  async getStockRequestsByDealerId(dealerId: string): Promise<StockRequestResponseDTO[]> {
    const requests = await this.stockRequestRepository.findByDealerId(dealerId);
    return requests.map(this.toResponseDTO);
  }

  async createStockRequest(data: StockRequestCreateDTO, dealerName: string): Promise<StockRequestResponseDTO> {
    // Get car details
    const car = await this.carRepository.findById(data.carModelId);
    if (!car) {
      throw new Error('Car not found');
    }

    const request = await this.stockRequestRepository.create({
      dealerId: data.dealerId,
      dealerName,
      carModelId: data.carModelId,
      carModelName: car.name,
      quantity: data.quantity,
      urgency: data.urgency,
      expectedDate: new Date(data.expectedDate),
      reason: data.reason,
      status: StockRequestStatus.PENDING,
    });

    logger.info(`Stock request created: ${request.requestNumber} by dealer ${dealerName}`);

    // Publish event to manufacturer service
    await publishEvent('stock.request.created', {
      requestId: request.id,
      requestNumber: request.requestNumber,
      dealerId: request.dealerId,
      carModelId: request.carModelId,
      quantity: request.quantity,
      urgency: request.urgency,
    });

    return this.toResponseDTO(request);
  }

  async updateStockRequestStatus(id: string, status: StockRequestStatus): Promise<StockRequestResponseDTO | null> {
    const request = await this.stockRequestRepository.updateStatus(id, status);
    if (request) {
      logger.info(`Stock request status updated: ${request.requestNumber} -> ${status}`);

      // Publish event
      await publishEvent('stock.request.status.updated', {
        requestId: request.id,
        requestNumber: request.requestNumber,
        status,
      });

      return this.toResponseDTO(request);
    }
    return null;
  }

  async deleteStockRequest(id: string): Promise<boolean> {
    const result = await this.stockRequestRepository.delete(id);
    if (result) {
      logger.info(`Stock request deleted: ${id}`);
    }
    return result;
  }

  private toResponseDTO(request: StockRequest): StockRequestResponseDTO {
    return {
      id: request.id,
      requestNumber: request.requestNumber,
      dealerId: request.dealerId,
      dealerName: request.dealerName,
      carModelId: request.carModelId,
      carModelName: request.carModelName,
      quantity: request.quantity,
      urgency: request.urgency,
      expectedDate: request.expectedDate instanceof Date 
        ? request.expectedDate.toISOString().split('T')[0]
        : String(request.expectedDate).split('T')[0],
      status: request.status,
      reason: request.reason,
      createdAt: request.createdAt instanceof Date 
        ? request.createdAt.toISOString()
        : String(request.createdAt),
      updatedAt: request.updatedAt instanceof Date 
        ? request.updatedAt.toISOString()
        : String(request.updatedAt),
    };
  }
}
