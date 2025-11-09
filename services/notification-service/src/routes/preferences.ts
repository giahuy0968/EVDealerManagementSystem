import { Router } from 'express';
import Joi from 'joi';
import { PreferenceRepository } from '../repositories/PreferenceRepository';

const router = Router();
const repo = new PreferenceRepository();

const schema = Joi.object({
  email_enabled: Joi.boolean(),
  sms_enabled: Joi.boolean(),
  push_enabled: Joi.boolean(),
  channels: Joi.object().unknown(true),
});

// Assume user id from header X-User-Id for now (gateway/JWT should set it)
function getUserId(req: any): string | null {
  return (req.headers['x-user-id'] as string) || null;
}

router.get('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Missing user context' });
  const prefs = await repo.getByUserId(userId);
  res.json({ success: true, data: prefs });
});

router.put('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Missing user context' });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });
  const updated = await repo.upsert(userId, value);
  res.json({ success: true, data: updated });
});

export default router;
