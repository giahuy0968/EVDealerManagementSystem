import { database } from '../config/database';

export interface Preferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  channels: any;
  created_at: string;
  updated_at: string;
}

export class PreferenceRepository {
  async getByUserId(userId: string): Promise<Preferences | null> {
    const { rows } = await database.query('SELECT * FROM notification_preferences WHERE user_id=$1', [userId]);
    return rows[0] || null;
  }

  async upsert(userId: string, patch: Partial<Preferences>): Promise<Preferences> {
    const existing = await this.getByUserId(userId);
    if (existing) {
      const { rows } = await database.query(
        `UPDATE notification_preferences SET 
          email_enabled = COALESCE($2, email_enabled),
          sms_enabled = COALESCE($3, sms_enabled),
          push_enabled = COALESCE($4, push_enabled),
          channels = COALESCE($5, channels),
          updated_at = NOW()
         WHERE user_id=$1 RETURNING *`,
        [userId, patch.email_enabled, patch.sms_enabled, patch.push_enabled, patch.channels]
      );
      return rows[0];
    } else {
      const { rows } = await database.query(
        `INSERT INTO notification_preferences (user_id, email_enabled, sms_enabled, push_enabled, channels)
         VALUES ($1, COALESCE($2, TRUE), COALESCE($3, TRUE), COALESCE($4, TRUE), COALESCE($5, '{}'::jsonb)) RETURNING *`,
        [userId, patch.email_enabled, patch.sms_enabled, patch.push_enabled, patch.channels]
      );
      return rows[0];
    }
  }
}
