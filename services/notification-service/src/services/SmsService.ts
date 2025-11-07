import { config } from '../config';

export class SmsService {
  isValidPhoneVN(phone: string): boolean {
    // Accept formats: +84xxxxxxxxx or 0xxxxxxxxx with 9-10 digits after leading 0
    return /^(\+84|0)[0-9]{9,10}$/.test(phone);
  }

  splitMessage(text: string, limit = 160): string[] {
    if (text.length <= limit) return [text];
    const parts: string[] = [];
    let i = 0;
    while (i < text.length) {
      parts.push(text.slice(i, i + limit));
      i += limit;
    }
    return parts;
  }

  async send(to: string, text: string): Promise<void> {
    // For now, stub provider; integrate Twilio/esms later
    // Simulate send ok
    void to; void text; void config;
    return;
  }
}
