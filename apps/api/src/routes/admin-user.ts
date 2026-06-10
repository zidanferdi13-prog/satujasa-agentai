import { Router } from 'express'
import { eq, and, isNull, sql, desc, or, ilike } from 'drizzle-orm'

import type { Database } from '../db/index.js'
import { schema } from '../db/index.js'
import type { AppConfig } from '../config.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { tenantIsolation, getUserTenantId } from '../middleware/tenant-isolation.js'
import { validate, setTenantServiceSchema, createAdminTransactionSchema, updateTransactionStatusSchema } from '../middleware/validate.js'
import { isValidTransition, getAllowedTransitions } from '../lib/state-machine.js'
import type { TransactionStatus } from '../lib/state-machine.js'
import { generateWaLink } from '../lib/wa-link.js'

function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0]! : (value ?? '')
}

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

  // ─── Transactions ───────────────────────────────────────────────────────────

  // POST /transactions — Create
  router.post('/transactions', validate(createAdminTransactionSchema), async (req, res) => {
    try {
      const tenantId = getUserTenantId(req)
      if (!tenantId) {
        res.status(403).json({ error: 'no_tenant_assigned' })
        return
      }

      const userId = (req as any).user.id as string
      const { customer_name, customer_phone, vehicle_plate, service_id, total_cost, additional_cost, notes } = req.body

      // Find or create customer
      let customer = await db
        .select()
        .from(schema.customers)
        .where(
          and(
            eq(schema.customers.tenant_id, tenantId),
            eq(schema.customers.phone, customer_phone),
            eq(schema.customers.plate_number, vehicle_plate),
            isNull(schema.customers.deleted_at)
          )
        )
        .limit(1)
        .then((rows) => rows[0])

      if (!customer) {
        const [created] = await db
          .insert(schema.customers)
          .values({
            tenant_id: tenantId,
            name: customer_name,
            phone: customer_phone,
            plate_number: vehicle_plate,
            vehicle_type: '',
          })
          .returning()
        customer = created!
      }

      // Create transaction
      const [tx] = await db
        .insert(schema.transactions)
        .values({
          tenant_id: tenantId,
          customer_id: customer.id,
          service_id,
          created_by: userId,
          status: 'received',
          total_cost: total_cost.toString(),
          additional_cost: (additional_cost ?? 0).toString(),
          notes: notes ?? null,
        })
        .returning()

      // Log initial status
      await db.insert(schema.transactionStatusLog).values({
        transaction_id: tx!.id,
        from_status: null,
        to_status: 'received',
        changed_by: userId,
        notes: 'Transaction created',
      })

      res.status(201).json({
        ...tx,
        customer_name,
        customer_phone,
        vehicle_plate,
        monitoring_token: tx!.monitoring_token,
      })
    } catch (error) {
      console.error('Create transaction error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // GET /transactions — List
  router.get('/transactions', async (req, res) => {
    try {
      const tenantId = getUserTenantId(req)
      if (!tenantId) {
        res.status(403).json({ error: 'no_tenant_assigned' })
        return
      }

      const { status, page = '1', limit = '20', search } = req.query as {
        status?: string
        page?: string
        limit?: string
        search?: string
      }

      const pageNum = Math.max(1, parseInt(page, 10) || 1)
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
      const offset = (pageNum - 1) * limitNum

      const conditions = [
        eq(schema.transactions.tenant_id, tenantId),
        isNull(schema.transactions.deleted_at),
      ]

      if (status) {
        conditions.push(eq(schema.transactions.status, status as any))
      }

      if (search) {
        conditions.push(
          or(
            ilike(schema.customers.name, `%${search}%`),
            ilike(schema.customers.plate_number, `%${search}%`)
          )!
        )
      }

      const [countResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.transactions)
        .innerJoin(schema.customers, eq(schema.customers.id, schema.transactions.customer_id))
        .where(and(...conditions))

      const transactions = await db
        .select({
          id: schema.transactions.id,
          customer_name: schema.customers.name,
          customer_phone: schema.customers.phone,
          vehicle_plate: schema.customers.plate_number,
          service_id: schema.transactions.service_id,
          service_name: schema.services.name,
          status: schema.transactions.status,
          total_cost: schema.transactions.total_cost,
          additional_cost: schema.transactions.additional_cost,
          notes: schema.transactions.notes,
          monitoring_token: schema.transactions.monitoring_token,
          created_at: schema.transactions.created_at,
          updated_at: schema.transactions.updated_at,
        })
        .from(schema.transactions)
        .innerJoin(schema.customers, eq(schema.customers.id, schema.transactions.customer_id))
        .innerJoin(schema.services, eq(schema.services.id, schema.transactions.service_id))
        .where(and(...conditions))
        .orderBy(desc(schema.transactions.created_at))
        .limit(limitNum)
        .offset(offset)

      res.json({
        data: transactions,
        meta: {
          page: pageNum,
          limit: limitNum,
          total: countResult?.count ?? 0,
          total_pages: Math.ceil((countResult?.count ?? 0) / limitNum),
        },
      })
    } catch (error) {
      console.error('List transactions error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // GET /transactions/:id — Detail
  router.get('/transactions/:id', async (req, res) => {
    try {
      const tenantId = getUserTenantId(req)
      if (!tenantId) {
        res.status(403).json({ error: 'no_tenant_assigned' })
        return
      }

      const id = param(req.params.id)

      const [tx] = await db
        .select({
          id: schema.transactions.id,
          customer_name: schema.customers.name,
          customer_phone: schema.customers.phone,
          vehicle_plate: schema.customers.plate_number,
          service_id: schema.transactions.service_id,
          service_name: schema.services.name,
          service_code: schema.services.code,
          status: schema.transactions.status,
          total_cost: schema.transactions.total_cost,
          additional_cost: schema.transactions.additional_cost,
          notes: schema.transactions.notes,
          monitoring_token: schema.transactions.monitoring_token,
          created_by: schema.transactions.created_by,
          created_at: schema.transactions.created_at,
          updated_at: schema.transactions.updated_at,
        })
        .from(schema.transactions)
        .innerJoin(schema.customers, eq(schema.customers.id, schema.transactions.customer_id))
        .innerJoin(schema.services, eq(schema.services.id, schema.transactions.service_id))
        .where(
          and(
            eq(schema.transactions.id, id),
            eq(schema.transactions.tenant_id, tenantId),
            isNull(schema.transactions.deleted_at)
          )
        )

      if (!tx) {
        res.status(404).json({ error: 'transaction_not_found' })
        return
      }

      const statusLogs = await db
        .select()
        .from(schema.transactionStatusLog)
        .where(eq(schema.transactionStatusLog.transaction_id, id))
        .orderBy(schema.transactionStatusLog.created_at)

      res.json({ ...tx, status_logs: statusLogs })
    } catch (error) {
      console.error('Get transaction error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // PATCH /transactions/:id/status — State transition
  router.patch('/transactions/:id/status', validate(updateTransactionStatusSchema), async (req, res) => {
    try {
      const tenantId = getUserTenantId(req)
      if (!tenantId) {
        res.status(403).json({ error: 'no_tenant_assigned' })
        return
      }

      const userId = (req as any).user.id as string
      const id = param(req.params.id)
      const { status: newStatus, notes } = req.body as { status: TransactionStatus; notes?: string }

      // Get current transaction
      const [tx] = await db
        .select()
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.id, id),
            eq(schema.transactions.tenant_id, tenantId),
            isNull(schema.transactions.deleted_at)
          )
        )

      if (!tx) {
        res.status(404).json({ error: 'transaction_not_found' })
        return
      }

      const currentStatus = tx.status as TransactionStatus

      // Validate transition
      if (!isValidTransition(currentStatus, newStatus)) {
        res.status(422).json({
          error: 'invalid_transition',
          details: {
            from: currentStatus,
            to: newStatus,
            allowed: getAllowedTransitions(currentStatus),
          },
        })
        return
      }

      // Update status
      const [updated] = await db
        .update(schema.transactions)
        .set({ status: newStatus, updated_at: new Date() })
        .where(eq(schema.transactions.id, id))
        .returning()

      // Log transition
      await db.insert(schema.transactionStatusLog).values({
        transaction_id: id,
        from_status: currentStatus,
        to_status: newStatus,
        changed_by: userId,
        notes: notes ?? null,
      })

      res.json(updated)
    } catch (error) {
      console.error('Update transaction status error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // DELETE /transactions/:id — Soft delete
  router.delete('/transactions/:id', async (req, res) => {
    try {
      const tenantId = getUserTenantId(req)
      if (!tenantId) {
        res.status(403).json({ error: 'no_tenant_assigned' })
        return
      }

      const id = param(req.params.id)

      const [tx] = await db
        .select()
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.id, id),
            eq(schema.transactions.tenant_id, tenantId),
            isNull(schema.transactions.deleted_at)
          )
        )

      if (!tx) {
        res.status(404).json({ error: 'transaction_not_found' })
        return
      }

      await db
        .update(schema.transactions)
        .set({ deleted_at: new Date() })
        .where(eq(schema.transactions.id, id))

      res.json({ message: 'transaction_deleted' })
    } catch (error) {
      console.error('Delete transaction error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // GET /transactions/:id/wa-link — Generate WA link
  router.get('/transactions/:id/wa-link', async (req, res) => {
    try {
      const tenantId = getUserTenantId(req)
      if (!tenantId) {
        res.status(403).json({ error: 'no_tenant_assigned' })
        return
      }

      const id = param(req.params.id)

      const [tx] = await db
        .select({
          status: schema.transactions.status,
          customer_name: schema.customers.name,
          customer_phone: schema.customers.phone,
          vehicle_plate: schema.customers.plate_number,
        })
        .from(schema.transactions)
        .innerJoin(schema.customers, eq(schema.customers.id, schema.transactions.customer_id))
        .where(
          and(
            eq(schema.transactions.id, id),
            eq(schema.transactions.tenant_id, tenantId),
            isNull(schema.transactions.deleted_at)
          )
        )

      if (!tx) {
        res.status(404).json({ error: 'transaction_not_found' })
        return
      }

      const link = generateWaLink(tx.customer_phone, tx.customer_name, tx.vehicle_plate, tx.status)
      res.json({ wa_link: link })
    } catch (error) {
      console.error('Generate WA link error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  return router
}
