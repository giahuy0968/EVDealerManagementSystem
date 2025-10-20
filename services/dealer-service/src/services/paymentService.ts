import { AppDataSource } from "../config/database";
import { Payment } from "../models/entities/payment.entity";
import { publish } from "../events/publisher";

const repo = () => AppDataSource.getRepository(Payment);

export const paymentService = {
  async create(payload: Partial<Payment>) {
    const p = repo().create(payload);
    const saved = await repo().save(p);
    try {
      await publish("payment.created", { paymentId: saved.id, orderId: saved.orderId, amount: saved.amount });
    } catch (e) {
      console.warn("Failed to publish payment.created", e);
    }
    return saved;
  },
  async list() {
    return repo().find({ order: { createdAt: "DESC" } });
  },
  async getById(id: string) {
    return repo().findOneBy({ id });
  }
};