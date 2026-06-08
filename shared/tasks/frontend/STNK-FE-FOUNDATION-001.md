# Task STNK-FE-FOUNDATION-001 — Frontend Foundation

## Metadata
- **Role:** frontend
- **Branch:** `agent/frontend/fe-foundation-001`
- **Status:** dispatch-ready
- **Priority:** high
- **Created:** 2026-06-08
- **Depends On:** Backend `agent/backend/be-foundation-001` (contracts package updated)

---

## Wajib Dibaca Sebelum Mulai

1. `AGENTS.md` — rules dan struktur repo
2. `docs/SPEC.md` — master spec
3. `docs/ai/ai-coding-agent-rules.md` — coding rules
4. `docs/ai/prompt-frontend.md` — frontend-specific instructions
5. `docs/architecture/frontend-architecture.md` — arsitektur frontend
6. `docs/design/ui-ux-guidelines.md` — design guidelines
7. `docs/technical/api-contract.md` — endpoint specs
8. `packages/contracts/src/index.ts` — shared types

---

## Objective

Rebuild frontend web app SatuJasa STNK dengan Tailwind CSS + shadcn/ui.
Implementasi semua halaman dan role-based dashboard sesuai SPEC.md.

## Context — Kondisi Saat Ini

`apps/web/` sudah ada bootstrap awal:
- React + Vite + React Router sudah terpasang
- `src/App.tsx` punya LandingPage, LoginPage, DashboardPage (preview, belum real)
- Custom CSS masih pakai `App.css` dan `index.css`
- Belum ada Tailwind, belum ada shadcn/ui
- Belum ada API integration
- Logo: placeholder dulu di `src/assets/logo.png`

## Scope

### 1. Setup Tailwind + shadcn/ui
- Install dan konfigurasi Tailwind CSS v3
- Install dan konfigurasi shadcn/ui
- Hapus `App.css`, ganti dengan Tailwind utilities
- Setup `src/components/ui/` untuk shadcn components
- Setup API client (`src/lib/api.ts`) dengan axios + auth interceptor

### 2. Landing Page (`/`)
- Hero: headline, subtext, 2 CTA (Login / Daftar)
- Features grid: 3 card benefit
- Process section: alur layanan singkat
- Footer dengan brand SatuJasa STNK
- Responsive mobile-first (≥375px)

### 3. Auth Pages
- **Login** (`/login`): email + password, link ke register
- **Register** (`/register`): owner only (name, email, phone, password)
- Validasi client-side (zod + react-hook-form)
- Error/loading states
- Redirect ke dashboard sesuai role setelah login

### 4. Dashboard Layout (shared)
- Sidebar navigasi (collapse di mobile)
- Topbar: nama user + role badge + logout
- Content area
- Route guard: redirect ke /login jika belum auth

### 5. Super Admin Dashboard
- Overview: total owners, total tenants, total revenue, total transactions
- Kelola Owner: tabel + search, detail panel, activate/deactivate
- Kelola Subscription: upgrade/downgrade tier per owner
- Settings: service catalog list (enable/disable)

### 6. Owner Dashboard
- Overview: revenue total + per tenant, berkas aktif
- Input Transaksi: form lengkap (pilih tenant, pilih layanan, data customer)
- List Berkas: tabel + filter (tenant, status, tanggal)
- Kelola Tenant: CRUD
- Kelola Admin User: CRUD (tampilkan kuota subs)
- Setting Jasa: pricing per tenant (editable table)
- Free tier: tampilkan menu tapi locked + prompt upgrade

### 7. Admin User Dashboard
- Overview: revenue tenant, berkas aktif/done
- Input Transaksi: form (tenant auto-assigned)
- List Berkas: filter status aktif/done
- Setting Jasa: pricing tenant sendiri

### 8. Monitoring Page (`/monitoring/:token`)
- Public (no auth)
- Progress stepper visual (status)
- Info: nama layanan, plat, biaya total, biaya tambahan
- Branding header: logo + SatuJasa STNK
- Tombol Kirim WA (wa.me link)

### 9. API Integration
- `src/lib/api.ts`: axios instance + auth interceptor (auto-refresh 401)
- Hooks per resource: `useAuth`, `useTenants`, `useTransactions`, dll
- Type-safe menggunakan `@stnk/contracts`
- Loading states + error handling + toast notifications

## Constraints

- ❌ Jangan deploy / expose port ke publik
- ❌ Jangan ubah `.env` production
- ❌ Jangan merge ke `main`
- ✅ Semua kerja di branch `agent/frontend/fe-foundation-001`
- ✅ Gunakan types dari `@stnk/contracts` — jangan duplikat types

## Acceptance Criteria

- [ ] Tailwind + shadcn/ui terkonfigurasi
- [ ] Semua halaman render tanpa error
- [ ] Free tier owner: menu visible tapi disabled + locked state
- [ ] Form validasi sebelum submit
- [ ] Monitoring page bisa diakses tanpa login
- [ ] Responsive di ≥375px
- [ ] WA link generate dengan benar
- [ ] `npm run typecheck` PASS dari root monorepo
- [ ] `npm run lint` PASS

## Deliverables

Report ke PM:
1. Branch name + file list yang dibuat/diubah
2. Screenshot atau deskripsi tiap halaman
3. Hasil typecheck + lint
4. Known risks / blockers
5. Rollback notes

## Rollback

Branch-based — tidak ada DB impact.
