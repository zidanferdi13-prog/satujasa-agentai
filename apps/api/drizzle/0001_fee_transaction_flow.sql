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

CREATE INDEX IF NOT EXISTS idx_m_fee_rules_service_vehicle ON m_fee_rules(service_id, vehicle_type_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_item_fee_details_item ON transaction_item_fee_details(transaction_item_id);
CREATE INDEX IF NOT EXISTS idx_transaction_item_checklists_item ON transaction_item_document_checklists(transaction_item_id);
