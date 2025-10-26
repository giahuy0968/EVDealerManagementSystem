"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const NotificationService_1 = require("../services/NotificationService");
const NotificationRepository_1 = require("../repositories/NotificationRepository");
const router = (0, express_1.Router)();
const service = new NotificationService_1.NotificationService();
const repo = new NotificationRepository_1.NotificationRepository();
const sendSchema = joi_1.default.object({
    channel: joi_1.default.string().valid('EMAIL', 'SMS', 'PUSH').required(),
    recipient: joi_1.default.object({ email: joi_1.default.string().email(), phone: joi_1.default.string(), pushToken: joi_1.default.string(), id: joi_1.default.string().uuid() }).required(),
    templateId: joi_1.default.string().uuid(),
    subject: joi_1.default.string().allow(''),
    content: joi_1.default.string().allow(''),
    variables: joi_1.default.object().unknown(true),
    metadata: joi_1.default.object().unknown(true),
});
router.post('/send', async (req, res) => {
    const { error, value } = sendSchema.validate(req.body);
    if (error)
        return res.status(400).json({ success: false, message: error.message });
    const result = await service.sendSingle(value);
    res.json({ success: true, data: result });
});
router.post('/send-batch', async (req, res) => {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    const results = await service.sendBatch(items);
    res.json({ success: true, results });
});
router.get('/', async (req, res) => {
    const limit = parseInt(String(req.query.limit || '50'), 10);
    const offset = parseInt(String(req.query.offset || '0'), 10);
    const list = await repo.list(limit, offset);
    res.json({ success: true, data: list });
});
router.get('/:id', async (req, res) => {
    const item = await repo.findById(req.params.id);
    if (!item)
        return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
});
router.post('/:id/retry', async (req, res) => {
    const item = await repo.findById(req.params.id);
    if (!item)
        return res.status(404).json({ success: false, message: 'Not found' });
    const result = await service.sendSingle({
        channel: item.type,
        recipient: { email: item.recipient_email || undefined, phone: item.recipient_phone || undefined, id: item.recipient_id || undefined },
        templateId: item.template_id || undefined,
        subject: item.subject || undefined,
        content: item.content,
        variables: {},
        metadata: item.metadata,
    });
    res.json({ success: true, data: result });
});
exports.default = router;
