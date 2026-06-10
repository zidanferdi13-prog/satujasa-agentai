import type { Request, Response, NextFunction } from 'express'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(opts: { windowMs: number; max: number }) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown'
    const now = Date.now()
    const entry = rateLimitMap.get(key)

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + opts.windowMs })
      next()
      return
    }

    if (entry.count >= opts.max) {
      res.status(429).json({ error: 'too_many_requests' })
      return
    }

    entry.count++
    next()
  }
}

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key)
    }
  }
}, 60_000)
