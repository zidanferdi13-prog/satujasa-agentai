import { useState, useEffect } from 'react'
import type { TenantServiceDTO, TenantDTO } from '@stnk/contracts'
import { PageHeader } from '../../components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '../../components/ui'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { SubscriptionGate } from '../../components/SubscriptionGate'
import { api } from '../../lib/api'

interface TenantWithServices extends TenantDTO {
  services: TenantServiceDTO[]
}

export function OwnerServicesPage() {
  const [tenants, setTenants] = useState<TenantWithServices[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Bulk pricing state
  const [bulkServiceId, setBulkServiceId] = useState('')
  const [bulkPrice, setBulkPrice] = useState('')
  const [isBulkSaving, setIsBulkSaving] = useState(false)
  const [bulkSuccess, setBulkSuccess] = useState<string | null>(null)

  // Per-tenant edit state
  const [editingService, setEditingService] = useState<{ tenantId: string; serviceId: string } | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [isSavingPerTenant, setIsSavingPerTenant] = useState(false)

  // Available services for bulk pricing dropdown
  const [availableServices, setAvailableServices] = useState<{ id: string; code: string; name: string }[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch tenants
      const tenantsRes = await api.get('/api/v1/owner/tenants')
      const tenantList: TenantDTO[] = tenantsRes.data.data ?? []

      // Fetch services for each tenant
      const tenantsWithServices: TenantWithServices[] = await Promise.all(
        tenantList.map(async (tenant) => {
          try {
            const servicesRes = await api.get(`/api/v1/owner/tenants/${tenant.id}/services`)
            return { ...tenant, services: servicesRes.data.data ?? [] }
          } catch {
            return { ...tenant, services: [] }
          }
        })
      )

      setTenants(tenantsWithServices)

      // Collect unique services for bulk dropdown
      const serviceMap = new Map<string, { id: string; code: string; name: string }>()
      for (const t of tenantsWithServices) {
        for (const s of t.services) {
          if (!serviceMap.has(s.service_id)) {
            serviceMap.set(s.service_id, { id: s.service_id, code: s.service_code, name: s.service_name })
          }
        }
      }
      setAvailableServices(Array.from(serviceMap.values()))
    } catch {
      setError('Gagal memuat data layanan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkPricing = async () => {
    if (!bulkServiceId || !bulkPrice) return
    setIsBulkSaving(true)
    setBulkSuccess(null)
    try {
      const res = await api.post('/api/v1/owner/services/bulk-pricing', {
        service_id: bulkServiceId,
        price: Number(bulkPrice),
      })
      const updated = res.data.data?.updated_count ?? tenants.length
      setBulkSuccess(`Harga berhasil diupdate ke ${updated} tenant`)
      setBulkPrice('')
      fetchData() // Refresh
    } catch {
      setError('Gagal menyimpan harga bulk')
    } finally {
      setIsBulkSaving(false)
    }
  }

  const handlePerTenantSave = async (tenantId: string, serviceId: string) => {
    if (!editPrice) return
    setIsSavingPerTenant(true)
    try {
      await api.patch(`/api/v1/owner/tenants/${tenantId}/services/${serviceId}`, {
        price: Number(editPrice),
      })
      setEditingService(null)
      setEditPrice('')
      fetchData()
    } catch {
      setError('Gagal menyimpan harga')
    } finally {
      setIsSavingPerTenant(false)
    }
  }

  const formatRupiah = (value: string | number) => {
    const num = typeof value === 'string' ? Number(value) : value
    return `Rp ${num.toLocaleString('id-ID')}`
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageHeader title="Setting Jasa" description="Atur biaya layanan per tenant" />
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Memuat data...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader title="Setting Jasa" description="Atur biaya layanan per tenant atau semua tenant sekaligus" />

      <SubscriptionGate requiredTier="pro">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Bulk Pricing Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Harga Bulk (Semua Tenant)</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Set harga untuk satu layanan ke semua tenant Anda sekaligus. Harga yang sudah diset oleh admin user akan di-override.
            </p>
          </CardHeader>
          <CardContent>
            {availableServices.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada layanan yang aktif di tenant Anda.</p>
            ) : (
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-48">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Layanan</label>
                  <select
                    value={bulkServiceId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBulkServiceId(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">— Pilih layanan —</option>
                    {availableServices.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-48">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harga (Rp)</label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="150000"
                    value={bulkPrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBulkPrice(e.target.value)}
                  />
                </div>
                <Button onClick={handleBulkPricing} disabled={isBulkSaving || !bulkServiceId || !bulkPrice}>
                  {isBulkSaving ? 'Menyimpan...' : 'Terapkan ke Semua'}
                </Button>
              </div>
            )}

            {bulkSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm mt-4">
                ✅ {bulkSuccess}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Per-Tenant Pricing */}
        {tenants.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-slate-500 text-sm">Belum ada tenant. Buat tenant terlebih dahulu.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {tenants.map((tenant) => (
              <Card key={tenant.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{tenant.name}</CardTitle>
                    <Badge className="bg-slate-100 text-slate-600 text-xs">
                      {tenant.services.length} layanan
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {tenant.services.length === 0 ? (
                    <p className="text-sm text-slate-500">Belum ada layanan aktif untuk tenant ini.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-2 px-2 font-medium text-slate-600">Layanan</th>
                            <th className="text-right py-2 px-2 font-medium text-slate-600">Harga</th>
                            <th className="text-center py-2 px-2 font-medium text-slate-600">Sumber</th>
                            <th className="text-center py-2 px-2 font-medium text-slate-600">Status</th>
                            <th className="text-right py-2 px-2 font-medium text-slate-600">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tenant.services.map((service) => (
                            <tr key={service.id} className="border-b border-slate-100">
                              <td className="py-3 px-2">{service.service_name}</td>
                              <td className="py-3 px-2 text-right">
                                {editingService?.tenantId === tenant.id && editingService.serviceId === service.service_id ? (
                                  <Input
                                    type="number"
                                    min={0}
                                    className="w-32 text-right"
                                    value={editPrice}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditPrice(e.target.value)}
                                    autoFocus
                                  />
                                ) : (
                                  <span className="font-medium">{formatRupiah(service.price)}</span>
                                )}
                              </td>
                              <td className="py-3 px-2 text-center">
                                <Badge className={
                                  (service as TenantServiceDTO & { price_source?: string }).price_source === 'admin-user'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-blue-100 text-blue-700'
                                }>
                                  {(service as TenantServiceDTO & { price_source?: string }).price_source ?? 'owner'}
                                </Badge>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <Badge className={service.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                  {service.is_active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                              </td>
                              <td className="py-3 px-2 text-right">
                                {editingService?.tenantId === tenant.id && editingService.serviceId === service.service_id ? (
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      variant="ghost"
                                      onClick={() => { setEditingService(null); setEditPrice('') }}
                                      className="text-xs"
                                    >
                                      Batal
                                    </Button>
                                    <Button
                                      onClick={() => handlePerTenantSave(tenant.id, service.service_id)}
                                      disabled={isSavingPerTenant}
                                      className="text-xs"
                                    >
                                      Simpan
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    onClick={() => {
                                      setEditingService({ tenantId: tenant.id, serviceId: service.service_id })
                                      setEditPrice(service.price)
                                    }}
                                    className="text-xs"
                                  >
                                    Edit Harga
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SubscriptionGate>
    </DashboardLayout>
  )
}
