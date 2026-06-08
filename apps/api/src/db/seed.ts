import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'

import { DEFAULT_SERVICES } from '@stnk/contracts'
import type { Database } from './index.js'
import { schema } from './index.js'

export async function seed(db: Database, bcryptRounds = 10) {
  // 1. Create super-admin user
  const existingAdmin = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, 'admin@satujasa.id'))
    .limit(1)

  let superAdminId: string

  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash('SuperAdmin123!', bcryptRounds)
    const [admin] = await db
      .insert(schema.users)
      .values({
        email: 'admin@satujasa.id',
        phone: '+6281000000000',
        password_hash: passwordHash,
        role: 'super-admin',
      })
      .returning()
    superAdminId = admin!.id
    console.log('✓ Super-admin user created: admin@satujasa.id')
  } else {
    superAdminId = existingAdmin[0]!.id
    console.log('○ Super-admin user already exists')
  }

  // 2. Seed default services
  for (const svc of DEFAULT_SERVICES) {
    const existing = await db
      .select()
      .from(schema.services)
      .where(eq(schema.services.code, svc.code))
      .limit(1)

    if (existing.length === 0) {
      await db.insert(schema.services).values({
        code: svc.code,
        name: svc.name,
        description: svc.description,
        is_default: true,
      })
    }
  }
  console.log('✓ 11 default services seeded')

  return { superAdminId }
}
