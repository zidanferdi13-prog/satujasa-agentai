import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema.js'

let db: ReturnType<typeof createDb> | null = null

function createDb(databaseUrl: string) {
  const client = postgres(databaseUrl, { max: 10 })
  return drizzle(client, { schema })
}

export function getDb(databaseUrl: string) {
  if (!db) {
    db = createDb(databaseUrl)
  }
  return db
}

export function createTestDb(databaseUrl: string) {
  const client = postgres(databaseUrl, { max: 3 })
  return drizzle(client, { schema })
}

export type Database = ReturnType<typeof createDb>

export { schema }
