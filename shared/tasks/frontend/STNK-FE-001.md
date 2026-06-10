# Task STNK-FE-001 — Frontend Foundation

## Metadata
- **Role:** frontend
- **Branch:** `agent/frontend/fe-foundation-001`
- **Status:** dispatch-ready
- **Priority:** high
- **Created:** 2026-06-08
- **Depends On:** Backend `agent/backend/be-foundation-001` (API contract sudah final di `packages/contracts`)

---

## Wajib Dibaca Sebelum Mulai

1. `AGENTS.md` — entry point, rules
2. `docs/SPEC.md` — master spec
3. `docs/ai/ai-coding-agent-rules.md` — coding rules
4. `docs/ai/prompt-frontend.md` — frontend-specific instructions
5. `docs/architecture/frontend-architecture.md` — struktur folder
6. `docs/technical/api-contract.md` — semua endpoint specs
7. `docs/technical/authentication-flow.md` — JWT flow
8. `docs/design/ui-ux-guidelines.md` — Tailwind + shadcn/ui guidelines
9. `packages/contracts/src/index.ts` — shared types

---

## Context — Kondisi Saat Ini

`apps/web/` sudah ada bootstrap React + Vite:
- `src/App.tsx` — shell landing + login preview per role (belum ada routing)
- `src/main.tsx` — React entry point
- Tailwind sudah terkonfigurasi
- shadcn/ui belum diinstall
- Belum ada routing (React Router / TanStack Router)
- Belum ada API integration
- Logo: placeholder di `src/assets/`

---

## Scope

### 1. Setup & Konfigurasi
- Install shadcn/ui dan init komponen dasar (Button, Input, Card, Badge, Dialog, Toast)
- Install React Router v6 untuk routing
- Install axios untuk HTTP client
- Setup `src/lib/api.ts` — axios instance + auth interceptor (auto-attach JWT, handle 401 refresh)
- Setup `src/lib/auth.ts` — token storage (localStorage), helper isAuthenticated, getRole
- Buat `src/env.ts` — env config dari `VITE_API_URL`

### 2. Routing Structure
```
/                    → Landing page (public)
/login               → Login page (public)
/register            → Register Owner page (public)
/monitoring/:token   → Monitoring page (public, no auth)
/dashboard           → Redirect ke role-specific dashboard
/super-admin/*       → Super admin pages
/owner/*             → Owner pages
/admin-user/*        → Admin user pages (redirect ke /login jika mobile)
```

### 3. Landing Page (`/`)
- Hero section: nama app, tagline, CTA "Daftar Sekarang" + "Login"
- Fitur highlights: 3 kartu fitur utama
- Logo placeholder di header
- Footer minimal

### 4. Auth Pages
- `/login` — form email + password, validasi, error state, link ke register
- `/register` — form register Owner (email, password, phone), validasi, auto-redirect ke dashboard setelah berhasil

### 5. Super Admin Pages (`/super-admin/`)
- `dashboard` — stats: total owners, active subs per tier
- `owners` — tabel list owners, search, filter by subs tier
- `owners/:id` — detail owner + subscription info + tombol ubah subs tier (Free/Pro/Plus/Expert)
- `subscriptions` — list semua subs aktif

### 6. Owner Pages (`/owner/`)
- `dashboard` — revenue cards, stats per tenant, list tenant
- `tenants` — list tenant, tombol buat tenant baru (gated by subs)
- `tenants/:id` — detail tenant: admin user, daftar layanan + harga
- `tenants/:id/services` — set harga per layanan, toggle aktif/nonaktif
- `transactions` — list semua transaksi semua tenant, filter status
- `transactions/:id` — detail transaksi + status history + tombol update status + WA link

### 7. Monitoring Page (`/monitoring/:token`)
- Public, no auth
- Tampilkan: nama customer, plat, layanan, status badge, timeline history
- WA link tombol "Hubungi Kami"
- Responsive, mobile-friendly

### 8. Subscription Gate Component
- Komponen `<SubscriptionGate tier="pro">` — wrap konten yang butuh subs tertentu
- Tampilkan overlay "Upgrade ke Pro" jika tier tidak cukup
- Gunakan di semua fitur yang gated

### 9. Common Components
- `<LoadingSpinner />`, `<Skeleton />`, `<ErrorState />`, `<EmptyState />`
- `<StatusBadge status="..." />` — warna per status transaksi
- `<PageHeader title="..." />`, `<DataTable />` (reusable)

---

## Constraints

- ❌ Jangan commit ke `main` atau `master`
- ❌ Jangan start dev server di background proses tanpa izin
- ❌ Jangan ubah `.env` production
- ✅ Semua kerja di branch `agent/frontend/fe-foundation-001`
- ✅ Gunakan types dari `@stnk/contracts`
- ✅ API base URL dari `.env` (`VITE_API_URL=http://127.0.0.1:4000`)
- ✅ Jalankan `npm run typecheck` sebelum report

---

## Acceptance Criteria

- [ ] Landing page render tanpa error
- [ ] Login berhasil, redirect ke dashboard sesuai role
- [ ] Register Owner berhasil, redirect ke dashboard
- [ ] Super admin bisa lihat + ubah subscription owner
- [ ] Owner bisa buat tenant (gated by subs tier)
- [ ] Monitoring page tampilkan data transaksi by token
- [ ] Subscription gate menampilkan upgrade prompt jika tier kurang
- [ ] `npm run typecheck` PASS
- [ ] Tidak ada console error di halaman utama

---

## Reporting Format

Report ke PM:
1. **Branch:** nama branch
2. **Files Created/Changed:** list lengkap
3. **Pages Done:** checklist halaman yang selesai
4. **Verification:** typecheck PASS/FAIL
5. **Known Issues:** apa yang belum selesai atau bermasalah
6. **Risks:** dependency ke backend yang belum live
7. **Rollback Notes:** branch-based, safe

---

## Rollback

Branch-based — tidak ada DB impact. Safe untuk di-revert kapanpun.
