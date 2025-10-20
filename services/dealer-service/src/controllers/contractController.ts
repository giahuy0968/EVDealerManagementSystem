import { Request, Response, NextFunction } from "express";
import { contractService } from "../services/contractService";

export const createContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const c = await contractService.create(req.body);
    res.status(201).json(c);
  } catch (err) {
    next(err);
  }
};

export const listContracts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await contractService.list();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const c = await contractService.getById(req.params.id);
    if (!c) return res.status(404).json({ message: "Not found" });
    res.json(c);
  } catch (err) {
    next(err);
  }
};