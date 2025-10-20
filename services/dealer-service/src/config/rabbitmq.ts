import amqplib from "amqplib";
import logger from "../utils/logger";

let connection: amqplib.Connection | null = null;
let channel: amqplib.Channel | null = null;

export async function initRabbitMQ() {
  const url = process.env.RABBITMQ_URL || "amqp://localhost";
  const conn = await amqplib.connect(url);
  connection = conn as amqplib.Connection;
  const ch = await connection.createChannel();
  channel = ch as amqplib.Channel;

  await channel.assertExchange("events", "topic", { durable: true });
  channel.on("error", (err) => logger.error("Rabbit channel error", { err }));
  return { connection, channel };
}

export async function publishEvent(routingKey: string, payload: any) {
  if (!channel) throw new Error("Rabbit channel not initialized");
  const buffer = Buffer.from(JSON.stringify(payload));
  channel.publish("events", routingKey, buffer, { persistent: true });
}