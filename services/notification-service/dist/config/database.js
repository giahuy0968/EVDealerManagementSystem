"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const pg_1 = require("pg");
const index_1 = require("./index");
const logger_1 = require("../utils/logger");
class Database {
    constructor() {
        const poolConfig = {
            host: index_1.config.database.host,
            port: index_1.config.database.port,
            database: index_1.config.database.database,
            user: index_1.config.database.username,
            password: index_1.config.database.password,
            ssl: index_1.config.database.ssl ? { rejectUnauthorized: false } : false,
            max: index_1.config.database.maxConnections,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        };
        this.pool = new pg_1.Pool(poolConfig);
        this.pool.on('connect', () => logger_1.logger.info('Connected to PostgreSQL database'));
        this.pool.on('error', (err) => {
            logger_1.logger.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }
    static getInstance() {
        if (!Database.instance)
            Database.instance = new Database();
        return Database.instance;
    }
    getPool() { return this.pool; }
    async query(text, params) {
        const start = Date.now();
        try {
            const res = await this.pool.query(text, params);
            const duration = Date.now() - start;
            logger_1.logger.debug('Query executed', { text, duration, rows: res.rowCount });
            return res;
        }
        catch (error) {
            logger_1.logger.error('Database query error', { text, error });
            throw error;
        }
    }
    async close() {
        await this.pool.end();
        logger_1.logger.info('Database connection pool closed');
    }
    async testConnection() {
        try {
            const client = await this.pool.connect();
            const result = await client.query('SELECT NOW()');
            client.release();
            logger_1.logger.info('Database connection test successful', { timestamp: result.rows[0].now });
            return true;
        }
        catch (error) {
            logger_1.logger.error('Database connection test failed', error);
            return false;
        }
    }
}
exports.database = Database.getInstance();
