import { Router } from 'express'
import { eq, isNull } from 'drizzle-orm'

import type { Database } from '../db/index.js'
import { schema } from '../db/index.js'

export function publicRoutes(db: Database): Router {
  const router = Router()

  // GET /health
  router.get('/health', (_req, res) => {
    res.json({
      service: 'stnk-jasa-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  })

  // GET /meta/roles
  router.get('/meta/roles', (_req, res) => {
    res.json({
      roles: ['super-admin', 'owner', 'admin-user'],
    })
  })

  // GET /monitoring/:token - read-only transaction monitoring
  router.get('/monitoring/:token', async (req, res) => {
    try {
      const token = req.params.token!

      const [tx] = await db
        .select()
        .from(schema.transactions)
        .where(eq(schema.transactions.monitoring_token, token))
        .limit(1)

      if (!tx) {
        res.status(404).json({ error: 'transaction_not_found' })
        return
      }

      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(eq(schema.tenants.id, tx.tenant_id))
        .limit(1)

      const [service] = await db
        .select()
        .from(schema.services)
        .where(eq(schema.services.id, tx.service_id))
        .limit(1)

      const [customer] = await db
        .select()
        .from(schema.customers)
        .where(eq(schema.customers.id, tx.customer_id))
        .limit(1)

      const statusLog = await db
        .select({
          from_status: schema.transactionStatusLog.from_status,
          to_status: schema.transactionStatusLog.to_status,
          changed_at: schema.transactionStatusLog.created_at,
          notes: schema.transactionStatusLog.notes,
        })
        .from(schema.transactionStatusLog)
        .where(eq(schema.transactionStatusLog.transaction_id, tx.id))
        .orderBy(schema.transactionStatusLog.created_at)

      res.json({
        service_name: service?.name ?? 'Unknown',
        status: tx.status,
        total_cost: tx.total_cost,
        additional_cost: tx.additional_cost,
        customer_name: customer?.name ?? 'Unknown',
        plate_number: customer?.plate_number ?? 'Unknown',
        tenant_name: tenant?.name ?? 'Unknown',
        created_at: tx.created_at,
        updated_at: tx.updated_at,
        status_history: statusLog,
      })
    } catch (error) {
      console.error('Monitoring error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  return router
}
