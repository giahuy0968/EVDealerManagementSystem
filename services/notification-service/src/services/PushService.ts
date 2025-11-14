import { config } from '../config';

export class PushService {
  async send(token: string, title: string, body: string, data?: Record<string, any>): Promise<void> {
    // TODO integrate FCM
    void token; void title; void body; void data; void config;
    return;
  }
}
