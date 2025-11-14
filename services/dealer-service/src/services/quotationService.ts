import { QuotationRepository } from '../repositories/QuotationRepository';
import { CarRepository } from '../repositories/CarRepository';
import { Quotation } from '../models/Quotation';
import { QuotationCreateDTO, QuotationResponseDTO, QuotationStatus, PromotionDTO } from '../types';
import { logger } from '../utils/logger';

export class QuotationService {
  private quotationRepository: QuotationRepository;
  private carRepository: CarRepository;

  constructor() {
    this.quotationRepository = new QuotationRepository();
    this.carRepository = new CarRepository();
  }

  async getAllQuotations(): Promise<QuotationResponseDTO[]> {
    const quotations = await this.quotationRepository.findAll();
    return quotations.map(this.toResponseDTO);
  }

  async getQuotationById(id: string): Promise<QuotationResponseDTO | null> {
    const quotation = await this.quotationRepository.findById(id);
    return quotation ? this.toResponseDTO(quotation) : null;
  }

  async getQuotationsByCustomerId(customerId: string): Promise<QuotationResponseDTO[]> {
    const quotations = await this.quotationRepository.findByCustomerId(customerId);
    return quotations.map(this.toResponseDTO);
  }

  async createQuotation(data: QuotationCreateDTO, customerName: string): Promise<QuotationResponseDTO> {
    // Get car details
    const car = await this.carRepository.findById(data.carModelId);
    if (!car) {
      throw new Error('Car not found');
    }

    // Calculate prices
    const basePrice = Number(car.basePrice);
    let totalDiscount = 0;

    if (data.promotions && data.promotions.length > 0) {
      totalDiscount = data.promotions.reduce((sum, promo) => sum + promo.discount, 0);
    }

    const finalPrice = basePrice - totalDiscount;

    const quotation = await this.quotationRepository.create({
      customerId: data.customerId,
      customerName,
      carModelId: data.carModelId,
      carModelName: car.name,
      basePrice,
      promotionsJson: data.promotions ? JSON.stringify(data.promotions) : undefined,
      finalPrice,
      validUntil: new Date(data.validUntil),
      note: data.note,
      status: QuotationStatus.DRAFT,
    });

    logger.info(`Quotation created: ${quotation.id} for customer ${customerName}`);
    return this.toResponseDTO(quotation);
  }

  async updateQuotation(id: string, data: Partial<QuotationCreateDTO>): Promise<QuotationResponseDTO | null> {
    const updateData: Partial<Quotation> = {};

    if (data.validUntil) {
      updateData.validUntil = new Date(data.validUntil);
    }
    if (data.note !== undefined) {
      updateData.note = data.note;
    }
    if (data.promotions) {
      updateData.promotionsJson = JSON.stringify(data.promotions);
      
      // Recalculate final price
      const quotation = await this.quotationRepository.findById(id);
      if (quotation) {
        const totalDiscount = data.promotions.reduce((sum, promo) => sum + promo.discount, 0);
        updateData.finalPrice = Number(quotation.basePrice) - totalDiscount;
      }
    }

    const quotation = await this.quotationRepository.update(id, updateData);
    if (quotation) {
      logger.info(`Quotation updated: ${id}`);
      return this.toResponseDTO(quotation);
    }
    return null;
  }

  async updateQuotationStatus(id: string, status: QuotationStatus): Promise<QuotationResponseDTO | null> {
    const quotation = await this.quotationRepository.updateStatus(id, status);
    if (quotation) {
      logger.info(`Quotation status updated: ${id} -> ${status}`);
      return this.toResponseDTO(quotation);
    }
    return null;
  }

  async deleteQuotation(id: string): Promise<boolean> {
    const result = await this.quotationRepository.delete(id);
    if (result) {
      logger.info(`Quotation deleted: ${id}`);
    }
    return result;
  }

  private toResponseDTO(quotation: Quotation): QuotationResponseDTO {
    let promotions: PromotionDTO[] = [];
    if (quotation.promotionsJson) {
      try {
        promotions = JSON.parse(quotation.promotionsJson);
      } catch (e) {
        logger.error('Failed to parse promotions JSON', e);
      }
    }

    return {
      id: quotation.id,
      customerId: quotation.customerId,
      customerName: quotation.customerName,
      carModelId: quotation.carModelId,
      carModelName: quotation.carModelName,
      basePrice: Number(quotation.basePrice),
      promotions,
      finalPrice: Number(quotation.finalPrice),
      validUntil: quotation.validUntil.toISOString(),
      status: quotation.status,
      note: quotation.note,
      createdAt: quotation.createdAt.toISOString(),
      updatedAt: quotation.updatedAt.toISOString(),
    };
  }
}
