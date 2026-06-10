import { PageHeader } from '../../../components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { SubscriptionGate } from '../../../components/SubscriptionGate'

export function OwnerDashboard() {
  return (
    <DashboardLayout>
      <PageHeader title="Dashboard Owner" description="Kelola bisnis dan tenant Anda" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Revenue (Bulan Ini)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp —</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Tenant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buat Tenant Baru</CardTitle>
          <CardDescription>Tambahkan tenant untuk memperluas layanan</CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionGate tier="pro">
            <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90">
              Buat Tenant
            </button>
          </SubscriptionGate>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm">Data akan ditampilkan setelah integrasi API</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
