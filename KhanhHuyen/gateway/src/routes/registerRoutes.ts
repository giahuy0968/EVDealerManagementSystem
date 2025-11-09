import { createProxyMiddleware } from 'http-proxy-middleware'
import type { Application } from 'express'

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001'
const DEALER_SERVICE_URL = process.env.DEALER_SERVICE_URL || 'http://localhost:3002'
const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3003'
const MANUFACTURER_SERVICE_URL = process.env.MANUFACTURER_SERVICE_URL || 'http://localhost:3004'
const REPORT_SERVICE_URL = process.env.REPORT_SERVICE_URL || 'http://localhost:3005'
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006'

export function registerRoutes(app: Application) {
  // Public auth endpoints
  app.use('/api/v1/auth', createProxyMiddleware({ target: AUTH_SERVICE_URL, changeOrigin: true }))

  // Protected routes: pass auth header through –
  // downstream services should validate JWT
  app.use('/api/v1/dealers', createProxyMiddleware({ target: DEALER_SERVICE_URL, changeOrigin: true }))
  app.use('/api/v1/customers', createProxyMiddleware({ target: CUSTOMER_SERVICE_URL, changeOrigin: true }))
  app.use('/api/v1/manufacturers', createProxyMiddleware({ target: MANUFACTURER_SERVICE_URL, changeOrigin: true }))
  app.use('/api/v1/reports', createProxyMiddleware({ target: REPORT_SERVICE_URL, changeOrigin: true }))
  app.use('/api/v1/notifications', createProxyMiddleware({ target: NOTIFICATION_SERVICE_URL, changeOrigin: true }))
}
