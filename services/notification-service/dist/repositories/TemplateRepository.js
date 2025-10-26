"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateRepository = void 0;
const database_1 = require("../config/database");
class TemplateRepository {
    async list() {
        const { rows } = await database_1.database.query('SELECT * FROM notification_templates ORDER BY created_at DESC');
        return rows;
    }
    async create(t) {
        const { rows } = await database_1.database.query(`INSERT INTO notification_templates (name, type, subject, content, variables, is_active)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [t.name, t.type, t.subject ?? null, t.content, t.variables, t.is_active]);
        return rows[0];
    }
    async update(id, patch) {
        const fields = [];
        const values = [];
        let idx = 1;
        for (const [k, v] of Object.entries(patch)) {
            fields.push(`${k}=$${idx++}`);
            values.push(v);
        }
        if (!fields.length)
            return this.findById(id);
        values.push(id);
        const { rows } = await database_1.database.query(`UPDATE notification_templates SET ${fields.join(', ')} WHERE id=$${idx} RETURNING *`, values);
        return rows[0] || null;
    }
    async delete(id) {
        const res = await database_1.database.query('DELETE FROM notification_templates WHERE id=$1', [id]);
        return (res.rowCount ?? 0) > 0;
    }
    async findById(id) {
        const { rows } = await database_1.database.query('SELECT * FROM notification_templates WHERE id=$1', [id]);
        return rows[0] || null;
    }
}
exports.TemplateRepository = TemplateRepository;
