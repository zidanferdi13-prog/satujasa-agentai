import { and, eq, ne, isNull } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { schema } from '../db/index.js'
import type { Database } from '../db/index.js'

/**
 * Check for expired subscriptions and downgrade them to 'free' tier.
 * @returns number of subscriptions downgraded
 */
export async function checkExpiredSubscriptions(db: Database): Promise<number> {
  // Find expired subscriptions that aren't already free
  const expired = await db
    .select({ id: schema.subscriptions.id, owner_id: schema.subscriptions.owner_id })
    .from(schema.subscriptions)
    .where(
      and(
        sql`${schema.subscriptions.expires_at} < NOW()`,
        ne(schema.subscriptions.tier, 'free'),
        isNull(schema.subscriptions.deleted_at),
      ),
    )

  if (expired.length === 0) {
    console.log(`[SubscriptionExpiry] ${new Date().toISOString()} — No expired subscriptions found`)
    return 0
  }

  // Downgrade each expired subscription
  for (const sub of expired) {
    await db
      .update(schema.subscriptions)
      .set({
        tier: 'free',
        max_tenants: 1,
        max_admin_users: 1,
        updated_at: new Date(),
      })
      .where(and(
        eq(schema.subscriptions.id, sub.id),
        isNull(schema.subscriptions.deleted_at),
      ))
  }

  console.log(
    `[SubscriptionExpiry] ${new Date().toISOString()} — Downgraded ${expired.length} subscription(s): ` +
    expired.map(s => s.owner_id).join(', '),
  )

  return expired.length
}
