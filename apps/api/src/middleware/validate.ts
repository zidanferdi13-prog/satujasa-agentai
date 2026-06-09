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
})

// ─── Subscription Schemas ────────────────────────────────────────────────────
export const updateSubscriptionSchema = z.object({
  tier: z.enum(['free', 'pro', 'plus', 'expert']),
  max_tenants: z.number().int().min(0).optional(),
  max_admin_users: z.number().int().min(0).optional(),
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

export const updateTransactionStatusSchema = z.object({
  status: z.enum([
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
