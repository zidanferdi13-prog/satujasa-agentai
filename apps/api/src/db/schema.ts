import { pgTable, varchar, text, boolean, numeric, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core'
import { integer } from 'drizzle-orm/pg-core'

// ─── Enums ───────────────────────────────────────────────────────────────────
export const roleEnum = pgEnum('user_role', ['super-admin', 'owner', 'admin-user'])
export const tierEnum = pgEnum('subscription_tier', ['free', 'pro', 'plus', 'expert'])
export const statusEnum = pgEnum('transaction_status', [
  'received',
  'document_check',
  'payment_pending',
  'processing',
  'at_samsat',
  'needs_revision',
  'done',
  'cancelled',
])

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }).notNull().default(''),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  role: roleEnum('role').notNull().default('owner'),
  owner_id: uuid('owner_id'),
  tenant_id: uuid('tenant_id'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

// ─── Tenants ─────────────────────────────────────────────────────────────────
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  owner_id: uuid('owner_id').notNull().references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

// ─── Subscriptions ───────────────────────────────────────────────────────────
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  owner_id: uuid('owner_id').notNull().references(() => users.id),
  tier: tierEnum('tier').notNull().default('free'),
  max_tenants: integer('max_tenants').notNull().default(0),
  max_admin_users: integer('max_admin_users').notNull().default(0),
  activated_by: uuid('activated_by').references(() => users.id),
  activated_at: timestamp('activated_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

// ─── Services ────────────────────────────────────────────────────────────────
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull().default(''),
  is_default: boolean('is_default').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

// ─── Tenant Services ─────────────────────────────────────────────────────────
export const tenantServices = pgTable('tenant_services', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id').notNull().references(() => tenants.id),
  service_id: uuid('service_id').notNull().references(() => services.id),
  price: numeric('price', { precision: 12, scale: 2 }).notNull().default('0'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

// ─── Customers ───────────────────────────────────────────────────────────────
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id').notNull().references(() => tenants.id),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  plate_number: varchar('plate_number', { length: 20 }).notNull(),
  vehicle_type: varchar('vehicle_type', { length: 100 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

// ─── Transactions ────────────────────────────────────────────────────────────
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenant_id: uuid('tenant_id').notNull().references(() => tenants.id),
  customer_id: uuid('customer_id').notNull().references(() => customers.id),
  service_id: uuid('service_id').notNull().references(() => services.id),
  created_by: uuid('created_by').notNull().references(() => users.id),
  status: statusEnum('status').notNull().default('received'),
  total_cost: numeric('total_cost', { precision: 12, scale: 2 }).notNull().default('0'),
  additional_cost: numeric('additional_cost', { precision: 12, scale: 2 }).notNull().default('0'),
  notes: text('notes'),
  monitoring_token: uuid('monitoring_token').notNull().defaultRandom().unique(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

// ─── Transaction Status Log ──────────────────────────────────────────────────
export const transactionStatusLog = pgTable('transaction_status_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  transaction_id: uuid('transaction_id').notNull().references(() => transactions.id),
  from_status: statusEnum('from_status'),
  to_status: statusEnum('to_status').notNull(),
  changed_by: uuid('changed_by').notNull().references(() => users.id),
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
