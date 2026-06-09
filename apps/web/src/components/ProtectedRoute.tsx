import { Navigate } from 'react-router-dom'
import type { ApplicationRole } from '@stnk/contracts'
import { authStore } from '../stores/auth'
import { LoadingSpinner } from '../components/shared/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ApplicationRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { token, role, isLoading } = authStore()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!token || !role) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
