# Business Requirements

## BR-01: Multi-Tenant Architecture
- Setiap owner dapat memiliki lebih dari satu tenant (cabang/kantor)
- Data antar tenant terisolasi sempurna
- Admin user hanya bisa akses 1 tenant yang di-assign
- Jumlah tenant dibatasi oleh subscription tier owner

## BR-02: Registration & Subscription Management
- Owner mendaftar sendiri → akun langsung **aktif** dengan tier **Free**
- Free tier: bisa login dan lihat semua menu (preview), tapi **tidak bisa**:
  - Assign admin user ke tenant
  - Add/create tenant
  - Input transaksi
- Super Admin mengaktifkan/upgrade subscription secara manual (belum ada payment gateway)
- Subscription menentukan limit tenant dan admin user
- Tiers:
  - Free: 0 tenant, 0 admin user, dashboard preview only
  - Pro: 1 tenant, 1 admin user, full access
  - Plus: 3 tenant, 3 admin user (1 per tenant), full access
  - Expert: custom limit, di-set oleh Super Admin per owner

## BR-03: Transaction Lifecycle
- Setiap transaksi mengikuti state machine yang terdefinisi
- Status: received → document_check → payment_pending → processing → at_samsat → done
- Loop: document_check ↔ needs_revision
- Cancel bisa dari semua status kecuali done
- Setiap perubahan status tercatat di log dengan who/when/notes

## BR-04: Customer Transparency
- Customer menerima link monitoring unik (UUID token)
- Halaman monitoring public, tidak perlu login
- Menampilkan: layanan, status progress, biaya total, estimasi selesai

## BR-05: Service Catalog & Biaya Jasa
- 11 jenis layanan STNK tersedia
- Layanan bisa di-enable/disable per tenant
- Harga per layanan ditentukan per tenant
- **Pricing hierarchy**:
  - Owner bisa set harga ke seluruh tenant sekaligus (bulk) atau per tenant individual
  - Admin User bisa set harga khusus untuk tenant-nya sendiri
  - Jika Owner set global lalu Admin User override → harga per-tenant yang berlaku (override menang)
  - Owner bisa reset harga tenant ke harga global kapan saja
  - Field `price_source` mencatat siapa yang terakhir set harga (`owner` atau `admin-user`)

## BR-06: Role-Based Access
- 3 role: Super Admin, Owner, Admin User
- Setiap role hanya bisa akses fitur dan data sesuai permission matrix
- Tenant isolation enforced di level middleware

## BR-07: WhatsApp Notification (Manual)
- Sistem generate template pesan WhatsApp
- Owner/admin user copy-paste dan kirim manual via wa.me link
- Tidak ada integrasi WA API di Phase 1

## BR-08: Reporting
- Super Admin: revenue global, jumlah owner/user aktif
- Owner: revenue per tenant, jumlah berkas aktif/selesai
- Admin User: revenue dan berkas untuk tenant-nya saja
- Owner Free: preview only (data sample)

## BR-09: Data Integrity
- Soft delete untuk semua entitas (recovery & audit trail)
- UUID v7 untuk semua primary keys (sortable by time)
- Audit log untuk perubahan status transaksi

## BR-10: Security
- Session-based auth (httpOnly cookie + JWT refresh)
- Rate limiting pada auth endpoints
- Input validation (zod) pada semua endpoint
- CORS restricted
- Tidak ada secret di public channel
