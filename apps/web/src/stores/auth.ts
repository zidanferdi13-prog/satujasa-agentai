import { create } from 'zustand'
import type { ApplicationRole, SubscriptionTier } from '@stnk/contracts'

export interface Subscription {
  tier: SubscriptionTier
  max_tenants: number
  max_admin_users: number
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: ApplicationRole
}

export interface AuthState {
  token: string | null
  user: AuthUser | null
  subscription: Subscription | null
  isLoading: boolean
  error: string | null

  // Derived helpers
  role: ApplicationRole | null
  userId: string | null
  isFreeTier: boolean
  canCreateTenant: boolean
  canAssignAdmin: boolean
  canCreateTransaction: boolean

  // Actions
  setAuth: (token: string, user: AuthUser, subscription?: Subscription) => void
  setSubscription: (subscription: Subscription) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  restore: () => void
}

function getStoredAuth() {
  try {
    const token = localStorage.getItem('stnk_token')
    const userStr = localStorage.getItem('stnk_user')
    const subStr = localStorage.getItem('stnk_subscription')
    const user = userStr ? JSON.parse(userStr) : null
    const subscription = subStr ? JSON.parse(subStr) : null
    return { token, user, subscription }
  } catch {
    return { token: null, user: null, subscription: null }
  }
}

function computeDerived(user: AuthUser | null, subscription: Subscription | null) {
  const role = user?.role ?? null
  const userId = user?.id ?? null
  const isFreeTier = role === 'owner' && (!subscription || subscription.tier === 'free')
  const isPaidOwner = role === 'owner' && subscription != null && subscription.tier !== 'free'
  const isSuperAdmin = role === 'super-admin'
  const isAdminUser = role === 'admin-user'

  return {
    role,
    userId,
    isFreeTier,
    canCreateTenant: isSuperAdmin || isPaidOwner,
    canAssignAdmin: isSuperAdmin || isPaidOwner,
    canCreateTransaction: isSuperAdmin || isPaidOwner || isAdminUser,
  }
}

export const authStore = create<AuthState>((set) => {
  const stored = getStoredAuth()
  const derived = computeDerived(stored.user, stored.subscription)

  return {
    token: stored.token,
    user: stored.user,
    subscription: stored.subscription,
    isLoading: false,
    error: null,
    ...derived,

    setAuth: (token, user, subscription) => {
      localStorage.setItem('stnk_token', token)
      localStorage.setItem('stnk_user', JSON.stringify(user))
      if (subscription) {
        localStorage.setItem('stnk_subscription', JSON.stringify(subscription))
      }
      const sub = subscription ?? null
      set({ token, user, subscription: sub, error: null, ...computeDerived(user, sub) })
    },

    setSubscription: (subscription) => {
      localStorage.setItem('stnk_subscription', JSON.stringify(subscription))
      set((state) => ({
        subscription,
        ...computeDerived(state.user, subscription),
      }))
    },

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    logout: () => {
      localStorage.removeItem('stnk_token')
      localStorage.removeItem('stnk_user')
      localStorage.removeItem('stnk_subscription')
      set({
        token: null,
        user: null,
        subscription: null,
        error: null,
        role: null,
        userId: null,
        isFreeTier: false,
        canCreateTenant: false,
        canAssignAdmin: false,
        canCreateTransaction: false,
      })
    },

    restore: () => {
      const stored = getStoredAuth()
      if (stored.token && stored.user) {
        const derived = computeDerived(stored.user, stored.subscription)
        set({ ...stored, ...derived })
      }
    },
  }
})
