import { Router } from 'express'
import { eq, and, isNull, sql } from 'drizzle-orm'

import type { Database } from '../db/index.js'
import { schema } from '../db/index.js'
import type { AppConfig } from '../config.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { tenantIsolation, getUserTenantId } from '../middleware/tenant-isolation.js'
import { validate, setTenantServiceSchema } from '../middleware/validate.js'

export function adminUserRoutes(db: Database, config: AppConfig): Router {
  const router = Router()

  router.use(authMiddleware(config))
  router.use(requireRole('admin-user'))
  router.use(tenantIsolation)

  // ─── Dashboard ────────────────────────────────────────────────────────────
  router.get('/dashboard', async (req, res) => {
    try {
      const tenantId = getUserTenantId(req)
      if (!tenantId) {
        res.status(403).json({ error: 'no_tenant_assigned' })
        return
      }

      const [txCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.transactions)
        .where(and(eq(schema.transactions.tenant_id, tenantId), isNull(schema.transactions.deleted_at)))

      const [activeTx] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.tenant_id, tenantId),
            sql`status NOT IN ('done', 'cancelled')`,
            isNull(schema.transactions.deleted_at)
          )
        )

      const [doneTx] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.tenant_id, tenantId),
            eq(schema.transactions.status, 'done'),
            isNull(schema.transactions.deleted_at)
          )
        )

      const [revenue] = await db
        .select({ total: sql<string>`COALESCE(sum(total_cost + additional_cost), 0)::text` })
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.tenant_id, tenantId),
            eq(schema.transactions.status, 'done'),
            isNull(schema.transactions.deleted_at)
          )
        )

      res.json({
        total_transactions: txCount?.count ?? 0,
        active_transactions: activeTx?.count ?? 0,
        done_transactions: doneTx?.count ?? 0,
        total_revenue: revenue?.total ?? '0',
      })
    } catch (error) {
      console.error('Admin dashboard error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Services ────────────────────────────────────────────────────────────
  router.get('/services', async (req, res) => {
    try {
      const tenantId = getUserTenantId(req)
      if (!tenantId) {
        res.status(403).json({ error: 'no_tenant_assigned' })
        return
      }

      const services = await db
        .select({
          id: schema.tenantServices.id,
          service_id: schema.tenantServices.service_id,
          service_code: schema.services.code,
          service_name: schema.services.name,
          price: schema.tenantServices.price,
          is_active: schema.tenantServices.is_active,
        })
        .from(schema.tenantServices)
        .innerJoin(schema.services, eq(schema.services.id, schema.tenantServices.service_id))
        .where(
          and(
            eq(schema.tenantServices.tenant_id, tenantId),
            isNull(schema.tenantServices.deleted_at)
          )
        )

      res.json({ data: services })
    } catch (error) {
      console.error('List services error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.post('/services', validate(setTenantServiceSchema), async (req, res) => {
    try {
      const tenantId = getUserTenantId(req)
      if (!tenantId) {
        res.status(403).json({ error: 'no_tenant_assigned' })
        return
      }

      const { service_id, price, is_active } = req.body as { service_id: string; price: number; is_active: boolean }

      const existing = await db
        .select()
        .from(schema.tenantServices)
        .where(
          and(
            eq(schema.tenantServices.tenant_id, tenantId),
            eq(schema.tenantServices.service_id, service_id),
            isNull(schema.tenantServices.deleted_at)
          )
        )
        .limit(1)

      if (existing.length > 0) {
        const [updated] = await db
          .update(schema.tenantServices)
          .set({ price: price.toString(), is_active, updated_at: new Date() })
          .where(eq(schema.tenantServices.id, existing[0]!.id))
          .returning()
        res.json(updated)
        return
      }

      const [ts] = await db
        .insert(schema.tenantServices)
        .values({
          tenant_id: tenantId,
          service_id,
          price: price.toString(),
          is_active,
        })
        .returning()

      res.status(201).json(ts)
    } catch (error) {
      console.error('Set service error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  return router
}
