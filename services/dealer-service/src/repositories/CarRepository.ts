import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Car } from '../models/Car';

export class CarRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = AppDataSource.getRepository(Car);
  }

  async findAll(): Promise<Car[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Car | null> {
    return this.repository.findOneBy({ id });
  }

  async findByDealerId(dealerId: string): Promise<Car[]> {
    return this.repository.find({
      where: { dealerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByIds(ids: string[]): Promise<Car[]> {
    return this.repository.findByIds(ids);
  }

  async create(carData: Partial<Car>): Promise<Car> {
    const car = this.repository.create(carData);
    return this.repository.save(car);
  }

  async update(id: string, carData: Partial<Car>): Promise<Car | null> {
    await this.repository.update(id, carData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async updateStock(id: string, quantity: number): Promise<Car | null> {
    const car = await this.findById(id);
    if (!car) return null;
    
    car.stock = quantity;
    return this.repository.save(car);
  }

  async decrementStock(id: string, quantity: number): Promise<Car | null> {
    const car = await this.findById(id);
    if (!car || car.stock < quantity) return null;
    
    car.stock -= quantity;
    return this.repository.save(car);
  }

  async incrementStock(id: string, quantity: number): Promise<Car | null> {
    const car = await this.findById(id);
    if (!car) return null;
    
    car.stock += quantity;
    return this.repository.save(car);
  }
}
