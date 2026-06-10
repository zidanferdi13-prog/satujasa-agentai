# Backend Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express |
| Language | TypeScript |
| ORM | Drizzle ORM |
| Database | PostgreSQL 15+ |
| Validation | Zod (shared via @stnk/contracts) |
| Auth | Session (httpOnly cookie) + JWT refresh token |
| Testing | Vitest + Supertest |

## Project Structure

```
apps/api/
├── src/
│   ├── app.ts                # Express app setup, mounts all routes
│   ├── server.ts             # Entry point, listen
│   ├── config.ts             # Env config (zod-validated)
│   ├── db/
│   │   ├── schema.ts         # Drizzle table definitions (all 8 tables)
│   │   ├── migrate.ts        # Raw SQL migration runner
│   │   ├── seed.ts           # Seed: super admin + 11 services
│   │   └── index.ts          # DB connection (postgres-js + drizzle)
│   ├── routes/
│   │   ├── auth.ts           # POST /auth/register|login|logout|refresh
│   │   ├── super-admin.ts    # GET|POST|PATCH /admin/dashboard|owners|subscriptions|settings
│   │   ├── owner.ts          # GET|POST|PATCH|DELETE /owner/dashboard|tenants|admin-users|services|transactions
│   │   ├── admin-user.ts     # GET|POST|PATCH /admin-user/dashboard|transactions|tenant/services
│   │   └── public.ts         # GET /monitoring/:token, /health, /meta/roles
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification, attaches req.user
│   │   ├── rbac.ts           # requireRole(...roles) guard
│   │   ├── validate.ts       # Zod schema validation + all request schemas
│   │   ├── rate-limit.ts     # In-memory rate limiter
│   │   ├── subscription.ts   # Subscription limit enforcement helpers
│   │   └── tenant-isolation.ts # Tenant scope helpers
│   └── utils/
│       ├── transaction-state-machine.ts  # Valid transitions, status labels
│       └── wa-template.ts               # WA link generator
├── drizzle.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## Layered Architecture

```
Request → Router → Middleware Chain → Controller → Service → Repository → DB
                                                                      ↓
Response ← Controller ← Service ← Repository ← Drizzle Query Result
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| Router | HTTP method + path mapping |
| Middleware | Auth, RBAC, tenant isolation, validation, rate limit |
| Controller | Parse request, call service, format response |
| Service | Business logic, orchestration |
| Repository | Database queries (Drizzle), tenant-scoped |

## Middleware Chain (per request)

```
1. Rate Limiter (auth endpoints only)
2. Session/JWT Auth → attaches user to req
3. RBAC Check → verifies role has permission for route
4. Tenant Isolation → injects tenant filter into req context
5. Zod Validation → validates body/params/query
6. Controller execution
```

## Error Handling

Consistent JSON error format:
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have access to this tenant",
    "details": {}
  }
}
```

## Database Conventions

- All PKs: UUID v7 (time-sortable)
- All tables: `created_at`, `updated_at`, `deleted_at` (soft delete)
- Tenant-scoped queries MUST use `.where(eq(table.tenantId, ctx.tenantId))`
- Migrations via Drizzle Kit (`drizzle-kit generate`, `drizzle-kit migrate`)
