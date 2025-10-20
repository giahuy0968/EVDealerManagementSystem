import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import carRoutes from "./routes/carRoutes";
import orderRoutes from "./routes/orderRoutes";
import quotationRoutes from "./routes/quotationRoutes";
import contractRoutes from "./routes/contractRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import stockRoutes from "./routes/stockRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (_, res) => res.json({ service: "dealer-service", ok: true }));

app.use("/api/v1/cars", carRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/quotations", quotationRoutes);
app.use("/api/v1/contracts", contractRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/stock-requests", stockRoutes);

app.use(errorHandler);

export default app;