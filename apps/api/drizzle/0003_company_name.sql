ALTER TABLE users
  ADD COLUMN IF NOT EXISTS company_name varchar(255);
