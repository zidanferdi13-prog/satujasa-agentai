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

  // ─── Helper ────────────────────────────────────────────────────────────────

  function getMonthStart(offsetMonths: number): Date {
    const d = new Date()
    d.setMonth(d.getMonth() + offsetMonths, 1)
    d.setHours(0, 0, 0, 0)
    return d
  }

  function getMonthEnd(date: Date): Date {
    const d = new Date(date)
    d.setMonth(d.getMonth() + 1, 0)
    d.setHours(23, 59, 59, 999)
    return d
  }

  function calcTrend(current: number, previous: number): string {
    if (previous === 0) return current > 0 ? '100.0' : '0.0'
    return (((current - previous) / previous) * 100).toFixed(1)
  }

  function tierDisplay(tier: string): string {
    return { free: 'Free', pro: 'Business', plus: 'Standard', expert: 'Enterprise' }[tier] ?? tier
  }

  function shortId(id: string): string {
    return id.substring(0, 8)
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────
  router.get('/dashboard', async (req, res) => {
    const ownerId = req.user!.userId
    const now = new Date()

    // All sections start with safe fallback defaults
    const kpi = {
      total_tenants: 0,
      total_admin_users: 0,
      total_transactions: 0,
      active_transactions: 0,
      total_revenue: '0',
      trends: { tenants: '0.0', admin_users: '0.0', transactions: '0.0', revenue: '0.0' },
    }
    let tenants: Array<{
      id: string
      name: string
      admin_user_count: number
      active_transactions: number
      last_activity: string | null
      plan_tier: string
    }> = []
    let chart30d: Array<{ date: string; count: number }> = []
    let activity: Array<{
      id: string
      type: string
      description: string
      created_at: string
    }> = []
    const subscription = {
      tier: 'free' as string,
      display_name: 'Free' as string,
      max_tenants: 0,
      max_admin_users: 0,
      current_tenants: 0,
      current_admin_users: 0,
      activated_at: null as string | null,
      expires_at: null as string | null,
    }
    const health = {
      server: 'operational' as const,
      database: 'operational' as const,
      backup: 'operational' as const,
      api: 'operational' as const,
      security: 'operational' as const,
    }

    // 1. Owner subscription
    try {
      const [sub] = await db
        .select()
        .from(schema.subscriptions)
        .where(and(eq(schema.subscriptions.owner_id, ownerId), isNull(schema.subscriptions.deleted_at)))
        .limit(1)

      if (sub) {
        subscription.tier = sub.tier
        subscription.display_name = tierDisplay(sub.tier)
        subscription.max_tenants = sub.max_tenants
        subscription.max_admin_users = sub.max_admin_users
        if (sub.activated_at) {
          subscription.activated_at = sub.activated_at.toISOString()
          const expiresAt = new Date(sub.activated_at)
          expiresAt.setDate(expiresAt.getDate() + 30)
          subscription.expires_at = expiresAt.toISOString()
        }
      }
    } catch (e) {
      console.error('Owner dashboard subscription error:', e)
    }

    // 2. Owner tenant IDs (used by multiple sections)
    let tenantIds: string[] = []
    try {
      const rows = await db
        .select({ id: schema.tenants.id })
        .from(schema.tenants)
        .where(and(eq(schema.tenants.owner_id, ownerId), isNull(schema.tenants.deleted_at)))
      tenantIds = rows.map(r => r.id)
    } catch (e) {
      console.error('Owner dashboard tenant IDs error:', e)
    }

    // 3. Basic counts
    try {
      const [tenantCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.tenants)
        .where(and(eq(schema.tenants.owner_id, ownerId), isNull(schema.tenants.deleted_at)))
      kpi.total_tenants = tenantCount?.count ?? 0
      subscription.current_tenants = kpi.total_tenants
    } catch (e) {
      console.error('Owner dashboard tenant count error:', e)
    }

    try {
      const [adminCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.users)
        .where(and(
          eq(schema.users.owner_id, ownerId),
          eq(schema.users.role, 'admin-user'),
          isNull(schema.users.deleted_at),
        ))
      kpi.total_admin_users = adminCount?.count ?? 0
      subscription.current_admin_users = kpi.total_admin_users
    } catch (e) {
      console.error('Owner dashboard admin count error:', e)
    }

    if (tenantIds.length > 0) {
      try {
        const [txCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(schema.transactions)
          .where(and(
            sql`${schema.transactions.tenant_id} IN (${sql.join(tenantIds.map(id => sql`${id}`), sql`, `)})`,
            isNull(schema.transactions.deleted_at),
          ))
        kpi.total_transactions = txCount?.count ?? 0
      } catch (e) {
        console.error('Owner dashboard tx count error:', e)
      }

      try {
        const [activeCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(schema.transactions)
          .where(and(
            sql`${schema.transactions.tenant_id} IN (${sql.join(tenantIds.map(id => sql`${id}`), sql`, `)})`,
            sql`status NOT IN ('done', 'cancelled', 'SELESAI', 'DIBATALKAN')`,
            isNull(schema.transactions.deleted_at),
          ))
        kpi.active_transactions = activeCount?.count ?? 0
      } catch (e) {
        console.error('Owner dashboard active tx error:', e)
      }

      try {
        const [revRes] = await db
          .select({ total: sql<string>`COALESCE(sum(total_cost + additional_cost), 0)::text` })
          .from(schema.transactions)
          .where(and(
            sql`${schema.transactions.tenant_id} IN (${sql.join(tenantIds.map(id => sql`${id}`), sql`, `)})`,
            sql`${schema.transactions.status} IN ('done', 'SELESAI')`,
            isNull(schema.transactions.deleted_at),
          ))
        kpi.total_revenue = revRes?.total ?? '0'
      } catch (e) {
        console.error('Owner dashboard revenue error:', e)
      }
    }

    // 4. Trends (current month vs previous month)
    try {
      const currentStart = getMonthStart(0)
      const currentEnd = getMonthEnd(currentStart)
      const prevStart = getMonthStart(-1)
      const prevEnd = getMonthEnd(prevStart)

      // Current month tenants
      const [curTenants] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.tenants)
        .where(and(
          eq(schema.tenants.owner_id, ownerId),
          sql`${schema.tenants.created_at} >= ${currentStart.toISOString()} AND ${schema.tenants.created_at} <= ${currentEnd.toISOString()}`,
          isNull(schema.tenants.deleted_at),
        ))

      const [prevTenants] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.tenants)
        .where(and(
          eq(schema.tenants.owner_id, ownerId),
          sql`${schema.tenants.created_at} >= ${prevStart.toISOString()} AND ${schema.tenants.created_at} <= ${prevEnd.toISOString()}`,
          isNull(schema.tenants.deleted_at),
        ))
      kpi.trends.tenants = calcTrend(curTenants?.count ?? 0, prevTenants?.count ?? 0)

      // Current month admin users
      const [curAdmins] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.users)
        .where(and(
          eq(schema.users.owner_id, ownerId),
          eq(schema.users.role, 'admin-user'),
          sql`${schema.users.created_at} >= ${currentStart.toISOString()} AND ${schema.users.created_at} <= ${currentEnd.toISOString()}`,
          isNull(schema.users.deleted_at),
        ))
      const [prevAdmins] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.users)
        .where(and(
          eq(schema.users.owner_id, ownerId),
          eq(schema.users.role, 'admin-user'),
          sql`${schema.users.created_at} >= ${prevStart.toISOString()} AND ${schema.users.created_at} <= ${prevEnd.toISOString()}`,
          isNull(schema.users.deleted_at),
        ))
      kpi.trends.admin_users = calcTrend(curAdmins?.count ?? 0, prevAdmins?.count ?? 0)

      // Current month transactions
      if (tenantIds.length > 0) {
        const [curTx] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(schema.transactions)
          .where(and(
            sql`${schema.transactions.tenant_id} IN (${sql.join(tenantIds.map(id => sql`${id}`), sql`, `)})`,
            sql`${schema.transactions.created_at} >= ${currentStart.toISOString()} AND ${schema.transactions.created_at} <= ${currentEnd.toISOString()}`,
            isNull(schema.transactions.deleted_at),
          ))
        const [prevTx] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(schema.transactions)
          .where(and(
            sql`${schema.transactions.tenant_id} IN (${sql.join(tenantIds.map(id => sql`${id}`), sql`, `)})`,
            sql`${schema.transactions.created_at} >= ${prevStart.toISOString()} AND ${schema.transactions.created_at} <= ${prevEnd.toISOString()}`,
            isNull(schema.transactions.deleted_at),
          ))
        kpi.trends.transactions = calcTrend(curTx?.count ?? 0, prevTx?.count ?? 0)

        const [curRev] = await db
          .select({ total: sql<number>`COALESCE(sum(total_cost + additional_cost), 0)` })
          .from(schema.transactions)
          .where(and(
            sql`${schema.transactions.tenant_id} IN (${sql.join(tenantIds.map(id => sql`${id}`), sql`, `)})`,
            sql`${schema.transactions.status} IN ('done', 'SELESAI')`,
            sql`${schema.transactions.created_at} >= ${currentStart.toISOString()} AND ${schema.transactions.created_at} <= ${currentEnd.toISOString()}`,
            isNull(schema.transactions.deleted_at),
          ))
        const [prevRev] = await db
          .select({ total: sql<number>`COALESCE(sum(total_cost + additional_cost), 0)` })
          .from(schema.transactions)
          .where(and(
            sql`${schema.transactions.tenant_id} IN (${sql.join(tenantIds.map(id => sql`${id}`), sql`, `)})`,
            sql`${schema.transactions.status} IN ('done', 'SELESAI')`,
            sql`${schema.transactions.created_at} >= ${prevStart.toISOString()} AND ${schema.transactions.created_at} <= ${prevEnd.toISOString()}`,
            isNull(schema.transactions.deleted_at),
          ))
        kpi.trends.revenue = calcTrend(curRev?.total ?? 0, prevRev?.total ?? 0)
      }
    } catch (e) {
      console.error('Owner dashboard trends error:', e)
    }

    // 5. Enriched tenant list
    try {
      const tenantRows = await db
        .select({ id: schema.tenants.id, name: schema.tenants.name })
        .from(schema.tenants)
        .where(and(eq(schema.tenants.owner_id, ownerId), isNull(schema.tenants.deleted_at)))

      const allTenantIds = tenantRows.map(t => t.id)

      // Admin counts per tenant
      const adminCounts: Map<string, number> = new Map()
      if (allTenantIds.length > 0) {
        const rows = await db
          .select({ tenant_id: schema.users.tenant_id, count: sql<number>`count(*)::int` })
          .from(schema.users)
          .where(and(
            eq(schema.users.role, 'admin-user'),
            sql`${schema.users.tenant_id} IN (${sql.join(allTenantIds.map(id => sql`${id}`), sql`, `)})`,
            isNull(schema.users.deleted_at),
          ))
          .groupBy(schema.users.tenant_id)
        for (const r of rows) { if (r.tenant_id) adminCounts.set(r.tenant_id, r.count) }
      }

      // Active tx counts per tenant
      const activeTxCounts: Map<string, number> = new Map()
      if (allTenantIds.length > 0) {
        const rows = await db
          .select({ tenant_id: schema.transactions.tenant_id, count: sql<number>`count(*)::int` })
          .from(schema.transactions)
          .where(and(
            sql`${schema.transactions.tenant_id} IN (${sql.join(allTenantIds.map(id => sql`${id}`), sql`, `)})`,
            sql`status NOT IN ('done', 'cancelled', 'SELESAI', 'DIBATALKAN')`,
            isNull(schema.transactions.deleted_at),
          ))
          .groupBy(schema.transactions.tenant_id)
        for (const r of rows) { if (r.tenant_id) activeTxCounts.set(r.tenant_id, r.count) }
      }

      // Latest activity per tenant (via transaction_status_log)
      const lastActivity: Map<string, string> = new Map()
      if (allTenantIds.length > 0) {
        // Get transaction IDs belonging to these tenants
        const txRows = await db
          .select({ id: schema.transactions.id, tenant_id: schema.transactions.tenant_id })
          .from(schema.transactions)
          .where(and(
            sql`${schema.transactions.tenant_id} IN (${sql.join(allTenantIds.map(id => sql`${id}`), sql`, `)})`,
            isNull(schema.transactions.deleted_at),
          ))
        const tenantTxMap = new Map<string, string[]>()
        for (const tx of txRows) {
          if (!tx.tenant_id) continue
          const arr = tenantTxMap.get(tx.tenant_id) || []
          arr.push(tx.id)
          tenantTxMap.set(tx.tenant_id, arr)
        }

        for (const [tid, txIds] of tenantTxMap) {
          if (txIds.length === 0) continue
          const [latest] = await db
            .select({ created_at: schema.transactionStatusLog.created_at })
            .from(schema.transactionStatusLog)
            .where(sql`${schema.transactionStatusLog.transaction_id} IN (${sql.join(txIds.map(id => sql`${id}`), sql`, `)})`)
            .orderBy(sql`${schema.transactionStatusLog.created_at} DESC`)
            .limit(1)
          if (latest) lastActivity.set(tid, latest.created_at.toISOString())
        }
      }

      tenants = tenantRows.map(t => ({
        id: t.id,
        name: t.name,
        admin_user_count: adminCounts.get(t.id) ?? 0,
        active_transactions: activeTxCounts.get(t.id) ?? 0,
        last_activity: lastActivity.get(t.id) ?? null,
        plan_tier: subscription.tier,
      }))
    } catch (e) {
      console.error('Owner dashboard tenants error:', e)
    }

    // 6. 30-day chart
    try {
      const thirtyDaysAgo = new Date(now)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
      thirtyDaysAgo.setHours(0, 0, 0, 0)

      const dailyMap: Map<string, number> = new Map()
      // Fill all 30 days with 0
      for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo)
        d.setDate(d.getDate() + i)
        dailyMap.set(d.toISOString().substring(0, 10), 0)
      }

      if (tenantIds.length > 0) {
        const rows = await db.execute<{ date: string; count: number }>(
          sql`SELECT to_char(created_at, 'YYYY-MM-DD') as date, count(*)::int as count
              FROM transactions
              WHERE tenant_id IN (${sql.join(tenantIds.map(id => sql`${id}::uuid`), sql`, `)})
              AND deleted_at IS NULL
              AND created_at >= ${thirtyDaysAgo.toISOString()}
              GROUP BY to_char(created_at, 'YYYY-MM-DD')
              ORDER BY date`)

        if (rows) {
          for (const row of rows) {
            if (dailyMap.has(row.date)) {
              dailyMap.set(row.date, row.count)
            }
          }
        }
      }

      chart30d = [...dailyMap.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }))
    } catch (e) {
      console.error('Owner dashboard chart error:', e)
    }

    // 7. Activity feed
    try {
      const activityItems: Array<{
        id: string
        type: string
        description: string
        created_at: Date
      }> = []

      // 7a. Transaction status changes (last 30 days)
      if (tenantIds.length > 0) {
        const txIds = await db
          .select({ id: schema.transactions.id })
          .from(schema.transactions)
          .where(and(
            sql`${schema.transactions.tenant_id} IN (${sql.join(tenantIds.map(id => sql`${id}`), sql`, `)})`,
            isNull(schema.transactions.deleted_at),
          ))
        const txIdList = txIds.map(t => t.id)

        if (txIdList.length > 0) {
          const logRows = await db
            .select({
              id: schema.transactionStatusLog.id,
              transaction_id: schema.transactionStatusLog.transaction_id,
              new_status: schema.transactionStatusLog.to_status,
              created_at: schema.transactionStatusLog.created_at,
            })
            .from(schema.transactionStatusLog)
            .where(sql`${schema.transactionStatusLog.transaction_id} IN (${sql.join(txIdList.map(id => sql`${id}`), sql`, `)})`)
            .orderBy(sql`${schema.transactionStatusLog.created_at} DESC`)
            .limit(10)

          for (const log of logRows) {
            activityItems.push({
              id: log.id,
              type: 'transaction_status_change',
              description: `Transaksi #${shortId(log.transaction_id)} berstatus ${log.new_status}`,
              created_at: log.created_at,
            })
          }
        }
      }

      // 7b. Recently created tenants
      const recentTenants = await db
        .select({ id: schema.tenants.id, name: schema.tenants.name, created_at: schema.tenants.created_at })
        .from(schema.tenants)
        .where(and(eq(schema.tenants.owner_id, ownerId), isNull(schema.tenants.deleted_at)))
        .orderBy(sql`${schema.tenants.created_at} DESC`)
        .limit(5)

      for (const t of recentTenants) {
        activityItems.push({
          id: t.id,
          type: 'tenant_created',
          description: `Tenant baru "${t.name}" telah ditambahkan`,
          created_at: t.created_at,
        })
      }

      // 7c. Recently created admin-users
      const recentAdmins = await db
        .select({ id: schema.users.id, email: schema.users.email, created_at: schema.users.created_at })
        .from(schema.users)
        .where(and(
          eq(schema.users.owner_id, ownerId),
          eq(schema.users.role, 'admin-user'),
          isNull(schema.users.deleted_at),
        ))
        .orderBy(sql`${schema.users.created_at} DESC`)
        .limit(5)

      for (const u of recentAdmins) {
        activityItems.push({
          id: u.id,
          type: 'admin_user_created',
          description: `Admin user "${u.email}" telah dibuat`,
          created_at: u.created_at,
        })
      }

      // Sort and limit to 20
      activityItems.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      activity = activityItems.slice(0, 20).map(item => ({
        id: item.id,
        type: item.type,
        description: item.description,
        created_at: item.created_at.toISOString(),
      }))
    } catch (e) {
      console.error('Owner dashboard activity error:', e)
    }

    // Build response
    res.json({ kpi, tenants, chart_30d: chart30d, activity, subscription, health })
  })

  // GET /report — Owner detailed transaction report
  router.get('/report', async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const period = (req.query.period as string | undefined) ?? 'monthly'
      const startDateParam = req.query.start_date as string | undefined
      const endDateParam = req.query.end_date as string | undefined
      const tenantIdParam = req.query.tenant_id as string | undefined

      if (!['monthly', 'range'].includes(period)) {
        res.status(400).json({ error: 'invalid_period' })
        return
      }
      if (period === 'range' && (!startDateParam || !endDateParam)) {
        res.status(400).json({ error: 'date_range_required' })
        return
      }

      const ownerTenants = await db
        .select({ id: schema.tenants.id, name: schema.tenants.name })
        .from(schema.tenants)
        .where(and(eq(schema.tenants.owner_id, ownerId), isNull(schema.tenants.deleted_at)))

      const tenantIds = tenantIdParam ? [tenantIdParam] : ownerTenants.map((tenant) => tenant.id)
      const allowedTenantIds = new Set(ownerTenants.map((tenant) => tenant.id))
      if (tenantIdParam && !allowedTenantIds.has(tenantIdParam)) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }

      if (tenantIds.length === 0) {
        res.json({
          period,
          summary: {
            total_transactions: 0,
            total_revenue: '0',
            active_transactions: 0,
            completed_transactions: 0,
            cancelled_transactions: 0,
          },
          status_distribution: [],
          by_tenant: [],
          monthly_revenue: [],
        })
        return
      }

      const now = new Date()
      const startDate = period === 'range'
        ? new Date(startDateParam!)
        : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
      const endDate = period === 'range'
        ? new Date(endDateParam!)
        : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || startDate > endDate) {
        res.status(400).json({ error: 'invalid_date_range' })
        return
      }

      const tenantFilter = sql`${schema.transactions.tenant_id} IN (${sql.join(tenantIds.map((id) => sql`${id}`), sql`, `)})`
      const dateFilter = sql`${schema.transactions.created_at} >= ${startDate.toISOString()} AND ${schema.transactions.created_at} < ${endDate.toISOString()}`
      const baseFilter = and(tenantFilter, dateFilter, isNull(schema.transactions.deleted_at))
      const completedStatusSql = sql`${schema.transactions.status}::text IN ('done', 'SELESAI')`
      const cancelledStatusSql = sql`${schema.transactions.status}::text IN ('cancelled', 'DIBATALKAN')`
      const inactiveStatusSql = sql`${schema.transactions.status}::text IN ('done', 'SELESAI', 'cancelled', 'DIBATALKAN')`

      const [summary] = await db
        .select({
          total_transactions: sql<number>`count(*)::int`,
          total_revenue: sql<string>`COALESCE(sum(CASE WHEN ${completedStatusSql} THEN total_cost + additional_cost ELSE 0 END), 0)::text`,
          active_transactions: sql<number>`count(*) FILTER (WHERE NOT ${inactiveStatusSql})::int`,
          completed_transactions: sql<number>`count(*) FILTER (WHERE ${completedStatusSql})::int`,
          cancelled_transactions: sql<number>`count(*) FILTER (WHERE ${cancelledStatusSql})::int`,
        })
        .from(schema.transactions)
        .where(baseFilter)

      const statusDistribution = await db
        .select({ status: schema.transactions.status, count: sql<number>`count(*)::int` })
        .from(schema.transactions)
        .where(baseFilter)
        .groupBy(schema.transactions.status)

      const byTenant = await db
        .select({
          tenant_id: schema.tenants.id,
          tenant_name: schema.tenants.name,
          transaction_count: sql<number>`count(${schema.transactions.id})::int`,
          revenue: sql<string>`COALESCE(sum(CASE WHEN ${completedStatusSql} THEN total_cost + additional_cost ELSE 0 END), 0)::text`,
        })
        .from(schema.tenants)
        .innerJoin(schema.transactions, eq(schema.transactions.tenant_id, schema.tenants.id))
        .where(baseFilter)
        .groupBy(schema.tenants.id, schema.tenants.name)

      const monthlyRevenue = await db
        .select({
          month: sql<string>`to_char(date_trunc('month', ${schema.transactions.created_at}), 'YYYY-MM')`,
          revenue: sql<string>`COALESCE(sum(CASE WHEN ${completedStatusSql} THEN total_cost + additional_cost ELSE 0 END), 0)::text`,
          transaction_count: sql<number>`count(*)::int`,
        })
        .from(schema.transactions)
        .where(baseFilter)
        .groupBy(sql`date_trunc('month', ${schema.transactions.created_at})`)
        .orderBy(sql`date_trunc('month', ${schema.transactions.created_at})`)

      res.json({
        period,
        summary: summary ?? {
          total_transactions: 0,
          total_revenue: '0',
          active_transactions: 0,
          completed_transactions: 0,
          cancelled_transactions: 0,
        },
        status_distribution: statusDistribution,
        by_tenant: byTenant,
        monthly_revenue: monthlyRevenue,
      })
    } catch (error) {
      console.error('Owner report error:', error)
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

      // Enrich with admin-user count and active tx count per tenant
      const enriched = await Promise.all(
        tenants.map(async (tenant) => {
          const [adminCount] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(schema.users)
            .where(
              and(
                eq(schema.users.tenant_id, tenant.id),
                eq(schema.users.role, 'admin-user'),
                isNull(schema.users.deleted_at)
              )
            )

          const [activeTxCount] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(schema.transactions)
            .where(
              and(
                eq(schema.transactions.tenant_id, tenant.id),
                sql`status NOT IN ('done', 'cancelled', 'SELESAI', 'DIBATALKAN')`,
                isNull(schema.transactions.deleted_at)
              )
            )

          return {
            ...tenant,
            admin_user_count: adminCount?.count ?? 0,
            active_transactions: activeTxCount?.count ?? 0,
          }
        })
      )

      res.json({ data: enriched })
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

  // GET /tenants/:id — Detail tenant with admin-users
  router.get('/tenants/:id', async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const tenantId = (req.params.id as string)!

      const [tenant] = await db
        .select({
          id: schema.tenants.id,
          name: schema.tenants.name,
          created_at: schema.tenants.created_at,
          updated_at: schema.tenants.updated_at,
        })
        .from(schema.tenants)
        .where(
          and(
            eq(schema.tenants.id, tenantId),
            eq(schema.tenants.owner_id, ownerId),
            isNull(schema.tenants.deleted_at)
          )
        )

      if (!tenant) {
        res.status(404).json({ error: 'tenant_not_found' })
        return
      }

      const adminUsers = await db
        .select({
          id: schema.users.id,
          email: schema.users.email,
          phone: schema.users.phone,
          created_at: schema.users.created_at,
        })
        .from(schema.users)
        .where(
          and(
            eq(schema.users.tenant_id, tenantId),
            eq(schema.users.role, 'admin-user'),
            isNull(schema.users.deleted_at)
          )
        )

      res.json({ ...tenant, admin_users: adminUsers })
    } catch (error) {
      console.error('Get tenant detail error:', error)
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

  // GET /admin-users — Flat list of all admin-users owned by this owner
  router.get('/admin-users', async (req, res) => {
    try {
      const ownerId = req.user!.userId

      const admins = await db
        .select({
          id: schema.users.id,
          email: schema.users.email,
          phone: schema.users.phone,
          tenant_id: schema.users.tenant_id,
          tenant_name: schema.tenants.name,
          created_at: schema.users.created_at,
        })
        .from(schema.users)
        .leftJoin(schema.tenants, eq(schema.tenants.id, schema.users.tenant_id))
        .where(
          and(
            eq(schema.users.owner_id, ownerId),
            eq(schema.users.role, 'admin-user'),
            isNull(schema.users.deleted_at)
          )
        )

      res.json({ data: admins })
    } catch (error) {
      console.error('List all admin users error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // POST /admin-users — Create admin-user (alternative flat route)
  router.post('/admin-users', validate(createAdminUserSchema), async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const { email, phone, password, tenant_id } = req.body as { email: string; phone: string; password: string; tenant_id: string }

      // Verify tenant belongs to owner
      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.id, tenant_id), eq(schema.tenants.owner_id, ownerId)))
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
          tenant_id,
        })
        .returning()

      res.status(201).json({ id: admin!.id, email: admin!.email, phone: admin!.phone, tenant_id })
    } catch (error) {
      console.error('Create admin user error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // DELETE /admin-users/:id — Soft delete admin-user (flat route)
  router.delete('/admin-users/:id', async (req, res) => {
    try {
      const ownerId = req.user!.userId
      const adminId = (req.params.id as string)!

      const [admin] = await db
        .select()
        .from(schema.users)
        .where(
          and(
            eq(schema.users.id, adminId),
            eq(schema.users.owner_id, ownerId),
            eq(schema.users.role, 'admin-user'),
            isNull(schema.users.deleted_at)
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

  // GET /tenants/:tenantId/admin-users (legacy tenant-scoped route)
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

      const currentStatus = tx.status as Parameters<typeof isValidTransition>[0]
      const nextStatus = status as Parameters<typeof isValidTransition>[1]
      if (!isValidTransition(currentStatus, nextStatus)) {
        res.status(400).json({ error: 'invalid_status_transition' })
        return
      }

      const statusUpdatedAt = new Date()
      const [updated] = await db
        .update(schema.transactions)
        .set({ status: nextStatus, status_updated_at: statusUpdatedAt, updated_at: statusUpdatedAt })
        .where(eq(schema.transactions.id, txId))
        .returning()

      await db.insert(schema.transactionStatusLog).values({
        transaction_id: txId,
        from_status: currentStatus,
        to_status: nextStatus,
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
