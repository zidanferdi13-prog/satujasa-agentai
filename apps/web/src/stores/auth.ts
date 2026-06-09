import { create } from 'zustand'
import type { ApplicationRole } from '@stnk/contracts'

export interface AuthState {
  token: string | null
  role: ApplicationRole | null
  userId: string | null
  isLoading: boolean
  error: string | null
  setAuth: (token: string, role: ApplicationRole, userId: string) => void
  setToken: (token: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  restore: () => void
}

export const authStore = create<AuthState>((set) => ({
  token: localStorage.getItem('stnk_token'),
  role: (localStorage.getItem('stnk_role') as ApplicationRole) || null,
  userId: localStorage.getItem('stnk_userId'),
  isLoading: false,
  error: null,

  setAuth: (token, role, userId) => {
    localStorage.setItem('stnk_token', token)
    localStorage.setItem('stnk_role', role)
    localStorage.setItem('stnk_userId', userId)
    set({ token, role, userId, error: null })
  },

  setToken: (token) => {
    localStorage.setItem('stnk_token', token)
    set({ token })
  },

  setLoading: (isLoading) => {
    set({ isLoading })
  },

  setError: (error) => {
    set({ error })
  },

  logout: () => {
    localStorage.removeItem('stnk_token')
    localStorage.removeItem('stnk_role')
    localStorage.removeItem('stnk_userId')
    set({ token: null, role: null, userId: null, error: null })
  },

  restore: () => {
    const token = localStorage.getItem('stnk_token')
    const role = localStorage.getItem('stnk_role') as ApplicationRole
    if (token && role) {
      set({ token, role })
    }
  },
}))
