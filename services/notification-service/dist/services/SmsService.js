"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const config_1 = require("../config");
class SmsService {
    isValidPhoneVN(phone) {
        // Accept formats: +84xxxxxxxxx or 0xxxxxxxxx with 9-10 digits after leading 0
        return /^(\+84|0)[0-9]{9,10}$/.test(phone);
    }
    splitMessage(text, limit = 160) {
        if (text.length <= limit)
            return [text];
        const parts = [];
        let i = 0;
        while (i < text.length) {
            parts.push(text.slice(i, i + limit));
            i += limit;
        }
        return parts;
    }
    async send(to, text) {
        // For now, stub provider; integrate Twilio/esms later
        // Simulate send ok
        void to;
        void text;
        void config_1.config;
        return;
    }
}
exports.SmsService = SmsService;
