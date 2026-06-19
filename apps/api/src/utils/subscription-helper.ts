import type { SubscriptionTier } from '@stnk/contracts'
import { TIER_DEFAULTS } from '@stnk/contracts'

/**
 * Calculate expires_at timestamp based on duration in months.
 * Uses setMonth() to handle month boundaries correctly.
 */
export function calculateExpiresAt(durationMonths: number): Date {
  const now = new Date()
  const expiresAt = new Date(now)
  expiresAt.setMonth(expiresAt.getMonth() + durationMonths)
  return expiresAt
}

/**
 * Price per month for each subscription tier.
 * Free tier: 0 (no charge)
 * Pro: 49,999
 * Plus: 99,999
 * Expert: Use 0 as default (should be set per owner)
 */
export const TIER_PRICES: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 49.999,
  plus: 99.999,
  expert: 0, // Custom pricing per owner
}

/**
 * Calculate total price for a subscription tier and duration.
 * Formula: price_per_month × duration_months
 */
export function calculateTotalPrice(tier: SubscriptionTier, durationMonths: number): number {
  const pricePerMonth = TIER_PRICES[tier]
  return pricePerMonth * durationMonths
}

/**
 * Determine subscription status based on expires_at.
 * Free tier: always 'active'
 * Other tiers: 'active' if expires_at > NOW(), 'expired' if < NOW(), 'inactive' if null
 */
export function getSubscriptionStatus(tier: SubscriptionTier, expiresAt: Date | null): 'active' | 'expired' | 'inactive' {
  if (tier === 'free') return 'active'
  if (!expiresAt) return 'inactive'
  return expiresAt > new Date() ? 'active' : 'expired'
}

/**
 * Get tier defaults (max_tenants, max_admin_users) for a given tier.
 * For Expert tier, allow override. For others, use hardcoded defaults.
 */
export function getTierDefaults(tier: SubscriptionTier, customMaxTenants?: number, customMaxAdminUsers?: number) {
  if (tier === 'expert') {
    return {
      max_tenants: customMaxTenants ?? TIER_DEFAULTS.expert.max_tenants,
      max_admin_users: customMaxAdminUsers ?? TIER_DEFAULTS.expert.max_admin_users,
    }
  }
  return TIER_DEFAULTS[tier]
}
