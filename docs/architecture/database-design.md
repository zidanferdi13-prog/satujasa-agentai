# Database Design

## Overview

PostgreSQL 15+ dengan Drizzle ORM. Semua tabel menggunakan UUID v7 sebagai primary key dan soft delete (`deleted_at`).

## Entity Relationship

```
users ─┬─< tenants (owner_id)
       ├─< subscriptions (owner_id)
       └─< transactions (created_by)

tenants ─┬─< tenant_services (tenant_id)
         ├─< customers (tenant_id)
         └─< transactions (tenant_id)

services ─< tenant_services (service_id)

customers ─< transactions (customer_id)

transactions ─< transaction_status_log (transaction_id)
```

## Tables

### users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID v7 | PK |
| email | varchar | unique, not null |
| phone | varchar | |
| name | varchar | not null |
| password_hash | varchar | not null |
| role | enum | `super-admin`, `owner`, `admin-user` |
| owner_id | UUID FK → users | nullable, for admin-user → their owner |
| tenant_id | UUID FK → tenants | nullable, for admin-user → assigned tenant |
| status | enum | `active`, `inactive` |
| created_at | timestamp | default now() |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

### tenants
| Column | Type | Notes |
|--------|------|-------|
| id | UUID v7 | PK |
| name | varchar | not null |
| code | varchar | unique slug (auto-generated) |
| address | text | |
| phone | varchar | |
| owner_id | UUID FK → users | not null |
| status | enum | `active`, `inactive` |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | |

### subscriptions
| Column | Type | Notes |
|--------|------|-------|
| id | UUID v7 | PK |
| owner_id | UUID FK → users | not null |
| tier | enum | `free`, `pro`, `plus`, `expert` |
| max_tenants | int | 0 for free, 1 for pro, 3 for plus, custom for expert |
| max_admin_users | int | 0 for free, 1 for pro, 3 for plus, custom for expert |
| activated_by | UUID FK → users | super admin who activated (null for free auto-created) |
| activated_at | timestamp | null for free tier (auto-created on register) |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | |

**Notes:**
- Saat owner register, otomatis create subscription record: `tier=free, max_tenants=0, max_admin_users=0, activated_by=null`
- Saat Super Admin upgrade, `activated_by` dan `activated_at` diisi
- Expert tier: `max_tenants` dan `max_admin_users` di-set custom oleh Super Admin

### services
| Column | Type | Notes |
|--------|------|-------|
| id | UUID v7 | PK |
| code | varchar | unique slug |
| name | varchar | not null |
| description | text | |
| is_default | boolean | auto-enabled for new tenants |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | |

### tenant_services
| Column | Type | Notes |
|--------|------|-------|
| id | UUID v7 | PK |
| tenant_id | UUID FK → tenants | not null |
| service_id | UUID FK → services | not null |
| price | numeric | not null |
| price_source | enum | `owner`, `admin-user` — siapa yang terakhir set harga |
| is_active | boolean | default true |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | |

**Unique constraint:** (tenant_id, service_id)

**Notes:**
- `price_source` di-set otomatis saat harga diubah:
  - Owner update (per-tenant atau bulk) → `price_source = 'owner'`
  - Admin User update → `price_source = 'admin-user'`
- Owner bulk pricing (`POST /owner/services/bulk-pricing`) akan update semua tenant_services yang match dan set `price_source = 'owner'`

### customers
| Column | Type | Notes |
|--------|------|-------|
| id | UUID v7 | PK |
| tenant_id | UUID FK → tenants | not null |
| name | varchar | not null |
| phone | varchar | |
| plate_number | varchar | |
| vehicle_type | varchar | |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | |

### transactions
| Column | Type | Notes |
|--------|------|-------|
| id | UUID v7 | PK |
| tenant_id | UUID FK → tenants | not null |
| customer_id | UUID FK → customers | not null |
| service_id | UUID FK → services | not null |
| created_by | UUID FK → users | not null |
| status | enum | see state machine |
| total_cost | numeric | not null |
| additional_cost | numeric | default 0 |
| notes | text | |
| monitoring_token | UUID | unique, auto-generated |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | |

**Status enum values:** `received`, `document_check`, `payment_pending`, `processing`, `at_samsat`, `needs_revision`, `done`, `cancelled`

### transaction_status_log
| Column | Type | Notes |
|--------|------|-------|
| id | UUID v7 | PK |
| transaction_id | UUID FK → transactions | not null |
| from_status | enum | nullable (null for initial) |
| to_status | enum | not null |
| changed_by | UUID FK → users | not null |
| notes | text | |
| created_at | timestamp | not null |

**No soft delete** — logs are immutable.

## Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| users | email (unique) | Login lookup |
| users | owner_id | Find admin users by owner |
| tenants | owner_id | Find tenants by owner |
| customers | tenant_id | Tenant-scoped queries |
| transactions | tenant_id | Tenant-scoped queries |
| transactions | monitoring_token (unique) | Public monitoring lookup |
| transactions | status | Filter by status |
| transaction_status_log | transaction_id | Audit trail lookup |

## Seed Data

1. Super Admin user (seeded on first deploy)
2. 11 service catalog entries (from SPEC.md)
