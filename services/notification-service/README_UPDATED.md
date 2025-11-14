# Notification Service

The Notification Service handles all email, SMS, and push notifications for the EVDMS platform. It provides template management, user preferences, and delivery tracking.

## Features

- ✅ Multi-channel notifications (Email, SMS, Push, In-App)
- ✅ Template management with variable substitution
- ✅ User notification preferences
- ✅ Retry mechanism with exponential backoff
- ✅ Rate limiting (100 SMS/hour per user)
- ✅ Delivery tracking and status monitoring
- ✅ RabbitMQ event consumption
- ✅ Email validation and phone number validation
- ✅ Unsubscribe functionality

## Endpoints

### Notifications

- `POST /api/v1/notifications/send` - Send a single notification
- `POST /api/v1/notifications/send-batch` - Send multiple notifications
- `GET /api/v1/notifications` - Get notification history
- `GET /api/v1/notifications/:id` - Get notification details
- `POST /api/v1/notifications/:id/retry` - Retry failed notification

### Templates

- `GET /api/v1/notifications/templates` - List all templates
- `POST /api/v1/notifications/templates` - Create new template
- `PUT /api/v1/notifications/templates/:id` - Update template
- `DELETE /api/v1/notifications/templates/:id` - Delete template

### Preferences

- `GET /api/v1/notifications/preferences?user_id=xxx` - Get user preferences
- `PUT /api/v1/notifications/preferences` - Update user preferences

## Environment Variables

```env
# Server
PORT=3006
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evdms
DB_USER=evdms_user
DB_PASSWORD=evdms_password

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Redis
REDIS_URL=redis://localhost:6379

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@evdms.com

# SMS (Twilio)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM=+1234567890
SMS_RATE_LIMIT_PER_HOUR=100

# Push Notifications (FCM)
FCM_SERVER_KEY=your-fcm-server-key
```

## Database Setup

```bash
# Run database migrations
psql -U evdms_user -d evdms -f src/db/schema.sql
```

## Running the Service

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Notification Types

### Customer-facing
- `WELCOME_EMAIL` - Welcome new customers
- `TEST_DRIVE_CONFIRMATION` - Test drive confirmation
- `TEST_DRIVE_REMINDER` - Reminder 1 day before test drive
- `QUOTATION_SENT` - Quotation sent notification
- `ORDER_CONFIRMED` - Order confirmation
- `ORDER_READY` - Vehicle ready for pickup
- `ORDER_DELIVERED` - Vehicle delivered
- `PAYMENT_RECEIVED` - Payment confirmation
- `CONTRACT_SIGNED` - Contract signed notification

### Staff-facing
- `NEW_LEAD_ASSIGNED` - New lead assigned to staff
- `TEST_DRIVE_SCHEDULED` - New test drive scheduled
- `ORDER_CREATED` - New order created
- `STOCK_LOW` - Low stock alert
- `CUSTOMER_COMPLAINT` - Customer complaint notification

### Manager-facing
- `DAILY_SALES_REPORT` - Daily sales summary
- `WEEKLY_SUMMARY` - Weekly performance summary
- `MONTHLY_REPORT` - Monthly report
- `TARGET_ACHIEVED` - Target achievement notification
- `DEBT_OVERDUE` - Overdue debt warning

### Manufacturer-facing
- `STOCK_REQUEST_CREATED` - Dealer stock request
- `DEALER_SUSPENDED` - Dealer suspension notification
- `NEW_DEALER_REGISTERED` - New dealer registration

## RabbitMQ Events

The service consumes these events:
- `customer.created` → Send welcome email
- `test_drive.scheduled` → Send confirmation
- `test_drive.reminder` → Send reminder SMS
- `order.created` → Send order confirmation
- `order.confirmed` → Notify customer and staff
- `order.ready` → Send pickup notification
- `order.delivered` → Send thank you email
- `payment.received` → Send receipt
- `stock.low` → Alert manager
- `complaint.created` → Alert manager
- `lead.assigned` → Notify staff
- `target.achieved` → Send congratulations
- `debt.overdue` → Send warning

## Template Variables

Templates support variable substitution using `{{variable_name}}` syntax:

Common variables:
- `{{customer_name}}` - Customer full name
- `{{order_number}}` - Order reference number
- `{{vehicle_name}}` - Vehicle model name
- `{{amount}}` - Price or payment amount
- `{{date}}` - Formatted date
- `{{dealer_name}}` - Dealer name
- `{{dealer_address}}` - Dealer address

## API Usage Examples

### Send Email Notification

```bash
POST /api/v1/notifications/send
{
  "channel": "EMAIL",
  "recipient": {
    "id": "user-uuid",
    "email": "customer@example.com"
  },
  "templateId": "welcome_email",
  "variables": {
    "customer_name": "John Doe"
  },
  "metadata": {
    "customer_id": "customer-uuid"
  }
}
```

### Send SMS

```bash
POST /api/v1/notifications/send
{
  "channel": "SMS",
  "recipient": {
    "id": "user-uuid",
    "phone": "+84901234567"
  },
  "content": "Your test drive is confirmed for tomorrow at 10 AM"
}
```

### Batch Send

```bash
POST /api/v1/notifications/send-batch
{
  "notifications": [
    {
      "channel": "EMAIL",
      "recipient": { "email": "user1@example.com" },
      "templateId": "welcome_email",
      "variables": { "customer_name": "User 1" }
    },
    {
      "channel": "EMAIL",
      "recipient": { "email": "user2@example.com" },
      "templateId": "welcome_email",
      "variables": { "customer_name": "User 2" }
    }
  ]
}
```

## Business Logic

- ✅ Automatic retry up to 3 times with exponential backoff
- ✅ SMS rate limiting: 100 messages per hour per user
- ✅ Email validation before sending
- ✅ Phone number validation (VN format)
- ✅ SMS message splitting (160 char limit)
- ✅ Unsubscribe link automatically added to emails
- ✅ Queue priority: urgent (SMS) > normal (EMAIL) > low (PUSH)

## License

MIT
