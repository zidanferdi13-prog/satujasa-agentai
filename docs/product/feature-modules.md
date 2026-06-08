# Feature Modules

## 1. Authentication Module
- Owner registration → akun langsung **aktif** dengan tier Free
- Free tier: bisa login, lihat semua menu (preview), tapi tidak bisa melakukan action apapun
- Login via email/phone + password
- Session management (httpOnly cookie + JWT refresh)
- Logout (clear session)
- Password reset (Phase 2)

## 2. Subscription Module
- Super Admin mengelola subscription per owner (manual, belum ada payment gateway)
- Owner mendaftar → otomatis Free tier (dashboard preview only, semua action disabled)
- Upgrade/downgrade tier oleh Super Admin
- Set custom limits (`max_tenants`, `max_admin_users`) untuk Expert tier
- Enforce limits saat create tenant/admin user
- Free tier enforcement: block create tenant, assign admin, input transaksi

## 3. Tenant Management Module
- Owner CRUD tenants (limited by subscription)
- Tenant memiliki: name, address, phone, status
- Super Admin bisa lihat dan kelola semua tenant
- Soft delete (deactivate, bukan hapus permanen)

## 4. User Management Module
- Owner CRUD admin users untuk tenant-nya
- 1 admin user = 1 tenant (fixed assignment)
- Super Admin bisa kelola semua users
- Role assignment saat create

## 5. Service Catalog & Biaya Jasa Module
- Master services (11 jenis layanan STNK)
- Tenant services: enable/disable per tenant
- Pricing per tenant per service
- Default services bisa di-set oleh super admin
- **Pricing hierarchy**:
  - Owner bisa set harga ke seluruh tenant sekaligus (bulk) via `POST /owner/services/bulk-pricing`
  - Owner bisa set harga per tenant individual
  - Admin User bisa set harga khusus untuk tenant-nya sendiri
  - Conflict resolution: override per-tenant menang atas harga bulk/global
  - Owner bisa reset harga tenant ke harga global kapan saja
  - Field `price_source` mencatat siapa yang terakhir set harga

## 6. Transaction Module
- Input transaksi (customer, vehicle, service, tenant)
- State machine enforcement
- Status update dengan notes
- Transaction status log (audit trail)
- Filter/search berkas by status, date, tenant

## 7. Customer & Vehicle Module
- Customer data per tenant (name, phone, plate)
- Vehicle data linked to customer
- Reuse customer/vehicle data untuk transaksi berikutnya

## 8. Monitoring Module
- Public page, no auth required
- Unique monitoring token per transaksi
- Progress stepper visualization
- Info: service, status, biaya, estimasi

## 9. WhatsApp Template Module
- Generate template message dari data transaksi
- Format wa.me link dengan URL-encoded message
- Copy-paste workflow (manual send)

## 10. Dashboard Module
- Role-specific dashboard views
- Super Admin: global stats
- Owner: per-tenant revenue & berkas summary
- Admin User: own tenant stats

## 11. Settings Module
- Super Admin: platform config, service catalog master
- Owner: profile, tenant settings
- Admin User: profile
