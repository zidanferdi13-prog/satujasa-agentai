# Frontend Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18+ |
| Build Tool | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Component Library | shadcn/ui |
| HTTP Client | Axios (or fetch wrapper) |
| State Management | React Query (server state) + Zustand (client state) |
| Routing | React Router v6 |
| Validation | Zod (shared via @stnk/contracts) |
| Forms | React Hook Form + Zod resolver |

## Project Structure

```
packages/frontend/
├── src/
│   ├── app/                  # App entry, providers, router
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Sidebar, header, breadcrumb
│   │   └── shared/           # Reusable business components
│   ├── features/
│   │   ├── auth/             # Login, register, session
│   │   ├── dashboard/        # Role-specific dashboards
│   │   ├── tenants/          # Tenant CRUD
│   │   ├── admin-users/      # Admin user management
│   │   ├── transactions/     # Input, list, detail, status update
│   │   ├── services/         # Service catalog & pricing
│   │   ├── monitoring/       # Public monitoring page
│   │   └── settings/         # Platform & profile settings
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities, API client, constants
│   ├── stores/               # Zustand stores
│   └── types/                # Frontend-specific types
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Routing Structure

### Public Routes (no auth)
```
/                    → Landing page
/signin              → Login page
/register            → Owner registration
/monitoring/:token   → Customer monitoring page
```

### Super Admin Routes
```
/super-admin/dashboard
/super-admin/owners
/super-admin/owners/:id
/super-admin/subscriptions
/super-admin/tenants
/super-admin/transactions
/super-admin/reports
/super-admin/settings
```

### Owner Routes
```
/owner/dashboard
/owner/tenants
/owner/tenants/:id
/owner/admin-users
/owner/transactions
/owner/transactions/new
/owner/transactions/:id
/owner/services
/owner/reports
/owner/settings
```

### Admin User Routes
```
/admin-user/dashboard
/admin-user/transactions
/admin-user/transactions/new
/admin-user/transactions/:id
/admin-user/customers
/admin-user/services
/admin-user/settings
```

## Route Guards

```typescript
// Pseudo-code for route protection
const routes = [
  { path: '/super-admin/*', roles: ['super-admin'] },
  { path: '/owner/*', roles: ['owner'] },
  { path: '/admin-user/*', roles: ['admin-user'] },
  { path: '/monitoring/*', roles: null }, // public
];

// After login, redirect to role-specific dashboard
function getDefaultRoute(role) {
  switch (role) {
    case 'super-admin': return '/super-admin/dashboard';
    case 'owner': return '/owner/dashboard';
    case 'admin-user': return '/admin-user/dashboard';
  }
}
```

## Navigation (Sidebar per Role)

**Super Admin:** Dashboard, Kelola Owner, Subscriptions, Semua Tenant, Semua Transaksi, Reports, Settings

**Owner:** Dashboard, Input Transaksi, Daftar Berkas, Kelola Tenant, Kelola Admin User, Setting Jasa, Reports, Settings

**Admin User:** Dashboard, Input Transaksi, Daftar Berkas, Customers, Setting Jasa, Settings

## Key Patterns

1. **Feature-based structure** — each feature owns its components, hooks, and API calls
2. **Role-based layouts** — different sidebar menus per role, enforced by route guards
3. **React Query** — all server data cached and synced via query keys
4. **Optimistic updates** — for status changes on transactions
5. **Shared Zod schemas** — validation consistent between client and server
6. **Responsive** — desktop-first but responsive down to tablet for admin panels
