-- Notification Service Database Schema

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('EMAIL', 'SMS', 'PUSH', 'IN_APP')),
    notification_type VARCHAR(50),
    recipient_id UUID,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    template_id UUID,
    subject VARCHAR(500),
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'DELIVERED', 'READ')),
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notification_templates table
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('EMAIL', 'SMS', 'PUSH')),
    subject VARCHAR(500),
    content TEXT NOT NULL,
    variables TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    email_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT true,
    push_enabled BOOLEAN DEFAULT true,
    channels JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_email ON notifications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_phone ON notifications(recipient_phone);

CREATE INDEX IF NOT EXISTS idx_templates_name ON notification_templates(name);
CREATE INDEX IF NOT EXISTS idx_templates_type ON notification_templates(type);
CREATE INDEX IF NOT EXISTS idx_templates_is_active ON notification_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_preferences_user_id ON notification_preferences(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at 
    BEFORE UPDATE ON notification_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at 
    BEFORE UPDATE ON notification_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default email templates
INSERT INTO notification_templates (name, type, subject, content, variables, is_active) VALUES
('welcome_email', 'EMAIL', 'Welcome to EVDMS', 
'<h1>Welcome {{customer_name}}!</h1>
<p>Thank you for joining EVDMS. We are excited to have you on board.</p>
<p>Your account has been successfully created.</p>
<p>Best regards,<br>EVDMS Team</p>', 
ARRAY['customer_name'], true),

('test_drive_confirmation', 'EMAIL', 'Test Drive Confirmation',
'<h1>Test Drive Confirmed</h1>
<p>Hi {{customer_name}},</p>
<p>Your test drive has been scheduled:</p>
<ul>
  <li><strong>Vehicle:</strong> {{vehicle_name}}</li>
  <li><strong>Date:</strong> {{test_drive_date}}</li>
  <li><strong>Time:</strong> {{test_drive_time}}</li>
  <li><strong>Location:</strong> {{dealer_address}}</li>
</ul>
<p>We look forward to seeing you!</p>',
ARRAY['customer_name', 'vehicle_name', 'test_drive_date', 'test_drive_time', 'dealer_address'], true),

('order_confirmed', 'EMAIL', 'Order Confirmation',
'<h1>Order Confirmed</h1>
<p>Hi {{customer_name}},</p>
<p>Your order has been confirmed!</p>
<ul>
  <li><strong>Order Number:</strong> {{order_number}}</li>
  <li><strong>Vehicle:</strong> {{vehicle_name}}</li>
  <li><strong>Price:</strong> {{order_price}}</li>
  <li><strong>Expected Delivery:</strong> {{delivery_date}}</li>
</ul>
<p>Thank you for your purchase!</p>',
ARRAY['customer_name', 'order_number', 'vehicle_name', 'order_price', 'delivery_date'], true),

('payment_received', 'EMAIL', 'Payment Received',
'<h1>Payment Received</h1>
<p>Hi {{customer_name}},</p>
<p>We have received your payment of <strong>{{amount}}</strong>.</p>
<p>Transaction ID: {{transaction_id}}</p>
<p>Thank you for your payment!</p>',
ARRAY['customer_name', 'amount', 'transaction_id'], true),

('order_delivered', 'EMAIL', 'Vehicle Delivered',
'<h1>Congratulations!</h1>
<p>Hi {{customer_name}},</p>
<p>Your vehicle <strong>{{vehicle_name}}</strong> has been successfully delivered!</p>
<p>We hope you enjoy your new electric vehicle.</p>
<p>Thank you for choosing EVDMS!</p>',
ARRAY['customer_name', 'vehicle_name'], true);

-- Insert default SMS templates
INSERT INTO notification_templates (name, type, content, variables, is_active) VALUES
('test_drive_reminder', 'SMS', 
'Hi {{customer_name}}, reminder: Your test drive for {{vehicle_name}} is tomorrow at {{test_drive_time}}. See you at {{dealer_name}}!',
ARRAY['customer_name', 'vehicle_name', 'test_drive_time', 'dealer_name'], true),

('order_ready', 'SMS',
'Hi {{customer_name}}, your {{vehicle_name}} is ready for pickup! Order #{{order_number}}. Contact us to schedule.',
ARRAY['customer_name', 'vehicle_name', 'order_number'], true),

('payment_confirmation', 'SMS',
'Payment of {{amount}} received for order #{{order_number}}. Thank you! - EVDMS',
ARRAY['amount', 'order_number'], true);

-- Insert default PUSH notification templates
INSERT INTO notification_templates (name, type, subject, content, variables, is_active) VALUES
('new_lead_assigned', 'PUSH', 'New Lead Assigned',
'You have been assigned a new lead: {{customer_name}}',
ARRAY['customer_name'], true),

('stock_low', 'PUSH', 'Low Stock Alert',
'Stock alert: {{vehicle_name}} is running low ({{stock_count}} units left)',
ARRAY['vehicle_name', 'stock_count'], true);

COMMENT ON TABLE notifications IS 'Stores all notification records with delivery status';
COMMENT ON TABLE notification_templates IS 'Email, SMS, and Push notification templates';
COMMENT ON TABLE notification_preferences IS 'User notification preferences and channel settings';
