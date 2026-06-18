import 'dotenv/config'

import { createApp } from './app.js'
import { loadConfig } from './config.js'
import { getDb } from './db/index.js'
import { checkExpiredSubscriptions } from './jobs/subscription-expiry.js'

const config = loadConfig()
const app = createApp(config)
const db = getDb(config.DATABASE_URL)

// ─── Scheduled Jobs ───────────────────────────────────────────────────────────
// Check for expired subscriptions every 6 hours
const SIX_HOURS_MS = 6 * 60 * 60 * 1000
checkExpiredSubscriptions(db).catch(e => console.error('[SubscriptionExpiry] Startup check failed:', e))
setInterval(
  () => {
    checkExpiredSubscriptions(db).catch(e => console.error('[SubscriptionExpiry] Scheduled check failed:', e))
  },
  SIX_HOURS_MS,
)

app.listen(config.PORT, config.HOST, () => {
  console.log(`STNK Jasa API listening on http://${config.HOST}:${config.PORT}`)
})
