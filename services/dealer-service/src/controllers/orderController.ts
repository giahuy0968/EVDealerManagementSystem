import { Request, Response, NextFunction } from "express";
import { orderService } from "../services/orderService";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const order = await orderService.create(payload);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const listOrders = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await orderService.findAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ord = await orderService.getById(req.params.id);
    if (!ord) return res.status(404).json({ message: "Not found" });
    res.json(ord);
  } catch (err) {
    next(err);
  }
};