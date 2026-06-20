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

describe('Super Admin Routes', () => {
  // Note: Tests assume super-admin is seeded with email: admin@satujasa.id, password: SuperAdmin123!
  const superAdminEmail = 'admin@satujasa.id'
  const superAdminPassword = 'SuperAdmin123!'
  let superAdminToken: string

  // Setup: Login as super-admin before tests
  it('logs in as super-admin for subsequent tests', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: superAdminEmail,
      password: superAdminPassword,
    })

    expect(response.status).toBe(200)
    expect(response.body.user.role).toBe('super-admin')
    superAdminToken = response.body.accessToken
  })

  // Test 1: GET /admin/dashboard → 200 + stats shape
  it('returns dashboard stats with correct shape', async () => {
    const response = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${superAdminToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('total_owners')
    expect(response.body).toHaveProperty('active_owners')
    expect(response.body).toHaveProperty('total_tenants')
    expect(response.body).toHaveProperty('total_transactions')
    expect(response.body).toHaveProperty('total_revenue')
    expect(response.body).toHaveProperty('total_subscription_revenue')
    expect(typeof response.body.total_owners).toBe('number')
    expect(typeof response.body.total_revenue).toBe('string')
    expect(typeof response.body.total_subscription_revenue).toBe('string')
  })

  // Test 2: GET /admin/owners → 200 + array
  it('returns list of all owners', async () => {
    const response = await request(app)
      .get('/api/v1/admin/owners')
      .set('Authorization', `Bearer ${superAdminToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.data)).toBe(true)
    if (response.body.data.length > 0) {
      const owner = response.body.data[0]
      expect(owner).toHaveProperty('id')
      expect(owner).toHaveProperty('email')
      expect(owner).toHaveProperty('role')
      expect(owner.role).toBe('owner')
    }
  })

  // Test 3: POST /admin/owners/:id/subscription → 200 + tier updated + expires_at calculated
  it('updates owner subscription tier with duration_months', async () => {
    // First, get an owner
    const ownerRes = await request(app)
      .get('/api/v1/admin/owners')
      .set('Authorization', `Bearer ${superAdminToken}`)

    expect(ownerRes.status).toBe(200)
    expect(ownerRes.body.data.length).toBeGreaterThan(0)

    const ownerId = ownerRes.body.data[0].id

    // Update subscription to 'pro' with duration_months
    const updateRes = await request(app)
      .post(`/api/v1/admin/owners/${ownerId}/subscription`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        tier: 'pro',
        duration_months: 6,
      })

    expect(updateRes.status).toBe(201)
    expect(updateRes.body).toHaveProperty('tier')
    expect(updateRes.body.tier).toBe('pro')
    expect(updateRes.body).toHaveProperty('expires_at')
    expect(updateRes.body.expires_at).not.toBeNull()

    // Verify expires_at is roughly 6 months from now (within 5 minutes tolerance)
    const expiresAt = new Date(updateRes.body.expires_at)
    const expectedMin = new Date()
    expectedMin.setMonth(expectedMin.getMonth() + 5)
    expectedMin.setMinutes(expectedMin.getMinutes() - 5)
    const expectedMax = new Date()
    expectedMax.setMonth(expectedMax.getMonth() + 7)
    expectedMax.setMinutes(expectedMax.getMinutes() + 5)
    expect(expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMin.getTime())
    expect(expiresAt.getTime()).toBeLessThanOrEqual(expectedMax.getTime())
  })

  // Test 3b: GET /admin/users → 200 + list
  it('returns admin users list', async () => {
    const response = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${superAdminToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body).toHaveProperty('meta')
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.data.length).toBeGreaterThan(0)

    const user = response.body.data[0]
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('role')
    expect(user).toHaveProperty('is_active')
    expect(user).toHaveProperty('created_at')
    expect(user.is_active).toBe(true)
  })

  // Test 3c: GET /admin/users?role= → filter
  it('filters admin users by role', async () => {
    const response = await request(app)
      .get('/api/v1/admin/users?role=owner')
      .set('Authorization', `Bearer ${superAdminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.data.length).toBeGreaterThan(0)
    response.body.data.forEach((user: { role: string }) => {
      expect(user.role).toBe('owner')
    })
  })

  // Test 3d: GET /admin/settings → 200 + data
  it('returns app settings', async () => {
    const response = await request(app)
      .get('/api/v1/admin/settings')
      .set('Authorization', `Bearer ${superAdminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty('app_name')
    expect(response.body.data).toHaveProperty('support_email')
    expect(response.body.data).toHaveProperty('support_phone')
  })

  // Test 3e: POST /admin/settings → success
  it('updates app settings', async () => {
    const response = await request(app)
      .post('/api/v1/admin/settings')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        app_name: 'STNK Jasa Test',
        support_email: 'test@satujasa.my.id',
        support_phone: '08111111111',
      })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })

  // Test 3f: GET /admin/subscription-logs → 200 + logs + summary
  it('returns subscription logs with summary', async () => {
    const response = await request(app)
      .get('/api/v1/admin/subscription-logs')
      .set('Authorization', `Bearer ${superAdminToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('logs')
    expect(response.body).toHaveProperty('pagination')
    expect(response.body).toHaveProperty('summary')
    expect(Array.isArray(response.body.logs)).toBe(true)
    expect(response.body.pagination).toHaveProperty('page')
    expect(response.body.pagination).toHaveProperty('limit')
    expect(response.body.pagination).toHaveProperty('total')
    expect(response.body.pagination).toHaveProperty('total_pages')
    expect(response.body.summary).toHaveProperty('total_subscriptions')
    expect(response.body.summary).toHaveProperty('by_tier')
    expect(response.body.summary).toHaveProperty('total_revenue')
    expect(response.body.summary).toHaveProperty('active_subscriptions')
    expect(response.body.summary).toHaveProperty('expired_subscriptions')

    if (response.body.logs.length > 0) {
      const log = response.body.logs[0]
      expect(log).toHaveProperty('id')
      expect(log).toHaveProperty('owner_id')
      expect(log).toHaveProperty('owner_email')
      expect(log).toHaveProperty('tier')
      expect(log).toHaveProperty('price_per_month')
      expect(log).toHaveProperty('duration_months')
      expect(log).toHaveProperty('total_price')
      expect(log).toHaveProperty('status')
    }
  })

  // Test 4: Non super-admin hit super-admin route → 403
  it('rejects non-super-admin access to admin routes', async () => {
    // Register a regular owner
    const ownerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: `owner-${Date.now()}@test.local`,
        phone: '+628****7890',
        password: 'Password123!',
      })

    expect(ownerRes.status).toBe(201)
    const ownerToken = ownerRes.body.accessToken

    // Try to access super-admin endpoint
    const response = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${ownerToken}`)

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('forbidden')
  })
})
