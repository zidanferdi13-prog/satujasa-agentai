import { Link } from 'react-router-dom'
import { Button } from '../../components/ui'

export function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-slate-900">
            STNK Jasa
          </Link>
          <nav className="flex items-center gap-8">
            <a href="#services" className="text-sm text-slate-600 hover:text-slate-900">
              Layanan
            </a>
            <a href="#process" className="text-sm text-slate-600 hover:text-slate-900">
              Proses
            </a>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Masuk
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-semibold text-primary">Biro jasa STNK</span>
            <h1 className="text-5xl font-bold text-slate-900 mt-4">
              Urus dokumen kendaraan tanpa kehilangan kendali.
            </h1>
            <p className="text-lg text-slate-600 mt-4">
              Pantau proses, kelola pelanggan, dan koordinasikan pekerjaan administrasi
              dalam satu sistem yang aman dan terukur.
            </p>
            <div className="flex gap-4 mt-8">
              <Link to="/register">
                <Button size="lg">Daftar Sekarang</Button>
              </Link>
              <a href="#process">
                <Button variant="outline" size="lg">
                  Lihat Alur
                </Button>
              </a>
            </div>
          </div>

          <div className="bg-slate-100 rounded-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <p className="text-sm font-medium text-slate-700">Status Layanan</p>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Dokumen Sedang Diverifikasi</h3>
              <div className="bg-slate-200 rounded-full h-2 w-full">
                <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }} />
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Nomor Proses</dt>
                  <dd className="font-medium text-slate-900">STNK-2026-0142</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Estimasi</dt>
                  <dd className="font-medium text-slate-900">2 hari kerja</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center">Fitur Utama</h2>
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-8 rounded-lg border border-slate-200">
              <div className="text-3xl font-bold text-primary mb-4">01</div>
              <h3 className="text-xl font-semibold text-slate-900">Data Terpusat</h3>
              <p className="text-slate-600 mt-2">
                Riwayat pelanggan dan dokumen tersusun dalam alur yang mudah diaudit.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-slate-200">
              <div className="text-3xl font-bold text-primary mb-4">02</div>
              <h3 className="text-xl font-semibold text-slate-900">Akses Berbasis Role</h3>
              <p className="text-slate-600 mt-2">
                Super admin, owner, dan admin user mendapat dashboard sesuai tanggung jawab.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-slate-200">
              <div className="text-3xl font-bold text-primary mb-4">03</div>
              <h3 className="text-xl font-semibold text-slate-900">Proses Terpantau</h3>
              <p className="text-slate-600 mt-2">
                Status pekerjaan dan tindak lanjut terlihat jelas tanpa percakapan tercecer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-sm font-semibold text-primary">Fondasi Produk</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-4">
            Satu alur dari penerimaan hingga dokumen selesai.
          </h2>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
            Bootstrap ini menyiapkan struktur aplikasi. Auth, database, upload, dan workflow
            transaksi akan ditambahkan melalui task terpisah yang diuji dan diaudit.
          </p>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400">© 2026 STNK Jasa. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
