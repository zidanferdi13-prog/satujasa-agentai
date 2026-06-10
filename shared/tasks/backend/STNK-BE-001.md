# Task STNK-BE-001 — Backend: Setup DB, Migrate, Verify API

## Metadata
- **Role:** backend
- **Branch:** `agent/backend/be-foundation-001` (sudah ada, lanjutkan di sini)
- **Status:** dispatch-ready
- **Priority:** high
- **Created:** 2026-06-08

---

## Wajib Dibaca Sebelum Mulai

1. `AGENTS.md` — entry point, rules
2. `docs/SPEC.md` — master spec
3. `docs/ai/ai-coding-agent-rules.md` — coding rules
4. `docs/ai/prompt-backend.md` — backend-specific instructions
5. `docs/architecture/backend-architecture.md` — struktur folder
6. `docs/architecture/database-design.md` — ERD dan relasi tabel
7. `docs/technical/api-contract.md` — semua endpoint specs
8. `docs/technical/authentication-flow.md` — JWT flow

---

## Context — Kondisi Saat Ini

Code backend sudah ditulis lengkap di branch `agent/backend/be-foundation-001`:

```
apps/api/src/
├── app.ts                  # Express app, semua routes mounted
├── config.ts               # Env config via zod
├── server.ts               # Entry point
├── db/
│   ├── schema.ts           # 8 tabel Drizzle
│   ├── index.ts            # DB connection
│   ├── migrate.ts          # Migration runner
│   └── seed.ts             # Super-admin + 11 services
├── middleware/             # auth, rbac, validate, rate-limit, subscription, tenant-isolation
├── routes/
│   ├── auth.ts             # register, login, logout, refresh
│   ├── super-admin.ts      # dashboard, owners, subscriptions
│   ├── owner.ts            # tenants, admin-users, services, transactions
│   ├── admin-user.ts       # dashboard, transactions, tenant services
│   └── public.ts           # health, roles, monitoring
└── utils/
    ├── transaction-state-machine.ts
    └── wa-template.ts
```

`packages/contracts/src/index.ts` — semua shared types, enums, DTOs sudah lengkap.

---

## Scope

### 1. Review Code
- Baca semua file di `apps/api/src/`
- Verifikasi skema DB match dengan `docs/architecture/database-design.md`
- Verifikasi routes match dengan `docs/technical/api-contract.md`
- Catat jika ada gap atau inkonsistensi

### 2. Setup PostgreSQL & .env
- Cek apakah PostgreSQL sudah running di server
- Buat database `stnk_jasa` jika belum ada
- Buat user dengan password yang sesuai
- Buat `.env` di `apps/api/` dari `.env.example`:
  ```
  DATABASE_URL=postgres://<user>:<pass>@127.0.0.1:5432/stnk_jasa
  JWT_SECRET=<random-256-bit>
  JWT_REFRESH_SECRET=<random-256-bit>
  JWT_EXPIRES_IN=15m
  JWT_REFRESH_EXPIRES_IN=7d
  BCRYPT_ROUNDS=12
  BASE_URL=http://127.0.0.1:4000
  WEB_ORIGIN=http://127.0.0.1:5173
  PORT=4000
  HOST=127.0.0.1
  NODE_ENV=development
  ```

### 3. Run Migration & Seed
- `cd apps/api && npm run migrate`
- `cd apps/api && npm run seed`
- Verifikasi semua tabel terbuat dan super-admin + 11 services terseed

### 4. Smoke Test API
- Start server: `cd apps/api && npm run dev`
- Test endpoints manual via curl:
  ```bash
  # Health check
  curl http://127.0.0.1:4000/api/v1/health

  # Register owner
  curl -X POST http://127.0.0.1:4000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"owner@test.com","password":"Test1234!","phone":"081234567890","role":"owner"}'

  # Login super-admin (seeded)
  curl -X POST http://127.0.0.1:4000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"superadmin@stnkjasa.com","password":"SuperAdmin123!"}'
  ```
- Catat response dan verifikasi shape sesuai contract

### 5. Fix Any Issues Found
- Jika ada error DB (kolom missing, FK constraint, type mismatch) — fix di `schema.ts` + `migrate.ts`
- Jika ada error runtime — fix dan re-run typecheck + lint

### 6. Run Full Verify
```bash
cd /opt/stnk-ai-team/projects/stnk-jasa
npm run typecheck
npm run lint
```

---

## Constraints

- ❌ Jangan commit ke `main` atau `master`
- ❌ Jangan expose port ke public
- ❌ Jangan ubah `.env` production
- ❌ Jangan merge tanpa owner approval
- ✅ Semua kerja di branch `agent/backend/be-foundation-001`
- ✅ Jalankan typecheck + lint sebelum report

---

## Acceptance Criteria

- [ ] `GET /api/v1/health` returns `{ status: "ok" }`
- [ ] `POST /api/v1/auth/register` berhasil daftar owner baru
- [ ] `POST /api/v1/auth/login` berhasil login dan return JWT
- [ ] DB migration berjalan tanpa error
- [ ] Seed menghasilkan 1 super-admin + 11 services
- [ ] `npm run typecheck` PASS
- [ ] `npm run lint` PASS

---

## Reporting Format

Report ke PM dengan format:
1. **Branch:** nama branch
2. **Files Changed:** list file yang diubah (jika ada)
3. **DB Status:** migration OK / error apa
4. **Smoke Test Results:** hasil curl tiap endpoint
5. **Verification:** typecheck PASS/FAIL, lint PASS/FAIL
6. **Risks:** apa yang mungkin jadi masalah
7. **Rollback Notes:** cara undo jika ada yang salah

---

## Rollback

- DB: `DROP DATABASE stnk_jasa` dan buat ulang
- Code: sudah di branch, tidak menyentuh `main`
