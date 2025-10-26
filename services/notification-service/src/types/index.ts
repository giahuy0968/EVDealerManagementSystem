export enum NotificationType {
  // Customer-facing
  WELCOME_EMAIL = 'WELCOME_EMAIL',
  TEST_DRIVE_CONFIRMATION = 'TEST_DRIVE_CONFIRMATION',
  TEST_DRIVE_REMINDER = 'TEST_DRIVE_REMINDER',
  QUOTATION_SENT = 'QUOTATION_SENT',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  ORDER_READY = 'ORDER_READY',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  CONTRACT_SIGNED = 'CONTRACT_SIGNED',
  
  // Staff-facing
  NEW_LEAD_ASSIGNED = 'NEW_LEAD_ASSIGNED',
  TEST_DRIVE_SCHEDULED = 'TEST_DRIVE_SCHEDULED',
  ORDER_CREATED = 'ORDER_CREATED',
  STOCK_LOW = 'STOCK_LOW',
  CUSTOMER_COMPLAINT = 'CUSTOMER_COMPLAINT',
  
  // Manager-facing
  DAILY_SALES_REPORT = 'DAILY_SALES_REPORT',
  WEEKLY_SUMMARY = 'WEEKLY_SUMMARY',
  MONTHLY_REPORT = 'MONTHLY_REPORT',
  TARGET_ACHIEVED = 'TARGET_ACHIEVED',
  DEBT_OVERDUE = 'DEBT_OVERDUE',
  
  // Manufacturer-facing
  STOCK_REQUEST_CREATED = 'STOCK_REQUEST_CREATED',
  DEALER_SUSPENDED = 'DEALER_SUSPENDED',
  NEW_DEALER_REGISTERED = 'NEW_DEALER_REGISTERED',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

export interface Notification {
  id: string;
  type: NotificationChannel;
  notification_type?: NotificationType;
  recipient_id?: string;
  recipient_email?: string;
  recipient_phone?: string;
  template_id?: string;
  subject: string;
  content: string;
  status: NotificationStatus;
  sent_at?: Date;
  delivered_at?: Date;
  read_at?: Date;
  error_message?: string;
  metadata?: Record<string, any>;
  retry_count?: number;
  created_at: Date;
  updated_at?: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationChannel;
  subject?: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  channels: {
    order_updates?: string[];
    promotions?: string[];
    system_alerts?: string[];
    [key: string]: string[] | undefined;
  };
  created_at: Date;
  updated_at?: Date;
}

export interface SendNotificationRequest {
  type: NotificationChannel;
  notification_type?: NotificationType;
  recipient_id?: string;
  recipient_email?: string;
  recipient_phone?: string;
  template_id?: string;
  subject?: string;
  content?: string;
  metadata?: Record<string, any>;
  priority?: 'urgent' | 'normal' | 'low';
}

export interface BatchNotificationRequest {
  notifications: SendNotificationRequest[];
}
