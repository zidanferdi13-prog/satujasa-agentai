import { PageHeader } from '../../../components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'

export function AdminUserDashboard() {
  return (
    <DashboardLayout>
      <PageHeader title="Dashboard Admin User" description="Kelola transaksi dan pelanggan" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Transaksi Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Input</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Selesai Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
          <CardDescription>Daftar transaksi yang sedang berjalan</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm">Data akan ditampilkan setelah integrasi API</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
