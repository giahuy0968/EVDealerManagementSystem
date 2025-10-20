import { publishEvent } from "../config/rabbitmq";

export const publish = async (topic: string, payload: any) => {
  await publishEvent(topic, payload);
};