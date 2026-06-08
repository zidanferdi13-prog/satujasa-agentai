# Task STNK-MOB-FOUNDATION-001 — Mobile Foundation

## Metadata
- **Role:** mobile
- **Branch:** `agent/mobile/mob-foundation-001`
- **Status:** dispatch-ready
- **Priority:** high
- **Created:** 2026-06-08
- **Depends On:** Backend `agent/backend/be-foundation-001` (API harus ready)

---

## Wajib Dibaca Sebelum Mulai

1. `AGENTS.md` — rules dan struktur repo
2. `docs/SPEC.md` — master spec
3. `docs/ai/ai-coding-agent-rules.md` — coding rules
4. `docs/ai/prompt-mobile.md` — mobile-specific instructions
5. `docs/architecture/mobile-architecture.md` — arsitektur mobile
6. `docs/technical/api-contract.md` — endpoint specs
7. `packages/contracts/src/index.ts` — shared types
8. https://docs.expo.dev/versions/v56.0.0/ — Expo v56 docs (WAJIB baca sebelum tulis kode)

---

## Objective

Build mobile app SatuJasa STNK untuk **Admin User saja**.
Fokus: input transaksi cepat, list berkas, dashboard tenant, settings.

## Context — Kondisi Saat Ini

`apps/mobile/` sudah ada bootstrap Expo:
- Expo v56 + React Native
- `App.tsx` hanya preview role (belum ada navigasi, belum ada auth)
- Belum ada navigation library
- Belum ada API integration
- Logo: placeholder di `assets/logo.png`

## Scope

### 1. Setup & Konfigurasi
- Install Expo Router (navigation)
- Install axios untuk HTTP client
- Install expo-secure-store untuk token storage
- Setup `src/lib/api.ts` — axios instance + auth interceptor
- Setup env config untuk API base URL via `.env`

### 2. Auth Screen (`/login`)
- Form: email + password
- Validasi client-side
- Hit `POST /api/v1/auth/login`
- Simpan token di expo-secure-store
- Auto-redirect ke dashboard jika sudah auth
- Error state: invalid credentials, network error

### 3. Dashboard Screen (Home)
- Revenue card: tenant revenue bulan ini
- Stats: berkas aktif, berkas selesai
- Quick action: "Input Transaksi", "Lihat Berkas"
- Pull-to-refresh

### 4. Input Transaksi Screen
- Form fields:
  - Nama customer, nomor HP, plat nomor, jenis kendaraan
  - Pilih layanan (dropdown dari tenant_services)
  - Biaya (auto-fill dari harga layanan, bisa edit)
  - Catatan (opsional)
- Tenant auto-assigned (dari user.tenantId)
- Submit → `POST /api/v1/admin-user/transactions`
- Success: tampilkan link monitoring + tombol "Kirim WA"

### 5. List Berkas Screen
- Tab: Aktif | Selesai | Dibatalkan
- Item: nama customer, plat, layanan, status badge, tanggal
- Tap → Detail screen
- Search by nama / plat
- Pull-to-refresh

### 6. Detail Berkas Screen
- Info lengkap: customer, layanan, biaya, status, tanggal
- Progress stepper visual
- Tombol Update Status (hanya tampilkan transisi yang valid)
- Input catatan saat update status
- Tombol "Kirim WA" (buka wa.me link)
- Tombol "Salin Link Monitoring" (copy clipboard)

### 7. Settings Screen
- Info tenant (read-only)
- Daftar harga layanan (editable)
  - Save → `PATCH /api/v1/admin-user/tenant/services`
- Profil user (read-only)
- Tombol Logout

### 8. Common Components
- LoadingSpinner, SkeletonCard
- ErrorState dengan tombol retry
- Toast/Snackbar feedback
- EmptyState illustration
- NetworkOffline indicator

## Constraints

- ❌ Jangan start Expo dev server di VPS tanpa review network mode
- ❌ Jangan deploy / expose port
- ❌ Jangan ubah `.env` production
- ❌ Jangan merge ke `main`
- ✅ Semua kerja di branch `agent/mobile/mob-foundation-001`
- ✅ Gunakan types dari `@stnk/contracts`
- ✅ API base URL dari `.env` (`EXPO_PUBLIC_API_URL`)

## Acceptance Criteria

- [ ] Login berhasil dengan kredensial valid
- [ ] Dashboard tampilkan data real dari API
- [ ] Input transaksi berhasil, muncul di list
- [ ] Update status hanya izinkan transisi valid
- [ ] WA link terbuka dengan template yang benar
- [ ] Harga layanan bisa diedit dan tersimpan
- [ ] Logout clear session, kembali ke login
- [ ] App tidak crash saat network error
- [ ] TypeScript compile tanpa error (`npx expo export --dump-assetmap` atau typecheck)

## Deliverables

Report ke PM:
1. Branch name + file list yang dibuat/diubah
2. Flow yang sudah ditest
3. Hasil typecheck
4. Known risks / blockers
5. Rollback notes

## Rollback

Branch-based — tidak ada DB impact.
