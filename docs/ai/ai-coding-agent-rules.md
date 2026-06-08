# AI Coding Agent Rules

## General Rules

1. **Read before write** — selalu baca file yang akan diubah sebelum editing
2. **Branch convention** — semua work di `agent/<role>/<task-name>`, TIDAK PERNAH commit ke main/master
3. **Plan before code** — tulis plan dulu, dapat approval, baru implement
4. **Type safety** — gunakan TypeScript strict mode, no `any`
5. **Shared contracts** — semua types, enums, schemas yang dipakai frontend+backend WAJIB di `@stnk/contracts`

## Code Style

- File naming: kebab-case (`auth.controller.ts`, `create-tenant.tsx`)
- Component naming: PascalCase (`TenantList`, `TransactionForm`)
- Variable/function: camelCase
- Enum values: SCREAMING_SNAKE_CASE
- Database columns: snake_case

## Architecture Rules

### Backend
- Setiap module: controller → service → (repository optional, bisa langsung Drizzle di service)
- Controller HANYA parse request + format response
- Business logic HANYA di service layer
- Database query WAJIB respect tenant isolation
- Semua input validated dengan Zod sebelum masuk service

### Frontend
- Feature-based structure (bukan type-based)
- Server state: React Query (TIDAK boleh simpan API data di Zustand)
- Client state: Zustand (UI state, form state)
- Reusable component → `components/shared/`
- Feature-specific component → `features/<name>/components/`

### Mobile
- Expo managed workflow (TIDAK bare)
- File-based routing (Expo Router)
- Share hooks dan API client logic dengan web jika possible

## Testing Rules

- Backend: unit test services, integration test critical flows (auth, transaction)
- Frontend: component tests untuk form flows, e2e untuk critical paths
- Minimum coverage target: 70% untuk services, 50% overall

## Security Rules

1. NEVER hardcode secrets
2. ALWAYS use parameterized queries (Drizzle handles this)
3. ALWAYS validate input dengan Zod
4. NEVER trust client-side role/tenant claims — verify dari session
5. ALWAYS check subscription limits before create operations
6. NEVER expose internal error details to client

## Git Rules

1. Commit message format: `type(scope): description`
   - Types: feat, fix, refactor, test, docs, chore
   - Example: `feat(transactions): add status update endpoint`
2. One logical change per commit
3. PR must include: description, affected files, test results
4. No force push on shared branches

## Documentation

- New endpoint → update `docs/technical/api-contract.md`
- Schema change → update `docs/architecture/database-design.md`
- New feature → update `docs/product/feature-modules.md`
- Always keep SPEC.md as source of truth for business decisions

## Error Handling

```typescript
// Consistent error format
throw new AppError('TENANT_LIMIT_REACHED', 'Subscription limit reached', 403);

// Controller catches and formats
res.status(err.statusCode).json({
  error: { code: err.code, message: err.message }
});
```

## Performance Guidelines

- Pagination on ALL list endpoints (default 20, max 100)
- Index foreign keys and frequently filtered columns
- Use `select()` in Drizzle to fetch only needed columns
- Avoid N+1 queries — use joins or batch queries
