import type { Request, Response, NextFunction } from 'express'

/**
 * Tenant isolation middleware.
 * Attaches tenant scope information to the request based on user role.
 *
 * - super-admin: no tenant scope (can access all)
 * - owner: scopes to all tenants owned by this user
 * - admin-user: scopes to the single tenant they are assigned to
 */
export function tenantIsolation(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'authentication_required' })
    return
  }

  // Super admin bypasses tenant isolation
  if (req.user.role === 'super-admin') {
    next()
    return
  }

  // Admin user must have a tenant assigned
  if (req.user.role === 'admin-user' && !req.user.tenantId) {
    res.status(403).json({ error: 'no_tenant_assigned' })
    return
  }

  next()
}

/**
 * Helper to get the tenant IDs accessible by the current user.
 * For owner: returns all their tenant IDs (must be resolved from DB).
 * For admin-user: returns their single assigned tenant ID.
 */
export function getUserTenantId(req: Request): string | null {
  if (req.user?.role === 'admin-user') {
    return req.user.tenantId
  }
  return null
}

/**
 * Get the owner ID for subscription/tenant queries.
 * For owner: their own userId.
 * For admin-user: their ownerId field.
 */
export function getOwnerId(req: Request): string | null {
  if (!req.user) return null
  if (req.user.role === 'owner') return req.user.userId
  if (req.user.role === 'admin-user') return req.user.ownerId
  return null
}
