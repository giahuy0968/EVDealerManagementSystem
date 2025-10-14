import nodemailer from 'nodemailer';
import { config } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/config';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.auth.user,
      pass: config.email.auth.pass,
    },
  });

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(
    to: string,
    fullName: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"${config.email.from.name}" <${config.email.from.email}>`,
      to,
      subject: 'Password Reset Request - EV Dealer Management System',
      html: this.getPasswordResetTemplate(fullName, resetUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${to}`);
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Send welcome email to new users
   */
  static async sendWelcomeEmail(
    to: string,
    fullName: string,
    username: string,
    tempPassword?: string
  ): Promise<void> {
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;
    
    const mailOptions = {
      from: `"${config.email.from.name}" <${config.email.from.email}>`,
      to,
      subject: 'Welcome to EV Dealer Management System',
      html: this.getWelcomeTemplate(fullName, username, loginUrl, tempPassword),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${to}`);
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  /**
   * Send account locked notification
   */
  static async sendAccountLockedEmail(
    to: string,
    fullName: string,
    lockoutTime: Date
  ): Promise<void> {
    const supportEmail = config.email.from.email;
    
    const mailOptions = {
      from: `"${config.email.from.name}" <${config.email.from.email}>`,
      to,
      subject: 'Account Temporarily Locked - EV Dealer Management System',
      html: this.getAccountLockedTemplate(fullName, lockoutTime, supportEmail),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Account locked email sent to ${to}`);
    } catch (error) {
      console.error('❌ Failed to send account locked email:', error);
      // Don't throw error for notification emails
    }
  }

  /**
   * Send security alert email
   */
  static async sendSecurityAlert(
    to: string,
    fullName: string,
    alertType: string,
    details: string,
    ipAddress?: string
  ): Promise<void> {
    const mailOptions = {
      from: `"${config.email.from.name}" <${config.email.from.email}>`,
      to,
      subject: 'Security Alert - EV Dealer Management System',
      html: this.getSecurityAlertTemplate(fullName, alertType, details, ipAddress),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Security alert email sent to ${to}`);
    } catch (error) {
      console.error('❌ Failed to send security alert email:', error);
      // Don't throw error for notification emails
    }
  }

  /**
   * Test email connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }

  // Email templates

  private static getPasswordResetTemplate(fullName: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${fullName},</h2>
            <p>You have requested to reset your password for your EV Dealer Management System account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EV Dealer Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private static getWelcomeTemplate(
    fullName: string,
    username: string,
    loginUrl: string,
    tempPassword?: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to EVDMS</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .credentials { background: #e5e7eb; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to EVDMS!</h1>
          </div>
          <div class="content">
            <h2>Hello ${fullName},</h2>
            <p>Welcome to the EV Dealer Management System! Your account has been successfully created.</p>
            
            <div class="credentials">
              <h3>Your Login Credentials:</h3>
              <p><strong>Username:</strong> ${username}</p>
              ${tempPassword ? `<p><strong>Temporary Password:</strong> ${tempPassword}</p>` : ''}
            </div>
            
            ${tempPassword ? '<p><strong>Important:</strong> Please change your password after your first login for security reasons.</p>' : ''}
            
            <a href="${loginUrl}" class="button">Login to Your Account</a>
            
            <p>If you have any questions or need assistance, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EV Dealer Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private static getAccountLockedTemplate(
    fullName: string,
    lockoutTime: Date,
    supportEmail: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Account Locked</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .warning { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #f59e0b; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Temporarily Locked</h1>
          </div>
          <div class="content">
            <h2>Hello ${fullName},</h2>
            
            <div class="warning">
              <p><strong>Your account has been temporarily locked due to multiple failed login attempts.</strong></p>
            </div>
            
            <p>Your account will be automatically unlocked at: <strong>${lockoutTime.toLocaleString()}</strong></p>
            
            <p>If you believe this was not you, please contact our support team immediately at <a href="mailto:${supportEmail}">${supportEmail}</a></p>
            
            <p>For your security, we recommend:</p>
            <ul>
              <li>Using a strong, unique password</li>
              <li>Enabling two-factor authentication if available</li>
              <li>Not sharing your login credentials</li>
            </ul>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EV Dealer Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private static getSecurityAlertTemplate(
    fullName: string,
    alertType: string,
    details: string,
    ipAddress?: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Security Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .alert { background: #fef2f2; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc2626; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Security Alert</h1>
          </div>
          <div class="content">
            <h2>Hello ${fullName},</h2>
            
            <div class="alert">
              <h3>Security Alert: ${alertType}</h3>
              <p>${details}</p>
              ${ipAddress ? `<p><strong>IP Address:</strong> ${ipAddress}</p>` : ''}
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p>If this was you, you can ignore this email. If this wasn't you, please:</p>
            <ul>
              <li>Change your password immediately</li>
              <li>Check your account for any unauthorized activity</li>
              <li>Contact our support team</li>
            </ul>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} EV Dealer Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}