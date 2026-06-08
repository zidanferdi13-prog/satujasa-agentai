# Task STNK-002 — Mobile Foundation

## Assigned To: Mobile Agent
## Branch: `agent/mobile/stnk-002-foundation`
## Reference: `docs/SPEC.md`
## Depends On: Backend STNK-002 (API must be available), Contracts package updated

---

## Objective

Build the mobile app for Admin User role only. Focus on fast transaction input, berkas management, and tenant settings. Expo + React Native.

## Important
- Read https://docs.expo.dev/versions/v56.0.0/ for current Expo APIs before writing code.
- This app is for **Admin User only** — no super admin or owner flows.

## Scope

### 1. Setup & Configuration
- Keep Expo setup (already initialized)
- Install navigation library (Expo Router or React Navigation)
- Install HTTP client (axios)
- Setup auth token storage (expo-secure-store)
- Setup environment config for API base URL
- Placeholder logo in `assets/logo.png`

### 2. Login Screen
- Email/phone + password form
- Validate credentials against `POST /api/v1/auth/login`
- Store session token securely
- Auto-redirect to dashboard if already authenticated
- Error states (invalid credentials, network error)

### 3. Dashboard Screen (Home)
- Revenue card: tenant revenue bulan ini
- Stats cards: berkas aktif count, berkas done count
- Quick action buttons: "Input Transaksi", "Lihat Berkas"
- Pull-to-refresh

### 4. Input Transaksi Screen
- Form fields:
  - Customer: name, phone, plate number, vehicle type
  - Service: dropdown/picker from tenant_services
  - Total cost: auto-filled from service price (editable)
  - Notes: optional text
- Tenant auto-assigned (from logged-in user's tenant_id)
- Submit → `POST /api/v1/admin-user/transactions`
- Success: show monitoring link + "Kirim WA" button
- Validation before submit

### 5. List Berkas Screen
- Tabs: "Aktif" (all non-done/cancelled) | "Selesai" (done) | "Dibatalkan" (cancelled)
- Each item shows: customer name, plate, service, status badge, date
- Tap → Detail screen
- Search/filter by customer name or plate
- Pull-to-refresh

### 6. Detail Berkas Screen
- Full transaction info: customer, service, cost, dates, status
- Status progress stepper (visual)
- **Update Status** button → picker with valid next states only (state machine enforced)
- Add notes on status change
- "Kirim WA" button (opens wa.me link)
- "Salin Link Monitoring" button (copy to clipboard)

### 7. Settings Screen
- Tenant info (name, read-only)
- Service pricing list (editable)
  - Each service: name + price input
  - Save → `PATCH /api/v1/admin-user/tenant/services`
- Profile section: name, email, phone (read-only for now)
- Logout button

### 8. Common Components
- Loading spinner / skeleton
- Error state with retry
- Toast/snackbar for success/error feedback
- Empty state illustrations
- Network offline indicator

## Acceptance Criteria
- [ ] Login works with valid credentials
- [ ] Dashboard shows real data from API
- [ ] Can input new transaction successfully
- [ ] Transaction appears in list immediately after creation
- [ ] Status update works with valid transitions only
- [ ] WA link opens correctly with template message
- [ ] Service pricing editable and saves to API
- [ ] Logout clears session and returns to login
- [ ] App doesn't crash on network errors (graceful handling)
- [ ] TypeScript compiles without errors

## Verification
- Test full flow: login → input transaksi → lihat di list → update status → kirim WA
- Test offline/error handling: disable network → verify graceful behavior
- Test state machine: try invalid transition → verify rejection
- `npx expo export` (or typecheck) passes without errors

## Deliverables
- Updated `apps/mobile/` with full implementation
- Navigation structure in `apps/mobile/app/` or `apps/mobile/src/`
- Screens, components, hooks, API client
- Updated `apps/mobile/package.json` with new deps
- Summary report to PM: files changed, tested flows, screenshots if possible, any blockers

## Rollback
- Branch-based
- No database impact (mobile is client-only)

## Notes
- Do NOT start Expo dev server on VPS without reviewing network mode
- API base URL must point to `http://127.0.0.1:4000` for local dev, configurable via `.env`
- Expo Go can be used for testing on physical device (same network)
