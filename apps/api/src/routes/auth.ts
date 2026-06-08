import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'

import type { Database } from '../db/index.js'
import { schema } from '../db/index.js'
import type { AppConfig } from '../config.js'
import { validate, registerSchema, loginSchema } from '../middleware/validate.js'
import { rateLimit } from '../middleware/rate-limit.js'
import type { AuthPayload } from '../middleware/auth.js'

export function authRoutes(db: Database, config: AppConfig): Router {
  const router = Router()

  const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 })

  // POST /auth/register — owner registration
  router.post('/register', authRateLimit, validate(registerSchema), async (req, res) => {
    try {
      const { email, phone, password } = req.body as { email: string; phone: string; password: string }

      // Check if email exists
      const existing = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1)

      if (existing.length > 0) {
        res.status(409).json({ error: 'email_already_exists' })
        return
      }

      const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS)

      const [user] = await db
        .insert(schema.users)
        .values({
          email,
          phone,
          password_hash: passwordHash,
          role: 'owner',
        })
        .returning()

      // Create free subscription
      await db.insert(schema.subscriptions).values({
        owner_id: user!.id,
        tier: 'free',
        max_tenants: 0,
        max_admin_users: 0,
      })

      const payload: AuthPayload = {
        userId: user!.id,
        email: user!.email,
        role: user!.role,
        ownerId: null,
        tenantId: null,
      }

      const accessToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN as unknown as number })
      const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRES_IN as unknown as number })

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      })

      res.status(201).json({
        user: { id: user!.id, email: user!.email, phone: user!.phone, role: user!.role },
        accessToken,
        refreshToken,
      })
    } catch (error) {
      console.error('Register error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // POST /auth/login
  router.post('/login', authRateLimit, validate(loginSchema), async (req, res) => {
    try {
      const { email, password } = req.body as { email: string; password: string }

      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1)

      if (!user) {
        res.status(401).json({ error: 'invalid_credentials' })
        return
      }

      const validPassword = await bcrypt.compare(password, user.password_hash)
      if (!validPassword) {
        res.status(401).json({ error: 'invalid_credentials' })
        return
      }

      if (user.deleted_at) {
        res.status(401).json({ error: 'account_deactivated' })
        return
      }

      const payload: AuthPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        ownerId: user.owner_id,
        tenantId: user.tenant_id,
      }

      const accessToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN as unknown as number })
      const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRES_IN as unknown as number })

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      })

      res.status(200).json({
        user: { id: user.id, email: user.email, phone: user.phone, role: user.role },
        accessToken,
        refreshToken,
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // POST /auth/logout
  router.post('/logout', (_req, res) => {
    res.clearCookie('access_token')
    res.status(200).json({ message: 'logged_out' })
  })

  // POST /auth/refresh
  router.post('/refresh', authRateLimit, async (req, res) => {
    try {
      const refreshToken = req.body?.refreshToken || req.headers['x-refresh-token']
      if (!refreshToken) {
        res.status(400).json({ error: 'refresh_token_required' })
        return
      }

      const payload = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as AuthPayload
      const newPayload: AuthPayload = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        ownerId: payload.ownerId,
        tenantId: payload.tenantId,
      }

      const accessToken = jwt.sign(newPayload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN as unknown as number })
      const newRefreshToken = jwt.sign(newPayload, config.JWT_REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRES_IN as unknown as number })

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      })

      res.status(200).json({ accessToken, refreshToken: newRefreshToken })
    } catch {
      res.status(401).json({ error: 'invalid_refresh_token' })
    }
  })

  return router
}
