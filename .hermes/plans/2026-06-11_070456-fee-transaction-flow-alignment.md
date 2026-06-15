# Fee Transaction Flow Alignment Implementation Plan

> **For Hermes:** Use PM local dispatch to implement this plan task-by-task with backend first, then mobile/frontend.

**Goal:** Align the existing transaction creation flow with Jihann's fee design: fee defaults from database, editable transaction `amount`, transaction snapshot tables, document checklist snapshots, and total from `SUM(amount)`.

**Architecture:** Backend owns fee requirements, snapshots, and total calculation. Mobile/Admin UI only displays requirements and sends user-entered `feeDetails.amount`; it does not hardcode official STNK fees. Existing simple transaction fields remain for compatibility while new fee/checklist tables are added per transaction item.

**Tech Stack:** Express + TypeScript + Drizzle + PostgreSQL API, Expo React Native mobile, Next.js admin frontend.

---

## Current Context

- Existing backend currently has simple `transactions`, `customers`, `services`, and `tenant_services` tables in `apps/api/src/db/schema.ts`.
- Existing `POST /admin-user/transactions` in `apps/api/src/routes/admin-user.ts` accepts `customer_name`, `customer_phone`, `vehicle_plate`, `service_id`, `total_cost`, `additional_cost`, `notes`.
- Existing mobile `apps/mobile/app/app/transactions/new.tsx` currently:
  - loads `/admin-user/services`,
  - selects service,
  - sets `total_cost` from service price,
  - has only `Motor/Mobil/Truk`,
  - does not fetch fee requirements,
  - does not submit `feeDetails`.
- Owner-provided docs clarify final flow:
  - `orders` maps to `transactions`.
  - `order_fee_details` maps to `transaction_item_fee_details`.
  - `order_document_checklist` maps to `transaction_item_document_checklists`.
  - Fee/checklist snapshots are per `transaction_items`.
  - `OPERASIONAL` is not used in latest flow.
  - `JASA_BIRO` comes from tenant service/pricing and is displayed as system fee.
  - Tax/notice inputs are manual editable amounts initialized from master defaults.

---

## Proposed Flow

1. Admin user opens Create Transaction.
2. App loads active tenant services from `/admin-user/services`.
3. User selects service and vehicle type.
4. App calls `/admin-user/transactions/requirements?service_id=...&vehicle_type_code=...&province_code=JABAR`.
5. Backend resolves service code and tenant service price.
6. Backend returns:
   - vehicle type metadata,
   - fee components from `m_fee_rules`,
   - `JASA_BIRO` system fee from `tenant_services.price`,
   - document checklist from `m_service_document_requirements`.
7. Mobile renders notice/STNK fee rows as editable amount inputs.
8. Mobile renders `JASA_BIRO` separately as biaya sistem.
9. Mobile submits transaction with `feeDetails` amounts.
10. Backend creates `transactions` + `transaction_items`.
11. Backend snapshots `feeDetails` into `transaction_item_fee_details` with both `default_amount` and `amount`.
12. Backend snapshots documents into `transaction_item_document_checklists`.
13. Backend sets `transactions.total_cost = SUM(transaction_item_fee_details.amount)`.
14. Detail pages read saved snapshots, not master rules.

---

## Backend Task — STNK-FEE-BE-001

**Branch:** `agent/backend/fee-transaction-flow`

**Objective:** Add DB schema, seed data, requirements endpoint, and create-transaction snapshot logic.

**Files likely to change:**
- `apps/api/src/db/schema.ts`
- `apps/api/src/db/seed.ts`
- `apps/api/src/middleware/validate.ts`
- `apps/api/src/routes/admin-user.ts`
- `apps/api/tests/admin-user.test.ts`
- new migration file under `apps/api/drizzle/` or current project migration location
- docs update if needed

### Backend scope

1. Add master tables:
   - `vehicle_types`
   - `fee_components`
   - `m_fee_rules`
   - `m_service_document_requirements`
2. Add transaction item/snapshot tables:
   - `transaction_items`
   - `transaction_item_fee_details`
   - `transaction_item_document_checklists`
3. Seed MVP data:
   - vehicle types: `MOTOR`, `MOBIL`, `PICKUP`, `TRUK`, `BUS`, `LAINNYA`
   - service codes from existing `services`
   - fee components using latest notice format:
     - `PKB_POKOK`
     - `PKB_DENDA`
     - `OPSEN_PKB_POKOK`
     - `OPSEN_PKB_DENDA`
     - `SWDKLLJ_POKOK`
     - `SWDKLLJ_DENDA`
     - `PNBP_STNK`
     - `PNBP_TNKB`
     - `BBNKB`
     - `BPKB`
     - `SURAT_MUTASI`
     - `SURAT_KEHILANGAN`
     - `PENGUMUMAN_KEHILANGAN`
     - `CEK_FISIK`
     - `BIAYA_TAMBAHAN`
     - `JASA_BIRO`
   - Do **not** seed/use `OPERASIONAL` in new flow.
4. Add `GET /admin-user/transactions/requirements`.
5. Update `POST /admin-user/transactions` to accept optional new payload fields:
   - `vehicle_type_code`
   - `province_code`
   - `city_code`
   - `city_name`
   - `fee_details: [{ component_code, amount, notes? }]`
6. Backend should calculate `total_cost` itself from fee details; do not trust client `total_cost` when `fee_details` is provided.
7. Keep backwards compatibility temporarily: old payload with `total_cost` still works while mobile/frontend migrate.
8. Add response detail fields for saved fee/checklist snapshots.

### Backend acceptance criteria

- `GET /admin-user/transactions/requirements` returns fee defaults and checklist for a service + vehicle type.
- `POST /admin-user/transactions` creates transaction item, fee snapshots, checklist snapshots, and total from `SUM(amount)`.
- `JASA_BIRO` amount comes from tenant service price.
- Official notice fee components can default to 0 and be editable.
- No hardcoded fee calculation in route logic except seed defaults.
- Existing tests still pass.
- New tests prove transaction old master changes do not mutate saved transaction fee details.

### Backend verification commands

```bash
cd apps/api
npm run typecheck
npm test -- admin-user.test.ts
npm run build
```

---

## Mobile Task — STNK-FEE-MOB-001

**Branch:** `agent/mobile/fee-transaction-flow`

**Objective:** Update create/detail transaction screens to follow backend requirements and snapshot flow.

**Files likely to change:**
- `apps/mobile/app/app/transactions/new.tsx`
- `apps/mobile/app/app/transactions/[id].tsx`
- `apps/mobile/src/contracts.ts`
- `apps/mobile/src/lib/api.ts` if needed

### Mobile scope

1. Replace hardcoded vehicle labels with vehicle type codes:
   - `MOTOR`
   - `MOBIL`
   - `PICKUP`
   - `TRUK`
   - `BUS`
   - `LAINNYA`
2. After service + vehicle selected, fetch requirements endpoint.
3. Render fee rows from backend response:
   - notice/STNK official components as editable numeric inputs,
   - `JASA_BIRO` displayed separately as biaya sistem, still included in submitted `fee_details`.
4. Remove local logic that sets `total_cost` directly from tenant service price.
5. Show computed preview total locally as sum of current fee input amounts.
6. Submit `fee_details` to backend.
7. Detail screen displays saved `fee_details` and checklist snapshots from transaction response.
8. No upload document/file UI.

### Mobile acceptance criteria

- Mobile no longer hardcodes official STNK fee rows.
- Mobile can create transaction after selecting service + vehicle type.
- Total preview updates when fee input changes.
- Submitted payload contains `fee_details` amounts.
- `JASA_BIRO` appears as biaya sistem from backend/tenant price.
- Typecheck passes.

### Mobile verification commands

```bash
cd apps/mobile
npm run typecheck
npx expo-doctor
```

For APK build, follow `docs/technical/mobile-eas-build.md`.

---

## Frontend/Admin Task — STNK-FEE-FE-001

**Branch:** `agent/frontend/fee-admin-detail`

**Objective:** Prepare web/admin UI to view transaction fee snapshots and checklist, and optionally edit fee `amount` in admin detail if route exists.

**Files likely to change:**
- `apps/frontend/src/types/transaction.ts`
- transaction page files when present/created
- API client files when present

### Frontend scope

1. Use verified backend response shapes; do not invent field names.
2. Display transaction detail fee rows from saved snapshots.
3. Display checklist snapshots as checkboxes.
4. If edit endpoint is added by backend, implement admin fee edit:
   - update `amount`, not `default_amount`,
   - trigger backend total recalculation,
   - refetch detail.
5. Use null-safe rendering for optional fields.
6. Use Box/CSS grid instead of incompatible MUI Grid item props.

### Frontend acceptance criteria

- Detail page shows saved fee snapshot, not master fee rules.
- Total matches backend `total_cost`.
- Checklist visible.
- Typecheck/build pass.

### Frontend verification commands

```bash
cd apps/frontend
npx tsc --noEmit
NODE_OPTIONS="--max-old-space-size=1536" npx next build
```

---

## API Contract Draft

### GET `/api/v1/admin-user/transactions/requirements`

Query:

```json
{
  "service_id": "uuid",
  "vehicle_type_code": "MOTOR",
  "province_code": "JABAR",
  "city_code": "optional"
}
```

Response draft:

```json
{
  "service": {
    "id": "uuid",
    "code": "PAJAK_TAHUNAN",
    "name": "Pajak Tahunan"
  },
  "vehicleType": {
    "code": "MOTOR",
    "name": "Motor",
    "priceGroup": "R2_R3"
  },
  "provinceCode": "JABAR",
  "fees": [
    {
      "componentCode": "PKB_POKOK",
      "componentName": "PKB Pokok",
      "defaultAmount": "0.00",
      "amount": "0.00",
      "isEditable": true,
      "source": "master",
      "sortOrder": 10
    },
    {
      "componentCode": "JASA_BIRO",
      "componentName": "Jasa Biro",
      "defaultAmount": "150000.00",
      "amount": "150000.00",
      "isEditable": false,
      "source": "tenant_pricing",
      "sortOrder": 900
    }
  ],
  "documents": [
    {
      "documentCode": "STNK_ASLI",
      "documentName": "STNK Asli",
      "isRequired": true,
      "sortOrder": 10
    }
  ]
}
```

### POST `/api/v1/admin-user/transactions`

New payload draft:

```json
{
  "customer_name": "Budi",
  "customer_phone": "081234567890",
  "vehicle_plate": "D1234ABC",
  "vehicle_type_code": "MOTOR",
  "service_id": "uuid",
  "province_code": "JABAR",
  "city_code": "BDG",
  "city_name": "Bandung",
  "tax_due_date": "2026-12-31",
  "notes": "optional",
  "fee_details": [
    { "component_code": "PKB_POKOK", "amount": 0 },
    { "component_code": "SWDKLLJ_POKOK", "amount": 35000 },
    { "component_code": "JASA_BIRO", "amount": 150000 }
  ]
}
```

Backend response should include saved fee/checklist snapshots.

---

## Dispatch Order

1. Backend first: `STNK-FEE-BE-001`.
2. PM verifies backend with curl and captures exact response shapes.
3. Mobile second: `STNK-FEE-MOB-001`, using exact verified API contract.
4. Frontend third: `STNK-FEE-FE-001` if web transaction UI is in scope for this sprint.
5. PM runs integration smoke test and reports.

---

## Risks / Tradeoffs

- Current schema has no `transaction_items`; adding it is a real data model change and needs migration care.
- Existing transactions must remain readable; migration should not break old rows.
- If service codes in current `services` table differ from `FEE_DESIGN.md`, backend agent must map them explicitly or seed missing services.
- Mobile APK build still needs standalone EAS flow from `docs/technical/mobile-eas-build.md`.
- Web admin transaction pages appear minimal/not present; frontend scope may need separate UI foundation task.

---

## Open Questions for Owner

1. For MVP mobile, should `JASA_BIRO` be editable by mobile admin-user or locked as system fee and only editable in web/admin later?
2. Do we keep `additional_cost` in the old transaction payload, or replace it with `BIAYA_TAMBAHAN` fee component?
3. For city selection, should MVP use free text `city_name` first or fixed Jabar city master dropdown?
4. Should we include `BPKB`, `BBNKB`, `SURAT_MUTASI`, etc. in all seeded rules with default 0, or only where relevant per service?
