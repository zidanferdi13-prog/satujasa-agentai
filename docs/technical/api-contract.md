# API Contract

Base URL: `/api/v1`

All responses follow this format:
```json
{
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

Error responses:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

---

## Auth

### POST /auth/register
Owner registration (enters Free tier, account immediately active).

**Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```

**Response:** `201` — user object (without password_hash) + subscription (tier: free)

**Notes:**
- Akun langsung aktif, bisa login
- Otomatis create subscription record dengan tier Free
- Free tier: bisa lihat semua menu tapi tidak bisa melakukan action (create tenant, assign admin, input transaksi)

---

### POST /auth/login
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200` — user object + sets httpOnly session cookie

---

### POST /auth/logout
**Response:** `200` — clears session

---

### POST /auth/refresh
**Response:** `200` — new access token

---

## Super Admin

### GET /admin/dashboard
Global stats: total revenue, active owners, active users, pending transactions.

### GET /admin/owners
List all owners. Supports `?page=&limit=&search=&status=`

### GET /admin/owners/:id
Owner detail including subscription info.

### PATCH /admin/owners/:id
Update owner status (activate/deactivate).

### GET /admin/owners/:id/subscription
Current subscription for owner.

### POST /admin/owners/:id/subscription
Create/upgrade subscription.
```json
{
  "tier": "pro|plus|expert",
  "max_tenants": 1,
  "max_admin_users": 1,
  "duration_months": 6
}
```

**Notes:**
- `duration_months`: 1–12 (default: 1)
- Untuk tier Pro: `max_tenants=1`, `max_admin_users=1` (fixed)
- Untuk tier Plus: `max_tenants=3`, `max_admin_users=3` (fixed)
- Untuk tier Expert: `max_tenants` dan `max_admin_users` di-set custom oleh Super Admin (bisa lebih dari 3)
- Saat upgrade, owner langsung bisa akses fitur sesuai tier baru

### GET /admin/subscription-logs
Get subscription history and revenue summary.
Query: `page`, `limit`, `tier`, `owner_id`, `date_from`, `date_to`.
Response: list of subscription changes + summary revenue/tier distribution.

### PATCH /admin/owners/:id/subscription
Modify existing subscription limits.

### GET /admin/settings
Platform settings.

### PATCH /admin/settings
Update platform settings.

---

## Owner

### GET /owner/dashboard
Revenue per tenant, total active berkas, monthly summary.

### GET /owner/tenants
List own tenants. Supports `?page=&limit=&search=`

### POST /owner/tenants
Create tenant (enforces subscription limit).
```json
{
  "name": "string",
  "address": "string",
  "phone": "string"
}
```

### PATCH /owner/tenants/:id
Update tenant info.

### DELETE /owner/tenants/:id
Soft delete tenant (fails if active transactions exist).

### GET /owner/tenants/:id/admin-users
List admin users for a tenant.

### POST /owner/tenants/:id/admin-users
Create admin user (enforces subscription limit).
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```

### PATCH /owner/admin-users/:id
Update admin user.

### DELETE /owner/admin-users/:id
Soft delete admin user.

### GET /owner/tenants/:id/services
List tenant services with pricing.

### POST /owner/tenants/:id/services
Enable a service for tenant.
```json
{
  "service_id": "uuid",
  "price": 150000
}
```

### PATCH /owner/tenants/:id/services/:serviceId
Update price or toggle active.

### POST /owner/services/bulk-pricing
Set harga jasa ke semua tenant milik owner sekaligus (bulk).
```json
{
  "service_id": "uuid",
  "price": 150000
}
```

**Notes:**
- Set harga untuk 1 service ke semua tenant milik owner
- Semua `tenant_services` yang match akan di-update
- Field `price_source` di-set ke `owner`
- Jika admin user sudah override harga per-tenant sebelumnya, harga tersebut akan di-replace oleh harga bulk ini
- Response mengembalikan jumlah tenant yang ter-update

### POST /owner/transactions
Input transaction (owner selects tenant).
```json
{
  "tenant_id": "uuid",
  "customer": { "name": "string", "phone": "string", "plate_number": "string", "vehicle_type": "string" },
  "service_id": "uuid",
  "total_cost": 350000,
  "notes": "string"
}
```

### GET /owner/transactions
List all transactions across own tenants. Supports `?tenant_id=&status=&page=&limit=&search=`

### GET /owner/transactions/:id
Transaction detail + status log.

### PATCH /owner/transactions/:id/status
Update status.
```json
{
  "status": "document_check",
  "notes": "Dokumen lengkap"
}
```

---

## Admin User

### GET /admin-user/dashboard
Tenant stats: active berkas, done, revenue.

### POST /admin-user/transactions
Input transaction (auto tenant from user context).
```json
{
  "customer": { "name": "string", "phone": "string", "plate_number": "string", "vehicle_type": "string" },
  "service_id": "uuid",
  "total_cost": 350000,
  "notes": "string"
}
```

### GET /admin-user/transactions
List tenant transactions. Supports `?status=&page=&limit=&search=`

### GET /admin-user/transactions/:id
Transaction detail + status log.

### PATCH /admin-user/transactions/:id/status
Update status.

### GET /admin-user/tenant/services
Own tenant services & pricing.

### PATCH /admin-user/tenant/services/:serviceId
Update pricing for own tenant.

**Notes:**
- Admin User hanya bisa update harga untuk tenant-nya sendiri
- Field `price_source` di-set ke `admin-user`
- Owner bisa override harga ini kapan saja via bulk pricing atau per-tenant update

---

## Public

### GET /monitoring/:token
Monitoring page data (no auth).
```json
{
  "data": {
    "service_name": "Perpanjang Tahunan STNK",
    "status": "processing",
    "status_history": [...],
    "total_cost": 350000,
    "additional_cost": 0,
    "tenant_name": "Biro Jasa Mandiri",
    "created_at": "2026-01-15T10:00:00Z"
  }
}
```

### GET /health
Service health check.

---

## Common Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| page | int | Page number (default: 1) |
| limit | int | Items per page (default: 20, max: 100) |
| search | string | Search by name/plate/phone |
| status | string | Filter by status |
| tenant_id | uuid | Filter by tenant (owner only) |
