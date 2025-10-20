import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { AppDataSource } from "./config/database";
import { initRabbitMQ } from "./config/rabbitmq";
import { initRedis } from "./config/redis";
import logger from "./utils/logger";

const PORT = Number(process.env.PORT || 4000);

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    logger.info("Postgres connected");
    await initRabbitMQ();
    logger.info("RabbitMQ connected");
    await initRedis();
    logger.info("Redis connected");

    app.listen(PORT, () => {
      logger.info(`Dealer service listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start service", { err });
    process.exit(1);
  }
}

bootstrap();