import { eq, and, isNull } from 'drizzle-orm'
import bcrypt from 'bcrypt'

import { DEFAULT_SERVICES } from '@stnk/contracts'
import type { Database } from './index.js'
import { schema } from './index.js'

const vehicleTypes = [
  { code: 'MOTOR', name: 'Motor', price_group: 'R2_R3', sort_order: 10 },
  { code: 'MOBIL', name: 'Mobil', price_group: 'R4_PLUS', sort_order: 20 },
  { code: 'PICKUP', name: 'Pickup', price_group: 'R4_PLUS', sort_order: 30 },
  { code: 'TRUK', name: 'Truk', price_group: 'R4_PLUS', sort_order: 40 },
  { code: 'BUS', name: 'Bus', price_group: 'R4_PLUS', sort_order: 50 },
  { code: 'LAINNYA', name: 'Lainnya', price_group: 'KHUSUS', sort_order: 60 },
]

const feeComponents = [
  ['PKB_POKOK', 'PKB Pokok', true, 10],
  ['PKB_DENDA', 'PKB Denda', true, 20],
  ['OPSEN_PKB_POKOK', 'Opsen PKB Pokok', true, 30],
  ['OPSEN_PKB_DENDA', 'Opsen PKB Denda', true, 40],
  ['SWDKLLJ_POKOK', 'SWDKLLJ Pokok', true, 50],
  ['SWDKLLJ_DENDA', 'SWDKLLJ Denda', true, 60],
  ['PNBP_STNK', 'PNBP STNK', true, 70],
  ['PNBP_TNKB', 'PNBP TNKB', true, 80],
  ['BBNKB', 'BBNKB', true, 90],
  ['BPKB', 'BPKB', true, 100],
  ['SURAT_MUTASI', 'Surat Mutasi', true, 110],
  ['SURAT_KEHILANGAN', 'Surat Kehilangan', true, 120],
  ['PENGUMUMAN_KEHILANGAN', 'Pengumuman Kehilangan', true, 130],
  ['CEK_FISIK', 'Cek Fisik', true, 140],
  ['BIAYA_TAMBAHAN', 'Biaya Tambahan', true, 800],
  ['JASA_BIRO', 'Jasa Biro', false, 900],
] as const

const defaultDocuments: Array<{ documentCode: string; documentName: string; sortOrder: number }> = [
  { documentCode: 'KTP_ASLI', documentName: 'KTP Asli Pemilik', sortOrder: 10 },
  { documentCode: 'STNK_ASLI', documentName: 'STNK Asli', sortOrder: 20 },
  { documentCode: 'BPKB_ASLI', documentName: 'BPKB Asli', sortOrder: 30 },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function upsertByCode<T extends { code: string }>(db: Database, table: any, value: T) {
  const existing = await db.select().from(table).where(eq(table.code, value.code)).limit(1)
  if (existing.length === 0) {
    await db.insert(table).values(value)
  }
}

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
        phone: '+628****0000',
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

  for (const vehicleType of vehicleTypes) {
    await upsertByCode(db, schema.vehicleTypes, vehicleType)
  }
  console.log('✓ MVP vehicle types seeded')

  for (const [code, name, isEditable, sortOrder] of feeComponents) {
    await upsertByCode(db, schema.feeComponents, {
      code,
      name,
      is_editable: isEditable,
      sort_order: sortOrder,
    })
  }
  console.log('✓ MVP fee components seeded')

  const services = await db.select().from(schema.services).where(isNull(schema.services.deleted_at))

  for (const service of services) {
    for (const document of defaultDocuments) {
      const existing = await db
        .select()
        .from(schema.serviceDocumentRequirements)
        .where(and(
          eq(schema.serviceDocumentRequirements.service_id, service.id),
          eq(schema.serviceDocumentRequirements.document_code, document.documentCode),
          isNull(schema.serviceDocumentRequirements.deleted_at)
        ))
        .limit(1)
      if (existing.length === 0) {
        await db.insert(schema.serviceDocumentRequirements).values({
          service_id: service.id,
          document_code: document.documentCode,
          document_name: document.documentName,
          is_required: true,
          sort_order: document.sortOrder,
        })
      }
    }
  }
  console.log('✓ MVP document requirements seeded')

  return { superAdminId }
}
