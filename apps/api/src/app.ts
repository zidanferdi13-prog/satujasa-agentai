import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import type { AppConfig } from './config.js'
import { getDb } from './db/index.js'
import { authRoutes } from './routes/auth.js'
import { superAdminRoutes } from './routes/super-admin.js'
import { ownerRoutes } from './routes/owner.js'
import { adminUserRoutes } from './routes/admin-user.js'
import { publicRoutes } from './routes/public.js'

export function createApp(config: AppConfig) {
  const app = express()
  const db = getDb(config.DATABASE_URL)

  app.disable('x-powered-by')
  app.use(helmet())
  const corsOrigins = config.WEB_ORIGIN.split(',')
    .map(s => s.trim())
    .filter(Boolean)
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin || corsOrigins.includes(origin)) return callback(null, true)
      callback(null, false)
    },
    credentials: true,
  }))
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())

  // ─── Public routes (no auth) ──────────────────────────────────────────────
  app.use('/api/v1', publicRoutes(db))

  // ─── Auth routes ──────────────────────────────────────────────────────────
  app.use('/api/v1/auth', authRoutes(db, config))

  // ─── Super Admin routes ───────────────────────────────────────────────────
  app.use('/api/v1/admin', superAdminRoutes(db, config))

  // ─── Owner routes ─────────────────────────────────────────────────────────
  app.use('/api/v1/owner', ownerRoutes(db, config))

  // ─── Admin User routes ────────────────────────────────────────────────────
  app.use('/api/v1/admin-user', adminUserRoutes(db, config))

  // ─── 404 fallback ─────────────────────────────────────────────────────────
  app.use((_request, response) => {
    response.status(404).json({ error: 'route_not_found' })
  })

  return app
}
