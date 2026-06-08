# Task STNK-MOB-001 — Mobile Foundation (Admin User)

## Metadata
- **Role:** mobile
- **Branch:** `agent/mobile/mob-foundation-001`
- **Status:** dispatch-ready
- **Priority:** high
- **Created:** 2026-06-08
- **Depends On:** Backend `agent/backend/be-foundation-001` (API harus ready)

---

## Wajib Dibaca Sebelum Mulai

1. `AGENTS.md` — entry point, rules
2. `docs/SPEC.md` — master spec
3. `docs/ai/ai-coding-agent-rules.md` — coding rules
4. `docs/ai/prompt-mobile.md` — mobile-specific instructions
5. `docs/architecture/mobile-architecture.md` — struktur folder
6. `docs/technical/api-contract.md` — endpoint specs
7. `packages/contracts/src/index.ts` — shared types

---

## Context — Kondisi Saat Ini

`apps/mobile/` sudah ada bootstrap Expo:
- Expo v56 + React Native
- `App.tsx` — hanya preview role, belum ada navigasi atau auth
- Belum ada Expo Router
- Belum ada API integration
- Logo: placeholder di `assets/`

**Scope mobile: Admin User SAJA.**
Owner dan Super Admin gunakan web app.

---

## Scope

### 1. Setup & Konfigurasi
- Install Expo Router (file-based navigation)
- Install axios + expo-secure-store (token storage)
- Setup `src/lib/api.ts` — axios instance + auth interceptor
- Setup `src/lib/auth.ts` — simpan/hapus token di SecureStore
- Buat `src/env.ts` — `EXPO_PUBLIC_API_URL`

### 2. Auth Screen (`/login`)
- Form: email + password
- Validasi client-side
- Hit `POST /api/v1/auth/login`
- Simpan token di SecureStore
- Auto-redirect ke dashboard jika sudah auth
- Error state: invalid credentials, network error

### 3. Dashboard Screen (Home)
- Revenue card: total revenue tenant bulan ini
- Stats: berkas aktif, berkas selesai
- Quick action buttons: "Input Transaksi", "Lihat Berkas"
- Pull-to-refresh
- Hit `GET /api/v1/admin-user/dashboard`

### 4. Input Transaksi Screen
- Form fields:
  - Nama customer, nomor HP, plat nomor
  - Jenis kendaraan (dropdown: Motor/Mobil/Truk)
  - Pilih layanan (dropdown dari tenant_services aktif)
  - Biaya (auto-fill dari harga layanan, bisa edit)
  - Catatan (opsional)
- Submit → `POST /api/v1/admin-user/transactions`
- Success: tampilkan monitoring link + tombol "Kirim WA"

### 5. List Berkas Screen
- Tab: Aktif | Selesai | Dibatalkan
- Item card: nama customer, plat, layanan, status badge, tanggal
- Tap → Detail screen
- Search by nama / plat
- Pull-to-refresh
- Hit `GET /api/v1/admin-user/transactions`

### 6. Detail Berkas Screen
- Info: customer, layanan, biaya, status, tanggal
- Progress stepper visual (status timeline)
- Tombol Update Status (hanya transisi valid)
- Input catatan opsional saat update status
- Tombol "Kirim WA" → buka wa.me link
- Tombol "Salin Link Monitoring" → clipboard

### 7. Settings Screen
- Info tenant (nama, read-only)
- Daftar harga layanan (editable, toggle aktif)
- Simpan → `PATCH /api/v1/admin-user/tenant/services/:serviceId`
- Profil user (read-only)
- Tombol Logout → clear SecureStore → kembali ke login

### 8. Common Components
- `<LoadingSpinner />`, `<SkeletonCard />`
- `<ErrorState />` dengan tombol retry
- `<EmptyState />` illustration
- `<StatusBadge status="..." />` — warna per status
- `<NetworkOffline />` indicator

---

## Constraints

- ❌ JANGAN start Expo dev server di VPS tanpa review network mode
- ❌ Jangan deploy / expose port
- ❌ Jangan ubah `.env` production
- ❌ Jangan merge ke `main`
- ✅ Semua kerja di branch `agent/mobile/mob-foundation-001`
- ✅ Gunakan types dari `@stnk/contracts`
- ✅ API base URL dari `.env` (`EXPO_PUBLIC_API_URL`)
- ✅ Jalankan typecheck sebelum report

---

## Acceptance Criteria

- [ ] Login berhasil dengan kredensial valid, token tersimpan
- [ ] Dashboard tampilkan data dari API
- [ ] Input transaksi berhasil, muncul di list berkas
- [ ] Update status hanya izinkan transisi valid
- [ ] WA link terbuka dengan template yang benar
- [ ] Harga layanan bisa diedit dan tersimpan
- [ ] Logout clear session, kembali ke login
- [ ] App tidak crash saat network error
- [ ] TypeScript compile tanpa error

---

## Reporting Format

Report ke PM:
1. **Branch:** nama branch
2. **Files Created/Changed:** list lengkap
3. **Screens Done:** checklist
4. **Verification:** typecheck PASS/FAIL
5. **Blockers:** dependency API belum live?
6. **Risks:** Expo network mode di VPS
7. **Rollback Notes:** branch-based, safe

---

## Rollback

Branch-based — tidak ada DB impact. Safe untuk di-revert kapanpun.
