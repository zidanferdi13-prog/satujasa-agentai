import { Router } from 'express'
import { eq, and, isNull, sql } from 'drizzle-orm'

function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0]! : (value ?? '')
}

import type { Database } from '../db/index.js'
import { schema } from '../db/index.js'
import type { AppConfig } from '../config.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { tenantIsolation } from '../middleware/tenant-isolation.js'
import {
  validate,
  setTenantServiceSchema,
  createTransactionSchema,
  updateTransactionStatusSchema,
} from '../middleware/validate.js'
import { isValidTransition } from '../utils/transaction-state-machine.js'
import { generateWaLink } from '../utils/wa-template.js'
import type { TransactionStatus } from '@stnk/contracts'

export function adminUserRoutes(db: Database, config: AppConfig): Router {
  const router = Router()

  router.use(authMiddleware(config))
  router.use(requireRole('admin-user'))
  router.use(tenantIsolation)

  // ─── Dashboard ────────────────────────────────────────────────────────────

  router.get('/dashboard', async (req, res) => {
    try {
      const tenantId = req.user!.tenantId!

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
            isNull(schema.transactions.deleted_at),
            sql`status NOT IN ('done', 'cancelled')`,
          ),
        )

      const [doneTx] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.tenant_id, tenantId),
            eq(schema.transactions.status, 'done'),
            isNull(schema.transactions.deleted_at),
          ),
        )

      const [revenue] = await db
        .select({ total: sql<string>`COALESCE(sum(total_cost + additional_cost), 0)::text` })
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.tenant_id, tenantId),
            eq(schema.transactions.status, 'done'),
            isNull(schema.transactions.deleted_at),
          ),
        )

      res.json({
        total_transactions: txCount?.count ?? 0,
        active_transactions: activeTx?.count ?? 0,
        done_transactions: doneTx?.count ?? 0,
        total_revenue: revenue?.total ?? '0',
      })
    } catch (error) {
      console.error('Admin user dashboard error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Transactions ─────────────────────────────────────────────────────────

  router.get('/transactions', async (req, res) => {
    try {
      const tenantId = req.user!.tenantId!

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
        .where(and(eq(schema.transactions.tenant_id, tenantId), isNull(schema.transactions.deleted_at)))
        .orderBy(sql`${schema.transactions.created_at} DESC`)

      res.json({ data: txs })
    } catch (error) {
      console.error('List transactions error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.post('/transactions', validate(createTransactionSchema), async (req, res) => {
    try {
      const userId = req.user!.userId
      const tenantId = req.user!.tenantId!

      const { customer_name, customer_phone, plate_number, vehicle_type, service_id, total_cost, notes } =
        req.body as {
          customer_name: string
          customer_phone: string
          plate_number: string
          vehicle_type: string
          service_id: string
          total_cost: number
          notes?: string
        }

      // Upsert customer scoped to tenant
      const existingCustomer = await db
        .select()
        .from(schema.customers)
        .where(
          and(
            eq(schema.customers.tenant_id, tenantId),
            eq(schema.customers.plate_number, plate_number),
            isNull(schema.customers.deleted_at),
          ),
        )
        .limit(1)

      let customerId: string
      if (existingCustomer.length > 0) {
        customerId = existingCustomer[0]!.id
      } else {
        const [cust] = await db
          .insert(schema.customers)
          .values({ tenant_id: tenantId, name: customer_name, phone: customer_phone, plate_number, vehicle_type })
          .returning()
        customerId = cust!.id
      }

      const [tx] = await db
        .insert(schema.transactions)
        .values({
          tenant_id: tenantId,
          customer_id: customerId,
          service_id,
          created_by: userId,
          total_cost: String(total_cost),
          notes,
        })
        .returning()

      await db.insert(schema.transactionStatusLog).values({
        transaction_id: tx!.id,
        from_status: null,
        to_status: 'received',
        changed_by: userId,
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
      const tenantId = req.user!.tenantId!
      const { status, notes } = req.body as { status: TransactionStatus; notes?: string }

      const [tx] = await db
        .select()
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.id, param(req.params['id'])),
            eq(schema.transactions.tenant_id, tenantId),
            isNull(schema.transactions.deleted_at),
          ),
        )
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

      // Build WA link with full customer/service info
      const [detail] = await db
        .select({
          customer_name: schema.customers.name,
          customer_phone: schema.customers.phone,
          service_name: schema.services.name,
          tenant_name: schema.tenants.name,
        })
        .from(schema.transactions)
        .innerJoin(schema.customers, eq(schema.transactions.customer_id, schema.customers.id))
        .innerJoin(schema.services, eq(schema.transactions.service_id, schema.services.id))
        .innerJoin(schema.tenants, eq(schema.transactions.tenant_id, schema.tenants.id))
        .where(eq(schema.transactions.id, tx.id))
        .limit(1)

      const waLink = generateWaLink({
        customer_name: detail?.customer_name ?? '',
        customer_phone: detail?.customer_phone ?? '',
        service_name: detail?.service_name ?? '',
        current_status: status,
        total_cost: updated!.total_cost,
        additional_cost: updated!.additional_cost,
        monitoring_token: updated!.monitoring_token,
        tenant_name: detail?.tenant_name ?? '',
        base_url: config.BASE_URL,
      })

      res.json({ ...updated, wa_link: waLink })
    } catch (error) {
      console.error('Update transaction status error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Tenant Services / Pricing ────────────────────────────────────────────

  router.get('/tenant/services', async (req, res) => {
    try {
      const tenantId = req.user!.tenantId!
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
        .where(and(eq(schema.tenantServices.tenant_id, tenantId), isNull(schema.tenantServices.deleted_at)))

      res.json({ data: rows })
    } catch (error) {
      console.error('List tenant services error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.patch('/tenant/services/:serviceId', validate(setTenantServiceSchema), async (req, res) => {
    try {
      const tenantId = req.user!.tenantId!
      const { price, is_active } = req.body as { service_id: string; price: number; is_active: boolean }

      const [updated] = await db
        .update(schema.tenantServices)
        .set({ price: String(price), is_active, updated_at: new Date() })
        .where(
          and(
            eq(schema.tenantServices.tenant_id, tenantId),
            eq(schema.tenantServices.service_id, param(req.params['serviceId'])),
            isNull(schema.tenantServices.deleted_at),
          ),
        )
        .returning()

      if (!updated) {
        res.status(404).json({ error: 'service_not_found' })
        return
      }

      res.json(updated)
    } catch (error) {
      console.error('Update tenant service error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  return router
}
