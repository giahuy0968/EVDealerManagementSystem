import { createProxyMiddleware } from 'http-proxy-middleware'
import type { Application } from 'express'
import { authenticateToken, optionalAuth } from '../middleware/auth'
import { apiRateLimiter } from '../middleware/rateLimit'

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001'
const DEALER_SERVICE_URL = process.env.DEALER_SERVICE_URL || 'http://localhost:3002'
const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3003'
const MANUFACTURER_SERVICE_URL = process.env.MANUFACTURER_SERVICE_URL || 'http://localhost:3004'
const REPORT_SERVICE_URL = process.env.REPORT_SERVICE_URL || 'http://localhost:3005'
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006'

// Proxy configuration with logging and error handling
const createProxy = (target: string) => 
  createProxyMiddleware({
    target,
    changeOrigin: true,
    timeout: 30000, // 30 second timeout
  })

export function registerRoutes(app: Application) {
  // Public auth endpoints (login, register, etc.)
  app.use(
    '/api/v1/auth',
    apiRateLimiter,
    createProxy(AUTH_SERVICE_URL)
  )

  // Protected routes with authentication
  // Customers - mixed (some public like vehicle listing, some protected)
  app.use(
    '/api/v1/customers',
    optionalAuth, // Optional auth - some endpoints are public
    apiRateLimiter,
    createProxy(CUSTOMER_SERVICE_URL)
  )

  // Dealers - requires authentication
  app.use(
    '/api/v1/dealers',
    authenticateToken,
    apiRateLimiter,
    createProxy(DEALER_SERVICE_URL)
  )

  // Manufacturers - requires authentication
  app.use(
    '/api/v1/manufacturers',
    authenticateToken,
    apiRateLimiter,
    createProxy(MANUFACTURER_SERVICE_URL)
  )

  // Reports - requires authentication
  app.use(
    '/api/v1/reports',
    authenticateToken,
    apiRateLimiter,
    createProxy(REPORT_SERVICE_URL)
  )

  // Notifications - requires authentication
  app.use(
    '/api/v1/notifications',
    authenticateToken,
    apiRateLimiter,
    createProxy(NOTIFICATION_SERVICE_URL)
  )
}
