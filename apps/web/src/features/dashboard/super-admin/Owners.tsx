import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { SubscriptionTier } from '@stnk/contracts'
import { PageHeader } from '../../../components/shared/PageHeader'
import { Card, CardContent, Badge, Button, Input } from '../../../components/ui'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { api } from '../../../lib/api'

interface Owner {
  id: string
  name: string
  email: string
  phone: string
  status: string
  subscription_tier: SubscriptionTier
  tenant_count: number
  created_at: string
}

const tierColors: Record<SubscriptionTier, string> = {
  free: 'bg-slate-100 text-slate-700',
  pro: 'bg-blue-100 text-blue-700',
  plus: 'bg-purple-100 text-purple-700',
  expert: 'bg-amber-100 text-amber-700',
}

export function OwnersPage() {
  const [search, setSearch] = useState('')
  const [owners, setOwners] = useState<Owner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOwners()
  }, [])

  const fetchOwners = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get('/api/v1/admin/owners')
      setOwners(res.data.data ?? [])
    } catch {
      setError('Gagal memuat data owner')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOwners = owners.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <PageHeader
        title="Kelola Owner"
        description="Lihat dan kelola semua owner biro jasa"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input
            placeholder="Cari owner berdasarkan nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-slate-500">Memuat data...</p>
            </div>
          ) : filteredOwners.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">
                {search ? 'Tidak ada owner yang cocok' : 'Belum ada owner yang terdaftar'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 font-medium text-slate-600">Nama</th>
                    <th className="text-left py-3 px-2 font-medium text-slate-600">Email</th>
                    <th className="text-center py-3 px-2 font-medium text-slate-600">Tier</th>
                    <th className="text-center py-3 px-2 font-medium text-slate-600">Tenant</th>
                    <th className="text-center py-3 px-2 font-medium text-slate-600">Status</th>
                    <th className="text-right py-3 px-2 font-medium text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOwners.map((owner) => (
                    <tr key={owner.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-2 font-medium">{owner.name}</td>
                      <td className="py-3 px-2 text-slate-600">{owner.email}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={tierColors[owner.subscription_tier]}>
                          {owner.subscription_tier.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">{owner.tenant_count}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={owner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {owner.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Link to={`/super-admin/owners/${owner.id}`}>
                          <Button variant="ghost" className="text-xs">
                            Detail & Subscription →
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
