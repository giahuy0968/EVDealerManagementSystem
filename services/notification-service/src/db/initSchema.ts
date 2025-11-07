import { database } from '../config/database';

export async function initSchema(): Promise<void> {
  // enums
  await database.query(`DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_channel') THEN
      CREATE TYPE notification_channel AS ENUM ('EMAIL','SMS','PUSH','IN_APP');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_status') THEN
      CREATE TYPE notification_status AS ENUM ('PENDING','SENT','FAILED','DELIVERED','READ');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'template_type') THEN
      CREATE TYPE template_type AS ENUM ('EMAIL','SMS','PUSH');
    END IF;
  END $$;`);

  // notifications table
  await database.query(`CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type notification_channel NOT NULL,
    recipient_id UUID,
    recipient_email TEXT,
    recipient_phone TEXT,
    template_id UUID,
    subject TEXT,
    content TEXT,
    status notification_status NOT NULL DEFAULT 'PENDING',
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`);

  // templates table
  await database.query(`CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type template_type NOT NULL,
    subject TEXT,
    content TEXT NOT NULL,
    variables TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`);

  // preferences table
  await database.query(`CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sms_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    push_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    channels JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`);
}
