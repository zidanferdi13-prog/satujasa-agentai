import { Router } from 'express'
import { eq, and, isNull } from 'drizzle-orm'

function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0]! : (value ?? '')
}

import type { Database } from '../db/index.js'
import { schema } from '../db/index.js'
import type { AppConfig } from '../config.js'
import { generateWaLink } from '../utils/wa-template.js'
import type { HealthResponse, RolesResponse } from '@stnk/contracts'

export function publicRoutes(db: Database, config: AppConfig): Router {
  const router = Router()

  // GET /health
  router.get('/health', (_req, res) => {
    const body: HealthResponse = {
      service: 'stnk-jasa-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
    res.status(200).json(body)
  })

  // GET /meta/roles
  router.get('/meta/roles', (_req, res) => {
    const body: RolesResponse = {
      roles: ['super-admin', 'owner', 'admin-user'],
    }
    res.status(200).json(body)
  })

  // GET /monitoring/:token
  router.get('/monitoring/:token', async (req, res) => {
    try {
      const [tx] = await db
        .select({
          id: schema.transactions.id,
          status: schema.transactions.status,
          total_cost: schema.transactions.total_cost,
          additional_cost: schema.transactions.additional_cost,
          monitoring_token: schema.transactions.monitoring_token,
          created_at: schema.transactions.created_at,
          updated_at: schema.transactions.updated_at,
          customer_name: schema.customers.name,
          customer_phone: schema.customers.phone,
          plate_number: schema.customers.plate_number,
          service_name: schema.services.name,
          tenant_name: schema.tenants.name,
        })
        .from(schema.transactions)
        .innerJoin(schema.customers, eq(schema.transactions.customer_id, schema.customers.id))
        .innerJoin(schema.services, eq(schema.transactions.service_id, schema.services.id))
        .innerJoin(schema.tenants, eq(schema.transactions.tenant_id, schema.tenants.id))
        .where(
          and(
            eq(schema.transactions.monitoring_token, param(req.params['token'])),
            isNull(schema.transactions.deleted_at),
          ),
        )
        .limit(1)

      if (!tx) {
        res.status(404).json({ error: 'transaction_not_found' })
        return
      }

      const statusHistory = await db
        .select({
          from_status: schema.transactionStatusLog.from_status,
          to_status: schema.transactionStatusLog.to_status,
          changed_at: schema.transactionStatusLog.created_at,
          notes: schema.transactionStatusLog.notes,
        })
        .from(schema.transactionStatusLog)
        .where(eq(schema.transactionStatusLog.transaction_id, tx.id))
        .orderBy(schema.transactionStatusLog.created_at)

      const waLink = generateWaLink({
        customer_name: tx.customer_name,
        customer_phone: tx.customer_phone,
        service_name: tx.service_name,
        current_status: tx.status,
        total_cost: tx.total_cost,
        additional_cost: tx.additional_cost,
        monitoring_token: tx.monitoring_token,
        tenant_name: tx.tenant_name,
        base_url: config.BASE_URL,
      })

      res.json({
        service_name: tx.service_name,
        status: tx.status,
        total_cost: tx.total_cost,
        additional_cost: tx.additional_cost,
        customer_name: tx.customer_name,
        plate_number: tx.plate_number,
        tenant_name: tx.tenant_name,
        created_at: tx.created_at,
        updated_at: tx.updated_at,
        status_history: statusHistory,
        wa_link: waLink,
      })
    } catch (error) {
      console.error('Monitoring error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  return router
}
