"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const NotificationRepository_1 = require("../repositories/NotificationRepository");
const TemplateService_1 = require("./TemplateService");
const EmailService_1 = require("./EmailService");
const SmsService_1 = require("./SmsService");
const PushService_1 = require("./PushService");
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
class NotificationService {
    constructor() {
        this.repo = new NotificationRepository_1.NotificationRepository();
        this.templates = new TemplateService_1.TemplateService();
        this.email = new EmailService_1.EmailService();
        this.sms = new SmsService_1.SmsService();
        this.push = new PushService_1.PushService();
    }
    async rateLimitSms(userId) {
        const key = `sms_rate:${userId}`;
        const countStr = await redis_1.redisClient.get(key);
        const count = countStr ? parseInt(countStr, 10) : 0;
        if (count >= 100) {
            throw Object.assign(new Error('SMS rate limit exceeded (100/hour)'), { status: 429 });
        }
        if (!countStr) {
            await redis_1.redisClient.set(key, '1', 3600);
        }
        else {
            await redis_1.redisClient.incr(key);
        }
    }
    async backoff(attempt) {
        const ms = Math.min(1000 * Math.pow(2, attempt), 30000);
        await new Promise((r) => setTimeout(r, ms));
    }
    async sendSingle(payload) {
        // Prepare content
        let subject = payload.subject ?? '';
        let content = payload.content ?? '';
        if (payload.templateId) {
            const tpl = await this.templates.get(payload.templateId);
            if (!tpl)
                throw Object.assign(new Error('Template not found'), { status: 404 });
            subject = tpl.subject || subject;
            content = this.templates.render(tpl.content, payload.variables || {});
        }
        const record = await this.repo.create({
            type: payload.channel,
            recipient_id: payload.recipient.id,
            recipient_email: payload.recipient.email,
            recipient_phone: payload.recipient.phone,
            template_id: payload.templateId,
            subject,
            content,
            status: 'PENDING',
            metadata: payload.metadata || {},
        });
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                if (payload.channel === 'EMAIL') {
                    const email = payload.recipient.email;
                    if (!email || !this.email.isValidEmail(email))
                        throw new Error('Invalid email');
                    const html = payload.unsubscribeToken ? this.email.addUnsubscribe(content, payload.unsubscribeToken) : content;
                    await this.email.send(email, subject, html);
                }
                else if (payload.channel === 'SMS') {
                    const phone = payload.recipient.phone;
                    if (!phone || !this.sms.isValidPhoneVN(phone))
                        throw new Error('Invalid phone');
                    await this.rateLimitSms(payload.recipient.id || phone);
                    const parts = this.sms.splitMessage(content);
                    for (const part of parts)
                        await this.sms.send(phone, part);
                }
                else if (payload.channel === 'PUSH') {
                    const token = payload.recipient.pushToken;
                    if (!token)
                        throw new Error('Missing push token');
                    await this.push.send(token, subject, content, payload.metadata);
                }
                await this.repo.updateStatus(record.id, 'SENT');
                return record;
            }
            catch (err) {
                logger_1.logger.error('Send attempt failed', { attempt, err: err?.message });
                if (attempt < 2)
                    await this.backoff(attempt);
                else {
                    await this.repo.updateStatus(record.id, 'FAILED', err?.message || 'Unknown error');
                    throw err;
                }
            }
        }
    }
    async sendBatch(items) {
        const results = [];
        for (const item of items) {
            try {
                const r = await this.sendSingle(item);
                results.push({ ok: true, id: r.id });
            }
            catch (e) {
                results.push({ ok: false, error: e?.message });
            }
        }
        return results;
    }
}
exports.NotificationService = NotificationService;
