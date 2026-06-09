import { useState, useEffect } from 'react'
import type { TenantServiceDTO } from '@stnk/contracts'
import { PageHeader } from '../../components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '../../components/ui'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { api } from '../../lib/api'

export function AdminUserServicesPage() {
  const [services, setServices] = useState<(TenantServiceDTO & { price_source?: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get('/api/v1/admin-user/tenant/services')
      setServices(res.data.data ?? [])
    } catch {
      setError('Gagal memuat data layanan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (serviceId: string) => {
    if (!editPrice) return
    setIsSaving(true)
    setSaveSuccess(null)
    try {
      await api.patch(`/api/v1/admin-user/tenant/services/${serviceId}`, {
        price: Number(editPrice),
      })
      setSaveSuccess('Harga berhasil diupdate')
      setEditingServiceId(null)
      setEditPrice('')
      fetchServices()
    } catch {
      setError('Gagal menyimpan harga')
    } finally {
      setIsSaving(false)
    }
  }

  const formatRupiah = (value: string | number) => {
    const num = typeof value === 'string' ? Number(value) : value
    return `Rp ${num.toLocaleString('id-ID')}`
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Setting Jasa"
        description="Atur biaya layanan untuk tenant Anda"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
          ✅ {saveSuccess}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Layanan Tenant</CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Anda bisa mengubah harga layanan untuk tenant Anda. Owner bisa meng-override harga ini kapan saja.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-slate-500">Memuat data...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">Belum ada layanan aktif untuk tenant Anda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 font-medium text-slate-600">Layanan</th>
                    <th className="text-right py-3 px-2 font-medium text-slate-600">Harga</th>
                    <th className="text-center py-3 px-2 font-medium text-slate-600">Diset Oleh</th>
                    <th className="text-center py-3 px-2 font-medium text-slate-600">Status</th>
                    <th className="text-right py-3 px-2 font-medium text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-2">
                        <p className="font-medium">{service.service_name}</p>
                        <p className="text-xs text-slate-400">{service.service_code}</p>
                      </td>
                      <td className="py-3 px-2 text-right">
                        {editingServiceId === service.service_id ? (
                          <Input
                            type="number"
                            min={0}
                            className="w-36 text-right"
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
                          service.price_source === 'admin-user'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                        }>
                          {service.price_source === 'admin-user' ? 'Admin' : 'Owner'}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={service.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {service.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        {editingServiceId === service.service_id ? (
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              onClick={() => { setEditingServiceId(null); setEditPrice('') }}
                              className="text-xs"
                            >
                              Batal
                            </Button>
                            <Button
                              onClick={() => handleSave(service.service_id)}
                              disabled={isSaving}
                              className="text-xs"
                            >
                              {isSaving ? '...' : 'Simpan'}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setEditingServiceId(service.service_id)
                              setEditPrice(service.price)
                              setSaveSuccess(null)
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
    </DashboardLayout>
  )
}
