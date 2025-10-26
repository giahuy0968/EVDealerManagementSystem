import { database } from '../config/database';

export interface Notification {
  id: string;
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  recipient_id?: string | null;
  recipient_email?: string | null;
  recipient_phone?: string | null;
  template_id?: string | null;
  subject?: string | null;
  content: string;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED' | 'READ';
  sent_at?: string | null;
  delivered_at?: string | null;
  read_at?: string | null;
  error_message?: string | null;
  metadata?: any;
  created_at: string;
}

export class NotificationRepository {
  async create(n: Partial<Notification>): Promise<Notification> {
    const { rows } = await database.query(
      `INSERT INTO notifications (type, recipient_id, recipient_email, recipient_phone, template_id, subject, content, status, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [n.type, n.recipient_id ?? null, n.recipient_email ?? null, n.recipient_phone ?? null, n.template_id ?? null, n.subject ?? null, n.content ?? '', n.status ?? 'PENDING', n.metadata ?? {}]
    );
    return rows[0];
  }

  async updateStatus(id: string, status: Notification['status'], error?: string | null): Promise<Notification | null> {
    const timeField = status === 'SENT' ? 'sent_at' : status === 'DELIVERED' ? 'delivered_at' : status === 'READ' ? 'read_at' : null;
    const setTime = timeField ? `, ${timeField} = NOW()` : '';
    const { rows } = await database.query(
      `UPDATE notifications SET status=$2${setTime}, error_message=$3 WHERE id=$1 RETURNING *`,
      [id, status, error ?? null]
    );
    return rows[0] || null;
  }

  async findById(id: string): Promise<Notification | null> {
    const { rows } = await database.query('SELECT * FROM notifications WHERE id=$1', [id]);
    return rows[0] || null;
  }

  async list(limit = 50, offset = 0): Promise<Notification[]> {
    const { rows } = await database.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
    return rows;
  }
}
