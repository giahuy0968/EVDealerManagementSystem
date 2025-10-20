import { DataSource } from "typeorm";
import { Car } from "../models/entities/car.entity";
import { Order } from "../models/entities/order.entity";
import { Quotation } from "../models/entities/quotation.entity";
import { Contract } from "../models/entities/contract.entity";
import { Payment } from "../models/entities/payment.entity";
import { StockRequest } from "../models/entities/stock.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/dealerdb",
  synchronize: true, // turn off in production, use migrations
  logging: false,
  entities: [Car, Order, Quotation, Contract, Payment, StockRequest],
});

export default AppDataSource;