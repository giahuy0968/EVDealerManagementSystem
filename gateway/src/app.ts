import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { registerRoutes } from './routes/registerRoutes'
import { globalRateLimiter } from './middleware/rateLimit'
import { requestId, requestLogger } from './middleware/logging'
import { checkAllServices, getOverallHealth } from './services/healthCheck'

export function createApp() {
  const app = express()

  app.set('trust proxy', 1)
  
  // Security & Performance
  // app.use(helmet({ crossOriginEmbedderPolicy: false })) // Temporarily disabled for debugging
  
  // CORS - Allow specific origins with credentials
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5176').split(',')
  app.use(cors({ 
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        callback(null, true)
      } else {
        callback(null, true) // Allow all for development
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  }))
  
  app.use(express.json({ limit: '2mb' }))
  app.use(express.urlencoded({ extended: true, limit: '2mb' }))
  
  // Logging & Tracing
  app.use(requestId)
  app.use(requestLogger)
  app.use(morgan('dev'))

  // Rate limiting
  app.use(globalRateLimiter)

  // Gateway health check
  app.get('/health', (_req, res) => {
    res.json({ 
      success: true,
      service: 'api-gateway', 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.VERSION || '1.0.0',
    })
  })

  // All services health check
  app.get('/health/services', async (_req, res) => {
    try {
      const services = await checkAllServices()
      const overall = getOverallHealth(services)
      
      res.status(overall.status === 'healthy' ? 200 : 503).json({
        success: true,
        overall,
        services,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to check service health',
        message: error.message,
      })
    }
  })

  // API versioning info
  app.get('/api', (_req, res) => {
    res.json({
      success: true,
      message: 'EVDMS API Gateway',
      version: 'v1',
      endpoints: {
        auth: '/api/v1/auth',
        customers: '/api/v1/customers',
        dealers: '/api/v1/dealers',
        manufacturers: '/api/v1/manufacturers',
        reports: '/api/v1/reports',
        notifications: '/api/v1/notifications',
      },
      documentation: '/api/docs',
    })
  })

  // Register proxy routes
  registerRoutes(app)

  // 404
  app.use((req, res) => {
    res.status(404).json({ 
      success: false,
      error: 'Not Found', 
      path: req.path,
      method: req.method,
    })
  })

  // Error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Gateway error:', err)
    
    const requestId = req.headers['x-request-id']
    
    res.status(err.status || 500).json({ 
      success: false,
      error: err.message || 'Internal Server Error',
      requestId,
      timestamp: new Date().toISOString(),
    })
  })

  return app
}
