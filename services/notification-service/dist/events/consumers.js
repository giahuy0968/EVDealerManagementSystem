"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConsumers = registerConsumers;
const rabbitmq_1 = require("../config/rabbitmq");
const NotificationService_1 = require("../services/NotificationService");
const service = new NotificationService_1.NotificationService();
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
async function registerConsumers() {
    for (const q of queues) {
        await rabbitmq_1.rabbit.consume(q, async (msg) => {
            const payload = JSON.parse(msg.content.toString());
            // TODO: map payloads to templates per event
            void payload;
            void q;
            // Example: for now, no-op
            return Promise.resolve();
        });
    }
}
