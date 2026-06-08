# Mobile Architecture

## Overview

Mobile app hanya untuk **Admin User** — digunakan untuk input transaksi cepat dan update status berkas di lapangan (kantor Samsat, dll).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo (managed workflow) |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| State | React Query + Zustand |
| HTTP | Axios (shared config with web) |
| UI | React Native Paper / NativeWind (Tailwind for RN) |
| Auth | Secure store for session token |

## Project Structure

```
packages/mobile/
├── app/                      # Expo Router file-based routes
│   ├── (auth)/
│   │   └── login.tsx
│   ├── (app)/
│   │   ├── _layout.tsx       # Tab navigator
│   │   ├── dashboard.tsx
│   │   ├── transactions/
│   │   │   ├── index.tsx     # List berkas
│   │   │   ├── new.tsx       # Input transaksi
│   │   │   └── [id].tsx      # Detail + update status
│   │   ├── services.tsx      # Tenant pricing
│   │   └── settings.tsx      # Profile
│   └── _layout.tsx           # Root layout (auth guard)
├── components/               # Reusable components
├── hooks/                    # Custom hooks
├── lib/                      # API client, utils
├── stores/                   # Zustand stores
├── assets/                   # Icons, images
├── app.json
├── tsconfig.json
└── package.json
```

## Screens

| Screen | Fungsi |
|--------|--------|
| Login | Email/phone + password |
| Dashboard | Tenant stats (berkas aktif, selesai, revenue) |
| List Berkas | Filter by status, search by plate/name |
| Input Transaksi | Quick form: customer, vehicle, service |
| Detail Berkas | Info lengkap + update status button |
| Services | Lihat/edit harga per layanan tenant |
| Settings | Profile, tenant info |

## Key Decisions

1. **Expo managed workflow** — no native module complexity, simpler build/deploy
2. **Admin User only** — owner dan super admin pakai web app (complex dashboards not suited for mobile)
3. **Offline-first (Phase 2)** — Phase 1 requires internet; Phase 2 bisa queue transactions offline
4. **Shared contracts** — import types/enums from `@stnk/contracts`
5. **Same API** — mobile hits the same REST API as web app, no separate backend

## Auth Flow (Mobile)

```
1. Login → API returns session cookie + refresh token
2. Store refresh token in Expo SecureStore
3. Axios interceptor attaches cookie / handles refresh
4. On 401 → attempt refresh → if fail → redirect to login
```
