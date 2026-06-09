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

describe('Auth Routes', () => {
  const testEmail = `owner-${Date.now()}@test.local`
  const testPhone = '+6281234567890'
  const testPassword = 'Password123!'
  let accessToken: string // eslint-disable-line @typescript-eslint/no-unused-vars
  let refreshToken: string

  // Test 1: Register owner baru → 201 + token
  it('registers a new owner with email, phone, password', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      email: testEmail,
      phone: testPhone,
      password: testPassword,
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('accessToken')
    expect(response.body).toHaveProperty('refreshToken')
    expect(response.body.user.email).toBe(testEmail)
    expect(response.body.user.role).toBe('owner')

    accessToken = response.body.accessToken
    refreshToken = response.body.refreshToken
  })

  // Test 2: Register duplikat email → 409
  it('rejects duplicate email registration with 409', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      email: testEmail,
      phone: '+6281111111111',
      password: 'AnotherPass123!',
    })

    expect(response.status).toBe(409)
    expect(response.body.error).toBe('email_already_exists')
  })

  // Test 3: Login valid → 200 + accessToken + refreshToken cookie
  it('logs in with valid email and password', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: testEmail,
      password: testPassword,
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('accessToken')
    expect(response.body).toHaveProperty('refreshToken')
    expect(response.body.user.email).toBe(testEmail)
    expect(response.headers['set-cookie']).toBeDefined()
  })

  // Test 4: Login invalid password → 401
  it('rejects login with invalid password', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: testEmail,
      password: 'WrongPassword123!',
    })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('invalid_credentials')
  })

  // Test 5: Refresh token → 200 + new accessToken
  it('refreshes token with valid refresh token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('accessToken')
    expect(response.body).toHaveProperty('refreshToken')
    expect(response.headers['set-cookie']).toBeDefined()
  })

  // Test 6: Logout → 200 + cookie cleared
  it('logs out and clears access token cookie', async () => {
    const response = await request(app).post('/api/v1/auth/logout')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('logged_out')
    expect(response.headers['set-cookie']).toBeDefined()
  })
})
