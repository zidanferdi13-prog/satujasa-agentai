// ─── Roles ───────────────────────────────────────────────────────────────────
export const applicationRoles = ['super-admin', 'owner', 'admin-user'] as const
export type ApplicationRole = (typeof applicationRoles)[number]

// ─── Subscription Tiers ──────────────────────────────────────────────────────
export const subscriptionTiers = ['free', 'pro', 'plus', 'expert'] as const
export type SubscriptionTier = (typeof subscriptionTiers)[number]

export interface SubscriptionLimits {
  tier: SubscriptionTier
  max_tenants: number
  max_admin_users: number
}

export const TIER_DEFAULTS: Record<SubscriptionTier, { max_tenants: number; max_admin_users: number }> = {
  free: { max_tenants: 0, max_admin_users: 0 },
  pro: { max_tenants: 1, max_admin_users: 1 },
  plus: { max_tenants: 3, max_admin_users: 3 },
  expert: { max_tenants: 99, max_admin_users: 99 },
}

// ─── Transaction Statuses ────────────────────────────────────────────────────
export const transactionStatuses = [
  'received',
  'document_check',
  'payment_pending',
  'processing',
  'at_samsat',
  'needs_revision',
  'done',
  'cancelled',
] as const
export type TransactionStatus = (typeof transactionStatuses)[number]

export const VALID_TRANSITIONS: Record<TransactionStatus, TransactionStatus[]> = {
  received: ['document_check', 'cancelled'],
  document_check: ['payment_pending', 'needs_revision', 'cancelled'],
  payment_pending: ['processing', 'cancelled'],
  processing: ['at_samsat', 'cancelled'],
  at_samsat: ['done', 'cancelled'],
  needs_revision: ['document_check', 'cancelled'],
  done: [],
  cancelled: [],
}

// ─── Service Catalog ─────────────────────────────────────────────────────────
export interface ServiceDefinition {
  code: string
  name: string
  description: string
}

export const DEFAULT_SERVICES: ServiceDefinition[] = [
  { code: 'perpanjang-tahunan', name: 'Perpanjang Tahunan STNK', description: 'Perpanjangan tahunan STNK kendaraan' },
  { code: 'perpanjang-5tahun', name: 'Perpanjang 5 Tahun (Ganti Plat)', description: 'Perpanjangan 5 tahunan dengan penggantian plat nomor' },
  { code: 'balik-nama', name: 'Balik Nama (BBN-KB) Satu Samsat', description: 'Proses balik nama kendaraan dalam satu wilayah samsat' },
  { code: 'mutasi-keluar', name: 'Mutasi Keluar (Cabut Berkas)', description: 'Proses mutasi keluar atau cabut berkas kendaraan' },
  { code: 'mutasi-masuk', name: 'Mutasi Masuk', description: 'Proses mutasi masuk kendaraan dari daerah lain' },
  { code: 'stnk-hilang', name: 'STNK Hilang (Duplikat)', description: 'Pengurusan STNK hilang atau pembuatan duplikat' },
  { code: 'bpkb-hilang', name: 'BPKB Hilang (Duplikat)', description: 'Pengurusan BPKB hilang atau pembuatan duplikat' },
  { code: 'rubah-warna', name: 'Rubah Warna / Bentuk', description: 'Pengurusan perubahan warna atau bentuk kendaraan' },
  { code: 'kendaraan-baru', name: 'Kendaraan Baru (Daftar Pertama)', description: 'Pendaftaran kendaraan baru pertama kali' },
  { code: 'blokir-unblokir', name: 'Blokir / Unblokir STNK', description: 'Proses blokir atau unblokir STNK kendaraan' },
  { code: 'nopol-pilihan', name: 'Nopol Pilihan (Plat Cantik)', description: 'Pengurusan nomor polisi pilihan atau plat cantik' },
]

// ─── API Response Types ──────────────────────────────────────────────────────
export interface HealthResponse {
  service: 'stnk-jasa-api'
  status: 'ok'
  timestamp: string
}

export interface RolesResponse {
  roles: ApplicationRole[]
}

export interface ErrorResponse {
  error: string
  details?: Record<string, unknown>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// ─── Auth Types ──────────────────────────────────────────────────────────────
export interface RegisterRequest {
  email: string
  phone: string
  password: string
  name?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    phone: string
    role: ApplicationRole
  }
  accessToken: string
}

// ─── User Types ──────────────────────────────────────────────────────────────
export interface UserDTO {
  id: string
  email: string
  phone: string
  role: ApplicationRole
  owner_id: string | null
  tenant_id: string | null
  created_at: string
}

// ─── Tenant Types ────────────────────────────────────────────────────────────
export interface TenantDTO {
  id: string
  name: string
  owner_id: string
  created_at: string
}

export interface CreateTenantRequest {
  name: string
}

// ─── Subscription Types ──────────────────────────────────────────────────────
export interface SubscriptionDTO {
  id: string
  owner_id: string
  tier: SubscriptionTier
  max_tenants: number
  max_admin_users: number
  activated_by: string
  activated_at: string
  created_at: string
}

export interface UpdateSubscriptionRequest {
  tier: SubscriptionTier
  max_tenants?: number
  max_admin_users?: number
}

// ─── Service Types ───────────────────────────────────────────────────────────
export interface ServiceDTO {
  id: string
  code: string
  name: string
  description: string
  is_default: boolean
}

export interface TenantServiceDTO {
  id: string
  tenant_id: string
  service_id: string
  service_code: string
  service_name: string
  price: string
  is_active: boolean
}

export interface SetTenantServiceRequest {
  service_id: string
  price: number
  is_active: boolean
}

// ─── Customer Types ──────────────────────────────────────────────────────────
export interface CustomerDTO {
  id: string
  tenant_id: string
  name: string
  phone: string
  plate_number: string
  vehicle_type: string
}

// ─── Transaction Types ───────────────────────────────────────────────────────
export interface TransactionDTO {
  id: string
  tenant_id: string
  customer_id: string
  service_id: string
  created_by: string
  status: TransactionStatus
  total_cost: string
  additional_cost: string
  notes: string | null
  monitoring_token: string
  created_at: string
  updated_at: string
}

export interface CreateTransactionRequest {
  tenant_id?: string
  customer_name: string
  customer_phone: string
  vehicle_plate: string
  vehicle_type_code?: VehicleTypeCode
  province_code?: string
  city_code?: string
  city_name?: string
  tax_due_date?: string
  service_id: string
  total_cost?: number
  additional_cost?: number
  fee_details?: CreateTransactionFeeDetail[]
  notes?: string
}

export const vehicleTypeCodes = ['MOTOR', 'MOBIL', 'PICKUP', 'TRUK', 'BUS', 'LAINNYA'] as const
export type VehicleTypeCode = (typeof vehicleTypeCodes)[number]

export interface TransactionRequirementFee {
  componentCode: string
  componentName: string
  defaultAmount: string
  amount: string
  isEditable: boolean
  source: string
  sortOrder: number
}

export interface TransactionRequirementDocument {
  documentCode: string
  documentName: string
  isRequired: boolean
  sortOrder: number
}

export interface TransactionRequirementsResponse {
  service: { id: string; code: string; name: string }
  vehicleType: { code: VehicleTypeCode; name: string; priceGroup: string }
  provinceCode: string
  cityCode: string | null
  fees: TransactionRequirementFee[]
  documents: TransactionRequirementDocument[]
}

export interface CreateTransactionFeeDetail {
  component_code: string
  amount: number
}

export interface TransactionFeeSnapshot {
  id: string
  transaction_item_id: string
  component_code: string
  component_name: string
  default_amount: string
  amount: string
  is_editable: boolean
  source: string
  sort_order: number
  notes: string | null
}

export interface TransactionDocumentChecklistSnapshot {
  id: string
  transaction_item_id: string
  document_code: string
  document_name: string
  is_required: boolean
  is_checked: boolean
  sort_order: number
}

export interface UpdateTransactionStatusRequest {
  status: TransactionStatus
  notes?: string
}

export interface MonitoringResponse {
  service_name: string
  status: TransactionStatus
  total_cost: string
  additional_cost: string
  customer_name: string
  plate_number: string
  tenant_name: string
  created_at: string
  updated_at: string
  status_history: {
    from_status: TransactionStatus | null
    to_status: TransactionStatus
    changed_at: string
    notes: string | null
  }[]
}

export interface WhatsAppLink {
  url: string
  template: string
}

// ─── Dashboard Types ─────────────────────────────────────────────────────────
export interface SuperAdminDashboard {
  total_owners: number
  active_owners: number
  total_tenants: number
  total_transactions: number
  total_revenue: string
}

export interface OwnerDashboard {
  total_tenants: number
  total_transactions: number
  active_transactions: number
  total_revenue: string
  revenue_per_tenant: { tenant_id: string; tenant_name: string; revenue: string }[]
}

export interface AdminUserDashboard {
  total_transactions: number
  active_transactions: number
  done_transactions: number
  total_revenue: string
}
