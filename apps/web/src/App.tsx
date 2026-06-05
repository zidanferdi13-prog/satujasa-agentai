import type { ApplicationRole } from '@stnk/contracts'
import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom'

import './App.css'

const roleLabels: Record<ApplicationRole, string> = {
  'super-admin': 'Super Admin',
  owner: 'Owner',
  'admin-user': 'Admin User',
}

function LandingPage() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" to="/">STNK Jasa</Link>
        <nav aria-label="Primary navigation">
          <a href="#services">Layanan</a>
          <a href="#process">Proses</a>
          <Link className="button button-small" to="/login">Masuk</Link>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Biro jasa STNK yang transparan</span>
          <h1>Urus dokumen kendaraan tanpa kehilangan kendali.</h1>
          <p>
            Pantau proses, kelola pelanggan, dan koordinasikan pekerjaan administrasi
            dalam satu sistem yang aman dan terukur.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/login">Mulai dari dashboard</Link>
            <a className="text-link" href="#process">Lihat alur layanan</a>
          </div>
        </div>
        <div className="status-card" aria-label="Service status preview">
          <span className="status-dot" />
          <p className="status-label">Status layanan</p>
          <strong>Dokumen sedang diverifikasi</strong>
          <div className="progress-track"><span /></div>
          <dl>
            <div><dt>Nomor proses</dt><dd>STNK-2026-0142</dd></div>
            <div><dt>Estimasi</dt><dd>2 hari kerja</dd></div>
          </dl>
        </div>
      </section>

      <section className="feature-grid" id="services">
        <article><span>01</span><h2>Data terpusat</h2><p>Riwayat pelanggan dan dokumen tersusun dalam alur yang mudah diaudit.</p></article>
        <article><span>02</span><h2>Akses berbasis role</h2><p>Super admin, owner, dan admin user mendapat dashboard sesuai tanggung jawab.</p></article>
        <article><span>03</span><h2>Proses terpantau</h2><p>Status pekerjaan dan tindak lanjut terlihat jelas tanpa percakapan tercecer.</p></article>
      </section>

      <section className="process-section" id="process">
        <span className="eyebrow">Fondasi produk</span>
        <h2>Satu alur dari penerimaan hingga dokumen selesai.</h2>
        <p>Bootstrap ini menyiapkan struktur aplikasi. Auth, database, upload, dan workflow transaksi akan ditambahkan melalui task terpisah yang diuji dan diaudit.</p>
      </section>
    </main>
  )
}

function LoginPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link className="brand" to="/">STNK Jasa</Link>
        <span className="eyebrow">Preview role routing</span>
        <h1>Pilih dashboard untuk melihat struktur awal.</h1>
        <p>Ini belum merupakan autentikasi. Login aman akan diimplementasikan bersama backend.</p>
        <div className="role-list">
          {(Object.keys(roleLabels) as ApplicationRole[]).map((role) => (
            <Link key={role} to={`/dashboard/${role}`}>{roleLabels[role]}<span>→</span></Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function DashboardPage() {
  const { role } = useParams()
  const normalizedRole = role as ApplicationRole

  if (!Object.hasOwn(roleLabels, normalizedRole)) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="dashboard-shell">
      <aside>
        <Link className="brand" to="/">STNK Jasa</Link>
        <p>{roleLabels[normalizedRole]}</p>
        <nav><a href="#overview">Ringkasan</a><a href="#work">Pekerjaan</a><a href="#documents">Dokumen</a></nav>
      </aside>
      <section className="dashboard-content">
        <span className="eyebrow">Dashboard preview</span>
        <h1>Selamat datang, {roleLabels[normalizedRole]}.</h1>
        <p>Modul operasional akan muncul di sini setelah kontrak API dan permission matrix disetujui.</p>
        <div className="metric-grid">
          <article><span>Proses aktif</span><strong>—</strong></article>
          <article><span>Perlu verifikasi</span><strong>—</strong></article>
          <article><span>Selesai bulan ini</span><strong>—</strong></article>
        </div>
      </section>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/:role" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
