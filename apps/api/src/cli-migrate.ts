import 'dotenv/config'

import { loadConfig } from './config.js'
import { getDb } from './db/index.js'
import { migrate } from './db/migrate.js'

async function main() {
  try {
    const config = loadConfig()
    const db = getDb(config.DATABASE_URL)
    await migrate(db)
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

main()
