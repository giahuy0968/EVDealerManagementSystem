import Joi from 'joi';
import { UserRole } from '../../../shared/types';

// User registration validation schema
export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    
  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'any.required': 'Password is required',
    }),
    
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 50 characters',
      'string.pattern.base': 'First name can only contain letters and spaces',
      'any.required': 'First name is required',
    }),
    
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 50 characters',
      'string.pattern.base': 'Last name can only contain letters and spaces',
      'any.required': 'Last name is required',
    }),
    
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required()
    .messages({
      'any.only': 'Invalid user role',
      'any.required': 'User role is required',
    }),
    
  dealerId: Joi.string()
    .uuid()
    .when('role', {
      is: Joi.string().valid(UserRole.DEALER_MANAGER, UserRole.DEALER_STAFF),
      then: Joi.required(),
      otherwise: Joi.optional().allow(null),
    })
    .messages({
      'string.uuid': 'Dealer ID must be a valid UUID',
      'any.required': 'Dealer ID is required for dealer roles',
    }),
    
  manufacturerId: Joi.string()
    .uuid()
    .when('role', {
      is: UserRole.MANUFACTURER_STAFF,
      then: Joi.required(),
      otherwise: Joi.optional().allow(null),
    })
    .messages({
      'string.uuid': 'Manufacturer ID must be a valid UUID',
      'any.required': 'Manufacturer ID is required for manufacturer staff role',
    }),
});

// User login validation schema
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});

// Password change validation schema
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required',
    }),
    
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.max': 'New password must not exceed 128 characters',
      'any.required': 'New password is required',
    }),
    
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
    .messages({
      'any.required': 'Password confirmation is required',
      'any.only': 'Passwords do not match',
    }),
});

// Password reset request validation schema
export const passwordResetRequestSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
});

// Password reset validation schema
export const passwordResetSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Reset token is required',
    }),
    
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'any.required': 'New password is required',
    }),
    
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
    .messages({
      'any.required': 'Password confirmation is required',
      'any.only': 'Passwords do not match',
    }),
});

// Refresh token validation schema
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required',
    }),
});

// User update validation schema
export const updateUserSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 50 characters',
      'string.pattern.base': 'First name can only contain letters and spaces',
    }),
    
  lastName: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 50 characters',
      'string.pattern.base': 'Last name can only contain letters and spaces',
    }),
    
  dealerId: Joi.string()
    .uuid()
    .allow(null)
    .messages({
      'string.uuid': 'Dealer ID must be a valid UUID',
    }),
    
  manufacturerId: Joi.string()
    .uuid()
    .allow(null)
    .messages({
      'string.uuid': 'Manufacturer ID must be a valid UUID',
    }),
});

// Validation helper function
export const validateRequest = (schema: Joi.ObjectSchema, data: any) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value,
    }));
    
    return { isValid: false, errors, value: null };
  }

  return { isValid: true, errors: [], value };
};