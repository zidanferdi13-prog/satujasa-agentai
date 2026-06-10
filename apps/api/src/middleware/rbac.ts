import type { Request, Response, NextFunction } from 'express'
import type { ApplicationRole } from '@stnk/contracts'

/**
 * Role-based access control middleware.
 * Requires authMiddleware to run first (req.user must exist).
 */
export function requireRole(...roles: ApplicationRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'authentication_required' })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'forbidden',
        details: { required: roles, current: req.user.role },
      })
      return
    }

    next()
  }
}
