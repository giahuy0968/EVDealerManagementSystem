import { AppDataSource } from "../config/database";
import { Quotation } from "../models/entities/quotation.entity";

const repo = () => AppDataSource.getRepository(Quotation);

export const quotationService = {
  async create(payload: Partial<Quotation>) {
    const q = repo().create(payload);
    return repo().save(q);
  },
  async list() {
    return repo().find({ order: { createdAt: "DESC" } });
  },
  async getById(id: string) {
    return repo().findOneBy({ id });
  }
};