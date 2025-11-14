"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbit = void 0;
const amqplib_1 = require("amqplib");
const index_1 = require("./index");
const logger_1 = require("../utils/logger");
class Rabbit {
    static getInstance() {
        if (!Rabbit.instance)
            Rabbit.instance = new Rabbit();
        return Rabbit.instance;
    }
    async connect() {
        this.connection = await (0, amqplib_1.connect)(index_1.config.rabbitmq.url);
        this.channel = await this.connection.createChannel();
        logger_1.logger.info('Connected to RabbitMQ');
    }
    async assertQueue(queue, options = {}) {
        if (!this.channel)
            throw new Error('RabbitMQ channel not initialized');
        await this.channel.assertQueue(queue, { durable: true, ...options });
    }
    async consume(queue, onMessage) {
        if (!this.channel)
            throw new Error('RabbitMQ channel not initialized');
        await this.assertQueue(queue);
        this.channel.consume(queue, async (msg) => {
            if (!msg)
                return;
            try {
                await onMessage(msg);
                this.channel.ack(msg);
            }
            catch (err) {
                logger_1.logger.error('Error processing message', { queue, err });
                this.channel.nack(msg, false, false); // send to dead-letter if configured
            }
        });
    }
    async publish(queue, content, options = {}) {
        if (!this.channel)
            throw new Error('RabbitMQ channel not initialized');
        await this.assertQueue(queue);
        return this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(content)), { persistent: true, ...options });
    }
    async close() {
        await this.channel?.close();
        await this.connection?.close();
    }
}
exports.rabbit = Rabbit.getInstance();
