"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const index_1 = require("./index");
const logger_1 = require("../utils/logger");
class RedisClient {
    constructor() {
        this.client = (0, redis_1.createClient)({ url: index_1.config.redis.url });
        this.client.on('connect', () => logger_1.logger.info('Connected to Redis'));
        this.client.on('error', (err) => logger_1.logger.error('Redis client error:', err));
    }
    static getInstance() {
        if (!RedisClient.instance)
            RedisClient.instance = new RedisClient();
        return RedisClient.instance;
    }
    async connect() { await this.client.connect(); }
    async disconnect() { await this.client.quit(); }
    getClient() { return this.client; }
    key(k) { return `${index_1.config.redis.keyPrefix}${k}`; }
    async set(key, value, expireInSeconds) {
        const k = this.key(key);
        if (expireInSeconds)
            await this.client.setEx(k, expireInSeconds, value);
        else
            await this.client.set(k, value);
    }
    async get(key) { return this.client.get(this.key(key)); }
    async delete(key) { return this.client.del(this.key(key)); }
    async exists(key) { return (await this.client.exists(this.key(key))) === 1; }
    async incr(key) { return this.client.incr(this.key(key)); }
    async expire(key, seconds) { return this.client.expire(this.key(key), seconds); }
    async isConnected() { try {
        await this.client.ping();
        return true;
    }
    catch {
        return false;
    } }
}
exports.redisClient = RedisClient.getInstance();
