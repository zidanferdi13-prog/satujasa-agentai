import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { LandingPage } from '../features/landing/LandingPage'
import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { MonitoringPage } from '../features/monitoring/MonitoringPage'
import { SuperAdminDashboard } from '../features/dashboard/super-admin/Dashboard'
import { OwnersPage } from '../features/dashboard/super-admin/Owners'
import { OwnerDetailPage } from '../features/dashboard/super-admin/OwnerDetail'
import { OwnerDashboard } from '../features/dashboard/owner/Dashboard'
import { AdminUserDashboard } from '../features/dashboard/admin-user/Dashboard'

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/monitoring/:token',
    element: <MonitoringPage />,
  },

  // Super Admin routes
  {
    path: '/super-admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['super-admin']}>
        <SuperAdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/super-admin/owners',
    element: (
      <ProtectedRoute allowedRoles={['super-admin']}>
        <OwnersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/super-admin/owners/:id',
    element: (
      <ProtectedRoute allowedRoles={['super-admin']}>
        <OwnerDetailPage />
      </ProtectedRoute>
    ),
  },

  // Owner routes
  {
    path: '/owner/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <OwnerDashboard />
      </ProtectedRoute>
    ),
  },

  // Admin User routes
  {
    path: '/admin-user/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin-user']}>
        <AdminUserDashboard />
      </ProtectedRoute>
    ),
  },

  // Catch-all
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
