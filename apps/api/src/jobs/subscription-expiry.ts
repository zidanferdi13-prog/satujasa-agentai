import { and, eq, ne, isNull } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { schema } from '../db/index.js'
import type { Database } from '../db/index.js'
import { sendEmail, templateExpiry7Day, templateExpiry3Day, templateExpiryExpired } from '../lib/email.js'

type NotificationType = 'expiry_7_day' | 'expiry_3_day' | 'expired'

async function hasNotificationBeenSent(
  db: Database,
  subscriptionId: string,
  type: NotificationType,
): Promise<boolean> {
  const [existing] = await db
    .select({ id: schema.subscriptionNotifications.id })
    .from(schema.subscriptionNotifications)
    .where(and(
      eq(schema.subscriptionNotifications.subscription_id, subscriptionId),
      eq(schema.subscriptionNotifications.notification_type, type),
    ))
    .limit(1)

  return Boolean(existing)
}

async function markNotificationSent(
  db: Database,
  subscriptionId: string,
  ownerId: string,
  type: NotificationType,
): Promise<void> {
  await db.insert(schema.subscriptionNotifications).values({
    subscription_id: subscriptionId,
    owner_id: ownerId,
    notification_type: type,
  })
}

/**
 * Check subscriptions nearing expiry and send notifications (7-day, 3-day, expired).
 * Duplicate prevention is handled by subscription_notifications table.
 * @returns number of notification emails sent
 */
export async function checkExpiryWarnings(db: Database): Promise<number> {
  const rows = await db
    .select({
      subscription_id: schema.subscriptions.id,
      owner_id: schema.subscriptions.owner_id,
      owner_email: schema.users.email,
      owner_name: schema.users.company_name,
      tier: schema.subscriptions.tier,
      expires_at: schema.subscriptions.expires_at,
    })
    .from(schema.subscriptions)
    .innerJoin(schema.users, eq(schema.users.id, schema.subscriptions.owner_id))
    .where(and(
      ne(schema.subscriptions.tier, 'free'),
      isNull(schema.subscriptions.deleted_at),
      sql`${schema.subscriptions.expires_at} IS NOT NULL`,
      sql`${schema.subscriptions.expires_at} <= NOW() + interval '7 days'`,
    ))

  if (rows.length === 0) {
    console.log(`[SubscriptionExpiry] ${new Date().toISOString()} — No subscriptions need expiry notifications`)
    return 0
  }

  let sentCount = 0

  for (const row of rows) {
    if (!row.expires_at) continue

    const expiresAt = new Date(row.expires_at)
    const now = new Date()
    const msDiff = expiresAt.getTime() - now.getTime()
    const dayDiff = Math.ceil(msDiff / (1000 * 60 * 60 * 24))

    let type: NotificationType | null = null
    if (dayDiff <= 0) type = 'expired'
    else if (dayDiff <= 3) type = 'expiry_3_day'
    else if (dayDiff <= 7) type = 'expiry_7_day'

    if (!type) continue

    const alreadySent = await hasNotificationBeenSent(db, row.subscription_id, type)
    if (alreadySent) continue

    const templateData = {
      ownerEmail: row.owner_email,
      ownerName: row.owner_name ?? undefined,
      tier: row.tier,
      expiresAt: expiresAt.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }

    if (type === 'expiry_7_day') {
      await sendEmail(templateExpiry7Day(templateData))
    } else if (type === 'expiry_3_day') {
      await sendEmail(templateExpiry3Day(templateData))
    } else {
      await sendEmail(templateExpiryExpired(templateData))
    }

    await markNotificationSent(db, row.subscription_id, row.owner_id, type)
    sentCount += 1
  }

  console.log(`[SubscriptionExpiry] ${new Date().toISOString()} — Sent ${sentCount} notification email(s)`)
  return sentCount
}

/**
 * Check for expired subscriptions and downgrade them to 'free' tier.
 * Also triggers expiry warning emails before downgrade.
 * @returns number of subscriptions downgraded
 */
export async function checkExpiredSubscriptions(db: Database): Promise<number> {
  // Send warnings first
  await checkExpiryWarnings(db)
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
