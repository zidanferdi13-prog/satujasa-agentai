import { Navigate } from 'react-router-dom'
import type { ApplicationRole } from '@stnk/contracts'
import { authStore } from '../stores/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ApplicationRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { token, role, isLoading } = authStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-slate-500 mt-3">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!token || !role) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role as ApplicationRole)) {
    // Redirect to appropriate dashboard based on role
    const redirectMap: Record<string, string> = {
      'super-admin': '/super-admin/dashboard',
      owner: '/owner/dashboard',
      'admin-user': '/admin-user/dashboard',
    }
    return <Navigate to={redirectMap[role] ?? '/'} replace />
  }

  return <>{children}</>
}
