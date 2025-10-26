import { database } from '../config/database';

export interface Template {
  id: string;
  name: string;
  type: 'EMAIL' | 'SMS' | 'PUSH';
  subject?: string | null;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
}

export class TemplateRepository {
  async list(): Promise<Template[]> {
    const { rows } = await database.query('SELECT * FROM notification_templates ORDER BY created_at DESC');
    return rows;
  }

  async create(t: Omit<Template, 'id' | 'created_at'>): Promise<Template> {
    const { rows } = await database.query(
      `INSERT INTO notification_templates (name, type, subject, content, variables, is_active)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [t.name, t.type, t.subject ?? null, t.content, t.variables, t.is_active]
    );
    return rows[0];
  }

  async update(id: string, patch: Partial<Template>): Promise<Template | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;
    for (const [k, v] of Object.entries(patch)) {
      fields.push(`${k}=$${idx++}`);
      values.push(v);
    }
    if (!fields.length) return this.findById(id);
    values.push(id);
    const { rows } = await database.query(`UPDATE notification_templates SET ${fields.join(', ')} WHERE id=$${idx} RETURNING *`, values);
    return rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const res = await database.query('DELETE FROM notification_templates WHERE id=$1', [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async findById(id: string): Promise<Template | null> {
    const { rows } = await database.query('SELECT * FROM notification_templates WHERE id=$1', [id]);
    return rows[0] || null;
  }
}
