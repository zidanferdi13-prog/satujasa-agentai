import 'dotenv/config'

import { loadConfig } from './config.js'
import { getDb } from './db/index.js'
import { seed } from './db/seed.js'

async function main() {
  try {
    const config = loadConfig()
    const db = getDb(config.DATABASE_URL)
    await seed(db, config.BCRYPT_ROUNDS)
    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

main()
