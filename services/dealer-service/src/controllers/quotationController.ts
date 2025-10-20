import { Request, Response, NextFunction } from "express";
import { quotationService } from "../services/quotationService";

export const createQuotation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = await quotationService.create(req.body);
    res.status(201).json(q);
  } catch (err) {
    next(err);
  }
};

export const listQuotations = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await quotationService.list();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getQuotation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = await quotationService.getById(req.params.id);
    if (!q) return res.status(404).json({ message: "Not found" });
    res.json(q);
  } catch (err) {
    next(err);
  }
};