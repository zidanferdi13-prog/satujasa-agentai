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
    expect(typeof response.body.total_owners).toBe('number')
    expect(typeof response.body.total_revenue).toBe('string')
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

  // Test 3: POST /admin/owners/:id/subscription → 200 + tier updated
  it('updates owner subscription tier', async () => {
    // First, get an owner
    const ownerRes = await request(app)
      .get('/api/v1/admin/owners')
      .set('Authorization', `Bearer ${superAdminToken}`)

    expect(ownerRes.status).toBe(200)
    expect(ownerRes.body.data.length).toBeGreaterThan(0)

    const ownerId = ownerRes.body.data[0].id

    // Update subscription to 'pro'
    const updateRes = await request(app)
      .post(`/api/v1/admin/owners/${ownerId}/subscription`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        tier: 'pro',
        max_tenants: 5,
        max_admin_users: 10,
      })

    expect(updateRes.status).toBe(201)
    expect(updateRes.body).toHaveProperty('tier')
    expect(updateRes.body.tier).toBe('pro')
    expect(updateRes.body.max_tenants).toBe(5)
    expect(updateRes.body.max_admin_users).toBe(10)
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
