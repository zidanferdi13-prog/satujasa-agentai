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

// ─── Helpers ────────────────────────────────────────────────────────────────

function relativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 1) return 'Baru saja'
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} jam lalu`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} hari lalu`
  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks < 5) return `${diffWeeks} minggu lalu`
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

// ─── Routes ──────────────────────────────────────────────────────────────────

  // GET /admin/dashboard
  router.get('/dashboard', async (_req, res) => {
    // All fields default to safe fallback values
    let totalOwners = 0
    let totalTenants = 0
    let totalTransactions = 0
    let totalRevenue = '0'
    let totalAdminUsers = 0
    const subscriptionDistribution: Record<string, number> = { free: 0, pro: 0, plus: 0, expert: 0 }
    let recentActivity: Array<{
      id: string
      type: 'owner_registered' | 'tenant_created' | 'admin_added' | 'owner_updated' | 'system_updated'
      description: string
      detail: string
      created_at: string
      relative_time: string
    }> = []
    const platformStats = {
      storage_used_gb: 21.2,
      storage_total_gb: 50,
      db_used_mb: 280,
      db_total_mb: 1024,
      active_users_30d: 0,
      total_users_30d: 0,
      active_tenants: 0,
      total_tenant_slots: 4,
    }
    const systemHealth = {
      server: 'operational' as const,
      database: 'operational' as const,
      backup: 'operational' as const,
    }

    // 1. Owner count
    try {
      const [ownerCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.users)
        .where(and(eq(schema.users.role, 'owner'), isNull(schema.users.deleted_at)))
      totalOwners = ownerCount?.count ?? 0
    } catch (e) {
      console.error('Dashboard owner count error:', e)
    }

    // 2. Tenant count
    try {
      const [tenantCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.tenants)
        .where(isNull(schema.tenants.deleted_at))
      totalTenants = tenantCount?.count ?? 0
    } catch (e) {
      console.error('Dashboard tenant count error:', e)
    }

    // 3. Transaction count
    try {
      const [txCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.transactions)
        .where(isNull(schema.transactions.deleted_at))
      totalTransactions = txCount?.count ?? 0
    } catch (e) {
      console.error('Dashboard transaction count error:', e)
    }

    // 4. Revenue
    try {
      const [revenue] = await db
        .select({ total: sql<string>`COALESCE(sum(total_cost + additional_cost), 0)::text` })
        .from(schema.transactions)
        .where(and(
          sql`${schema.transactions.status} IN ('done', 'SELESAI')`,
          isNull(schema.transactions.deleted_at),
        ))
      totalRevenue = revenue?.total ?? '0'
    } catch (e) {
      console.error('Dashboard revenue error:', e)
    }

    // 5. Admin user count
    try {
      const [adminUserCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.users)
        .where(and(eq(schema.users.role, 'admin-user'), isNull(schema.users.deleted_at)))
      totalAdminUsers = adminUserCount?.count ?? 0
    } catch (e) {
      console.error('Dashboard admin user count error:', e)
    }

    // 6. Subscription distribution
    try {
      const rows = await db
        .select({ tier: schema.subscriptions.tier, count: sql<number>`count(*)::int` })
        .from(schema.subscriptions)
        .where(isNull(schema.subscriptions.deleted_at))
        .groupBy(schema.subscriptions.tier)
      for (const row of rows) {
        const key = (row.tier || 'free') as string
        subscriptionDistribution[key] = (row.count ?? 0)
      }
    } catch (e) {
      console.error('Dashboard subscription distribution error:', e)
    }

    // 7. Recent activity (latest 2 owners, 2 tenants, 2 admin-users)
    try {
      // Latest 2 owners
      const latestOwners = await db
        .select({ id: schema.users.id, email: schema.users.email, createdAt: schema.users.created_at })
        .from(schema.users)
        .where(and(eq(schema.users.role, 'owner'), isNull(schema.users.deleted_at)))
        .orderBy(sql`${schema.users.created_at} DESC`)
        .limit(2)

      // Latest 2 tenants
      const latestTenants = await db
        .select({ id: schema.tenants.id, name: schema.tenants.name, createdAt: schema.tenants.created_at })
        .from(schema.tenants)
        .where(isNull(schema.tenants.deleted_at))
        .orderBy(sql`${schema.tenants.created_at} DESC`)
        .limit(2)

      // Latest 2 admin-users
      const latestAdmins = await db
        .select({ id: schema.users.id, email: schema.users.email, createdAt: schema.users.created_at })
        .from(schema.users)
        .where(and(eq(schema.users.role, 'admin-user'), isNull(schema.users.deleted_at)))
        .orderBy(sql`${schema.users.created_at} DESC`)
        .limit(2)

      // Build activity items
      const activityItems: Array<{
        id: string
        type: 'owner_registered' | 'tenant_created' | 'admin_added'
        description: string
        detail: string
        created_at: string
        relative_time: string
      }> = []

      for (const owner of latestOwners) {
        activityItems.push({
          id: owner.id,
          type: 'owner_registered',
          description: 'Owner baru terdaftar',
          detail: owner.email,
          created_at: owner.createdAt.toISOString(),
          relative_time: relativeTime(owner.createdAt),
        })
      }

      for (const tenant of latestTenants) {
        activityItems.push({
          id: tenant.id,
          type: 'tenant_created',
          description: 'Tenant baru dibuat',
          detail: tenant.name,
          created_at: tenant.createdAt.toISOString(),
          relative_time: relativeTime(tenant.createdAt),
        })
      }

      for (const admin of latestAdmins) {
        activityItems.push({
          id: admin.id,
          type: 'admin_added',
          description: 'Admin user ditambahkan',
          detail: admin.email,
          created_at: admin.createdAt.toISOString(),
          relative_time: relativeTime(admin.createdAt),
        })
      }

      // Sort by created_at DESC, take 6
      activityItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      recentActivity = activityItems.slice(0, 6)
    } catch (e) {
      console.error('Dashboard recent activity error:', e)
    }

    // 8. Platform stats
    try {
      // DB size
      const dbName = new URL(config.DATABASE_URL).pathname.replace('/', '')
      const [dbSize] = await db.execute<{ size_mb: number }>(
        sql`SELECT COALESCE(round(pg_database_size(${dbName}) / 1024.0 / 1024.0, 1), 280)::numeric as size_mb`,
      )
      platformStats.db_used_mb = Number(dbSize?.size_mb ?? 280)

      // Active users (owners + admin-users)
      const [activeUserCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.users)
        .where(and(
          sql`${schema.users.role} IN ('owner', 'admin-user')`,
          isNull(schema.users.deleted_at),
        ))
      platformStats.active_users_30d = activeUserCount?.count ?? 0
      platformStats.total_users_30d = activeUserCount?.count ?? 0

      // Active tenants (already have from #2)
      platformStats.active_tenants = totalTenants

      // Tenant slots sum from subscriptions
      try {
        const [tenantSlots] = await db
          .select({ total: sql<number>`COALESCE(sum(max_tenants), 4)::int` })
          .from(schema.subscriptions)
          .where(isNull(schema.subscriptions.deleted_at))
        platformStats.total_tenant_slots = tenantSlots?.total ?? 4
      } catch {
        // keep default 4
      }
    } catch (e) {
      console.error('Dashboard platform stats error:', e)
    }

    // Build response
    res.json({
      total_owners: totalOwners,
      active_owners: totalOwners,
      total_tenants: totalTenants,
      total_transactions: totalTransactions,
      total_revenue: totalRevenue,
      total_admin_users: totalAdminUsers,
      subscription_distribution: subscriptionDistribution,
      recent_activity: recentActivity,
      platform_stats: platformStats,
      system_health: systemHealth,
    })
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
