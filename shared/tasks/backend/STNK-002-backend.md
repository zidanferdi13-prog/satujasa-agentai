# Task STNK-002 — Backend Foundation

## Assigned To: Backend Agent
## Branch: `agent/backend/stnk-002-foundation`
## Reference: `docs/SPEC.md`

---

## Objective

Set up the backend foundation for SatuJasa STNK: database schema, auth system, core CRUD endpoints, transaction state machine, and monitoring endpoint.

## Scope

### 1. Database Setup (Drizzle ORM + PostgreSQL)
- Configure Drizzle ORM in `apps/api/`
- Create migration files for all tables defined in SPEC.md:
  - users, tenants, subscriptions, services, tenant_services, customers, transactions, transaction_status_log
- All PKs: UUID v7
- All tables: `created_at`, `updated_at`, `deleted_at` (soft delete)
- Seed: one super-admin user, all 11 default services

### 2. Auth System
- `POST /api/v1/auth/register` — owner only, auto Free tier
- `POST /api/v1/auth/login` — email + password, returns session cookie + refresh token
- `POST /api/v1/auth/logout` — clear session
- `POST /api/v1/auth/refresh` — refresh JWT
- Password hashing: bcrypt or argon2
- Session: httpOnly cookie + JWT refresh token
- Rate limiting on auth endpoints

### 3. Role-Based Access Control Middleware
- Middleware that reads session, resolves user role
- Guards per route group: super-admin, owner, admin-user
- Tenant isolation: all data queries scoped to user's tenant(s)

### 4. Subscription Enforcement
- Middleware/helper that checks owner's active subscription before:
  - Creating tenant (check max_tenants)
  - Creating admin user (check max_admin_users)
  - Creating transaction (Free tier blocked)
- Super admin endpoints to manage subscriptions

### 5. Core Endpoints (as defined in SPEC.md)
- Super Admin: dashboard stats, CRUD owners, manage subscriptions, settings
- Owner: dashboard, CRUD tenants, CRUD admin users, tenant services, transactions
- Admin User: dashboard, transactions, tenant services
- Public: monitoring/:token, health, meta/roles

### 6. Transaction State Machine
- Valid transitions as defined in SPEC.md state diagram
- `PATCH .../transactions/:id/status` validates transition
- Auto-log to `transaction_status_log` on every transition

### 7. WhatsApp Template Generator
- Utility that generates WA link with encoded message template
- Returned as part of transaction detail response

### 8. Validation
- Zod schemas for all request bodies
- Consistent error response format: `{ error: string, details?: object }`

## Acceptance Criteria
- [ ] All migrations run clean on fresh PostgreSQL
- [ ] Seed creates super-admin + 11 services
- [ ] Auth flow works end-to-end (register → login → access → logout)
- [ ] Subscription limits enforced (test: Free can't create tenant)
- [ ] Transaction state transitions validated
- [ ] Monitoring endpoint returns correct data without auth
- [ ] All endpoints have zod validation
- [ ] `npm run verify` passes (lint + typecheck + test + build)

## Verification
- Unit tests for: auth, subscription enforcement, state machine transitions
- Integration test for: full transaction lifecycle
- Run `npm run verify` before marking done

## Deliverables
- Updated `apps/api/src/` with full implementation
- Drizzle migration files in `apps/api/drizzle/`
- Updated `packages/contracts/src/index.ts` with all shared types
- Test files in `apps/api/src/__tests__/`
- Summary report back to PM with: files changed, test results, any blockers

## Rollback
- Branch-based: if issues found, branch can be abandoned
- Migrations: Drizzle supports rollback via `drizzle-kit drop`
