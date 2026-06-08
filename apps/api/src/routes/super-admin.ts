import { Router } from 'express'
import { eq, and, isNull, sql } from 'drizzle-orm'

function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0]! : (value ?? '')
}

import type { Database } from '../db/index.js'
import { schema } from '../db/index.js'
import type { AppConfig } from '../config.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { validate, updateSubscriptionSchema } from '../middleware/validate.js'
import { TIER_DEFAULTS } from '@stnk/contracts'
import type { SubscriptionTier } from '@stnk/contracts'

export function superAdminRoutes(db: Database, config: AppConfig): Router {
  const router = Router()

  router.use(authMiddleware(config))
  router.use(requireRole('super-admin'))

  // GET /admin/dashboard
  router.get('/dashboard', async (_req, res) => {
    try {
      const [ownerCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.users)
        .where(and(eq(schema.users.role, 'owner'), isNull(schema.users.deleted_at)))

      const [tenantCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.tenants)
        .where(isNull(schema.tenants.deleted_at))

      const [txCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.transactions)
        .where(isNull(schema.transactions.deleted_at))

      const [revenue] = await db
        .select({ total: sql<string>`COALESCE(sum(total_cost + additional_cost), 0)::text` })
        .from(schema.transactions)
        .where(and(eq(schema.transactions.status, 'done'), isNull(schema.transactions.deleted_at)))

      res.json({
        total_owners: ownerCount?.count ?? 0,
        active_owners: ownerCount?.count ?? 0,
        total_tenants: tenantCount?.count ?? 0,
        total_transactions: txCount?.count ?? 0,
        total_revenue: revenue?.total ?? '0',
      })
    } catch (error) {
      console.error('Dashboard error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // GET /admin/owners
  router.get('/owners', async (_req, res) => {
    try {
      const owners = await db
        .select({
          id: schema.users.id,
          email: schema.users.email,
          phone: schema.users.phone,
          role: schema.users.role,
          created_at: schema.users.created_at,
        })
        .from(schema.users)
        .where(and(eq(schema.users.role, 'owner'), isNull(schema.users.deleted_at)))

      res.json({ data: owners })
    } catch (error) {
      console.error('List owners error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // GET /admin/owners/:id
  router.get('/owners/:id', async (req, res) => {
    try {
      const [owner] = await db
        .select()
        .from(schema.users)
        .where(and(eq(schema.users.id, param(req.params['id'])), eq(schema.users.role, 'owner')))
        .limit(1)

      if (!owner) {
        res.status(404).json({ error: 'owner_not_found' })
        return
      }

      const [sub] = await db
        .select()
        .from(schema.subscriptions)
        .where(and(eq(schema.subscriptions.owner_id, owner.id), isNull(schema.subscriptions.deleted_at)))
        .limit(1)

      res.json({
        id: owner.id,
        email: owner.email,
        phone: owner.phone,
        role: owner.role,
        created_at: owner.created_at,
        subscription: sub || null,
      })
    } catch (error) {
      console.error('Get owner error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // GET /admin/owners/:id/subscription
  router.get('/owners/:id/subscription', async (req, res) => {
    try {
      const [sub] = await db
        .select()
        .from(schema.subscriptions)
        .where(and(eq(schema.subscriptions.owner_id, param(req.params['id'])), isNull(schema.subscriptions.deleted_at)))
        .limit(1)

      if (!sub) {
        res.status(404).json({ error: 'subscription_not_found' })
        return
      }

      res.json(sub)
    } catch (error) {
      console.error('Get subscription error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // POST /admin/owners/:id/subscription
  router.post('/owners/:id/subscription', validate(updateSubscriptionSchema), async (req, res) => {
    try {
      const { tier, max_tenants, max_admin_users } = req.body as {
        tier: SubscriptionTier
        max_tenants?: number
        max_admin_users?: number
      }

      const defaults = TIER_DEFAULTS[tier]
      const finalMaxTenants = max_tenants ?? defaults.max_tenants
      const finalMaxAdminUsers = max_admin_users ?? defaults.max_admin_users

      // Soft-delete old subscription
      await db
        .update(schema.subscriptions)
        .set({ deleted_at: new Date() })
        .where(and(eq(schema.subscriptions.owner_id, param(req.params['id'])), isNull(schema.subscriptions.deleted_at)))

      const [sub] = await db
        .insert(schema.subscriptions)
        .values({
          owner_id: param(req.params['id']),
          tier,
          max_tenants: finalMaxTenants,
          max_admin_users: finalMaxAdminUsers,
          activated_by: req.user!.userId,
          activated_at: new Date(),
        })
        .returning()

      res.status(201).json(sub)
    } catch (error) {
      console.error('Create subscription error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // PATCH /admin/owners/:id/subscription
  router.patch('/owners/:id/subscription', validate(updateSubscriptionSchema), async (req, res) => {
    try {
      const { tier, max_tenants, max_admin_users } = req.body as {
        tier: SubscriptionTier
        max_tenants?: number
        max_admin_users?: number
      }

      const defaults = TIER_DEFAULTS[tier]

      const [sub] = await db
        .update(schema.subscriptions)
        .set({
          tier,
          max_tenants: max_tenants ?? defaults.max_tenants,
          max_admin_users: max_admin_users ?? defaults.max_admin_users,
          activated_by: req.user!.userId,
          activated_at: new Date(),
          updated_at: new Date(),
        })
        .where(and(eq(schema.subscriptions.owner_id, param(req.params['id'])), isNull(schema.subscriptions.deleted_at)))
        .returning()

      if (!sub) {
        res.status(404).json({ error: 'subscription_not_found' })
        return
      }

      res.json(sub)
    } catch (error) {
      console.error('Update subscription error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // GET /admin/settings
  router.get('/settings', async (_req, res) => {
    try {
      const allServices = await db
        .select()
        .from(schema.services)
        .where(isNull(schema.services.deleted_at))

      res.json({ services: allServices })
    } catch (error) {
      console.error('Get settings error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  return router
}
