ALTER TABLE tenant_services
  ADD COLUMN IF NOT EXISTS custom_name varchar(255);
