import { Request, Response, NextFunction } from 'express';
import { CarService } from '../services/CarService';
import { logger } from '../utils/logger';

export class CarController {
  private carService: CarService;

  constructor() {
    this.carService = new CarService();
  }

  getCars = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dealerId } = req.query;

      let cars;
      if (dealerId) {
        cars = await this.carService.getCarsByDealerId(dealerId as string);
      } else {
        cars = await this.carService.getAllCars();
      }

      res.json({
        success: true,
        data: cars,
      });
    } catch (error) {
      next(error);
    }
  };

  getCarById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const car = await this.carService.getCarById(id);

      if (!car) {
        res.status(404).json({
          success: false,
          error: {
            code: 'CAR_NOT_FOUND',
            message: 'Car not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: car,
      });
    } catch (error) {
      next(error);
    }
  };

  compareCars = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { carIds } = req.body;

      if (!Array.isArray(carIds) || carIds.length < 2) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_COMPARISON',
            message: 'At least 2 car IDs are required for comparison',
          },
        });
        return;
      }

      const comparison = await this.carService.compareCars(carIds);

      res.json({
        success: true,
        data: comparison,
      });
    } catch (error) {
      next(error);
    }
  };

  createCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const carData = {
        ...req.body,
        specificationsJson: JSON.stringify(req.body.specifications),
      };
      delete carData.specifications;

      const car = await this.carService.createCar(carData);

      res.status(201).json({
        success: true,
        data: car,
      });
    } catch (error) {
      next(error);
    }
  };

  updateCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const carData = { ...req.body };
      if (req.body.specifications) {
        carData.specificationsJson = JSON.stringify(req.body.specifications);
        delete carData.specifications;
      }

      const car = await this.carService.updateCar(id, carData);

      if (!car) {
        res.status(404).json({
          success: false,
          error: {
            code: 'CAR_NOT_FOUND',
            message: 'Car not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: car,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.carService.deleteCar(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: {
            code: 'CAR_NOT_FOUND',
            message: 'Car not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Car deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  updateStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const car = await this.carService.updateStock(id, quantity);

      if (!car) {
        res.status(404).json({
          success: false,
          error: {
            code: 'CAR_NOT_FOUND',
            message: 'Car not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: car,
      });
    } catch (error) {
      next(error);
    }
  };
}
