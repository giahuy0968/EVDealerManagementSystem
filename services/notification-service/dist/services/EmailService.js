"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: config_1.config.email.smtpHost,
            port: config_1.config.email.smtpPort,
            secure: config_1.config.email.smtpPort === 465,
            auth: config_1.config.email.smtpUser ? { user: config_1.config.email.smtpUser, pass: config_1.config.email.smtpPass } : undefined,
        });
    }
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    addUnsubscribe(html, token) {
        const url = `${config_1.config.email.unsubscribeBaseUrl}?token=${encodeURIComponent(token)}`;
        const footer = `<div style="margin-top:16px;font-size:12px;color:#888">Nếu bạn không muốn nhận email, bấm <a href="${url}">hủy đăng ký</a>.</div>`;
        return html.includes('</body>') ? html.replace('</body>', `${footer}</body>`) : `${html}${footer}`;
    }
    async send(to, subject, html) {
        const mail = {
            from: config_1.config.email.from,
            to,
            subject,
            html,
        };
        const info = await this.transporter.sendMail(mail);
        logger_1.logger.info('Email sent', { messageId: info.messageId, to });
    }
}
exports.EmailService = EmailService;
