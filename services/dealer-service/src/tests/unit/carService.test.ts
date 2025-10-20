import { CarService } from '../../services/carService';
import { CarDTO } from '../../models/dtos/car.dto';

describe('CarService', () => {
    let carService: CarService;

    beforeEach(() => {
        carService = new CarService();
    });

    describe('createCar', () => {
        it('should create a new car and return the car DTO', async () => {
            const carData = { make: 'Toyota', model: 'Corolla', year: 2021 };
            const carDTO = new CarDTO(carData);
            const createdCar = await carService.createCar(carDTO);
            expect(createdCar).toEqual(carDTO);
        });
    });

    describe('getCar', () => {
        it('should return a car by ID', async () => {
            const carId = '1';
            const car = await carService.getCar(carId);
            expect(car.id).toBe(carId);
        });
    });

    describe('updateCar', () => {
        it('should update a car and return the updated car DTO', async () => {
            const carId = '1';
            const updatedData = { make: 'Toyota', model: 'Camry', year: 2022 };
            const updatedCarDTO = new CarDTO(updatedData);
            const updatedCar = await carService.updateCar(carId, updatedCarDTO);
            expect(updatedCar).toEqual(updatedCarDTO);
        });
    });

    describe('deleteCar', () => {
        it('should delete a car by ID', async () => {
            const carId = '1';
            const result = await carService.deleteCar(carId);
            expect(result).toBe(true);
        });
    });
});