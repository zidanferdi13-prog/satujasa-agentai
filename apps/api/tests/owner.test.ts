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

describe('Owner Routes', () => {
  const ownerEmail = `owner-${Date.now()}@test.local`
  const ownerPassword = 'Password123!'
  let ownerToken: string
  let ownerId: string
  let tenantId: string
  let transactionId: string
  let serviceId: string

  // Setup: Register owner
  it('registers owner for tests', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      email: ownerEmail,
      phone: '+628****7890',
      password: ownerPassword,
    })

    expect(response.status).toBe(201)
    ownerToken = response.body.accessToken
    ownerId = response.body.user.id

    // Get first available service ID for transaction tests
    const adminRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@satujasa.id',
      password: 'SuperAdmin123!',
    })
    const adminToken = adminRes.body.accessToken

    const servicesRes = await request(app)
      .get('/api/v1/admin/settings')
      .set('Authorization', `Bearer ${adminToken}`)

    console.log('Services response:', JSON.stringify(servicesRes.body, null, 2))
    if (servicesRes.body.services && servicesRes.body.services.length > 0) {
      serviceId = servicesRes.body.services[0].id
      console.log('Using serviceId:', serviceId)
    }
  })

  // Test 1: Free tier: POST /owner/tenants → 403
  it('rejects tenant creation for free tier owner', async () => {
    const response = await request(app)
      .post('/api/v1/owner/tenants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Test Tenant' })

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('free_tier_cannot_create_tenants')
  })

  // Test 2: Upgrade ke Pro
  it('upgrades owner subscription to pro tier', async () => {
    // Login as super-admin
    const adminRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@satujasa.id',
      password: 'SuperAdmin123!',
    })

    expect(adminRes.status).toBe(200)
    const adminToken = adminRes.body.accessToken

    // Upgrade owner
    const upgradeRes = await request(app)
      .post(`/api/v1/admin/owners/${ownerId}/subscription`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        tier: 'pro',
        max_tenants: 5,
        max_admin_users: 10,
      })

    expect(upgradeRes.status).toBe(201)
    expect(upgradeRes.body.tier).toBe('pro')
  })

  // Test 3: POST /owner/tenants → 201 (now allowed for pro tier)
  it('creates tenant after pro tier upgrade', async () => {
    const response = await request(app)
      .post('/api/v1/owner/tenants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Test Tenant Pro' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('Test Tenant Pro')
    tenantId = response.body.id
  })

  // Test 4: GET /owner/tenants → 200 + array
  it('lists owner tenants', async () => {
    const response = await request(app)
      .get('/api/v1/owner/tenants')
      .set('Authorization', `Bearer ${ownerToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.data.length).toBeGreaterThan(0)
  })

  // Test 5: GET /owner/dashboard → 200 + stats
  it('returns owner dashboard stats', async () => {
    const response = await request(app)
      .get('/api/v1/owner/dashboard')
      .set('Authorization', `Bearer ${ownerToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('kpi')
    expect(response.body.kpi).toHaveProperty('total_tenants')
    expect(response.body.kpi).toHaveProperty('total_transactions')
    expect(response.body.kpi).toHaveProperty('active_transactions')
    expect(response.body.kpi).toHaveProperty('total_revenue')
    expect(response.body.kpi).toHaveProperty('trends')
    expect(response.body).toHaveProperty('tenants')
    expect(response.body).toHaveProperty('chart_30d')
    expect(response.body).toHaveProperty('activity')
    expect(response.body).toHaveProperty('subscription')
    expect(response.body).toHaveProperty('health')
  })

  it('returns owner report data', async () => {
    const response = await request(app)
      .get('/api/v1/owner/report')
      .set('Authorization', `Bearer ${ownerToken}`)

    expect(response.status).toBe(200)
    expect(response.body.period).toBe('monthly')
    expect(response.body).toHaveProperty('summary')
    expect(response.body.summary).toHaveProperty('total_transactions')
    expect(response.body.summary).toHaveProperty('total_revenue')
    expect(response.body.summary).toHaveProperty('active_transactions')
    expect(response.body.summary).toHaveProperty('completed_transactions')
    expect(response.body.summary).toHaveProperty('cancelled_transactions')
    expect(Array.isArray(response.body.status_distribution)).toBe(true)
    expect(Array.isArray(response.body.by_tenant)).toBe(true)
    expect(Array.isArray(response.body.monthly_revenue)).toBe(true)
  })

  it('rejects owner report range without dates', async () => {
    const response = await request(app)
      .get('/api/v1/owner/report?period=range')
      .set('Authorization', `Bearer ${ownerToken}`)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('date_range_required')
  })

  it('rejects owner report tenant outside owner scope', async () => {
    const response = await request(app)
      .get('/api/v1/owner/report?tenant_id=00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${ownerToken}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('tenant_not_found')
  })

  // Test 5b: GET /owner/bisnis → 200 + list
  it('returns owner bisnis list', async () => {
    const response = await request(app)
      .get('/api/v1/owner/bisnis')
      .set('Authorization', `Bearer ${ownerToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body).toHaveProperty('meta')
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.data.length).toBeGreaterThan(0)

    const item = response.body.data[0]
    expect(item).toHaveProperty('id')
    expect(item).toHaveProperty('name')
    expect(item).toHaveProperty('status')
    expect(item).toHaveProperty('tenant_count')
    expect(item).toHaveProperty('transaction_count')
    expect(item).toHaveProperty('created_at')
  })

  // Test 5c: GET /owner/bisnis?search= → filter
  it('filters owner bisnis by search', async () => {
    const response = await request(app)
      .get('/api/v1/owner/bisnis?search=Test+Tenant+Pro')
      .set('Authorization', `Bearer ${ownerToken}`)

    expect(response.status).toBe(200)
    expect(response.body.data.length).toBeGreaterThan(0)
    response.body.data.forEach((item: { name: string }) => {
      expect(item.name.toLowerCase()).toContain('test tenant pro')
    })
  })

  // Test 6: POST /owner/transactions → 201 (setelah punya tenant)
  it('creates transaction for tenant', async () => {
    const response = await request(app)
      .post(`/api/v1/owner/tenants/${tenantId}/transactions`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        customer_name: 'John Doe',
        customer_phone: '+628****1234',
        plate_number: 'B 1234 ABC',
        vehicle_type: 'car',
        service_id: serviceId,
        total_cost: 500000,
        notes: 'Test transaction',
      })

    console.log('Transaction creation response:', response.status, response.body)
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.status).toBe('received')
    transactionId = response.body.id
  })

  // Test 7a: PATCH /owner/transactions/:id/status → 200 + valid transition (received → document_check)
  it('updates transaction status with valid transition', async () => {
    const response = await request(app)
      .patch(`/api/v1/owner/tenants/${tenantId}/transactions/${transactionId}/status`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        status: 'document_check',
        notes: 'Started document check',
      })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('document_check')
  })

  // Test 7b: PATCH /owner/transactions/:id/status → 400 invalid transition
  it('rejects invalid transaction status transition', async () => {
    // First update to document_check
    await request(app)
      .patch(`/api/v1/owner/tenants/${tenantId}/transactions/${transactionId}/status`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ status: 'document_check', notes: 'Checking docs' })

    // Now try invalid transition: document_check → received (not allowed)
    const response = await request(app)
      .patch(`/api/v1/owner/tenants/${tenantId}/transactions/${transactionId}/status`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        status: 'received', // Cannot go back to received from document_check
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('invalid_status_transition')
  })
})
