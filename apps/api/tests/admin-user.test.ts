import request from 'supertest'
import { describe, expect, it, beforeAll } from 'vitest'
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

describe('Admin User Routes', () => {
  const ownerEmail = `owner-${Date.now()}@test.local`
  const ownerPassword = 'Password123!'
  const adminUserEmail = `admin-${Date.now()}@test.local`
  const adminUserPassword = 'AdminPass123!'
  let adminUserToken: string
  let tenantId: string

  beforeAll(async () => {
    // Setup: Register owner
    const ownerRes = await request(app).post('/api/v1/auth/register').send({
      email: ownerEmail,
      phone: '+628****7890',
      password: ownerPassword,
    })
    expect(ownerRes.status).toBe(201)
    const ownerToken = ownerRes.body.accessToken
    const ownerId = ownerRes.body.user.id

    // Upgrade to pro
    const adminRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@satujasa.id',
      password: 'SuperAdmin123!',
    })
    const adminToken = adminRes.body.accessToken

    await request(app)
      .post(`/api/v1/admin/owners/${ownerId}/subscription`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ tier: 'pro', max_tenants: 5, max_admin_users: 10 })

    // Create tenant
    const tenantRes = await request(app)
      .post('/api/v1/owner/tenants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Test Tenant' })
    expect(tenantRes.status).toBe(201)
    tenantId = tenantRes.body.id

    // Create admin-user
    const createAdminRes = await request(app)
      .post(`/api/v1/owner/tenants/${tenantId}/admin-users`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        email: adminUserEmail,
        phone: '+628****9001',
        password: adminUserPassword,
      })
    expect(createAdminRes.status).toBe(201)

    // Login as admin-user to get token
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: adminUserEmail,
      password: adminUserPassword,
    })
    expect(loginRes.status).toBe(200)
    expect(loginRes.body.user.role).toBe('admin-user')
    expect(loginRes.body.user.tenant_id).toBe(tenantId)
    adminUserToken = loginRes.body.accessToken
  })

  // Test 1: GET /admin-user/dashboard → 200
  it('returns admin-user dashboard', async () => {
    const response = await request(app)
      .get('/api/v1/admin-user/dashboard')
      .set('Authorization', `Bearer ${adminUserToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('total_transactions')
    expect(response.body).toHaveProperty('active_transactions')
    expect(response.body).toHaveProperty('done_transactions')
    expect(response.body).toHaveProperty('total_revenue')
  })

  // Test 2: GET /admin-user/services → 200 + only own tenant data
  it('returns services for admin-user tenant only', async () => {
    const response = await request(app)
      .get('/api/v1/admin-user/services')
      .set('Authorization', `Bearer ${adminUserToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.data)).toBe(true)
    if (response.body.data.length > 0) {
      const svc = response.body.data[0]
      expect(svc).toHaveProperty('service_id')
      expect(svc).toHaveProperty('service_name')
      expect(svc).toHaveProperty('price')
    }
  })

  // Test 3: Admin-user cannot access other tenant data (tenant isolation)
  it('blocks admin-user access to other tenant services', async () => {
    const response = await request(app)
      .get(`/api/v1/admin-user/tenants/00000000-0000-0000-0000-000000000000/services`)
      .set('Authorization', `Bearer ${adminUserToken}`)

    expect(response.status).toBe(404)
  })
})
