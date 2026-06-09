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
      .get('/api/v1/admin/services')
      .set('Authorization', `Bearer ${adminToken}`)

    if (servicesRes.body.data && servicesRes.body.data.length > 0) {
      serviceId = servicesRes.body.data[0].id
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
    expect(response.body).toHaveProperty('total_tenants')
    expect(response.body).toHaveProperty('total_transactions')
    expect(response.body).toHaveProperty('active_transactions')
    expect(response.body).toHaveProperty('total_revenue')
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

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.status).toBe('received')
    transactionId = response.body.id
  })

  // Test 7a: PATCH /owner/transactions/:id/status → 200 + valid transition
  it('updates transaction status with valid transition', async () => {
    const response = await request(app)
      .patch(`/api/v1/owner/tenants/${tenantId}/transactions/${transactionId}/status`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        status: 'in_progress',
        notes: 'Started processing',
      })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('in_progress')
  })

  // Test 7b: PATCH /owner/transactions/:id/status → 400 invalid transition
  it('rejects invalid transaction status transition', async () => {
    const response = await request(app)
      .patch(`/api/v1/owner/tenants/${tenantId}/transactions/${transactionId}/status`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        status: 'received', // Cannot go back to received from in_progress
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('invalid_status_transition')
  })
})
