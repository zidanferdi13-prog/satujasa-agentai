import { Router } from 'express'
import { eq, and, isNull, sql } from 'drizzle-orm'
import bcrypt from 'bcrypt'

import type { Database } from '../db/index.js'
import { schema } from '../db/index.js'
import type { AppConfig } from '../config.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { tenantIsolation } from '../middleware/tenant-isolation.js'
import { subscriptionEnforcement } from '../middleware/subscription.js'
import { validate, createTenantSchema, createAdminUserSchema, setTenantServiceSchema, createTransactionSchema, updateTransactionStatusSchema } from '../middleware/validate.js'
import { isValidTransition } from '../utils/transaction-state-machine.js'

export function ownerRoutes(db: Database, config: AppConfig): Router {
  const router = Router()

  router.use(authMiddleware(config))
  router.use(requireRole('owner'))
  router.use(tenantIsolation)

  const subforcement = subscriptionEnforcement(db)

  // ─── Dashboard ────────────────────────────────────────────────────────────
  router.get('/dashboard', async (req, res) => {
    try {
      const ownerId = req.user!.userId

      const [tenantCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.tenants)
        .where(and(eq(schema.tenants.owner_id, ownerId), isNull(schema.tenants.deleted_at)))

      const [txCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.transactions)
        .where(and(eq(schema.transactions.created_by, ownerId), isNull(schema.transactions.deleted_at)))

      const [activeTx] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.created_by, ownerId),
            sql`status NOT IN ('done', 'cancelled')`,
            isNull(schema.transactions.deleted_at)
          )
        )

      const [revenue] = await db
        .select({ total: sql<string>`COALESCE(sum(total_cost + additional_cost), 0)::text` })
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.created_by, ownerId),
            eq(schema.transactions.status, 'done'),
            isNull(schema.transactions.deleted_at)
          )
        )

      res.json({
        total_tenants: tenantCount?.count ?? 0,
        total_transactions: txCount?.count ?? 0,
        active_transactions: activeTx?.count ?? 0,
        total_revenue: revenue?.total ?? '0',
      })
    } catch (error) {
      console.error('Owner dashboard error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Tenants ─────────────────────────────────────────────────────────────
  router.get('/tenants', async (req, res) => {
    try {
      const ownerId = req.user!.userId

      const tenants = await db
        .select({
          id: schema.tenants.id,
          name: schema.tenants.name,
          created_at: schema.tenants.created_at,
        })
        .from(schema.tenants)
        .where(and(eq(schema.tenants.owner_id, ownerId), isNull(schema.tenants.deleted_at)))

      res.json({ data: tenants })
    } catch (error) {
      console.error('List tenants error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.post('/tenants', validate(createTenantSchema), async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const { name } = req.body as { name: string }

      const canCreate = await subforcement.checkCanCreateTenant(ownerId)
      if (!canCreate.allowed) {
        res.status(403).json({ error: canCreate.reason })
        return
      }

      const [tenant] = await db
        .insert(schema.tenants)
        .values({ owner_id: ownerId, name })
        .returning()

      res.status(201).json(tenant)
    } catch (error) {
      console.error('Create tenant error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.patch('/tenants/:id', validate(createTenantSchema), async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const tenantId = (req.params.id as string)!
      const { name } = req.body as { name: string }

      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.id, tenantId), eq(schema.tenants.owner_id, ownerId)))
        .limit(1)

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }

      const [updated] = await db
        .update(schema.tenants)
        .set({ name, updated_at: new Date() })
        .where(eq(schema.tenants.id, tenantId))
        .returning()

      res.json(updated)
    } catch (error) {
      console.error('Update tenant error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.delete('/tenants/:id', async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const tenantId = (req.params.id as string)!

      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.id, tenantId), eq(schema.tenants.owner_id, ownerId)))
        .limit(1)

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }

      await db
        .update(schema.tenants)
        .set({ deleted_at: new Date() })
        .where(eq(schema.tenants.id, tenantId))

      res.status(204).send()
    } catch (error) {
      console.error('Delete tenant error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Admin Users ─────────────────────────────────────────────────────────
  router.get('/tenants/:tenantId/admin-users', async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const tenantId = (req.params.tenantId as string)!

      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.id, tenantId), eq(schema.tenants.owner_id, ownerId)))
        .limit(1)

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }

      const admins = await db
        .select({
          id: schema.users.id,
          email: schema.users.email,
          phone: schema.users.phone,
          created_at: schema.users.created_at,
        })
        .from(schema.users)
        .where(
          and(
            eq(schema.users.role, 'admin-user'),
            eq(schema.users.tenant_id, tenantId),
            isNull(schema.users.deleted_at)
          )
        )

      res.json({ data: admins })
    } catch (error) {
      console.error('List admin users error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.post('/tenants/:tenantId/admin-users', validate(createAdminUserSchema), async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const tenantId = (req.params.tenantId as string)!
      const { email, phone, password } = req.body as { email: string; phone: string; password: string }

      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.id, tenantId), eq(schema.tenants.owner_id, ownerId)))
        .limit(1)

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }

      const canCreate = await subforcement.checkCanCreateAdminUser(ownerId)
      if (!canCreate.allowed) {
        res.status(403).json({ error: canCreate.reason })
        return
      }

      const existing = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1)
      if (existing.length > 0) {
        res.status(409).json({ error: 'email_already_exists' })
        return
      }

      const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS)
      const [admin] = await db
        .insert(schema.users)
        .values({
          email,
          phone,
          password_hash: passwordHash,
          role: 'admin-user',
          owner_id: ownerId,
          tenant_id: tenantId,
        })
        .returning()

      res.status(201).json({ id: admin!.id, email: admin!.email, phone: admin!.phone })
    } catch (error) {
      console.error('Create admin user error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.delete('/tenants/:tenantId/admin-users/:id', async (req, res) => {
    try {
      const tenantId = (req.params.tenantId as string)!
      const adminId = (req.params.id as string)!

      const [admin] = await db
        .select()
        .from(schema.users)
        .where(
          and(
            eq(schema.users.id, adminId),
            eq(schema.users.tenant_id, tenantId),
            eq(schema.users.role, 'admin-user')
          )
        )
        .limit(1)

      if (!admin) {
        res.status(404).json({ error: 'admin_user_not_found' })
        return
      }

      await db
        .update(schema.users)
        .set({ deleted_at: new Date() })
        .where(eq(schema.users.id, adminId))

      res.status(204).send()
    } catch (error) {
      console.error('Delete admin user error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Tenant Services ─────────────────────────────────────────────────────
  router.get('/tenants/:tenantId/services', async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const tenantId = (req.params.tenantId as string)!

      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.id, tenantId), eq(schema.tenants.owner_id, ownerId)))
        .limit(1)

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }

      const services = await db
        .select({
          id: schema.tenantServices.id,
          tenant_id: schema.tenantServices.tenant_id,
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
      console.error('List tenant services error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.post('/tenants/:tenantId/services', validate(setTenantServiceSchema), async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const tenantId = (req.params.tenantId as string)!
      const { service_id, price, is_active } = req.body as { service_id: string; price: number; is_active: boolean }

      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.id, tenantId), eq(schema.tenants.owner_id, ownerId)))
        .limit(1)

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }

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
      console.error('Set tenant service error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Transactions ────────────────────────────────────────────────────────
  router.get('/tenants/:tenantId/transactions', async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const tenantId = (req.params.tenantId as string)!

      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.id, tenantId), eq(schema.tenants.owner_id, ownerId)))
        .limit(1)

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }

      const transactions = await db
        .select()
        .from(schema.transactions)
        .where(and(eq(schema.transactions.tenant_id, tenantId), isNull(schema.transactions.deleted_at)))
        .orderBy(sql`${schema.transactions.created_at} DESC`)

      res.json({ data: transactions })
    } catch (error) {
      console.error('List transactions error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.post('/tenants/:tenantId/transactions', validate(createTransactionSchema), async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const tenantId = (req.params.tenantId as string)!
      const { customer_name, customer_phone, plate_number, vehicle_type, service_id, total_cost, notes } = req.body as {
        customer_name: string
        customer_phone: string
        plate_number: string
        vehicle_type: string
        service_id: string
        total_cost: number
        notes?: string
      }

      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.id, tenantId), eq(schema.tenants.owner_id, ownerId)))
        .limit(1)

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }

      const canCreate = await subforcement.checkCanCreateTransaction(ownerId)
      if (!canCreate.allowed) {
        res.status(403).json({ error: canCreate.reason })
        return
      }

      const customerId = (await db
        .insert(schema.customers)
        .values({
          tenant_id: tenantId,
          name: customer_name,
          phone: customer_phone,
          plate_number,
          vehicle_type,
        })
        .returning())[0]?.id

      if (!customerId) throw new Error('Failed to create customer')

      const txId = (await db
        .insert(schema.transactions)
        .values({
          tenant_id: tenantId,
          customer_id: customerId,
          service_id,
          created_by: ownerId,
          total_cost: total_cost.toString(),
          notes,
        })
        .returning())[0]?.id

      if (!txId) throw new Error('Failed to create transaction')

      await db.insert(schema.transactionStatusLog).values({
        transaction_id: txId,
        from_status: null,
        to_status: 'received',
        changed_by: ownerId,
      })

      const [tx] = await db.select().from(schema.transactions).where(eq(schema.transactions.id, txId)).limit(1)
      res.status(201).json(tx)
    } catch (error) {
      console.error('Create transaction error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.patch('/tenants/:tenantId/transactions/:id/status', validate(updateTransactionStatusSchema), async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const tenantId = (req.params.tenantId as string)!
      const txId = (req.params.id as string)!
      const { status, notes } = req.body as { status: string; notes?: string }

      const [tx] = await db
        .select()
        .from(schema.transactions)
        .where(and(eq(schema.transactions.id, txId), eq(schema.transactions.tenant_id, tenantId)))
        .limit(1)

      if (!tx) {
        res.status(404).json({ error: 'transaction_not_found' })
        return
      }

      if (!isValidTransition(tx.status, status as Parameters<typeof isValidTransition>[1])) {
        res.status(400).json({ error: 'invalid_status_transition' })
        return
      }

      const [updated] = await db
        .update(schema.transactions)
        .set({ status: status as Parameters<typeof isValidTransition>[1], updated_at: new Date() })
        .where(eq(schema.transactions.id, txId))
        .returning()

      await db.insert(schema.transactionStatusLog).values({
        transaction_id: txId,
        from_status: tx.status,
        to_status: status as Parameters<typeof isValidTransition>[1],
        changed_by: ownerId,
        notes,
      })

      res.json(updated)
    } catch (error) {
      console.error('Update transaction status error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  return router
}
