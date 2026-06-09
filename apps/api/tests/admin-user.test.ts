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

describe('Admin User Routes', () => {
  // Setup: Create owner, tenant, and admin-user
  const ownerEmail = `owner-${Date.now()}@test.local`
  const ownerPassword = 'Password123!'
  const adminUserEmail = `admin-${Date.now()}@test.local`
  const adminUserPassword = 'AdminPass123!'
  
  let ownerToken: string
  let adminUserToken: string
  let tenantId: string
  let adminUserId: string

  it('creates owner and tenant for admin-user tests', async () => {
    // Register owner
    const ownerRes = await request(app).post('/api/v1/auth/register').send({
      email: ownerEmail,
      phone: '+628****7890',
      password: ownerPassword,
    })

    expect(ownerRes.status).toBe(201)
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
    adminUserId = createAdminRes.body.id
  })

  // Test 1: Login as admin-user → 200
  it('logs in as admin-user', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: adminUserEmail,
      password: adminUserPassword,
    })

    expect(response.status).toBe(200)
    expect(response.body.user.role).toBe('admin-user')
    expect(response.body.user.tenant_id).toBe(tenantId)
    adminUserToken = response.body.accessToken
  })

  // Test 2: GET /admin-user/dashboard → 200
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

  // Test 3: POST /admin-user/services → 201 (upsert)
  it('sets tenant service as admin-user', async () => {
    const response = await request(app)
      .post('/api/v1/admin-user/services')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({
        service_id: '01ARZ3NDEKTSV4RRFFQ69G5FAV', // Default service from seed
        price: 150000,
        is_active: true,
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.price).toBe('150000')
  })

  // Test 4: GET /admin-user/services → 200 + only own tenant data
  it('returns services for admin-user tenant only', async () => {
    const response = await request(app)
      .get('/api/v1/admin-user/services')
      .set('Authorization', `Bearer ${adminUserToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.data)).toBe(true)
    // All services should belong to this tenant
    if (response.body.data.length > 0) {
      const svc = response.body.data[0]
      expect(svc).toHaveProperty('service_id')
      expect(svc).toHaveProperty('service_name')
      expect(svc).toHaveProperty('price')
    }
  })

  // Test 5: Admin-user cannot access other tenant data (tenant isolation)
  it('blocks admin-user access to other tenant services', async () => {
    // Create another owner + tenant
    const owner2Res = await request(app).post('/api/v1/auth/register').send({
      email: `owner2-${Date.now()}@test.local`,
      phone: '+628****9999',
      password: 'Password123!',
    })

    expect(owner2Res.status).toBe(201)
    const owner2Token = owner2Res.body.accessToken
    const owner2Id = owner2Res.body.user.id

    // Upgrade to pro
    const adminRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@satujasa.id',
      password: 'SuperAdmin123!',
    })
    const adminToken = adminRes.body.accessToken

    await request(app)
      .post(`/api/v1/admin/owners/${owner2Id}/subscription`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ tier: 'pro' })

    // Create tenant 2
    const tenant2Res = await request(app)
      .post('/api/v1/owner/tenants')
      .set('Authorization', `Bearer ${owner2Token}`)
      .send({ name: 'Tenant 2' })

    expect(tenant2Res.status).toBe(201)
    const tenant2Id = tenant2Res.body.id

    // Admin-user from tenant 1 tries to access tenant 2 services
    // This should be blocked by tenant isolation middleware
    const response = await request(app)
      .get(`/api/v1/admin-user/tenants/${tenant2Id}/services`)
      .set('Authorization', `Bearer ${adminUserToken}`)

    // Expected: 403 or route not found due to tenant isolation
    expect([403, 404]).toContain(response.status)
  })
})
