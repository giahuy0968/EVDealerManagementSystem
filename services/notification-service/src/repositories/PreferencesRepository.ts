import { database } from '../config/database';
import { NotificationPreferences } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export class PreferencesRepository {
  async create(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const id = uuidv4();
    const query = `
      INSERT INTO notification_preferences (
        id, user_id, email_enabled, sms_enabled, push_enabled, channels, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    
    const values = [
      id,
      preferences.user_id,
      preferences.email_enabled !== false,
      preferences.sms_enabled !== false,
      preferences.push_enabled !== false,
      JSON.stringify(preferences.channels || {}),
    ];

    try {
      const result = await database.query(query, values);
      logger.info('Preferences created', { id, user_id: preferences.user_id });
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating preferences', { error });
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<NotificationPreferences | null> {
    const query = 'SELECT * FROM notification_preferences WHERE user_id = $1';
    const result = await database.query(query, [userId]);
    return result.rows[0] || null;
  }

  async update(userId: string, updates: Partial<NotificationPreferences>): Promise<NotificationPreferences | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.email_enabled !== undefined) {
      fields.push(`email_enabled = $${paramCount++}`);
      values.push(updates.email_enabled);
    }

    if (updates.sms_enabled !== undefined) {
      fields.push(`sms_enabled = $${paramCount++}`);
      values.push(updates.sms_enabled);
    }

    if (updates.push_enabled !== undefined) {
      fields.push(`push_enabled = $${paramCount++}`);
      values.push(updates.push_enabled);
    }

    if (updates.channels !== undefined) {
      fields.push(`channels = $${paramCount++}`);
      values.push(JSON.stringify(updates.channels));
    }

    if (fields.length === 0) {
      return this.findByUserId(userId);
    }

    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const query = `
      UPDATE notification_preferences 
      SET ${fields.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const result = await database.query(query, values);
    return result.rows[0] || null;
  }

  async upsert(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const existing = await this.findByUserId(preferences.user_id!);
    
    if (existing) {
      const updated = await this.update(preferences.user_id!, preferences);
      return updated!;
    } else {
      return this.create(preferences);
    }
  }
}
