import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../src/app.js'

const app = createApp({
  NODE_ENV: 'test',
  HOST: '127.0.0.1',
  PORT: 4000,
  WEB_ORIGIN: 'http://127.0.0.1:5173',
  DATABASE_URL: 'postgres://stnk:***@127.0.0.1:5432/stnk_jasa_test',
  JWT_SECRET: 'test-jwt-secret',
  JWT_REFRESH_SECRET: 'test-refresh-secret',
  JWT_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
  BCRYPT_ROUNDS: 4,
  BASE_URL: 'http://127.0.0.1:4000',
})

describe('Public Routes', () => {
  // Test 1: GET /api/v1/health → 200
  it('returns health check', async () => {
    const response = await request(app).get('/api/v1/health')

    expect(response.status).toBe(200)
    expect(response.body.service).toBe('stnk-jasa-api')
    expect(response.body.status).toBe('ok')
    expect(response.body).toHaveProperty('timestamp')
  })

  // Test 2: GET /api/v1/meta/roles → 200 + 3 roles
  it('returns supported application roles', async () => {
    const response = await request(app).get('/api/v1/meta/roles')

    expect(response.status).toBe(200)
    expect(response.body.roles).toEqual(['super-admin', 'owner', 'admin-user'])
  })

  // Test 3: GET /monitoring/:token invalid → 404
  it('returns 404 for invalid monitoring token', async () => {
    const response = await request(app).get('/api/v1/monitoring/invalid-token')

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('transaction_not_found')
  })

  // Test 4: 404 for unknown route
  it('returns 404 for unknown route', async () => {
    const response = await request(app).get('/api/v1/unknown-path')

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('route_not_found')
  })
})
