import { Router } from 'express'
import { eq, and, isNull, sql, inArray } from 'drizzle-orm'

function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0]! : (value ?? '')
}

import type { Database } from '../db/index.js'
import { schema } from '../db/index.js'
import type { AppConfig } from '../config.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { tenantIsolation } from '../middleware/tenant-isolation.js'
import { subscriptionEnforcement } from '../middleware/subscription.js'
import {
  validate,
  createTenantSchema,
  updateTenantSchema,
  createAdminUserSchema,
  setTenantServiceSchema,
  createTransactionSchema,
  updateTransactionStatusSchema,
} from '../middleware/validate.js'
import { isValidTransition } from '../utils/transaction-state-machine.js'
import { generateWaLink } from '../utils/wa-template.js'
import type { TransactionStatus } from '@stnk/contracts'
import bcrypt from 'bcrypt'

export function ownerRoutes(db: Database, config: AppConfig): Router {
  const router = Router()
  const enforce = subscriptionEnforcement(db)

  router.use(authMiddleware(config))
  router.use(requireRole('owner'))
  router.use(tenantIsolation)

  // ─── Dashboard ────────────────────────────────────────────────────────────

  router.get('/dashboard', async (req, res) => {
    try {
      const ownerId = req.user!.userId

      const ownerTenants = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.owner_id, ownerId), isNull(schema.tenants.deleted_at)))

      const tenantIds = ownerTenants.map((t) => t.id)

      if (tenantIds.length === 0) {
        res.json({
          total_tenants: 0,
          total_transactions: 0,
          active_transactions: 0,
          total_revenue: '0',
          revenue_per_tenant: [],
        })
        return
      }

      const [txCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.transactions)
        .where(and(inArray(schema.transactions.tenant_id, tenantIds), isNull(schema.transactions.deleted_at)))

      const [activeTx] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.transactions)
        .where(
          and(
            inArray(schema.transactions.tenant_id, tenantIds),
            isNull(schema.transactions.deleted_at),
            sql`status NOT IN ('done', 'cancelled')`,
          ),
        )

      const [revenue] = await db
        .select({ total: sql<string>`COALESCE(sum(total_cost + additional_cost), 0)::text` })
        .from(schema.transactions)
        .where(
          and(
            inArray(schema.transactions.tenant_id, tenantIds),
            eq(schema.transactions.status, 'done'),
            isNull(schema.transactions.deleted_at),
          ),
        )

      const revenuePerTenant = await Promise.all(
        ownerTenants.map(async (tenant) => {
          const [r] = await db
            .select({ total: sql<string>`COALESCE(sum(total_cost + additional_cost), 0)::text` })
            .from(schema.transactions)
            .where(
              and(
                eq(schema.transactions.tenant_id, tenant.id),
                eq(schema.transactions.status, 'done'),
                isNull(schema.transactions.deleted_at),
              ),
            )
          return { tenant_id: tenant.id, tenant_name: tenant.name, revenue: r?.total ?? '0' }
        }),
      )

      res.json({
        total_tenants: ownerTenants.length,
        total_transactions: txCount?.count ?? 0,
        active_transactions: activeTx?.count ?? 0,
        total_revenue: revenue?.total ?? '0',
        revenue_per_tenant: revenuePerTenant,
      })
    } catch (error) {
      console.error('Owner dashboard error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Tenants ──────────────────────────────────────────────────────────────

  router.get('/tenants', async (req, res) => {
    try {
      const tenants = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.owner_id, req.user!.userId), isNull(schema.tenants.deleted_at)))
      res.json({ data: tenants })
    } catch (error) {
      console.error('List tenants error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.post('/tenants', validate(createTenantSchema), async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const check = await enforce.checkCanCreateTenant(ownerId)
      if (!check.allowed) {
        res.status(403).json({ error: check.reason })
        return
      }

      const [tenant] = await db
        .insert(schema.tenants)
        .values({ name: req.body.name, owner_id: ownerId })
        .returning()

      // Auto-seed all default services into tenant_services
      const defaultServices = await db
        .select()
        .from(schema.services)
        .where(and(eq(schema.services.is_default, true), isNull(schema.services.deleted_at)))

      if (defaultServices.length > 0) {
        await db.insert(schema.tenantServices).values(
          defaultServices.map((svc) => ({
            tenant_id: tenant!.id,
            service_id: svc.id,
            price: '0',
            is_active: true,
          })),
        )
      }

      res.status(201).json(tenant)
    } catch (error) {
      console.error('Create tenant error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.patch('/tenants/:id', validate(updateTenantSchema), async (req, res) => {
    try {
      const [tenant] = await db
        .update(schema.tenants)
        .set({ name: req.body.name, updated_at: new Date() })
        .where(
          and(
            eq(schema.tenants.id, param(req.params['id'])),
            eq(schema.tenants.owner_id, req.user!.userId),
            isNull(schema.tenants.deleted_at),
          ),
        )
        .returning()

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }
      res.json(tenant)
    } catch (error) {
      console.error('Update tenant error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.delete('/tenants/:id', async (req, res) => {
    try {
      const [tenant] = await db
        .update(schema.tenants)
        .set({ deleted_at: new Date() })
        .where(
          and(
            eq(schema.tenants.id, param(req.params['id'])),
            eq(schema.tenants.owner_id, req.user!.userId),
            isNull(schema.tenants.deleted_at),
          ),
        )
        .returning()

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }
      res.status(204).send()
    } catch (error) {
      console.error('Delete tenant error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Admin Users ──────────────────────────────────────────────────────────

  router.get('/tenants/:tenantId/admin-users', async (req, res) => {
    try {
      const users = await db
        .select({
          id: schema.users.id,
          email: schema.users.email,
          phone: schema.users.phone,
          role: schema.users.role,
          tenant_id: schema.users.tenant_id,
          created_at: schema.users.created_at,
        })
        .from(schema.users)
        .where(
          and(
            eq(schema.users.owner_id, req.user!.userId),
            eq(schema.users.tenant_id, param(req.params['tenantId'])),
            eq(schema.users.role, 'admin-user'),
            isNull(schema.users.deleted_at),
          ),
        )
      res.json({ data: users })
    } catch (error) {
      console.error('List admin users error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.post('/tenants/:tenantId/admin-users', validate(createAdminUserSchema), async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const check = await enforce.checkCanCreateAdminUser(ownerId)
      if (!check.allowed) {
        res.status(403).json({ error: check.reason })
        return
      }

      // Verify tenant belongs to owner
      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(
          and(
            eq(schema.tenants.id, param(req.params['tenantId'])),
            eq(schema.tenants.owner_id, ownerId),
            isNull(schema.tenants.deleted_at),
          ),
        )
        .limit(1)

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }

      const existing = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, req.body.email))
        .limit(1)

      if (existing.length > 0) {
        res.status(409).json({ error: 'email_already_exists' })
        return
      }

      const passwordHash = await bcrypt.hash(req.body.password, config.BCRYPT_ROUNDS)
      const [user] = await db
        .insert(schema.users)
        .values({
          email: req.body.email,
          phone: req.body.phone,
          password_hash: passwordHash,
          role: 'admin-user',
          owner_id: ownerId,
          tenant_id: param(req.params['tenantId']),
        })
        .returning()

      res.status(201).json({
        id: user!.id,
        email: user!.email,
        phone: user!.phone,
        role: user!.role,
        tenant_id: user!.tenant_id,
        created_at: user!.created_at,
      })
    } catch (error) {
      console.error('Create admin user error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.delete('/tenants/:tenantId/admin-users/:userId', async (req, res) => {
    try {
      const [user] = await db
        .update(schema.users)
        .set({ deleted_at: new Date() })
        .where(
          and(
            eq(schema.users.id, param(req.params['userId'])),
            eq(schema.users.owner_id, req.user!.userId),
            eq(schema.users.tenant_id, param(req.params['tenantId'])),
            isNull(schema.users.deleted_at),
          ),
        )
        .returning()

      if (!user) {
        res.status(404).json({ error: 'user_not_found' })
        return
      }
      res.status(204).send()
    } catch (error) {
      console.error('Delete admin user error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Tenant Services / Pricing ────────────────────────────────────────────

  router.get('/tenants/:tenantId/services', async (req, res) => {
    try {
      const rows = await db
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
        .innerJoin(schema.services, eq(schema.tenantServices.service_id, schema.services.id))
        .where(
          and(
            eq(schema.tenantServices.tenant_id, param(req.params['tenantId'])),
            isNull(schema.tenantServices.deleted_at),
          ),
        )
      res.json({ data: rows })
    } catch (error) {
      console.error('List tenant services error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.post('/tenants/:tenantId/services', validate(setTenantServiceSchema), async (req, res) => {
    try {
      const { service_id, price, is_active } = req.body as { service_id: string; price: number; is_active: boolean }

      const existing = await db
        .select()
        .from(schema.tenantServices)
        .where(
          and(
            eq(schema.tenantServices.tenant_id, param(req.params['tenantId'])),
            eq(schema.tenantServices.service_id, service_id),
            isNull(schema.tenantServices.deleted_at),
          ),
        )
        .limit(1)

      if (existing.length > 0) {
        const [updated] = await db
          .update(schema.tenantServices)
          .set({ price: String(price), is_active, updated_at: new Date() })
          .where(eq(schema.tenantServices.id, existing[0]!.id))
          .returning()
        res.json(updated)
        return
      }

      const [row] = await db
        .insert(schema.tenantServices)
        .values({ tenant_id: param(req.params['tenantId']), service_id, price: String(price), is_active })
        .returning()
      res.status(201).json(row)
    } catch (error) {
      console.error('Set tenant service error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Transactions ─────────────────────────────────────────────────────────

  router.get('/transactions', async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const ownerTenants = await db
        .select({ id: schema.tenants.id })
        .from(schema.tenants)
        .where(and(eq(schema.tenants.owner_id, ownerId), isNull(schema.tenants.deleted_at)))

      const tenantIds = ownerTenants.map((t) => t.id)
      if (tenantIds.length === 0) {
        res.json({ data: [] })
        return
      }

      const txs = await db
        .select({
          id: schema.transactions.id,
          tenant_id: schema.transactions.tenant_id,
          status: schema.transactions.status,
          total_cost: schema.transactions.total_cost,
          additional_cost: schema.transactions.additional_cost,
          notes: schema.transactions.notes,
          monitoring_token: schema.transactions.monitoring_token,
          created_at: schema.transactions.created_at,
          updated_at: schema.transactions.updated_at,
          customer_name: schema.customers.name,
          customer_phone: schema.customers.phone,
          plate_number: schema.customers.plate_number,
          service_name: schema.services.name,
        })
        .from(schema.transactions)
        .innerJoin(schema.customers, eq(schema.transactions.customer_id, schema.customers.id))
        .innerJoin(schema.services, eq(schema.transactions.service_id, schema.services.id))
        .where(and(inArray(schema.transactions.tenant_id, tenantIds), isNull(schema.transactions.deleted_at)))
        .orderBy(sql`${schema.transactions.created_at} DESC`)

      res.json({ data: txs })
    } catch (error) {
      console.error('List transactions error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.post('/transactions', validate(createTransactionSchema), async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const check = await enforce.checkCanCreateTransaction(ownerId)
      if (!check.allowed) {
        res.status(403).json({ error: check.reason })
        return
      }

      const { tenant_id, customer_name, customer_phone, plate_number, vehicle_type, service_id, total_cost, notes } =
        req.body as {
          tenant_id: string
          customer_name: string
          customer_phone: string
          plate_number: string
          vehicle_type: string
          service_id: string
          total_cost: number
          notes?: string
        }

      // Verify tenant belongs to owner
      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.id, tenant_id), eq(schema.tenants.owner_id, ownerId), isNull(schema.tenants.deleted_at)))
        .limit(1)

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }

      // Upsert customer
      const existingCustomer = await db
        .select()
        .from(schema.customers)
        .where(and(eq(schema.customers.tenant_id, tenant_id), eq(schema.customers.plate_number, plate_number), isNull(schema.customers.deleted_at)))
        .limit(1)

      let customerId: string
      if (existingCustomer.length > 0) {
        customerId = existingCustomer[0]!.id
      } else {
        const [cust] = await db
          .insert(schema.customers)
          .values({ tenant_id, name: customer_name, phone: customer_phone, plate_number, vehicle_type })
          .returning()
        customerId = cust!.id
      }

      const [tx] = await db
        .insert(schema.transactions)
        .values({ tenant_id, customer_id: customerId, service_id, created_by: ownerId, total_cost: String(total_cost), notes })
        .returning()

      await db.insert(schema.transactionStatusLog).values({
        transaction_id: tx!.id,
        from_status: null,
        to_status: 'received',
        changed_by: ownerId,
        notes: 'Transaksi dibuat',
      })

      res.status(201).json(tx)
    } catch (error) {
      console.error('Create transaction error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.patch('/transactions/:id/status', validate(updateTransactionStatusSchema), async (req, res) => {
    try {
      const { status, notes } = req.body as { status: TransactionStatus; notes?: string }

      const [tx] = await db
        .select()
        .from(schema.transactions)
        .where(and(eq(schema.transactions.id, param(req.params['id'])), isNull(schema.transactions.deleted_at)))
        .limit(1)

      if (!tx) {
        res.status(404).json({ error: 'transaction_not_found' })
        return
      }

      if (!isValidTransition(tx.status, status)) {
        res.status(422).json({ error: 'invalid_status_transition', details: { from: tx.status, to: status } })
        return
      }

      const [updated] = await db
        .update(schema.transactions)
        .set({ status, updated_at: new Date() })
        .where(eq(schema.transactions.id, tx.id))
        .returning()

      await db.insert(schema.transactionStatusLog).values({
        transaction_id: tx.id,
        from_status: tx.status,
        to_status: status,
        changed_by: req.user!.userId,
        notes: notes ?? null,
      })

      const waLink = generateWaLink({
        customer_name: '',
        customer_phone: '',
        service_name: '',
        current_status: status,
        total_cost: updated!.total_cost,
        additional_cost: updated!.additional_cost,
        monitoring_token: updated!.monitoring_token,
        tenant_name: '',
        base_url: config.BASE_URL,
      })

      res.json({ ...updated, wa_link: waLink })
    } catch (error) {
      console.error('Update transaction status error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  return router
}
