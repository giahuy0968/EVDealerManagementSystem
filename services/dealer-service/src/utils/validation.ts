import Joi from 'joi';

// Car validation schemas
export const createCarSchema = Joi.object({
  name: Joi.string().required(),
  model: Joi.string().required(),
  version: Joi.string().required(),
  year: Joi.number().integer().min(2020).max(2030).required(),
  basePrice: Joi.number().positive().required(),
  colors: Joi.array().items(Joi.string()).min(1).required(),
  specifications: Joi.object().required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  stock: Joi.number().integer().min(0).default(0),
  dealerId: Joi.string().optional(),
});

// Quotation validation schemas
export const createQuotationSchema = Joi.object({
  customerId: Joi.string().required(),
  carModelId: Joi.string().required(),
  promotions: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      discount: Joi.number().min(0).required(),
    })
  ).optional(),
  validUntil: Joi.date().iso().greater('now').required(),
  note: Joi.string().optional(),
});

// Order validation schemas
export const createOrderSchema = Joi.object({
  customerId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      carModelId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
  paymentMethod: Joi.string().valid('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'INSTALLMENT').required(),
  note: Joi.string().optional(),
});

// Stock Request validation schemas
export const createStockRequestSchema = Joi.object({
  dealerId: Joi.string().required(),
  carModelId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  urgency: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').required(),
  expectedDate: Joi.date().iso().greater('now').required(),
  reason: Joi.string().optional(),
});

// Contract validation schemas
export const createContractSchema = Joi.object({
  orderId: Joi.string().required(),
  customerId: Joi.string().required(),
  contractType: Joi.string().valid('SALES', 'INSTALLMENT').required(),
  terms: Joi.string().required(),
  validFrom: Joi.date().iso().required(),
  validTo: Joi.date().iso().greater(Joi.ref('validFrom')).required(),
});

// Payment validation schemas
export const createPaymentSchema = Joi.object({
  orderId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid('CASH', 'BANK_TRANSFER', 'CREDIT_CARD').required(),
  transactionReference: Joi.string().optional(),
  note: Joi.string().optional(),
});

// Pagination validation
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
});
