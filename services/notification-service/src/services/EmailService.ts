import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../utils/logger';

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: config.email.smtpHost,
    port: config.email.smtpPort,
    secure: config.email.smtpPort === 465,
    auth: config.email.smtpUser ? { user: config.email.smtpUser, pass: config.email.smtpPass } : undefined,
  });

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  addUnsubscribe(html: string, token: string): string {
    const url = `${config.email.unsubscribeBaseUrl}?token=${encodeURIComponent(token)}`;
    const footer = `<div style="margin-top:16px;font-size:12px;color:#888">Nếu bạn không muốn nhận email, bấm <a href="${url}">hủy đăng ký</a>.</div>`;
    return html.includes('</body>') ? html.replace('</body>', `${footer}</body>`) : `${html}${footer}`;
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    const mail = {
      from: config.email.from,
      to,
      subject,
      html,
    };
    const info = await this.transporter.sendMail(mail);
    logger.info('Email sent', { messageId: info.messageId, to });
  }
}
