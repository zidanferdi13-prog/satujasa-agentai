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
  'DRAFT',
  'DOKUMEN_DITERIMA',
  'PROSES_SAMSAT',
  'MENUNGGU_PEMBAYARAN',
  'SELESAI',
  'DIBATALKAN',
])
export const subscriptionNotificationTypeEnum = pgEnum('subscription_notification_type', [
  'expiry_7_day',
  'expiry_3_day',
  'expired',
])

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  company_name: varchar('company_name', { length: 255 }),
  phone: varchar('phone', { length: 50 }).notNull().default(''),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  role: roleEnum('role').notNull().default('owner'),
  is_active: boolean('is_active').notNull().default(true),
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
  is_active: boolean('is_active').notNull().default(true),
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
  expires_at: timestamp('expires_at', { withTimezone: true }),
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
  custom_name: varchar('custom_name', { length: 255 }),
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
  status: statusEnum('status').notNull().default('DRAFT'),
  status_updated_at: timestamp('status_updated_at', { withTimezone: true }),
  total_cost: numeric('total_cost', { precision: 12, scale: 2 }).notNull().default('0'),
  additional_cost: numeric('additional_cost', { precision: 12, scale: 2 }).notNull().default('0'),
  notes: text('notes'),
  monitoring_token: uuid('monitoring_token').notNull().defaultRandom().unique(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

// ─── Fee Master Data ─────────────────────────────────────────────────────────
export const vehicleTypes = pgTable('vehicle_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  price_group: varchar('price_group', { length: 50 }).notNull(),
  sort_order: integer('sort_order').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

export const feeComponents = pgTable('fee_components', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  is_editable: boolean('is_editable').notNull().default(true),
  sort_order: integer('sort_order').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

export const feeRules = pgTable('m_fee_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  service_id: uuid('service_id').notNull().references(() => services.id),
  vehicle_type_id: uuid('vehicle_type_id').notNull().references(() => vehicleTypes.id),
  fee_component_id: uuid('fee_component_id').notNull().references(() => feeComponents.id),
  province_code: varchar('province_code', { length: 50 }).notNull().default('JABAR'),
  city_code: varchar('city_code', { length: 50 }),
  default_amount: numeric('default_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  source: varchar('source', { length: 50 }).notNull().default('master'),
  sort_order: integer('sort_order').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

export const serviceDocumentRequirements = pgTable('m_service_document_requirements', {
  id: uuid('id').primaryKey().defaultRandom(),
  service_id: uuid('service_id').notNull().references(() => services.id),
  document_code: varchar('document_code', { length: 100 }).notNull(),
  document_name: varchar('document_name', { length: 255 }).notNull(),
  is_required: boolean('is_required').notNull().default(true),
  sort_order: integer('sort_order').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

// ─── Transaction Item Snapshots ───────────────────────────────────────────────
export const transactionItems = pgTable('transaction_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  transaction_id: uuid('transaction_id').notNull().references(() => transactions.id),
  service_id: uuid('service_id').notNull().references(() => services.id),
  vehicle_type_code: varchar('vehicle_type_code', { length: 50 }),
  province_code: varchar('province_code', { length: 50 }).notNull().default('JABAR'),
  city_code: varchar('city_code', { length: 50 }),
  city_name: varchar('city_name', { length: 255 }),
  tax_due_date: timestamp('tax_due_date', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

export const transactionItemFeeDetails = pgTable('transaction_item_fee_details', {
  id: uuid('id').primaryKey().defaultRandom(),
  transaction_item_id: uuid('transaction_item_id').notNull().references(() => transactionItems.id),
  fee_component_id: uuid('fee_component_id').references(() => feeComponents.id),
  component_code: varchar('component_code', { length: 100 }).notNull(),
  component_name: varchar('component_name', { length: 255 }).notNull(),
  default_amount: numeric('default_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull().default('0'),
  is_editable: boolean('is_editable').notNull().default(true),
  source: varchar('source', { length: 50 }).notNull().default('master'),
  sort_order: integer('sort_order').notNull().default(0),
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const transactionItemDocumentChecklists = pgTable('transaction_item_document_checklists', {
  id: uuid('id').primaryKey().defaultRandom(),
  transaction_item_id: uuid('transaction_item_id').notNull().references(() => transactionItems.id),
  document_code: varchar('document_code', { length: 100 }).notNull(),
  document_name: varchar('document_name', { length: 255 }).notNull(),
  is_required: boolean('is_required').notNull().default(true),
  is_checked: boolean('is_checked').notNull().default(false),
  sort_order: integer('sort_order').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
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

// ─── Subscription Notifications ──────────────────────────────────────────────
export const subscriptionNotifications = pgTable('subscription_notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  subscription_id: uuid('subscription_id').notNull().references(() => subscriptions.id),
  owner_id: uuid('owner_id').notNull().references(() => users.id),
  notification_type: subscriptionNotificationTypeEnum('notification_type').notNull(),
  sent_at: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
})
