import request from 'supertest'
import { describe, expect, it, beforeAll, beforeEach, afterAll } from 'vitest'
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
  let ownerToken: string
  let adminUserToken: string
  let adminUserId: string
  let tenantId: string
  let adminUserEmail: string
  let serviceId: string

  // Setup once for all tests
  beforeAll(async () => {
    const ownerEmail = `owner-test-${Date.now()}@test.local`
    const ownerPassword = 'Password123!'
    adminUserEmail = `admin-user-test-${Date.now()}@test.local`
    const adminUserPassword = 'AdminPass123!'

    // Register owner
    const ownerRes = await request(app).post('/api/v1/auth/register').send({
      email: ownerEmail,
      phone: '+628****7890',
      password: ownerPassword,
    })
    ownerToken = ownerRes.body.accessToken
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
    adminUserId = createAdminRes.body.id

    // Get services to find a valid service_id
    const servicesRes = await request(app)
      .get('/api/v1/public/services')
    if (servicesRes.body && servicesRes.body.length > 0) {
      serviceId = servicesRes.body[0].id
    }
  })

  // Setup token for each test
  beforeEach(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: adminUserEmail,
      password: 'AdminPass123!',
    })
    adminUserToken = loginRes.body.accessToken
  })

  // Test 1: Login as admin-user → 200
  it('logs in as admin-user', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: adminUserEmail,
      password: 'AdminPass123!',
    })
    expect(response.status).toBe(200)
    expect(response.body.user.role).toBe('admin-user')
    expect(response.body.user.tenant_id).toBe(tenantId)
    adminUserToken = response.body.accessToken
  })

  // Test 2: Dashboard → 200
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

  // Test 3: Get services → 200
  it('returns services for admin-user tenant', async () => {
    const response = await request(app)
      .get('/api/v1/admin-user/services')
      .set('Authorization', `Bearer ${adminUserToken}`)
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.data)).toBe(true)
  })

  // Test 4: Set tenant service → 201
  it('sets tenant service as admin-user', async () => {
    if (!serviceId) {
      console.log('No service_id available, skipping test')
      return
    }
    const response = await request(app)
      .post('/api/v1/admin-user/services')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({ service_id: serviceId, price: 50000, is_active: true })
    expect(response.status).toBe(201)
    expect(response.body.service_id).toBe(serviceId)
  })

  // Test 5: Block access to other tenant → 403
  it('blocks admin-user access to other tenant services', async () => {
    const otherTenantId = '01ARZ3NDEKTSV4RRFFQ69G5FAV'
    const response = await request(app)
      .get(`/api/v1/owner/tenants/${otherTenantId}/services`)
      .set('Authorization', `Bearer ${adminUserToken}`)
    expect(response.status).toBe(403)
    expect(response.body.error).toBe('forbidden')
  })
})
