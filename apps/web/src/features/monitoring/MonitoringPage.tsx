import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '../../components/ui'
import { StatusBadge } from '../../components/shared/StatusBadge'

export function MonitoringPage() {
  const { token } = useParams()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Pantau Status Layanan</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Informasi Layanan</CardTitle>
                <CardDescription>Token: {token}</CardDescription>
              </div>
              <StatusBadge status="processing" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600">Nama Customer</p>
                <p className="font-semibold text-lg">—</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Plat Nomor</p>
                <p className="font-semibold text-lg">—</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Layanan</p>
                <p className="font-semibold text-lg">—</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Estimasi Selesai</p>
                <p className="font-semibold text-lg">—</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Timeline</p>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                  <p className="text-sm text-slate-600">Dokumen diterima</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs">→</div>
                  <p className="text-sm text-slate-600">Sedang diverifikasi</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-xs">-</div>
                  <p className="text-sm text-slate-600">Akan dikirim</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hubungi Kami</CardTitle>
          </CardHeader>
          <CardContent>
            <a 
              href="https://wa.me/62812345678" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors"
            >
              Hubungi via WhatsApp
            </a>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
