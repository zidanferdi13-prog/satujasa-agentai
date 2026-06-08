import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { ApplicationRole } from '@stnk/contracts'
import type { AppConfig } from '../config.js'

export interface AuthPayload {
  userId: string
  email: string
  role: ApplicationRole
  ownerId: string | null
  tenantId: string | null
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload
      config?: AppConfig
    }
  }
}

export function authMiddleware(config: AppConfig) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    // Also check cookie
    const cookieToken = (req as unknown as { cookies?: Record<string, string> }).cookies?.['access_token']
    const finalToken = token || cookieToken

    if (!finalToken) {
      res.status(401).json({ error: 'authentication_required' })
      return
    }

    try {
      const payload = jwt.verify(finalToken, config.JWT_SECRET) as AuthPayload
      req.user = payload
      req.config = config
      next()
    } catch {
      res.status(401).json({ error: 'invalid_or_expired_token' })
    }
  }
}

export function requireRole(...roles: ApplicationRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'authentication_required' })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'forbidden', details: { required: roles, current: req.user.role } })
      return
    }

    next()
  }
}
