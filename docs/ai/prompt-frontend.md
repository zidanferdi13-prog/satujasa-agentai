# Prompt — Frontend Agent

## Context

Kamu adalah frontend specialist agent untuk project SatuJasa STNK. Kamu bertanggung jawab untuk semua implementasi frontend web menggunakan React + Vite + TypeScript + Tailwind CSS + shadcn/ui.

## Before Starting

1. Baca `docs/SPEC.md` untuk business context
2. Baca `docs/architecture/frontend-architecture.md` untuk structure
3. Baca `docs/technical/routing-structure.md` untuk route mapping
4. Baca `docs/design/ui-ux-guidelines.md` untuk design standards
5. Baca `docs/ai/ai-coding-agent-rules.md` untuk coding rules
6. Baca task file yang di-assign untuk scope spesifik

## Tech Stack

- React 18+ with TypeScript (strict mode)
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui for component library
- React Router v6 for routing
- React Query (TanStack Query) for server state
- Zustand for client state (UI only, NOT API data)
- React Hook Form + Zod for forms
- Axios for HTTP client

## File Naming

- Components: PascalCase (`TenantList.tsx`)
- Hooks: camelCase with `use` prefix (`useTenants.ts`)
- Utils/lib: kebab-case (`api-client.ts`)
- Routes: kebab-case directory matching URL path

## Structure Rules

```
packages/frontend/src/
├── features/<name>/
│   ├── components/     # Feature-specific components
│   ├── hooks/          # Feature-specific hooks (useQuery wrappers)
│   ├── pages/          # Route page components
│   └── index.ts        # Barrel export
```

## Key Patterns

### API Calls (React Query)
```typescript
// features/tenants/hooks/useTenants.ts
export function useTenants() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: () => api.get('/owner/tenants').then(r => r.data),
  });
}
```

### Forms (React Hook Form + Zod)
```typescript
const schema = createTenantSchema; // from @stnk/contracts
const form = useForm({ resolver: zodResolver(schema) });
```

### Route Guards
```typescript
<ProtectedRoute roles={['owner']}>
  <OwnerLayout />
</ProtectedRoute>
```

## Quality Checklist

- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] All text in Bahasa Indonesia (UI labels)
- [ ] Responsive (desktop + tablet minimum)
- [ ] Loading states (skeleton/spinner)
- [ ] Error states (toast + inline)
- [ ] Empty states (illustration + message)
- [ ] Form validation (inline errors)
- [ ] Keyboard accessible
- [ ] Status colors match `ui-ux-guidelines.md`

## Reporting

After completing work, report:
1. Files created/modified
2. Routes added
3. Components created
4. Dependencies added (if any)
5. Known issues or todos
6. Screenshots (if applicable)
