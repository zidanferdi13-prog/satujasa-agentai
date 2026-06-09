import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { SubscriptionTier } from '@stnk/contracts'
import { TIER_DEFAULTS } from '@stnk/contracts'
import { PageHeader } from '../../../components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from '../../../components/ui'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { api } from '../../../lib/api'

interface OwnerDetail {
  id: string
  name: string
  email: string
  phone: string
  status: string
  created_at: string
  subscription: {
    id: string
    tier: SubscriptionTier
    max_tenants: number
    max_admin_users: number
    activated_at: string | null
  }
  tenant_count: number
  admin_user_count: number
}

const tierColors: Record<SubscriptionTier, string> = {
  free: 'bg-slate-100 text-slate-700',
  pro: 'bg-blue-100 text-blue-700',
  plus: 'bg-purple-100 text-purple-700',
  expert: 'bg-amber-100 text-amber-700',
}

export function OwnerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [owner, setOwner] = useState<OwnerDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Subscription form
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('free')
  const [maxTenants, setMaxTenants] = useState(0)
  const [maxAdminUsers, setMaxAdminUsers] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    fetchOwner()
  }, [id])

  const fetchOwner = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get(`/api/v1/admin/owners/${id}`)
      const data = res.data.data
      setOwner(data)
      setSelectedTier(data.subscription?.tier ?? 'free')
      setMaxTenants(data.subscription?.max_tenants ?? 0)
      setMaxAdminUsers(data.subscription?.max_admin_users ?? 0)
    } catch {
      setError('Gagal memuat data owner')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTierChange = (tier: SubscriptionTier) => {
    setSelectedTier(tier)
    if (tier !== 'expert') {
      const defaults = TIER_DEFAULTS[tier]
      setMaxTenants(defaults.max_tenants)
      setMaxAdminUsers(defaults.max_admin_users)
    }
    setSaveSuccess(false)
  }

  const handleSaveSubscription = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      await api.post(`/api/v1/admin/owners/${id}/subscription`, {
        tier: selectedTier,
        max_tenants: maxTenants,
        max_admin_users: maxAdminUsers,
      })
      setSaveSuccess(true)
      fetchOwner()
    } catch {
      setError('Gagal menyimpan subscription')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Memuat data...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !owner) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-red-600">{error || 'Owner tidak ditemukan'}</p>
          <Button onClick={() => navigate('/super-admin/owners')}>Kembali</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Detail Owner"
        description={owner.name}
        action={<Button variant="ghost" onClick={() => navigate('/super-admin/owners')}>← Kembali</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Owner Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Nama</p>
                  <p className="font-medium">{owner.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{owner.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Telepon</p>
                  <p className="font-medium">{owner.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <Badge className={owner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {owner.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tenant Aktif</p>
                  <p className="font-medium">{owner.tenant_count}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Admin User</p>
                  <p className="font-medium">{owner.admin_user_count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Management */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kelola Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current tier */}
              <div>
                <p className="text-sm text-slate-500 mb-1">Tier Saat Ini</p>
                <Badge className={tierColors[owner.subscription?.tier ?? 'free']}>
                  {(owner.subscription?.tier ?? 'free').toUpperCase()}
                </Badge>
              </div>

              {/* Tier selection */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Ubah Tier</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['free', 'pro', 'plus', 'expert'] as SubscriptionTier[]).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => handleTierChange(tier)}
                      className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                        selectedTier === tier
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {tier.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Limits */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Max Tenant</label>
                  <Input
                    type="number"
                    min={0}
                    value={maxTenants}
                    onChange={(e) => setMaxTenants(Number(e.target.value))}
                    disabled={selectedTier !== 'expert'}
                  />
                  {selectedTier !== 'expert' && (
                    <p className="text-xs text-slate-400 mt-1">Fixed untuk tier {selectedTier}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Max Admin User</label>
                  <Input
                    type="number"
                    min={0}
                    value={maxAdminUsers}
                    onChange={(e) => setMaxAdminUsers(Number(e.target.value))}
                    disabled={selectedTier !== 'expert'}
                  />
                  {selectedTier !== 'expert' && (
                    <p className="text-xs text-slate-400 mt-1">Fixed untuk tier {selectedTier}</p>
                  )}
                </div>
              </div>

              {/* Save */}
              {saveSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
                  ✅ Subscription berhasil diupdate!
                </div>
              )}

              <Button
                onClick={handleSaveSubscription}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Subscription'}
              </Button>
            </CardContent>
          </Card>

          {/* Tier Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Info Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs text-slate-600">
                <p><strong>Free:</strong> Preview only, tidak bisa action</p>
                <p><strong>Pro:</strong> 1 tenant, 1 admin user</p>
                <p><strong>Plus:</strong> 3 tenant, 3 admin user</p>
                <p><strong>Expert:</strong> Custom limit oleh Super Admin</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
