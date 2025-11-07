import { rabbit } from '../config/rabbitmq';
import { NotificationService } from '../services/NotificationService';

const service = new NotificationService();

const queues = [
  'customer.created',
  'test_drive.scheduled',
  'test_drive.reminder',
  'order.created',
  'order.confirmed',
  'order.ready',
  'order.delivered',
  'payment.received',
  'stock.low',
  'complaint.created',
  'lead.assigned',
  'target.achieved',
  'debt.overdue',
];

export async function registerConsumers() {
  for (const q of queues) {
    await rabbit.consume(q, async (msg) => {
      const payload = JSON.parse(msg.content.toString());
      // TODO: map payloads to templates per event
      void payload; void q;
      // Example: for now, no-op
      return Promise.resolve();
    });
  }
}
