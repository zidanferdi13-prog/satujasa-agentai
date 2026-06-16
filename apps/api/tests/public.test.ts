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
  // Test 1: GET /api/v1/health → 200 + `{ status: "ok" }`
  it('returns health check', async () => {
    const response = await request(app).get('/api/v1/health')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('service')
    expect(response.body).toHaveProperty('status')
    expect(response.body).toHaveProperty('timestamp')
    expect(response.body.service).toBe('stnk-jasa-api')
    expect(response.body.status).toBe('ok')
  })

  // Test 2: GET /api/v1/meta/roles → 200 + 3 roles
  it('returns supported application roles', async () => {
    const response = await request(app).get('/api/v1/meta/roles')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('roles')
    expect(Array.isArray(response.body.roles)).toBe(true)
    expect(response.body.roles).toContain('super-admin')
    expect(response.body.roles).toContain('owner')
    expect(response.body.roles).toContain('admin-user')
    expect(response.body.roles.length).toBe(3)
  })

  // Test 3: GET /monitoring/:token valid → 200 + transaction data
  it('returns transaction monitoring data with valid token', async () => {
    // Setup: Create transaction with monitoring token
    const ownerRes = await request(app).post('/api/v1/auth/register').send({
      email: `owner-${Date.now()}@test.local`,
      phone: '+628****7890',
      password: 'Password123!',
    })

    const ownerToken = ownerRes.body.accessToken
    const ownerId = ownerRes.body.user.id

    // Upgrade to pro
    const adminRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@satujasa.id',
      password: 'SuperAdmin123!',
    })
    const adminToken = adminRes.body.accessToken
    const servicesRes = await request(app)
      .get('/api/v1/admin/services')
      .set('Authorization', `Bearer ${adminToken}`)
    const serviceId = servicesRes.body.data[0].id

    await request(app)
      .post(`/api/v1/admin/owners/${ownerId}/subscription`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ tier: 'pro' })

    // Create tenant
    const tenantRes = await request(app)
      .post('/api/v1/owner/tenants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Test Tenant' })

    const tenantId = tenantRes.body.id

    // Create transaction
    const txRes = await request(app)
      .post(`/api/v1/owner/tenants/${tenantId}/transactions`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        customer_name: 'Jane Doe',
        customer_phone: '+628****5555',
        plate_number: 'B 5555 XYZ',
        vehicle_type: 'motorcycle',
        service_id: serviceId,
        total_cost: 300000,
      })

    expect(txRes.status).toBe(201)
    const monitoringToken = txRes.body.monitoring_token

    // Use monitoring token to fetch transaction
    const response = await request(app).get(`/api/v1/monitoring/${monitoringToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('service_name')
    expect(response.body).toHaveProperty('status')
    expect(response.body).toHaveProperty('total_cost')
    expect(response.body).toHaveProperty('customer_name')
    expect(response.body).toHaveProperty('plate_number')
    expect(response.body).toHaveProperty('tenant_name')
    expect(response.body).toHaveProperty('created_at')
    expect(response.body).toHaveProperty('status_history')
    expect(response.body.customer_name).toBe('Jane Doe')
    expect(response.body.plate_number).toBe('B 5555 XYZ')
  })

  // Test 4: GET /monitoring/:token invalid → 404
  it('returns 404 for invalid monitoring token', async () => {
    const response = await request(app).get('/api/v1/monitoring/invalid-token-12345')

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('transaction_not_found')
  })
})
