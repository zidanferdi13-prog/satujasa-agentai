import React, { useState } from 'react';
import { ShieldCheck, UserCheck, CheckCircle2, XCircle, Users, Lock, Eye } from 'lucide-react';
import { PlatformRole } from '@/types';

export default function RolePreviewer() {
  const [activeRole, setActiveRole] = useState<PlatformRole>('tenant_owner');

  const roleDetails = {
    tenant_owner: {
      title: 'Tenant Owner (Biro Jasa Owner)',
      badge: 'Pimpinan Bisnis',
      desc: 'Owner biro jasa pemegang kendali utama usaha. Memiliki kekuasaan penuh mengatur kantor cabang, melihat laporan keuangan menyeluruh, serta menstandarkan margin untung.',
      capabilities: [
        { name: 'Aktivasi, Perpanjang, & Blokir Paket Owner', status: false },
        { name: 'Melihat Pendapatan Internal Biro Jasa', status: true },
        { name: 'Menambahkan & Memproses Berkas Customer', status: true },
        { name: 'Mengubah Harga Layanan per Cabang', status: true },
        { name: 'Akses Otoritas Tambah Akun Admin Cabang', status: true },
        { name: 'Melihat Seluruh Database & Lacak Alur Berkas', status: true },
      ]
    },
    admin_cabang: {
      title: 'Admin Cabang (Operator Lapangan)',
      badge: 'Eksekutor Lapangan',
      desc: 'Staf cabang biro jasa yang bertugas mengelola berkas secara fisik di Samsat/kantor. Akses mereka terisolasi ketat hanya untuk cabang tempat mereka ditugaskan.',
      capabilities: [
        { name: 'Melihat Pendapatan Cabang Lain', status: false },
        { name: 'Mengubah Harga Layanan Tingkat Pusat/Cabang', status: false },
        { name: 'Menambahkan & Update Status Berkas Cabangnya', status: true },
        { name: 'Ambil Foto Gesek Plat & Upload Bukti Samsat', status: true },
        { name: 'Ubah Data Akun Admin Cabang Lain', status: false },
        { name: 'Melihat Log Status Lini Masa Transaksi Sendiri', status: true },
      ]
    }
  };

  return (
    <section className="bg-white py-20 border-b border-slate-100" id="roles">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header segment */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Keamanan & Hierarki Otoritas</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2 sm:text-4xl">
            Satu Dashboard Dengan 2 Lapisan Hak Akses Terisolasi
          </h2>
          <p className="mt-4 text-base text-slate-500">
            Jamin kerahasiaan profit dan data sensitif cabang Anda. Lindungi pricing spesial dan data transaksi utama dari manipulasi staf lapangan.
          </p>

          {/* Interactive Role Selector tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1.5 mt-8 inline-block shadow-inner">
            <button
              onClick={() => setActiveRole('tenant_owner')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'tenant_owner' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-950'
              }`}
              id="role-tab-owner"
            >
              <ShieldCheck className="h-4 w-4" />
              Tenant Owner (Anda)
            </button>
            <button
              onClick={() => setActiveRole('admin_cabang')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'admin_cabang' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-950'
              }`}
              id="role-tab-admin"
            >
              <UserCheck className="h-4 w-4" />
              Admin Cabang
            </button>
          </div>
        </div>

        {/* Selected Role UI Layout Card */}
        <div className="mx-auto max-w-4xl rounded-2xl bg-slate-50 border border-slate-150 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left explanation column */}
            <div className="md:col-span-5">
              <span className="inline-block rounded bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800 uppercase tracking-wide mb-2.5">
                {roleDetails[activeRole].badge}
              </span>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                {roleDetails[activeRole].title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-3 pt-3 border-t border-slate-200">
                {roleDetails[activeRole].desc}
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400 bg-white border border-slate-150 p-3 rounded-xl shadow-xs">
                <Lock className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>Enkripsi Database Cabang Menggunakan Token JWT Sandbox</span>
              </div>
            </div>

            {/* Right Matrix Capability list column */}
            <div className="md:col-span-7 bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-indigo-500" />
                Matriks Hak Otorisasi Fungsi
              </h4>

              <div className="space-y-2.5 text-xs">
                {roleDetails[activeRole].capabilities.map((cap, cIdx) => (
                  <div key={cIdx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700 font-medium">{cap.name}</span>
                    {cap.status ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        Diberikan
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-500 font-bold">
                        <XCircle className="h-4 w-4" />
                        Ditolak/Dibatasi
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
