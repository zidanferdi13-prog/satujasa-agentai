import type { SubscriptionTier } from '@stnk/contracts'
import { authStore } from '../stores/auth'

interface SubscriptionGateProps {
  tier: SubscriptionTier
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Wraps content that requires a minimum subscription tier
 * Shows upgrade prompt if user tier is insufficient
 */
export function SubscriptionGate({ tier, children, fallback }: SubscriptionGateProps) {
  const tierHierarchy: Record<SubscriptionTier, number> = {
    free: 0,
    pro: 1,
    plus: 2,
    expert: 3,
  }

  // For now, store user tier in auth store (will be replaced with API call)
  const userTier = (authStore().role === 'owner' ? 'free' : 'expert') as SubscriptionTier
  const userLevel = tierHierarchy[userTier]
  const requiredLevel = tierHierarchy[tier]

  if (userLevel >= requiredLevel) {
    return <>{children}</>
  }

  return (
    fallback || (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">Upgrade required</p>
          <p className="text-xs text-slate-500 mt-1">
            This feature requires {tier.toUpperCase()} subscription
          </p>
        </div>
      </div>
    )
  )
}
