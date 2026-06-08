import { eq, and, isNull } from 'drizzle-orm'

import type { Database } from '../db/index.js'
import { schema } from '../db/index.js'

export function subscriptionEnforcement(db: Database) {
  return {
    async checkCanCreateTenant(ownerId: string): Promise<{ allowed: boolean; reason?: string }> {
      const [sub] = await db
        .select()
        .from(schema.subscriptions)
        .where(and(eq(schema.subscriptions.owner_id, ownerId), isNull(schema.subscriptions.deleted_at)))
        .orderBy(schema.subscriptions.created_at)
        .limit(1)

      if (!sub) {
        return { allowed: false, reason: 'no_active_subscription' }
      }

      if (sub.tier === 'free') {
        return { allowed: false, reason: 'free_tier_cannot_create_tenants' }
      }

      const existingTenants = await db
        .select()
        .from(schema.tenants)
        .where(and(eq(schema.tenants.owner_id, ownerId), isNull(schema.tenants.deleted_at)))

      if (existingTenants.length >= sub.max_tenants) {
        return { allowed: false, reason: 'max_tenants_reached' }
      }

      return { allowed: true }
    },

    async checkCanCreateAdminUser(ownerId: string): Promise<{ allowed: boolean; reason?: string }> {
      const [sub] = await db
        .select()
        .from(schema.subscriptions)
        .where(and(eq(schema.subscriptions.owner_id, ownerId), isNull(schema.subscriptions.deleted_at)))
        .orderBy(schema.subscriptions.created_at)
        .limit(1)

      if (!sub) {
        return { allowed: false, reason: 'no_active_subscription' }
      }

      if (sub.tier === 'free') {
        return { allowed: false, reason: 'free_tier_cannot_create_admin_users' }
      }

      const existingAdmins = await db
        .select()
        .from(schema.users)
        .where(and(eq(schema.users.owner_id, ownerId), eq(schema.users.role, 'admin-user'), isNull(schema.users.deleted_at)))

      if (existingAdmins.length >= sub.max_admin_users) {
        return { allowed: false, reason: 'max_admin_users_reached' }
      }

      return { allowed: true }
    },

    async checkCanCreateTransaction(ownerId: string): Promise<{ allowed: boolean; reason?: string }> {
      const [sub] = await db
        .select()
        .from(schema.subscriptions)
        .where(and(eq(schema.subscriptions.owner_id, ownerId), isNull(schema.subscriptions.deleted_at)))
        .orderBy(schema.subscriptions.created_at)
        .limit(1)

      if (!sub) {
        return { allowed: false, reason: 'no_active_subscription' }
      }

      if (sub.tier === 'free') {
        return { allowed: false, reason: 'free_tier_cannot_create_transactions' }
      }

      return { allowed: true }
    },
  }
}

export type SubscriptionEnforcement = ReturnType<typeof subscriptionEnforcement>
