"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const PreferenceRepository_1 = require("../repositories/PreferenceRepository");
const router = (0, express_1.Router)();
const repo = new PreferenceRepository_1.PreferenceRepository();
const schema = joi_1.default.object({
    email_enabled: joi_1.default.boolean(),
    sms_enabled: joi_1.default.boolean(),
    push_enabled: joi_1.default.boolean(),
    channels: joi_1.default.object().unknown(true),
});
// Assume user id from header X-User-Id for now (gateway/JWT should set it)
function getUserId(req) {
    return req.headers['x-user-id'] || null;
}
router.get('/', async (req, res) => {
    const userId = getUserId(req);
    if (!userId)
        return res.status(401).json({ success: false, message: 'Missing user context' });
    const prefs = await repo.getByUserId(userId);
    res.json({ success: true, data: prefs });
});
router.put('/', async (req, res) => {
    const userId = getUserId(req);
    if (!userId)
        return res.status(401).json({ success: false, message: 'Missing user context' });
    const { error, value } = schema.validate(req.body);
    if (error)
        return res.status(400).json({ success: false, message: error.message });
    const updated = await repo.upsert(userId, value);
    res.json({ success: true, data: updated });
});
exports.default = router;
