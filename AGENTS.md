# AGENTS.md — SatuJasa STNK

Entry point untuk semua AI coding agents. Baca file ini pertama kali sebelum melakukan apapun.

## Wajib Dibaca Sebelum Mulai

1. `docs/SPEC.md` — master spec (business context, DB schema, API endpoints, state machine)
2. `docs/ai/ai-coding-agent-rules.md` — coding rules, branch convention, code style
3. `docs/ai/prompt-<role>.md` — role-specific instructions:
   - Backend agent → `docs/ai/prompt-backend.md`
   - Frontend agent → `docs/ai/prompt-frontend.md`
   - Mobile agent → `docs/ai/prompt-mobile.md`
   - Audit agent → `docs/ai/prompt-audit.md`
4. Task file yang di-assign (path ada di dispatch message)

## Aturan Dasar

- ❌ JANGAN commit ke `main` atau `master`
- ❌ JANGAN start server / expose port tanpa izin
- ❌ JANGAN ubah `.env` production
- ❌ JANGAN merge branch tanpa owner approval
- ✅ Semua kerja di branch `agent/<role>/<task-name>`
- ✅ Jalankan `npm run typecheck` sebelum selesai
- ✅ Report kembali ke PM: branch, files changed, verification results, risks, rollback notes

## Struktur Repo

```
stnk-jasa/
├── apps/
│   ├── api/          # Express backend (TypeScript + Drizzle + PostgreSQL)
│   ├── frontend/     # Next.js 16 frontend (Tailwind + shadcn/ui + MUI)
│   └── mobile/       # Expo + React Native (Admin User only)
├── packages/
│   └── contracts/    # Shared TypeScript types, enums, DTOs (@stnk/contracts)
├── docs/             # Project documentation (source of truth)
│   ├── SPEC.md
│   ├── ai/           # Agent prompts & rules
│   ├── architecture/ # Architecture docs per layer
│   ├── product/      # Business requirements, roles, features
│   ├── technical/    # API contracts, auth flow, deployment
│   └── design/       # UI/UX guidelines
└── shared/
    └── tasks/        # PM task files per role
```

## Dependency Order

```
packages/contracts  (types dulu)
       ↓
apps/api           (backend API)
       ↓
apps/frontend       (Next.js frontend)
apps/mobile         (mobile app, parallel dengan web)
```

## Quick Reference

- API base URL: `https://satujasa.my.id/api/v1`
- Production URL: `https://satujasa.my.id`
- Frontend build: `cd apps/frontend && NODE_OPTIONS="--max-old-space-size=1536" npx next build`
- Branch format: `agent/<role>/<task-name>`
- All PKs: UUID v7
- Soft delete: `deleted_at IS NULL` on all queries
- Error format: `{ error: string, details?: object }`
