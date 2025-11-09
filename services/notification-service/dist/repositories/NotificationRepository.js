"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const database_1 = require("../config/database");
class NotificationRepository {
    async create(n) {
        const { rows } = await database_1.database.query(`INSERT INTO notifications (type, recipient_id, recipient_email, recipient_phone, template_id, subject, content, status, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`, [n.type, n.recipient_id ?? null, n.recipient_email ?? null, n.recipient_phone ?? null, n.template_id ?? null, n.subject ?? null, n.content ?? '', n.status ?? 'PENDING', n.metadata ?? {}]);
        return rows[0];
    }
    async updateStatus(id, status, error) {
        const timeField = status === 'SENT' ? 'sent_at' : status === 'DELIVERED' ? 'delivered_at' : status === 'READ' ? 'read_at' : null;
        const setTime = timeField ? `, ${timeField} = NOW()` : '';
        const { rows } = await database_1.database.query(`UPDATE notifications SET status=$2${setTime}, error_message=$3 WHERE id=$1 RETURNING *`, [id, status, error ?? null]);
        return rows[0] || null;
    }
    async findById(id) {
        const { rows } = await database_1.database.query('SELECT * FROM notifications WHERE id=$1', [id]);
        return rows[0] || null;
    }
    async list(limit = 50, offset = 0) {
        const { rows } = await database_1.database.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return rows;
    }
}
exports.NotificationRepository = NotificationRepository;
