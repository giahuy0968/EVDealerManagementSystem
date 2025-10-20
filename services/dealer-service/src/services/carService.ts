import { AppDataSource } from "../config/database";
import { Car } from "../models/entities/car.entity";
import { CarCreateDTO } from "../models/dtos/car.dto";

const repo = () => AppDataSource.getRepository(Car);

export const carService = {
  async list() {
    return repo().find();
  },
  async getById(id: string) {
    return repo().findOneBy({ id });
  },
  async create(payload: CarCreateDTO) {
    const car = repo().create(payload as Partial<Car>);
    return repo().save(car);
  },
  async adjustStock(carId: string, delta: number) {
    const car = await repo().findOneBy({ id: carId });
    if (!car) throw new Error("Car not found");
    car.quantity += delta;
    if (car.quantity < 0) throw new Error("Insufficient stock");
    return repo().save(car);
  }
};