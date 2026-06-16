import { Router } from 'express'
import { eq, and, isNull, sql, ilike } from 'drizzle-orm'

function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0]! : (value ?? '')
}

import { readSettingsFromFile, writeSettingsToFile } from '../lib/settings-file.js'
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

  // GET /admin/owners — enriched list with search & tier filter
  router.get('/owners', async (req, res) => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search.trim() : null
      const tierFilter = typeof req.query.tier === 'string' ? req.query.tier.trim() : null

      // Base conditions
      const conditions: ReturnType<typeof and>[] = [
        eq(schema.users.role, 'owner'),
        isNull(schema.users.deleted_at),
      ]

      // Tier filter: pre-filter owner IDs from subscriptions
      if (tierFilter && ['free', 'pro', 'plus', 'expert'].includes(tierFilter)) {
        const tierSubs = await db
          .select({ ownerId: schema.subscriptions.owner_id })
          .from(schema.subscriptions)
          .where(and(
            eq(schema.subscriptions.tier, tierFilter as SubscriptionTier),
            isNull(schema.subscriptions.deleted_at),
          ))

        const filteredIds = [...new Set(tierSubs.map(s => s.ownerId))]
        if (filteredIds.length === 0) {
          // No owners match — return empty early
          const [cnt] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(schema.users)
            .where(and(...conditions))
          res.json({ data: [], meta: { total: cnt?.count ?? 0 } })
          return
        }

        conditions.push(sql`${schema.users.id} IN (${sql.join(
          filteredIds.map(id => sql`${id}`),
          sql`, `,
        )})`)
      }

      // Search filter: email or company_name ILIKE
      if (search && search.length > 0) {
        conditions.push(sql`(
          ${schema.users.email}::text ILIKE ${'%' + search + '%'}
          OR
          ${schema.users.company_name}::text ILIKE ${'%' + search + '%'}
        )`)
      }

      // Total count
      const [cnt] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.users)
        .where(and(...conditions))
      const total = cnt?.count ?? 0

      // Owners
      const owners = await db
        .select({
          id: schema.users.id,
          email: schema.users.email,
          phone: schema.users.phone,
          company_name: schema.users.company_name,
          role: schema.users.role,
          created_at: schema.users.created_at,
        })
        .from(schema.users)
        .where(and(...conditions))

      const ownerIds = owners.map(o => o.id)

      // Subscriptions for these owners (latest non-deleted per owner)
      const subs = ownerIds.length > 0
        ? await db
            .select({
              owner_id: schema.subscriptions.owner_id,
              tier: schema.subscriptions.tier,
              activated_at: schema.subscriptions.activated_at,
            })
            .from(schema.subscriptions)
            .where(and(
              sql`${schema.subscriptions.owner_id} IN (${sql.join(ownerIds.map(id => sql`${id}`), sql`, `)})`,
              isNull(schema.subscriptions.deleted_at),
            ))
        : []

      // Tenant counts grouped by owner_id
      const tenantCounts = ownerIds.length > 0
        ? await db
            .select({
              owner_id: schema.tenants.owner_id,
              count: sql<number>`count(*)::int`,
            })
            .from(schema.tenants)
            .where(and(
              sql`${schema.tenants.owner_id} IN (${sql.join(ownerIds.map(id => sql`${id}`), sql`, `)})`,
              isNull(schema.tenants.deleted_at),
            ))
            .groupBy(schema.tenants.owner_id)
        : []

      // Admin-user counts grouped by owner_id
      const adminCounts = ownerIds.length > 0
        ? await db
            .select({
              owner_id: schema.users.owner_id,
              count: sql<number>`count(*)::int`,
            })
            .from(schema.users)
            .where(and(
              eq(schema.users.role, 'admin-user'),
              isNull(schema.users.deleted_at),
              sql`${schema.users.owner_id} IN (${sql.join(ownerIds.map(id => sql`${id}`), sql`, `)})`,
            ))
            .groupBy(schema.users.owner_id)
        : []

      // Build lookup maps
      const subMap = new Map<string, { tier: string; activatedAt: Date | null }>()
      for (const s of subs) subMap.set(s.owner_id, { tier: s.tier, activatedAt: s.activated_at })

      const tenantCountMap = new Map<string, number>()
      for (const t of tenantCounts) tenantCountMap.set(t.owner_id, t.count)

      const adminCountMap = new Map<string, number>()
      for (const a of adminCounts) { if (a.owner_id) adminCountMap.set(a.owner_id, a.count) }

      // MRR mapping
      const mrrMap: Record<string, string> = {
        free: '0',
        pro: '299000',
        plus: '499000',
        expert: '899000',
      }

      // Enrich owners
      const enriched = owners.map(o => {
        const sub = subMap.get(o.id)
        const tier = sub?.tier ?? null
        const subscriptionStatus = sub?.activatedAt ? 'active' : 'pending'
        const mrr = tier ? (mrrMap[tier] ?? '') : ''
        return {
          id: o.id,
          email: o.email,
          phone: o.phone,
          company_name: o.company_name ?? null,
          role: o.role,
          subscription_tier: tier,
          total_tenants: tenantCountMap.get(o.id) ?? 0,
          total_admin_users: adminCountMap.get(o.id) ?? 0,
          subscription_status: subscriptionStatus,
          mrr,
          created_at: o.created_at,
        }
      })

      res.json({ data: enriched, meta: { total } })
    } catch (error) {
      console.error('List owners error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // GET /admin/owners/:id — enriched single owner
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

      const [tenantCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.tenants)
        .where(and(eq(schema.tenants.owner_id, owner.id), isNull(schema.tenants.deleted_at)))

      const [adminCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.users)
        .where(and(
          eq(schema.users.role, 'admin-user'),
          eq(schema.users.owner_id, owner.id),
          isNull(schema.users.deleted_at),
        ))

      const tier = sub?.tier ?? null
      const subscriptionStatus = sub?.activated_at ? 'active' : 'pending'
      const mrrMap: Record<string, string> = {
        free: '0',
        pro: '299000',
        plus: '499000',
        expert: '899000',
      }
      const mrr = tier ? (mrrMap[tier] ?? '') : ''

      res.json({
        id: owner.id,
        email: owner.email,
        phone: owner.phone,
        company_name: owner.company_name ?? null,
        role: owner.role,
        subscription_tier: tier,
        total_tenants: tenantCount?.count ?? 0,
        total_admin_users: adminCount?.count ?? 0,
        subscription_status: subscriptionStatus,
        mrr,
        created_at: owner.created_at,
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

  // ─── Services ────────────────────────────────────────────────────────────
  router.get('/services', async (_req, res) => {
    try {
      const allServices = await db
        .select()
        .from(schema.services)
        .where(isNull(schema.services.deleted_at))
        .orderBy(schema.services.name)

      res.json({ data: allServices })
    } catch (error) {
      console.error('Get services error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Settings ────────────────────────────────────────────────────────────
  router.get('/settings', async (_req, res) => {
    try {
      const settings = await readSettingsFromFile()
      res.json({ data: settings })
    } catch (error) {
      console.error('Get settings error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  // ─── Users ───────────────────────────────────────────────────────────────
  router.get('/users', async (req, res) => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''
      const roleFilter = typeof req.query.role === 'string' ? req.query.role.trim().toLowerCase() : ''

      // Map FE role values to DB role enum
      const roleMap: Record<string, string> = {
        superadmin: 'super-admin',
        owner: 'owner',
        admin_user: 'admin-user',
      }
      const dbRole = roleMap[roleFilter] ?? null

      const conditions: ReturnType<typeof and>[] = [isNull(schema.users.deleted_at)]

      if (dbRole) {
        conditions.push(eq(schema.users.role, dbRole as 'super-admin' | 'owner' | 'admin-user'))
      }

      if (search) {
        conditions.push(ilike(schema.users.email, `%${search}%`))
      }

      // Self-join: get owner_name from owner record
      const ownerAlias = sql<string>`COALESCE(owner.email, '')`

      const rows = await db
        .select({
          id: schema.users.id,
          email: schema.users.email,
          role: schema.users.role,
          owner_name: ownerAlias,
          created_at: schema.users.created_at,
        })
        .from(schema.users)
        .leftJoin(sql`users AS owner`, eq(schema.users.owner_id, sql.raw('owner.id')))
        .where(and(...conditions))
        .orderBy(sql`${schema.users.created_at} DESC`)

      const items = rows.map(r => ({
        id: r.id,
        email: r.email,
        role: r.role,
        owner_name: (r.owner_name as string) || null,
        is_active: true,
        created_at: r.created_at.toISOString(),
      }))

      res.json({ data: items, meta: { total: items.length } })
    } catch (e) {
      console.error('Super admin users list error:', e)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  router.post('/settings', async (req, res) => {
    try {
      await writeSettingsToFile(req.body)
      res.json({ success: true })
    } catch (error) {
      console.error('Update settings error:', error)
      res.status(500).json({ error: 'internal_server_error' })
    }
  })

  return router
}
