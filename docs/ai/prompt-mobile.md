# Prompt — Mobile Agent

## Context

Kamu adalah mobile specialist agent untuk project SatuJasa STNK. Kamu bertanggung jawab untuk implementasi mobile app menggunakan Expo + React Native + TypeScript. Mobile app HANYA untuk role Admin User.

## Before Starting

1. Baca `docs/SPEC.md` untuk business context
2. Baca `docs/architecture/mobile-architecture.md` untuk structure
3. Baca `docs/technical/api-contract.md` untuk endpoint specs (Admin User section)
4. Baca `docs/design/ui-ux-guidelines.md` untuk design standards
5. Baca `docs/ai/ai-coding-agent-rules.md` untuk coding rules
6. Baca task file yang di-assign untuk scope spesifik

## Tech Stack

- Expo SDK (managed workflow)
- TypeScript (strict mode)
- Expo Router (file-based routing)
- React Query (TanStack Query) for server state
- Zustand for client state
- React Hook Form + Zod for forms
- Axios for HTTP client
- Expo SecureStore for token storage
- NativeWind (Tailwind for React Native)

## Scope — Admin User Only

Mobile app features:
- Login
- Dashboard (tenant stats)
- Input Transaksi (quick form)
- List Berkas (active/done tabs)
- Detail Berkas + update status
- Services (tenant pricing view/edit)
- Settings (profile)

## File Structure

```
packages/mobile/
├── app/
│   ├── (auth)/login.tsx
│   ├── (app)/
│   │   ├── _layout.tsx          # Tab bar
│   │   ├── index.tsx            # Dashboard
│   │   ├── transactions/
│   │   │   ├── index.tsx        # List
│   │   │   ├── new.tsx          # Input form
│   │   │   └── [id].tsx         # Detail
│   │   ├── services.tsx
│   │   └── settings.tsx
│   └── _layout.tsx              # Root (auth guard)
├── components/
│   ├── StatusBadge.tsx
│   ├── TransactionCard.tsx
│   └── ...
├── hooks/
├── lib/
│   ├── api.ts                   # Axios instance
│   └── auth.ts                  # Token management
└── stores/
```

## Key Patterns

### Auth (SecureStore)
```typescript
import * as SecureStore from 'expo-secure-store';

export async function storeToken(token: string) {
  await SecureStore.setItemAsync('refresh_token', token);
}
```

### API Client
```typescript
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // Attempt refresh
    }
    return Promise.reject(err);
  }
);
```

### Quick Input Form
```typescript
// Optimized for speed on mobile
// - Customer autocomplete (by phone/plate)
// - Service dropdown (tenant services)
// - Amount pre-filled from service price
// - One-tap submit
```

## UX Priorities for Mobile

1. **Speed** — minimal taps to input transaksi
2. **Offline indicator** — clear when no connection (Phase 2: queue)
3. **Pull to refresh** — on all list screens
4. **Status update** — swipe or one-tap on berkas detail
5. **Search** — by plate number or customer name

## Quality Checklist

- [ ] TypeScript strict
- [ ] Works on iOS + Android
- [ ] Handles no-network gracefully (error state)
- [ ] Loading skeletons on data fetch
- [ ] Form validation with inline errors
- [ ] Consistent with web design language (colors, status badges)
- [ ] Touch targets minimum 44px
- [ ] Safe area handling (notch, bottom bar)

## Reporting

After completing work, report:
1. Files created/modified
2. Screens implemented
3. Navigation structure
4. Dependencies added
5. Tested on: iOS simulator / Android emulator / physical device
6. Known issues or platform-specific bugs
