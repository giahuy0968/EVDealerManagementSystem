import { Router } from 'express';
import Joi from 'joi';
import { TemplateService } from '../services/TemplateService';

const router = Router();
const service = new TemplateService();

const baseSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid('EMAIL','SMS','PUSH').required(),
  subject: Joi.string().allow(null, ''),
  content: Joi.string().required(),
  variables: Joi.array().items(Joi.string()).default([]),
  is_active: Joi.boolean().default(true),
});

router.get('/', async (_req, res) => {
  res.json({ success: true, data: await service.list() });
});

router.post('/', async (req, res) => {
  const { error, value } = baseSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });
  const created = await service.create(value);
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', async (req, res) => {
  const { error, value } = baseSchema.min(1).validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.message });
  const updated = await service.update(req.params.id, value);
  if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: updated });
});

router.delete('/:id', async (req, res) => {
  const ok = await service.delete(req.params.id);
  if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true });
});

export default router;
