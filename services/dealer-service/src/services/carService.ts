import { CarRepository } from '../repositories/CarRepository';
import { Car } from '../models/Car';
import { CarResponseDTO, CarSpecifications, CarCompareResponseDTO } from '../types';
import { logger } from '../utils/logger';

export class CarService {
  private carRepository: CarRepository;

  constructor() {
    this.carRepository = new CarRepository();
  }

  async getAllCars(): Promise<CarResponseDTO[]> {
    const cars = await this.carRepository.findAll();
    return cars.map(this.toResponseDTO);
  }

  async getCarById(id: string): Promise<CarResponseDTO | null> {
    const car = await this.carRepository.findById(id);
    return car ? this.toResponseDTO(car) : null;
  }

  async getCarsByDealerId(dealerId: string): Promise<CarResponseDTO[]> {
    const cars = await this.carRepository.findByDealerId(dealerId);
    return cars.map(this.toResponseDTO);
  }

  async compareCars(carIds: string[]): Promise<CarCompareResponseDTO> {
    const cars = await this.carRepository.findByIds(carIds);
    const carDTOs = cars.map(this.toResponseDTO);

    // Build comparison matrix
    const comparisonMatrix: Record<string, any> = {
      price: carDTOs.map(c => ({ id: c.id, value: c.basePrice })),
      range: carDTOs.map(c => ({ id: c.id, value: c.specifications.range })),
      batteryCapacity: carDTOs.map(c => ({ id: c.id, value: c.specifications.batteryCapacity })),
      seats: carDTOs.map(c => ({ id: c.id, value: c.specifications.seats })),
    };

    return {
      cars: carDTOs,
      comparisonMatrix,
    };
  }

  async createCar(carData: Partial<Car>): Promise<CarResponseDTO> {
    const car = await this.carRepository.create(carData);
    logger.info(`Car created: ${car.id}`);
    return this.toResponseDTO(car);
  }

  async updateCar(id: string, carData: Partial<Car>): Promise<CarResponseDTO | null> {
    const car = await this.carRepository.update(id, carData);
    if (car) {
      logger.info(`Car updated: ${id}`);
      return this.toResponseDTO(car);
    }
    return null;
  }

  async deleteCar(id: string): Promise<boolean> {
    const result = await this.carRepository.delete(id);
    if (result) {
      logger.info(`Car deleted: ${id}`);
    }
    return result;
  }

  async updateStock(id: string, quantity: number): Promise<CarResponseDTO | null> {
    const car = await this.carRepository.updateStock(id, quantity);
    return car ? this.toResponseDTO(car) : null;
  }

  private toResponseDTO(car: Car): CarResponseDTO {
    let specifications: CarSpecifications;
    try {
      specifications = JSON.parse(car.specificationsJson);
    } catch {
      specifications = {
        batteryCapacity: '',
        range: '',
        maxSpeed: '',
        acceleration: '',
        chargingTime: '',
        seats: 0,
        transmission: '',
      };
    }

    return {
      id: car.id,
      name: car.name,
      model: car.model,
      version: car.version,
      year: car.year,
      basePrice: Number(car.basePrice),
      colors: car.colors,
      specifications,
      images: car.images || [],
      stock: car.stock,
      dealerId: car.dealerId,
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
    };
  }
}
