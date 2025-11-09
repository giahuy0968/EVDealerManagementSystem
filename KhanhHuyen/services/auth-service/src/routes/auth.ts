import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate, authorize, optionalAuthenticate } from '../middlewares/auth';
import { authRateLimit, passwordResetRateLimit, generalRateLimit } from '../middlewares/rateLimiter';
import { UserRole } from '../../../shared/types';

const router = Router();
const authController = new AuthController();

/**
 * Public routes - no authentication required
 */
// User registration
router.post('/register', authRateLimit, authController.register);

// User login
router.post('/login', authRateLimit, authController.login);

// Token refresh
router.post('/refresh', generalRateLimit, authController.refreshToken);

// Token verification (can be used by other services)
router.post('/verify', generalRateLimit, optionalAuthenticate, authController.verifyToken);

/**
 * Protected routes - authentication required
 */
// User logout
router.post('/logout', authenticate, authController.logout);

// Get current user profile
router.get('/profile', authenticate, authController.getProfile);

// Change password
router.put('/password', authenticate, authController.changePassword);

/**
 * Admin only routes
 */
// Get all users (admin only)
router.get('/users', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  // This would be implemented in a separate UserController
  res.json({ message: 'Get all users endpoint - to be implemented' });
});

// Update user status (admin only)
router.put('/users/:userId/status', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  // This would be implemented in a separate UserController
  res.json({ message: 'Update user status endpoint - to be implemented' });
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'auth-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;