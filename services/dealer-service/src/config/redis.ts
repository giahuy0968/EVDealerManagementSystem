import Redis from "ioredis";

let client: Redis | null = null;

export async function initRedis() {
  const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";
  client = new Redis(url);
  await client.ping();
  return client;
}

export function getRedis() {
  if (!client) throw new Error("Redis not initialized");
  return client;
}