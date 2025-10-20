import { AppDataSource } from "../config/database";
import { StockRequest } from "../models/entities/stock.entity";
import { carService } from "./carService";
import { publish } from "../events/publisher";

const repo = () => AppDataSource.getRepository(StockRequest);

export const stockService = {
  async create(payload: Partial<StockRequest>) {
    const s = repo().create(payload);
    const saved = await repo().save(s);
    try {
      await publish("stock.requested", { id: saved.id, carId: saved.carId, qty: saved.quantity });
    } catch (e) {
      console.warn("Failed to publish stock.requested", e);
    }
    return saved;
  },
  async approve(id: string) {
    const req = await repo().findOneBy({ id });
    if (!req) throw new Error("Stock request not found");
    if (req.status !== "REQUESTED") throw new Error("Invalid status");
    req.status = "APPROVED";
    await repo().save(req);
    // increase stock on approval
    await carService.adjustStock(req.carId, req.quantity);
    await publish("stock.approved", { id: req.id, carId: req.carId, qty: req.quantity });
    return req;
  },
  async list() {
    return repo().find({ order: { createdAt: "DESC" } });
  },
  async getById(id: string) {
    return repo().findOneBy({ id });
  }
};