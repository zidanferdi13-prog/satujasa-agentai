import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../../components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '../../../components/ui'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { SubscriptionGate } from '../../../components/SubscriptionGate'
import { authStore } from '../../../stores/auth'
import { api } from '../../../lib/api'

interface DashboardData {
  total_tenants: number
  total_transactions: number
  active_transactions: number
  total_revenue: string
}

const tierColors: Record<string, string> = {
  free: 'bg-slate-100 text-slate-700',
  pro: 'bg-blue-100 text-blue-700',
  plus: 'bg-purple-100 text-purple-700',
  expert: 'bg-amber-100 text-amber-700',
}

export function OwnerDashboard() {
  const { subscription, isFreeTier } = authStore()
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/v1/owner/dashboard')
      setDashboard(res.data.data)
    } catch {
      // Dashboard data unavailable — show placeholders
    } finally {
      setIsLoading(false)
    }
  }

  const tier = subscription?.tier ?? 'free'

  return (
    <DashboardLayout>
      <PageHeader title="Dashboard Owner" description="Kelola bisnis dan tenant Anda" />

      {/* Subscription Banner */}
      {isFreeTier && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <p className="font-medium text-amber-800">Akun Anda masih di paket Free</p>
              <p className="text-sm text-amber-700 mt-1">
                Anda bisa melihat semua menu, tapi belum bisa melakukan action (buat tenant, assign admin, input transaksi).
                Hubungi admin platform untuk upgrade subscription.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Info Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-600">Subscription</CardTitle>
            <Badge className={tierColors[tier]}>{tier.toUpperCase()}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-slate-500">Max Tenant:</span>{' '}
              <strong>{subscription?.max_tenants ?? 0}</strong>
            </div>
            <div>
              <span className="text-slate-500">Max Admin User:</span>{' '}
              <strong>{subscription?.max_admin_users ?? 0}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Revenue (Bulan Ini)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : dashboard?.total_revenue ? `Rp ${Number(dashboard.total_revenue).toLocaleString('id-ID')}` : 'Rp 0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Tenant Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : dashboard?.total_tenants ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Transaksi Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : dashboard?.active_transactions ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Kelola Tenant</CardTitle>
            <CardDescription>Tambah dan kelola tenant (cabang) biro jasa Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionGate requiredTier="pro">
              <Link
                to="/owner/tenants"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Lihat Tenant
              </Link>
            </SubscriptionGate>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input Transaksi</CardTitle>
            <CardDescription>Buat transaksi baru untuk pelanggan</CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionGate requiredTier="pro">
              <Link
                to="/owner/transactions/new"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Transaksi Baru
              </Link>
            </SubscriptionGate>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Setting Jasa</CardTitle>
            <CardDescription>Atur biaya jasa per tenant atau semua tenant</CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionGate requiredTier="pro">
              <Link
                to="/owner/services"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Kelola Jasa
              </Link>
            </SubscriptionGate>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kelola Admin User</CardTitle>
            <CardDescription>Assign staff ke tenant Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionGate requiredTier="pro">
              <Link
                to="/owner/admin-users"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Kelola Admin
              </Link>
            </SubscriptionGate>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
