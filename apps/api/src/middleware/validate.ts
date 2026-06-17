import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'

export function validate<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const details = result.error.flatten()
      res.status(400).json({ error: 'validation_error', details })
      return
    }
    req.body = result.data
    next()
  }
}

// ─── Auth Schemas ────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  password: z.string().min(8).max(100),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// ─── Tenant Schemas ──────────────────────────────────────────────────────────
export const createTenantSchema = z.object({
  name: z.string().min(1).max(255),
})

export const updateTenantSchema = z.object({
  name: z.string().min(1).max(255).optional(),
})

// ─── Admin User Schemas ──────────────────────────────────────────────────────
export const createAdminUserSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  password: z.string().min(8).max(100),
  tenant_id: z.string().uuid().optional(),
})

// ─── Subscription Schemas ────────────────────────────────────────────────────
export const updateSubscriptionSchema = z.object({
  tier: z.enum(['free', 'pro', 'plus', 'expert']),
  max_tenants: z.number().int().min(0).optional(),
  max_admin_users: z.number().int().min(0).optional(),
  expires_at: z.string().datetime().nullable().optional(),
})

// ─── Tenant Service Schemas ──────────────────────────────────────────────────
export const setTenantServiceSchema = z.object({
  service_id: z.string().uuid(),
  price: z.number().min(0),
  is_active: z.boolean(),
})

// ─── Transaction Schemas ─────────────────────────────────────────────────────
export const createTransactionSchema = z.object({
  customer_name: z.string().min(1).max(255),
  customer_phone: z.string().min(8).max(20),
  plate_number: z.string().min(1).max(20),
  vehicle_type: z.string().min(1).max(100),
  service_id: z.string().uuid(),
  total_cost: z.number().min(0),
  notes: z.string().max(1000).optional(),
})

export const createAdminTransactionSchema = z.object({
  customer_name: z.string().min(2).max(255),
  customer_phone: z.string().min(10).max(20).refine(
    (v) => v.startsWith('08') || v.startsWith('+62'),
    { message: 'Phone must start with 08 or +62' }
  ),
  vehicle_plate: z.string().min(3).max(12),
  vehicle_type_code: z.string().min(1).max(50).optional(),
  service_id: z.string().uuid(),
  province_code: z.string().min(1).max(50).optional().default('JABAR'),
  city_code: z.string().max(50).optional(),
  city_name: z.string().max(255).optional(),
  tax_due_date: z.string().date().optional(),
  total_cost: z.number().min(0).optional(),
  additional_cost: z.number().min(0).optional().default(0),
  notes: z.string().max(1000).optional(),
  fee_details: z.array(z.object({
    component_code: z.string().min(1).max(100),
    amount: z.number().min(0),
    notes: z.string().max(1000).optional(),
  })).optional(),
}).refine((value) => value.fee_details || value.total_cost !== undefined, {
  message: 'total_cost is required when fee_details is not provided',
  path: ['total_cost'],
})

export const transactionRequirementsQuerySchema = z.object({
  service_id: z.string().uuid(),
  vehicle_type_code: z.string().min(1).max(50),
  province_code: z.string().min(1).max(50).optional().default('JABAR'),
  city_code: z.string().max(50).optional(),
})

export const updateDocumentChecklistSchema = z.object({
  isChecked: z.boolean(),
})

const feeDetailCamelSchema = z.object({
  componentCode: z.string().min(1).max(100),
  amount: z.number().min(0),
})

const feeDetailSnakeSchema = z.object({
  component_code: z.string().min(1).max(100),
  amount: z.number().min(0),
})

export const updateTransactionFeesSchema = z.object({
  feeDetails: z.array(feeDetailCamelSchema).min(1).optional(),
  fee_details: z.array(feeDetailSnakeSchema).min(1).optional(),
}).refine((value) => value.feeDetails || value.fee_details, {
  message: 'feeDetails or fee_details is required',
  path: ['feeDetails'],
})

export const updateTransactionStatusSchema = z.object({
  status: z.enum([
    // New workflow statuses
    'DRAFT',
    'DOKUMEN_DITERIMA',
    'PROSES_SAMSAT',
    'MENUNGGU_PEMBAYARAN',
    'SELESAI',
    'DIBATALKAN',
    // Legacy statuses (accepted for backward compatibility)
    'received',
    'document_check',
    'payment_pending',
    'processing',
    'at_samsat',
    'needs_revision',
    'done',
    'cancelled',
  ]),
  notes: z.string().max(1000).optional(),
})
