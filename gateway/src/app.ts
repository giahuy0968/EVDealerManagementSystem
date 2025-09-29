import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { registerRoutes } from './routes/registerRoutes'

export function createApp() {
  const app = express()

  app.set('trust proxy', 1)
  app.use(helmet({ crossOriginEmbedderPolicy: false }))
  app.use(cors({ origin: true, credentials: true }))
  app.use(express.json({ limit: '2mb' }))
  app.use(morgan('dev'))

  // Basic rate limit
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000,
      standardHeaders: true,
      legacyHeaders: false,
    })
  )

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'api-gateway', ts: new Date().toISOString() })
  })

  // Register proxy routes
  registerRoutes(app)

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.path })
  })

  // Error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err)
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
  })

  return app
}
