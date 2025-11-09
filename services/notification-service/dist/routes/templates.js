"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const TemplateService_1 = require("../services/TemplateService");
const router = (0, express_1.Router)();
const service = new TemplateService_1.TemplateService();
const baseSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    type: joi_1.default.string().valid('EMAIL', 'SMS', 'PUSH').required(),
    subject: joi_1.default.string().allow(null, ''),
    content: joi_1.default.string().required(),
    variables: joi_1.default.array().items(joi_1.default.string()).default([]),
    is_active: joi_1.default.boolean().default(true),
});
router.get('/', async (_req, res) => {
    res.json({ success: true, data: await service.list() });
});
router.post('/', async (req, res) => {
    const { error, value } = baseSchema.validate(req.body);
    if (error)
        return res.status(400).json({ success: false, message: error.message });
    const created = await service.create(value);
    res.status(201).json({ success: true, data: created });
});
router.put('/:id', async (req, res) => {
    const { error, value } = baseSchema.min(1).validate(req.body);
    if (error)
        return res.status(400).json({ success: false, message: error.message });
    const updated = await service.update(req.params.id, value);
    if (!updated)
        return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: updated });
});
router.delete('/:id', async (req, res) => {
    const ok = await service.delete(req.params.id);
    if (!ok)
        return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
});
exports.default = router;
