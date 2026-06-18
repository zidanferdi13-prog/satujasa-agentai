import postgres from 'postgres'

const TEST_DATABASE_URL = process.env.DATABASE_URL || 'postgres://stnk:***@127.0.0.1:5432/stnk_jasa_test'

function assertTestDatabase(url: string) {
  const parsed = new URL(url)
  if (!parsed.pathname.endsWith('/stnk_jasa_test')) {
    throw new Error(`Refusing to bootstrap non-test database: ${parsed.pathname}`)
  }
}

async function bootstrapTestDatabase() {
  assertTestDatabase(TEST_DATABASE_URL)

  const sql = postgres(TEST_DATABASE_URL, { max: 1, onnotice: () => undefined })
  try {
    await sql`ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'DRAFT'`
    await sql`ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'DOKUMEN_DITERIMA'`
    await sql`ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'PROSES_SAMSAT'`
    await sql`ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'MENUNGGU_PEMBAYARAN'`
    await sql`ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'SELESAI'`
    await sql`ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'DIBATALKAN'`

    await sql`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS status_updated_at timestamptz NOT NULL DEFAULT now()`
    await sql`UPDATE transactions SET status_updated_at = COALESCE(status_updated_at, updated_at, created_at, now()) WHERE status_updated_at IS NULL`
    
    await sql`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS expires_at timestamptz`

    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_notification_type') THEN
          CREATE TYPE subscription_notification_type AS ENUM ('expiry_7_day', 'expiry_3_day', 'expired');
        END IF;
      END
      $$
    `
    await sql`CREATE TABLE IF NOT EXISTS subscription_notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      subscription_id UUID NOT NULL REFERENCES subscriptions(id),
      owner_id UUID NOT NULL REFERENCES users(id),
      notification_type subscription_notification_type NOT NULL,
      sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  } finally {
    await sql.end({ timeout: 5 })
  }
}

await bootstrapTestDatabase()
