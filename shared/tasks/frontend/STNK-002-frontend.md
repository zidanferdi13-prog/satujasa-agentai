# Task STNK-002 — Frontend Foundation

## Assigned To: Frontend Agent
## Branch: `agent/frontend/stnk-002-foundation`
## Reference: `docs/SPEC.md`
## Depends On: Backend STNK-002 (contracts package must be updated first)

---

## Objective

Rebuild the web frontend with Tailwind CSS + shadcn/ui, implementing all pages and role-based dashboard flows for SatuJasa STNK.

## Scope

### 1. Setup & Migration
- Remove current custom CSS (`App.css`, `index.css`)
- Install & configure Tailwind CSS
- Install & configure shadcn/ui (components library)
- Setup React Router (already present, keep structure)
- Placeholder logo in `src/assets/logo.png` (will be replaced later)

### 2. Landing Page (`/`)
- Hero section: headline, subtext, CTA buttons (Login / Daftar)
- Features grid: 3-4 benefit cards
- Process section: simple step explanation
- Footer with brand
- Responsive (mobile-first)

### 3. Auth Pages
- **Login** (`/login`): email/phone + password form, link to register
- **Register** (`/register`): owner registration form (name, email, phone, password)
- Form validation (client-side with zod + react-hook-form)
- Error/success states
- Redirect to dashboard on success

### 4. Dashboard Layout
- Sidebar navigation (collapsible on mobile)
- Top bar with user info + logout
- Content area
- Role-aware: menu items differ per role

### 5. Super Admin Dashboard
- **Overview**: cards (active owners, active users, revenue bulan ini, revenue total)
- **Kelola Owner**: table with search/filter, detail modal, activate/deactivate
- **Kelola Subscription**: per-owner subscription management (upgrade/downgrade dropdown)
- **Revenue**: simple table/filter by owner/tenant/month
- **Settings**: service catalog list (enable/disable), platform config form

### 6. Owner Dashboard
- **Overview**: revenue cards (total + per tenant), berkas aktif count
- **Input Transaksi**: form (select tenant, select service, customer data, notes)
- **List Berkas**: table with filter (tenant, status, date range), status badge
- **Kelola Tenant**: CRUD cards/list
- **Kelola Admin User**: CRUD per tenant (show limit from subs)
- **Setting Jasa**: pricing table per tenant (editable)
- **Free tier state**: show menus but disabled/locked with upgrade prompt

### 7. Admin User Dashboard
- **Overview**: revenue tenant, berkas aktif/done counts
- **Input Transaksi**: form (tenant auto-assigned, select service, customer data)
- **List Berkas**: table with status filter
- **Setting Jasa**: own tenant pricing (editable)

### 8. Monitoring Page (`/monitoring/:token`)
- Public (no auth required)
- Progress stepper (visual status indicator)
- Service name, total cost, additional cost, estimated completion
- Clean, simple, customer-friendly design
- Brand header (logo + "SatuJasa STNK")

### 9. WhatsApp Link Button
- On transaction detail view: "Kirim ke WhatsApp" button
- Opens `wa.me/{phone}?text={encoded_template}` in new tab
- Template filled from transaction data

### 10. API Integration
- HTTP client (axios or fetch wrapper) with auth token handling
- Auto-refresh on 401
- Type-safe API calls using `@stnk/contracts` types
- Loading states, error handling, toast notifications

## Acceptance Criteria
- [ ] Tailwind + shadcn/ui configured and working
- [ ] All pages render correctly per role
- [ ] Free tier owner sees locked/disabled state
- [ ] Forms validate before submit
- [ ] Monitoring page works without login
- [ ] Responsive on mobile viewport (≥375px)
- [ ] WA link generates correctly
- [ ] `npm run verify` passes (lint + typecheck + build)

## Verification
- Visual check all pages (provide screenshots or describe layout)
- Test role routing: login as each role → correct dashboard
- Test monitoring page with sample token
- Run `npm run verify`

## Deliverables
- Updated `apps/web/src/` with full implementation
- Component library setup in `apps/web/src/components/ui/`
- Updated `apps/web/package.json` with new deps
- Summary report back to PM with: files changed, screenshots/descriptions, any blockers

## Rollback
- Branch-based: revert to current state if needed
- No database impact (frontend only)
