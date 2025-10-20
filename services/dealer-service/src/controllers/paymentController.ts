import { Request, Response, NextFunction } from "express";
import { paymentService } from "../services/paymentService";

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const p = await paymentService.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
};

export const listPayments = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await paymentService.list();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const p = await paymentService.getById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (err) {
    next(err);
  }
};