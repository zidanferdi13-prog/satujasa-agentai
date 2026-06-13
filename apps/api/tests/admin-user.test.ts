import request from 'supertest'
import { describe, expect, it, beforeAll, beforeEach } from 'vitest'
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
    expect(createAdminRes.body.id).toBeTruthy()

    // Get services to find a valid service_id
    const servicesRes = await request(app)
      .get('/api/v1/public/services')
    if (servicesRes.body && servicesRes.body.length > 0) {
      const fiveYearService = servicesRes.body.find((service: { code: string }) => service.code === 'perpanjang-5tahun')
      serviceId = fiveYearService?.id ?? servicesRes.body[0].id
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

  // Test 5: Requirements endpoint returns all manual fee components and document checklist
  it('returns all manual fee components for transaction creation', async () => {
    if (!serviceId) {
      console.log('No service_id available, skipping test')
      return
    }

    await request(app)
      .post('/api/v1/admin-user/services')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({ service_id: serviceId, price: 75000, is_active: true })

    const response = await request(app)
      .get('/api/v1/admin-user/transactions/requirements')
      .query({ service_id: serviceId, vehicle_type_code: 'MOTOR', province_code: 'JABAR' })
      .set('Authorization', `Bearer ${adminUserToken}`)

    expect(response.status).toBe(200)
    expect(response.body.service.id).toBe(serviceId)
    expect(response.body.vehicleType.code).toBe('MOTOR')
    expect(Array.isArray(response.body.fees)).toBe(true)
    expect(Array.isArray(response.body.documents)).toBe(true)
    expect(response.body.fees.length).toBeGreaterThanOrEqual(16)
    expect(response.body.fees).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          componentCode: 'JASA_BIRO',
          defaultAmount: '75000.00',
          amount: '75000.00',
          isEditable: true,
          source: 'tenant_pricing',
        }),
        expect.objectContaining({
          componentCode: 'PKB_POKOK',
          defaultAmount: '0.00',
          amount: '0.00',
          isEditable: true,
          source: 'component_template',
        }),
      ])
    )
  })

  it('returns manual fee components for JKT without fee rules dependency', async () => {
    if (!serviceId) {
      console.log('No service_id available, skipping test')
      return
    }

    await request(app)
      .post('/api/v1/admin-user/services')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({ service_id: serviceId, price: 75000, is_active: true })

    const response = await request(app)
      .get('/api/v1/admin-user/transactions/requirements')
      .query({ service_id: serviceId, vehicle_type_code: 'MOTOR', province_code: 'JKT' })
      .set('Authorization', `Bearer ${adminUserToken}`)

    expect(response.status).toBe(200)
    expect(response.body.provinceCode).toBe('JKT')
    expect(response.body.fees.length).toBeGreaterThan(1)
    expect(response.body.fees).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ componentCode: 'PKB_POKOK', source: 'component_template', isEditable: true, amount: '0.00' }),
        expect.objectContaining({ componentCode: 'JASA_BIRO', source: 'tenant_pricing', isEditable: true, amount: '75000.00' }),
      ])
    )
  })

  // Test 6: Create transaction with fee_details snapshots submitted amounts
  it('creates transaction snapshots and calculates total from fee detail amounts', async () => {
    if (!serviceId) {
      console.log('No service_id available, skipping test')
      return
    }

    const response = await request(app)
      .post('/api/v1/admin-user/transactions')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({
        customer_name: 'Budi Fee',
        customer_phone: '081234567890',
        vehicle_plate: 'D1234ABC',
        vehicle_type_code: 'MOTOR',
        service_id: serviceId,
        province_code: 'JABAR',
        city_code: 'BDG',
        city_name: 'Bandung',
        tax_due_date: '2026-12-31',
        total_cost: 999999,
        fee_details: [
          { component_code: 'PKB_POKOK', amount: 100000 },
          { component_code: 'SWDKLLJ_POKOK', amount: 35000 },
          { component_code: 'JASA_BIRO', amount: 65000 },
        ],
      })

    expect(response.status).toBe(201)
    expect(response.body.status).toBe('DRAFT')
    expect(response.body.total_cost).toBe('200000.00')
    expect(response.body.additional_cost).toBe('0')
    expect(response.body.item).toEqual(expect.objectContaining({ vehicle_type_code: 'MOTOR' }))
    expect(response.body.fee_details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ component_code: 'PKB_POKOK', amount: '100000.00' }),
        expect.objectContaining({ component_code: 'SWDKLLJ_POKOK', amount: '35000.00' }),
        expect.objectContaining({ component_code: 'JASA_BIRO', default_amount: '75000.00', amount: '65000.00', source: 'tenant_pricing' }),
      ])
    )
    const feeUpdateResponse = await request(app)
      .patch(`/api/v1/admin-user/transactions/${response.body.id}/fees`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({
        feeDetails: [
          { componentCode: 'PKB_POKOK', amount: 120000 },
          { componentCode: 'JASA_BIRO', amount: 50000 },
        ],
      })
    expect(feeUpdateResponse.status).toBe(200)
    expect(feeUpdateResponse.body.total_cost).toBe('205000.00')
    expect(feeUpdateResponse.body.transaction.total_cost).toBe('205000.00')
    expect(feeUpdateResponse.body.fee_details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ component_code: 'PKB_POKOK', default_amount: '0.00', amount: '120000.00' }),
        expect.objectContaining({ component_code: 'SWDKLLJ_POKOK', amount: '35000.00' }),
        expect.objectContaining({ component_code: 'JASA_BIRO', default_amount: '75000.00', amount: '50000.00' }),
      ])
    )

    const detailAfterFeeUpdate = await request(app)
      .get(`/api/v1/admin-user/transactions/${response.body.id}`)
      .set('Authorization', `Bearer ${adminUserToken}`)
    expect(detailAfterFeeUpdate.status).toBe(200)
    expect(detailAfterFeeUpdate.body.total_cost).toBe('205000.00')

    const invalidFeeResponse = await request(app)
      .patch(`/api/v1/admin-user/transactions/${response.body.id}/fees`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({ fee_details: [{ component_code: 'UNKNOWN_COMPONENT', amount: 1 }] })
    expect(invalidFeeResponse.status).toBe(400)
    expect(invalidFeeResponse.body.error).toBe('fee_component_not_in_snapshot')

    const duplicateFeeResponse = await request(app)
      .patch(`/api/v1/admin-user/transactions/${response.body.id}/fees`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({ feeDetails: [
        { componentCode: 'PKB_POKOK', amount: 1 },
        { componentCode: 'PKB_POKOK', amount: 2 },
      ] })
    expect(duplicateFeeResponse.status).toBe(400)
    expect(duplicateFeeResponse.body.error).toBe('duplicate_fee_component')

    const validStatusResponse = await request(app)
      .patch(`/api/v1/admin-user/transactions/${response.body.id}/status`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({ status: 'DOKUMEN_DITERIMA' })
    expect(validStatusResponse.status).toBe(200)
    expect(validStatusResponse.body).toEqual(expect.objectContaining({
      id: response.body.id,
      status: 'DOKUMEN_DITERIMA',
      previous_status: 'DRAFT',
    }))
    expect(validStatusResponse.body.status_updated_at).toBeTruthy()

    const logsResponse = await request(app)
      .get(`/api/v1/admin-user/transactions/${response.body.id}/logs`)
      .set('Authorization', `Bearer ${adminUserToken}`)
    expect(logsResponse.status).toBe(200)
    expect(Array.isArray(logsResponse.body.logs)).toBe(true)
    expect(logsResponse.body.logs.length).toBeGreaterThanOrEqual(1)
    const statusLog = logsResponse.body.logs[0]
    expect(statusLog.to_status).toBe('DOKUMEN_DITERIMA')
    expect(statusLog.from_status).toBe('DRAFT')
    expect(statusLog.changed_by).toHaveProperty('id')
    expect(statusLog.changed_by).toHaveProperty('email')
    expect(statusLog.created_at).toBeTruthy()

    const emptyLogsTx = await request(app)
      .post('/api/v1/admin-user/transactions')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({
        customer_name: 'No Logs Yet',
        customer_phone: '081234567899',
        vehicle_plate: 'D9999ABC',
        vehicle_type_code: 'MOTOR',
        service_id: serviceId,
        province_code: 'JABAR',
        fee_details: [{ component_code: 'JASA_BIRO', amount: 50000 }],
      })
    const emptyLogsRes = await request(app)
      .get(`/api/v1/admin-user/transactions/${emptyLogsTx.body.id}/logs`)
      .set('Authorization', `Bearer ${adminUserToken}`)
    expect(emptyLogsRes.status).toBe(200)
    expect(Array.isArray(emptyLogsRes.body.logs)).toBe(true)
    expect(emptyLogsRes.body.logs[0].to_status).toBe('received')

    const noOpStatusResponse = await request(app)
      .patch(`/api/v1/admin-user/transactions/${response.body.id}/status`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({ status: 'DOKUMEN_DITERIMA' })
    expect(noOpStatusResponse.status).toBe(400)
    expect(noOpStatusResponse.body.error).toBe('already_in_status')

    const invalidStatusResponse = await request(app)
      .patch(`/api/v1/admin-user/transactions/${response.body.id}/status`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({ status: 'SELESAI' })
    expect(invalidStatusResponse.status).toBe(400)
    expect(invalidStatusResponse.body.error).toBe('invalid_status_transition')
    expect(invalidStatusResponse.body.details).toEqual({ from: 'DOKUMEN_DITERIMA', to: 'SELESAI' })

    const detailAfterStatusUpdate = await request(app)
      .get(`/api/v1/admin-user/transactions/${response.body.id}`)
      .set('Authorization', `Bearer ${adminUserToken}`)
    expect(detailAfterStatusUpdate.status).toBe(200)
    expect(detailAfterStatusUpdate.body.status).toBe('DOKUMEN_DITERIMA')
    expect(detailAfterStatusUpdate.body.status_updated_at).toBeTruthy()
    expect(Array.isArray(response.body.document_checklists)).toBe(true)
    const checklist = response.body.document_checklists[0]
    expect(checklist).toBeTruthy()

    const checkedResponse = await request(app)
      .patch(`/api/v1/admin-user/transactions/${response.body.id}/document-checklists/${checklist.id}`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({ isChecked: true })
    expect(checkedResponse.status).toBe(200)
    expect(checkedResponse.body.id).toBe(checklist.id)
    expect(checkedResponse.body.is_checked).toBe(true)

    const detailAfterCheck = await request(app)
      .get(`/api/v1/admin-user/transactions/${response.body.id}`)
      .set('Authorization', `Bearer ${adminUserToken}`)
    expect(detailAfterCheck.status).toBe(200)
    expect(detailAfterCheck.body.document_checklists).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: checklist.id, is_checked: true }),
      ])
    )

    const uncheckedResponse = await request(app)
      .patch(`/api/v1/admin-user/transactions/${response.body.id}/document-checklists/${checklist.id}`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({ isChecked: false })
    expect(uncheckedResponse.status).toBe(200)
    expect(uncheckedResponse.body.is_checked).toBe(false)
  })

  it('rejects checklist update when checklist is not under requested transaction', async () => {
    if (!serviceId) {
      console.log('No service_id available, skipping test')
      return
    }

    const firstTx = await request(app)
      .post('/api/v1/admin-user/transactions')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({
        customer_name: 'Checklist One',
        customer_phone: '081234567892',
        vehicle_plate: 'D5678ABC',
        vehicle_type_code: 'MOTOR',
        service_id: serviceId,
        province_code: 'JABAR',
        fee_details: [{ component_code: 'JASA_BIRO', amount: 50000 }],
      })
    const secondTx = await request(app)
      .post('/api/v1/admin-user/transactions')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({
        customer_name: 'Checklist Two',
        customer_phone: '081234567893',
        vehicle_plate: 'D5679ABC',
        vehicle_type_code: 'MOTOR',
        service_id: serviceId,
        province_code: 'JABAR',
        fee_details: [{ component_code: 'JASA_BIRO', amount: 50000 }],
      })

    const checklist = firstTx.body.document_checklists[0]
    expect(checklist).toBeTruthy()

    const response = await request(app)
      .patch(`/api/v1/admin-user/transactions/${secondTx.body.id}/document-checklists/${checklist.id}`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({ isChecked: true })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('document_checklist_not_found')
  })

  it('returns 404 for logs of non-existent or cross-tenant transaction', async () => {
    const response = await request(app)
      .get('/api/v1/admin-user/transactions/00000000-0000-0000-0000-000000000000/logs')
      .set('Authorization', `Bearer ${adminUserToken}`)
    expect(response.status).toBe(404)
    expect(response.body.error).toBe('transaction_not_found')
  })

  it('creates JKT transaction snapshots with manual fee rows and stores selected province', async () => {
    if (!serviceId) {
      console.log('No service_id available, skipping test')
      return
    }

    const response = await request(app)
      .post('/api/v1/admin-user/transactions')
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({
        customer_name: 'Budi JKT Fee',
        customer_phone: '081234567891',
        vehicle_plate: 'B1234ABC',
        vehicle_type_code: 'MOTOR',
        service_id: serviceId,
        province_code: 'JKT',
        city_code: 'JKTSEL',
        city_name: 'Jakarta Selatan',
        tax_due_date: '2026-12-31',
        total_cost: 999999,
        fee_details: [
          { component_code: 'PKB_POKOK', amount: 100000 },
          { component_code: 'SWDKLLJ_POKOK', amount: 35000 },
          { component_code: 'PNBP_STNK', amount: 100000 },
          { component_code: 'PNBP_TNKB', amount: 60000 },
          { component_code: 'JASA_BIRO', amount: 75000 },
        ],
      })

    expect(response.status).toBe(201)
    expect(response.body.total_cost).toBe('370000.00')
    expect(response.body.item).toEqual(expect.objectContaining({ province_code: 'JKT', city_code: 'JKTSEL' }))
    expect(response.body.fee_details.length).toBeGreaterThan(1)
    expect(response.body.fee_details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ component_code: 'PKB_POKOK', source: 'manual', default_amount: '0.00' }),
        expect.objectContaining({ component_code: 'SWDKLLJ_POKOK', source: 'manual', default_amount: '0.00' }),
        expect.objectContaining({ component_code: 'PNBP_STNK', source: 'manual', default_amount: '0.00' }),
        expect.objectContaining({ component_code: 'PNBP_TNKB', source: 'manual', default_amount: '0.00' }),
        expect.objectContaining({ component_code: 'JASA_BIRO', source: 'tenant_pricing', default_amount: '75000.00', amount: '75000.00' }),
      ])
    )
  })

  // Test 8: Block access to other tenant → 403
  it('blocks admin-user access to other tenant services', async () => {
    const otherTenantId = '01ARZ3NDEKTSV4RRFFQ69G5FAV'
    const response = await request(app)
      .get(`/api/v1/owner/tenants/${otherTenantId}/services`)
      .set('Authorization', `Bearer ${adminUserToken}`)
    expect(response.status).toBe(403)
    expect(response.body.error).toBe('forbidden')
  })
})
