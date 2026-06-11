import { sql } from 'drizzle-orm'
import type { Database } from './index.js'

export async function migrate(db: Database) {
  // Create enums
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('super-admin', 'owner', 'admin-user');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'plus', 'expert');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE transaction_status AS ENUM ('received', 'document_check', 'payment_pending', 'processing', 'at_samsat', 'needs_revision', 'done', 'cancelled');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  // Create tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50) NOT NULL DEFAULT '',
      password_hash VARCHAR(255) NOT NULL,
      role user_role NOT NULL DEFAULT 'owner',
      owner_id UUID,
      tenant_id UUID,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS tenants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      owner_id UUID NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_id UUID NOT NULL REFERENCES users(id),
      tier subscription_tier NOT NULL DEFAULT 'free',
      max_tenants INTEGER NOT NULL DEFAULT 0,
      max_admin_users INTEGER NOT NULL DEFAULT 0,
      activated_by UUID REFERENCES users(id),
      activated_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS services (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      is_default BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS tenant_services (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      service_id UUID NOT NULL REFERENCES services(id),
      price NUMERIC(12, 2) NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      plate_number VARCHAR(20) NOT NULL,
      vehicle_type VARCHAR(100) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      customer_id UUID NOT NULL REFERENCES customers(id),
      service_id UUID NOT NULL REFERENCES services(id),
      created_by UUID NOT NULL REFERENCES users(id),
      status transaction_status NOT NULL DEFAULT 'received',
      total_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
      additional_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
      notes TEXT,
      monitoring_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS vehicle_types (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      price_group VARCHAR(50) NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS fee_components (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      is_editable BOOLEAN NOT NULL DEFAULT true,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS m_fee_rules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      service_id UUID NOT NULL REFERENCES services(id),
      vehicle_type_id UUID NOT NULL REFERENCES vehicle_types(id),
      fee_component_id UUID NOT NULL REFERENCES fee_components(id),
      province_code VARCHAR(50) NOT NULL DEFAULT 'JABAR',
      city_code VARCHAR(50),
      default_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
      source VARCHAR(50) NOT NULL DEFAULT 'master',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS m_service_document_requirements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      service_id UUID NOT NULL REFERENCES services(id),
      document_code VARCHAR(100) NOT NULL,
      document_name VARCHAR(255) NOT NULL,
      is_required BOOLEAN NOT NULL DEFAULT true,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS transaction_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      transaction_id UUID NOT NULL REFERENCES transactions(id),
      service_id UUID NOT NULL REFERENCES services(id),
      vehicle_type_code VARCHAR(50),
      province_code VARCHAR(50) NOT NULL DEFAULT 'JABAR',
      city_code VARCHAR(50),
      city_name VARCHAR(255),
      tax_due_date TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS transaction_item_fee_details (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      transaction_item_id UUID NOT NULL REFERENCES transaction_items(id),
      fee_component_id UUID REFERENCES fee_components(id),
      component_code VARCHAR(100) NOT NULL,
      component_name VARCHAR(255) NOT NULL,
      default_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
      amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
      is_editable BOOLEAN NOT NULL DEFAULT true,
      source VARCHAR(50) NOT NULL DEFAULT 'master',
      sort_order INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS transaction_item_document_checklists (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      transaction_item_id UUID NOT NULL REFERENCES transaction_items(id),
      document_code VARCHAR(100) NOT NULL,
      document_name VARCHAR(255) NOT NULL,
      is_required BOOLEAN NOT NULL DEFAULT true,
      is_checked BOOLEAN NOT NULL DEFAULT false,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS transaction_status_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      transaction_id UUID NOT NULL REFERENCES transactions(id),
      from_status transaction_status,
      to_status transaction_status NOT NULL,
      changed_by UUID NOT NULL REFERENCES users(id),
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  // Add FK for users.tenant_id after tenants table exists
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE users ADD CONSTRAINT users_tenant_id_fk FOREIGN KEY (tenant_id) REFERENCES tenants(id);
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  console.log('✓ All tables migrated')
}
