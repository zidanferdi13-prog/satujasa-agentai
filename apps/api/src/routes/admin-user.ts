import { Router } from 'express'
import { eq, and, isNull, sql, desc, or, ilike } from 'drizzle-orm'

import type { Database } from '../db/index.js'
import { schema } from '../db/index.js'
import type { AppConfig } from '../config.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { tenantIsolation, getUserTenantId } from '../middleware/tenant-isolation.js'
import { validate, setTenantServiceSchema, createAdminTransactionSchema, updateTransactionStatusSchema, transactionRequirementsQuerySchema } from '../middleware/validate.js'
import { isValidTransition, getAllowedTransitions } from '../lib/state-machine.js'
import type { TransactionStatus } from '../lib/state-machine.js'
import { generateWaLink } from '../lib/wa-link.js'

function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0]! : (value ?? '')
}

type FeeDetailInput = {
  component_code: string
  amount: number
  notes?: string
}

function moneySum(items: Array<{ amount: string }>): string {
  const total = items.reduce((sum, item) => sum + Number(item.amount), 0)
  return total.toFixed(2)
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

  // GET /transactions/requirements — Fee and checklist requirements
  router.get('/transactions/requirements', async (req, res) => {
    try {
      const tenantId = getUserTenantId(req)
      if (!tenantId) {
        res.status(403).json({ error: 'no_tenant_assigned' })
        return
      }

      const parsed = transactionRequirementsQuerySchema.safeParse(req.query)
      if (!parsed.success) {
        res.status(400).json({ error: 'validation_error', details: parsed.error.flatten() })
        return
      }
      const { service_id, vehicle_type_code, province_code, city_code } = parsed.data

      const [service] = await db
        .select({ id: schema.services.id, code: schema.services.code, name: schema.services.name })
        .from(schema.services)
        .where(and(eq(schema.services.id, service_id), isNull(schema.services.deleted_at)))
        .limit(1)
      if (!service) {
        res.status(404).json({ error: 'service_not_found' })
        return
      }

      const [vehicleType] = await db
        .select()
        .from(schema.vehicleTypes)
        .where(and(eq(schema.vehicleTypes.code, vehicle_type_code), isNull(schema.vehicleTypes.deleted_at)))
        .limit(1)
      if (!vehicleType) {
        res.status(404).json({ error: 'vehicle_type_not_found' })
        return
      }

      const [tenantService] = await db
        .select({ price: schema.tenantServices.price })
        .from(schema.tenantServices)
        .where(and(
          eq(schema.tenantServices.tenant_id, tenantId),
          eq(schema.tenantServices.service_id, service_id),
          eq(schema.tenantServices.is_active, true),
          isNull(schema.tenantServices.deleted_at)
        ))
        .limit(1)

      const feeRows = await db
        .select({
          componentCode: schema.feeComponents.code,
          componentName: schema.feeComponents.name,
          sortOrder: schema.feeComponents.sort_order,
        })
        .from(schema.feeComponents)
        .where(isNull(schema.feeComponents.deleted_at))
        .orderBy(schema.feeComponents.sort_order)


      const documents = await db
        .select({
          documentCode: schema.serviceDocumentRequirements.document_code,
          documentName: schema.serviceDocumentRequirements.document_name,
          isRequired: schema.serviceDocumentRequirements.is_required,
          sortOrder: schema.serviceDocumentRequirements.sort_order,
        })
        .from(schema.serviceDocumentRequirements)
        .where(and(
          eq(schema.serviceDocumentRequirements.service_id, service_id),
          isNull(schema.serviceDocumentRequirements.deleted_at)
        ))
        .orderBy(schema.serviceDocumentRequirements.sort_order)

      const fees = feeRows.map((fee) => {
        const isJasaBiro = fee.componentCode === 'JASA_BIRO'
        const defaultAmount = isJasaBiro ? (tenantService?.price ?? '0.00') : '0.00'
        return {
          componentCode: fee.componentCode,
          componentName: fee.componentName,
          defaultAmount,
          amount: defaultAmount,
          isEditable: true,
          source: isJasaBiro ? 'tenant_pricing' : 'component_template',
          sortOrder: fee.sortOrder,
        }
      })

      res.json({
        service,
        vehicleType: { code: vehicleType.code, name: vehicleType.name, priceGroup: vehicleType.price_group },
        provinceCode: province_code,
        cityCode: city_code ?? null,
        fees: fees.sort((a, b) => a.sortOrder - b.sortOrder),
        documents,
      })
    } catch (error) {
      console.error('Transaction requirements error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // POST /transactions — Create
  router.post('/transactions', validate(createAdminTransactionSchema), async (req, res) => {
    try {
      const tenantId = getUserTenantId(req)
      if (!tenantId) {
        res.status(403).json({ error: 'no_tenant_assigned' })
        return
      }

      const userId = req.user!.userId
      const body = req.body as {
        customer_name: string; customer_phone: string; vehicle_plate: string; service_id: string
        vehicle_type_code?: string; province_code?: string; city_code?: string; city_name?: string
        tax_due_date?: string; total_cost?: number; additional_cost: number; notes?: string
        fee_details?: FeeDetailInput[]
      }
      const provinceCode = body.province_code ?? 'JABAR'
      const vehicleTypeCode = body.vehicle_type_code ?? ''

      let customer = await db
        .select()
        .from(schema.customers)
        .where(and(
          eq(schema.customers.tenant_id, tenantId),
          eq(schema.customers.phone, body.customer_phone),
          eq(schema.customers.plate_number, body.vehicle_plate),
          isNull(schema.customers.deleted_at)
        ))
        .limit(1)
        .then((rows) => rows[0])

      if (!customer) {
        const [created] = await db
          .insert(schema.customers)
          .values({
            tenant_id: tenantId,
            name: body.customer_name,
            phone: body.customer_phone,
            plate_number: body.vehicle_plate,
            vehicle_type: vehicleTypeCode,
          })
          .returning()
        customer = created!
      }

      const feeInput = body.fee_details ?? []
      const useFeeSnapshot = feeInput.length > 0
      const requestedCodes = new Set(feeInput.map((item) => item.component_code))
      if (body.additional_cost > 0) requestedCodes.add('BIAYA_TAMBAHAN')

      let snapshotRows: Array<{
        fee_component_id: string | null; component_code: string; component_name: string
        default_amount: string; amount: string; is_editable: boolean; source: string; sort_order: number; notes?: string
      }> = []

      if (useFeeSnapshot || body.additional_cost > 0) {
        const components = await db.select().from(schema.feeComponents).where(isNull(schema.feeComponents.deleted_at))
        const tenantService = await db
          .select({ price: schema.tenantServices.price })
          .from(schema.tenantServices)
          .where(and(
            eq(schema.tenantServices.tenant_id, tenantId),
            eq(schema.tenantServices.service_id, body.service_id),
            eq(schema.tenantServices.is_active, true),
            isNull(schema.tenantServices.deleted_at)
          ))
          .limit(1)
          .then((rows) => rows[0])

        snapshotRows = Array.from(requestedCodes).map((code) => {
          const input = feeInput.find((item) => item.component_code === code)
          const component = components.find((item) => item.code === code)
          const isJasaBiro = code === 'JASA_BIRO'
          const defaultAmount = isJasaBiro ? (tenantService?.price ?? '0') : '0'
          const amount = code === 'BIAYA_TAMBAHAN' && !input
            ? body.additional_cost
            : (input?.amount ?? Number(defaultAmount))
          return {
            fee_component_id: component?.id ?? null,
            component_code: code,
            component_name: component?.name ?? code,
            default_amount: defaultAmount.toString(),
            amount: amount.toString(),
            is_editable: true,
            source: isJasaBiro ? 'tenant_pricing' : 'manual',
            sort_order: component?.sort_order ?? 999,
            notes: input?.notes,
          }
        }).sort((a, b) => a.sort_order - b.sort_order)
      }

      const totalCost = snapshotRows.length > 0 ? moneySum(snapshotRows) : (body.total_cost ?? 0).toString()
      const additionalCost = snapshotRows.length > 0 ? '0' : body.additional_cost.toString()

      const [tx] = await db.insert(schema.transactions).values({
        tenant_id: tenantId,
        customer_id: customer.id,
        service_id: body.service_id,
        created_by: userId,
        status: 'received',
        total_cost: totalCost,
        additional_cost: additionalCost,
        notes: body.notes ?? null,
      }).returning()

      let item = null
      if (snapshotRows.length > 0 || vehicleTypeCode) {
        const [createdItem] = await db.insert(schema.transactionItems).values({
          transaction_id: tx!.id,
          service_id: body.service_id,
          vehicle_type_code: vehicleTypeCode || null,
          province_code: provinceCode,
          city_code: body.city_code ?? null,
          city_name: body.city_name ?? null,
          tax_due_date: body.tax_due_date ? new Date(body.tax_due_date) : null,
        }).returning()
        item = createdItem!

        if (snapshotRows.length > 0) {
          await db.insert(schema.transactionItemFeeDetails).values(snapshotRows.map((row) => ({
            transaction_item_id: item!.id,
            ...row,
          })))
        }

        const documents = await db.select().from(schema.serviceDocumentRequirements).where(and(
          eq(schema.serviceDocumentRequirements.service_id, body.service_id),
          isNull(schema.serviceDocumentRequirements.deleted_at)
        ))
        if (documents.length > 0) {
          await db.insert(schema.transactionItemDocumentChecklists).values(documents.map((doc) => ({
            transaction_item_id: item!.id,
            document_code: doc.document_code,
            document_name: doc.document_name,
            is_required: doc.is_required,
            is_checked: false,
            sort_order: doc.sort_order,
          })))
        }
      }

      await db.insert(schema.transactionStatusLog).values({
        transaction_id: tx!.id,
        from_status: null,
        to_status: 'received',
        changed_by: userId,
        notes: 'Transaction created',
      })

      const savedFees = item ? await db.select().from(schema.transactionItemFeeDetails).where(eq(schema.transactionItemFeeDetails.transaction_item_id, item.id)) : []
      const savedDocuments = item ? await db.select().from(schema.transactionItemDocumentChecklists).where(eq(schema.transactionItemDocumentChecklists.transaction_item_id, item.id)) : []

      res.status(201).json({
        ...tx,
        total_cost: totalCost,
        additional_cost: additionalCost,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        vehicle_plate: body.vehicle_plate,
        monitoring_token: tx!.monitoring_token,
        item,
        fee_details: savedFees,
        document_checklists: savedDocuments,
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
        conditions.push(eq(schema.transactions.status, status as TransactionStatus))
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

      const items = await db
        .select()
        .from(schema.transactionItems)
        .where(and(eq(schema.transactionItems.transaction_id, id), isNull(schema.transactionItems.deleted_at)))

      const feeDetails = items.length > 0
        ? await db
          .select()
          .from(schema.transactionItemFeeDetails)
          .where(sql`${schema.transactionItemFeeDetails.transaction_item_id} IN (${sql.join(items.map((item) => sql`${item.id}`), sql`, `)})`)
        : []

      const documentChecklists = items.length > 0
        ? await db
          .select()
          .from(schema.transactionItemDocumentChecklists)
          .where(sql`${schema.transactionItemDocumentChecklists.transaction_item_id} IN (${sql.join(items.map((item) => sql`${item.id}`), sql`, `)})`)
        : []

      res.json({
        ...tx,
        status_logs: statusLogs,
        items,
        fee_details: feeDetails,
        document_checklists: documentChecklists,
      })
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

      const userId = req.user!.userId
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
