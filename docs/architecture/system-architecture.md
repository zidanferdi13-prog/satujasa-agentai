# System Architecture

## Overview

SatuJasa STNK menggunakan arsitektur **TypeScript monorepo** dengan npm workspaces. Semua package berbagi type definitions melalui shared contracts.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    Clients                            │
├──────────┬──────────────┬───────────────────────────┤
│  Web App │  Mobile App  │  Public Monitoring Page   │
│  (React) │  (Expo)      │  (React, no auth)         │
└────┬─────┴──────┬───────┴───────────┬───────────────┘
     │            │                   │
     ▼            ▼                   ▼
┌─────────────────────────────────────────────────────┐
│              REST API (Express + TypeScript)          │
├─────────────────────────────────────────────────────┤
│  Auth Middleware │ RBAC Middleware │ Tenant Isolation │
├─────────────────────────────────────────────────────┤
│  Controllers → Services → Repositories              │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              PostgreSQL (Drizzle ORM)                 │
│  UUID v7 PKs │ Soft Delete │ Tenant-scoped queries   │
└─────────────────────────────────────────────────────┘
```

## Monorepo Structure

```
stnk-jasa/
├── packages/
│   ├── backend/          # Express API server
│   ├── frontend/         # React + Vite web app
│   ├── mobile/           # Expo React Native app
│   └── contracts/        # @stnk/contracts — shared types, enums, schemas
├── docs/                 # Project documentation
├── package.json          # Workspace root
└── tsconfig.base.json    # Shared TypeScript config
```

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo | npm workspaces | Shared types, single repo, simple tooling |
| API style | REST | Simpler than GraphQL for CRUD-heavy ops |
| ORM | Drizzle | Type-safe, lightweight, great DX with PostgreSQL |
| Auth | Session + JWT refresh | Secure httpOnly cookies, no token in localStorage |
| IDs | UUID v7 | Time-sortable, no sequential exposure |
| Deletion | Soft delete | Recovery & audit trail |
| Validation | Zod | Shared between frontend and backend via contracts |

## Communication Flow

1. Web/Mobile → REST API via HTTPS
2. API validates auth → checks RBAC → enforces tenant isolation
3. Repository layer queries PostgreSQL with Drizzle
4. Responses return JSON with consistent error format

## Environments

| Env | Purpose | URL |
|-----|---------|-----|
| Development | Local dev | `http://localhost:3000` (API), `http://localhost:5173` (web) |
| Staging | Testing | TBD |
| Production | Live | `https://api.satujasa.my.id`, `https://satujasa.my.id` |
