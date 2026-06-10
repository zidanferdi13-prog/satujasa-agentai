# STNK Jasa

STNK Jasa is a role-based service platform for an STNK administration agency. This repository is a TypeScript monorepo with separate backend, frontend, and mobile applications.

## Applications

- `apps/api`: Express API.
- `apps/frontend`: Next.js 16 frontend (replaces deprecated `apps/web`).
- `apps/mobile`: Expo and React Native mobile shell.
- `packages/contracts`: Shared TypeScript roles and API response contracts.

## Requirements

- Node.js 24 or newer.
- npm 11 or newer.

## Setup

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/frontend/.env.example apps/frontend/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Do not commit `.env` files. Development servers bind to loopback by default and must not be exposed publicly without owner approval.

## Development

```bash
npm run dev:api
cd apps/frontend && npm run dev
npm run dev:mobile
```

Default local endpoints:

- API: `http://127.0.0.1:4000`
- Frontend: Next.js dev server (default `http://localhost:3000`)
- Mobile: Expo development tooling; do not start it on the VPS without reviewing its network mode.

## Verification

```bash
npm run verify
```

## Features

### Live (Production on https://satujasa.my.id)
- **Authentication:** Login/register with JWT, role-based (super-admin, owner, admin-user).
- **Super Admin:** Manage owners, assign subscriptions (Free/Pro/Plus/Expert).
- **Owner:** Manage tenants and admin-users within subscription quota.
- **Admin User:** Create and manage STNK transactions, update status, generate WA link.
- **Monitoring:** Public tracking page per transaction token (no login required).
- **Frontend:** Next.js 16 at `apps/frontend`, deployed via PM2 (`stnk-web`).
- **Backend:** Express API at `apps/api`, deployed via PM2 (`stnk-api`).

### In Development
- **Mobile app:** Expo/React Native at `apps/mobile`, APK via EAS Cloud Build.

## Build & Deploy

### Frontend (Next.js)
```bash
cd apps/frontend
npx tsc --noEmit                          # typecheck first
NODE_OPTIONS="--max-old-space-size=1536" npx next build
pm2 restart stnk-web
```

### Backend (Express)
```bash
cd apps/api
npm run build
pm2 restart stnk-api
```

### Mobile (Expo APK)
```bash
cd apps/mobile
export EXPO_TOKEN=***                     # Expo personal access token
npx eas-cli build --platform android --profile preview --non-interactive
```

## Branching

All agent work must use `agent/<role>/<task-name>`. Merge to `main` is manual and requires explicit owner approval.
