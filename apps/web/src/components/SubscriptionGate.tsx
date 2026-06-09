import type { SubscriptionTier } from '@stnk/contracts'
import { authStore } from '../stores/auth'

interface SubscriptionGateProps {
  /** Minimum tier required to see the content */
  requiredTier: SubscriptionTier
  children: React.ReactNode
  fallback?: React.ReactNode
}

const tierHierarchy: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 1,
  plus: 2,
  expert: 3,
}

/**
 * Wraps content that requires a minimum subscription tier.
 * Shows upgrade prompt if user's subscription is insufficient.
 * Super Admin bypasses all gates.
 */
export function SubscriptionGate({ requiredTier, children, fallback }: SubscriptionGateProps) {
  const { role, subscription } = authStore()

  // Super Admin always has access
  if (role === 'super-admin') {
    return <>{children}</>
  }

  // Admin User inherits owner's subscription — they can always act if assigned
  if (role === 'admin-user') {
    return <>{children}</>
  }

  // Owner: check subscription tier
  const userTier = subscription?.tier ?? 'free'
  const userLevel = tierHierarchy[userTier]
  const requiredLevel = tierHierarchy[requiredTier]

  if (userLevel >= requiredLevel) {
    return <>{children}</>
  }

  return (
    fallback || (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
        <div className="text-center">
          <div className="text-2xl mb-2">🔒</div>
          <p className="text-sm font-medium text-slate-700">Fitur Terkunci</p>
          <p className="text-xs text-slate-500 mt-1">
            Fitur ini membutuhkan langganan <span className="font-semibold uppercase">{requiredTier}</span> atau lebih tinggi.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Hubungi admin untuk upgrade langganan Anda.
          </p>
        </div>
      </div>
    )
  )
}
