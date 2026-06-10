# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Next.js version guidance

This project uses Next.js 16.2.6 with React 19.2.4. This version may have API, convention, and file-structure differences from older Next.js knowledge. Before changing framework-specific code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.

## Common commands

- `npm run dev` — start the local development server.
- `npm run build` — create a production build.
- `npm run start` — run the production build.
- `npm run lint` — run ESLint.

There is currently no test script in `package.json`.

## Project structure

This is a Next.js App Router frontend for SatuJasa/STNK SatuJasa.

- `src/app/layout.tsx` defines the root layout, Inter font setup, MUI App Router cache provider, and TanStack Query provider.
- `src/app/page.tsx` composes the public landing page from section components under `src/components/landing/`.
- `src/app/auth/signin/page.tsx` contains the sign-in route.
- `src/app/admin/`, `src/app/owner/`, and `src/app/user-admin/` contain role-specific app routes and layouts.
- `src/components/guards/RoleGuard.tsx` handles role-gated UI access.
- `src/components/providers/QueryProvider.tsx` centralizes TanStack Query setup.
- `src/hooks/` contains auth-related React Query hooks.
- `src/lib/` contains auth, Axios, and role-redirect helpers.
- `src/types/` contains shared TypeScript types.

## Styling and UI stack

- Tailwind CSS 4 is configured through PostCSS and global styles in `src/app/globals.css`.
- Material UI 9 is installed with Emotion and `@mui/material-nextjs` integration.
- Landing page UI is split into section components; keep landing-page edits localized to `src/components/landing/` unless shared layout/provider behavior must change.

## Auth/data flow

- Axios configuration lives in `src/lib/axios.ts`.
- Auth utilities live in `src/lib/auth.ts`.
- Current-user and login logic are exposed through `src/hooks/useCurrentUser.ts` and `src/hooks/useLogin.ts`.
- Role-based redirects are centralized in `src/lib/redirectByRole.ts`.
