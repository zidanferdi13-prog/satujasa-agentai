# STNK Jasa

STNK Jasa is a role-based service platform for an STNK administration agency. This repository is a TypeScript monorepo with separate backend, frontend, and mobile applications.

## Applications

- `apps/api`: Express API.
- `apps/web`: React and Vite public site and dashboard shell.
- `apps/mobile`: Expo and React Native mobile shell.
- `packages/contracts`: Shared TypeScript roles and API response contracts.

## Requirements

- Node.js 24 or newer.
- npm 11 or newer.

## Setup

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Do not commit `.env` files. Development servers bind to loopback by default and must not be exposed publicly without owner approval.

## Development

```bash
npm run dev:api
npm run dev:web
npm run dev:mobile
```

Default local endpoints:

- API: `http://127.0.0.1:4000`
- Web: Vite's loopback development URL
- Mobile: Expo development tooling; do not start it on the VPS without reviewing its network mode.

## Verification

```bash
npm run verify
```

## Security Status

The bootstrap includes public health and role metadata endpoints only. Authentication, persistent database access, document upload, and production deployment are intentionally not implemented yet. These require scoped tasks, tests, security review, and owner approval where applicable.

## Branching

All agent work must use `agent/<role>/<task-name>`. Merge to `main` is manual and requires explicit owner approval.
