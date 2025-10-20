import amqplib from "amqplib";
import logger from "../utils/logger";

export const startSubscriber = async (url?: string) => {
  const conn = await amqplib.connect(url || process.env.RABBITMQ_URL || "amqp://localhost");
  const ch = await conn.createChannel();
  await ch.assertExchange("events", "topic", { durable: true });
  const q = await ch.assertQueue("", { exclusive: true });
  // subscribe to relevant topics if needed
  await ch.bindQueue(q.queue, "events", "allocation.*");
  ch.consume(q.queue, (msg) => {
    if (!msg) return;
    try {
      const content = JSON.parse(msg.content.toString());
      logger.info("Received event", { routingKey: msg.fields.routingKey, content });
    } catch (e) {
      logger.error("Failed to parse message", { err: e });
    } finally {
      ch.ack(msg);
    }
  });
  logger.info("Subscriber started");
};