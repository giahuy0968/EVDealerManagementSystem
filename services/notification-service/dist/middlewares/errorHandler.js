"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const logger_1 = require("../utils/logger");
function notFoundHandler(req, res, _next) {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
}
function errorHandler(err, _req, res, _next) {
    logger_1.logger.error('Unhandled error', { err });
    const status = err.status || 500;
    res.status(status).json({ success: false, message: err.message || 'Internal Server Error' });
}
