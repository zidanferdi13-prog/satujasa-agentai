import type { HealthResponse, RolesResponse } from '@stnk/contracts'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import type { AppConfig } from './config.js'

export function createApp(config: AppConfig) {
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(cors({ origin: config.WEB_ORIGIN, credentials: true }))
  app.use(express.json({ limit: '1mb' }))

  app.get('/api/v1/health', (_request, response) => {
    const body: HealthResponse = {
      service: 'stnk-jasa-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    }

    response.status(200).json(body)
  })

  app.get('/api/v1/meta/roles', (_request, response) => {
    const body: RolesResponse = {
      roles: ['super-admin', 'owner', 'admin-user'],
    }

    response.status(200).json(body)
  })

  app.use((_request, response) => {
    response.status(404).json({ error: 'route_not_found' })
  })

  return app
}
