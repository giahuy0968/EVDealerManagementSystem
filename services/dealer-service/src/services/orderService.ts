import { AppDataSource } from "../config/database";
import { Order } from "../models/entities/order.entity";
import { carService } from "./carService";
import { publish } from "../events/publisher";

const repo = () => AppDataSource.getRepository(Order);

export const orderService = {
  async create(orderPayload: { customerId: string; items: { carId: string; qty: number }[] }) {
    const itemsDetailed: { carId: string; qty: number; price: number }[] = [];
    let total = 0;
    for (const it of orderPayload.items) {
      const car = await carService.getById(it.carId);
      if (!car) throw new Error(`Car ${it.carId} not found`);
      if (car.quantity < it.qty) throw new Error(`Insufficient stock for ${car.id}`);
      itemsDetailed.push({ carId: car.id, qty: it.qty, price: Number(car.price) });
      total += Number(car.price) * it.qty;
    }

    for (const it of orderPayload.items) {
      await carService.adjustStock(it.carId, -it.qty);
    }

    const order = repo().create({
      customerId: orderPayload.customerId,
      items: itemsDetailed,
      totalAmount: total,
      status: "CREATED"
    } as Partial<Order>);

    const saved = await repo().save(order);

    try {
      await publish("order.created", { orderId: saved.id, customerId: saved.customerId, total: saved.totalAmount });
    } catch (e) {
      // log warning, do not rollback
      console.warn("Failed to publish order.created", e);
    }

    return saved;
  },

  async findAll() {
    return repo().find({ order: { createdAt: "DESC" } });
  },

  async getById(id: string) {
    return repo().findOneBy({ id });
  }
};