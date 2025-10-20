import { Request, Response, NextFunction } from "express";
import { carService } from "../services/carService";

export const listCars = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await carService.list();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const car = await carService.getById(req.params.id);
    if (!car) return res.status(404).json({ message: "Not found" });
    res.json(car);
  } catch (err) {
    next(err);
  }
};

export const createCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const car = await carService.create(req.body);
    res.status(201).json(car);
  } catch (err) {
    next(err);
  }
};