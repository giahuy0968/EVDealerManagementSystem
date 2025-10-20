import { AppDataSource } from "../config/database";
import { Contract } from "../models/entities/contract.entity";

const repo = () => AppDataSource.getRepository(Contract);

export const contractService = {
  async create(payload: Partial<Contract>) {
    const c = repo().create(payload);
    return repo().save(c);
  },
  async list() {
    return repo().find({ order: { createdAt: "DESC" } });
  },
  async getById(id: string) {
    return repo().findOneBy({ id });
  }
};