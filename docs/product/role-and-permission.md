# Role & Permission

## Role Hierarchy

```
SUPER_ADMIN (platform owner — single user)
└── OWNER (biro jasa owner, subscribes to a plan)
    └── ADMIN_USER (staff, assigned to exactly 1 tenant)
```

## Role Descriptions

### Super Admin
- Pemilik dan pengelola platform SatuJasa
- Single user (tidak ada registrasi super admin)
- Akses semua data tanpa filter tenant
- Mengelola: owners, subscriptions, service catalog, platform settings
- Bisa manual assign/upgrade subscription ke owner manapun

### Owner
- Pemilik biro jasa STNK
- Mendaftar sendiri → akun langsung **aktif** dengan tier **Free**
- Free tier: bisa login, lihat semua menu & dashboard (preview only), tapi **tidak bisa**:
  - Assign admin user
  - Add/create tenant
  - Input transaksi
- Subscription diaktifkan/upgrade oleh Super Admin
- Mengelola tenant dan admin user sesuai limit subscription
- Bisa input transaksi dengan memilih tenant
- Bisa set biaya jasa ke seluruh tenant (bulk) atau per tenant individual

### Admin User
- Staff operasional biro jasa
- Dibuat oleh Owner dan di-assign ke 1 tenant
- Hanya bisa akses data dalam tenant-nya
- Input transaksi (auto-assigned ke tenant-nya)
- Update status berkas
- Bisa set biaya jasa khusus untuk tenant-nya sendiri

## Permission Matrix

| Fitur | Super Admin | Owner (Free) | Owner (Pro/Plus/Expert) | Admin User |
|-------|:-----------:|:------------:|:-----------------------:|:----------:|
| Login | ✅ | ✅ | ✅ | ✅ |
| Lihat Menu & Dashboard | ✅ | ✅ (preview only) | ✅ | ✅ |
| Kelola Owner | ✅ | ❌ | ❌ | ❌ |
| Kelola Subscription | ✅ | ❌ | ❌ | ❌ |
| Buat Tenant | ✅ | ❌ | ✅ | ❌ |
| Buat Admin User | ✅ | ❌ | ✅ | ❌ |
| Buat Transaksi | ✅ | ❌ | ✅ | ✅ |
| Lihat Laporan | ✅ | ❌ (preview only) | ✅ | Tenant only |
| Setting Platform | ✅ | ❌ | ❌ | ❌ |
| Setting Jasa — per tenant | ✅ | ❌ | ✅ | ✅ (own tenant) |
| Setting Jasa — bulk semua tenant | ✅ | ❌ | ✅ | ❌ |
| Monitoring Page | Public | Public | Public | Public |

## Data Access Rules

```
Super Admin  → all data, no tenant filter
Owner        → tenants WHERE owner_id = current_user.id
               admin_users WHERE owner_id = current_user.id
               transactions WHERE tenant_id IN (owned tenants)
Admin User   → transactions WHERE tenant_id = current_user.tenant_id
               customers WHERE tenant_id = current_user.tenant_id
```

## Subscription Limits

| Tier | Max Tenants | Max Admin Users | Can Create Transaction |
|------|:-----------:|:---------------:|:----------------------:|
| Free | 0 | 0 | ❌ |
| Pro | 1 | 1 | ✅ |
| Plus | 3 | 3 | ✅ |
| Expert | Custom (set by Super Admin) | Custom (set by Super Admin) | ✅ |

## Enforcement Rules

1. Owner Free: bisa login & lihat semua menu, tapi semua action disabled (create tenant, assign admin, input transaksi)
2. Owner Pro/Plus: create tenant/admin user di-block jika sudah mencapai limit
3. Owner Expert: limit dinamis, di-set oleh Super Admin via `max_tenants` dan `max_admin_users`
4. Admin User: semua query WAJIB filter by `tenant_id = user.tenant_id`
5. Owner: semua query WAJIB filter by `owner_id = user.id`
6. Super Admin: no filter, tapi tetap validasi input

## Biaya Jasa (Pricing) Rules

1. Owner bisa set harga jasa ke seluruh tenant sekaligus (bulk) atau per tenant individual
2. Admin User bisa set harga jasa khusus untuk tenant-nya sendiri
3. Conflict resolution: jika Owner set global lalu Admin User override per-tenant → yang berlaku adalah harga per-tenant
4. Owner bisa reset harga tenant ke harga global kapan saja (override Admin User)
5. Field `price_source` di `tenant_services` menandai siapa yang terakhir set: `owner` atau `admin-user`

## Assignment Rule

- 1 Admin User = 1 Tenant (kolom `tenant_id` di tabel `users`)
- Jika owner butuh 1 orang handle 2 tenant → buat 2 akun admin user terpisah
- Multi-tenant admin user dipertimbangkan untuk Phase 2
