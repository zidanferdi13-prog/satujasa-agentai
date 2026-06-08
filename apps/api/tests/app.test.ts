import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { createApp } from '../src/app.js'

const app = createApp({
  NODE_ENV: 'test',
  HOST: '127.0.0.1',
  PORT: 4000,
  WEB_ORIGIN: 'http://127.0.0.1:5173',
  DATABASE_URL: 'postgres://stnk:test@127.0.0.1:5432/stnk_jasa_test',
  JWT_SECRET: 'test-jwt-secret',
  JWT_REFRESH_SECRET: 'test-refresh-secret',
  JWT_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
  BCRYPT_ROUNDS: 4,
  BASE_URL: 'http://127.0.0.1:4000',
})

describe('STNK Jasa API', () => {
  it('reports service health', async () => {
    const response = await request(app).get('/api/v1/health')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      service: 'stnk-jasa-api',
      status: 'ok',
    })
  })

  it('returns the supported application roles', async () => {
    const response = await request(app).get('/api/v1/meta/roles')

    expect(response.status).toBe(200)
    expect(response.body.roles).toEqual(['super-admin', 'owner', 'admin-user'])
  })

  it('returns a stable not-found response', async () => {
    const response = await request(app).get('/missing')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'route_not_found' })
  })
})
