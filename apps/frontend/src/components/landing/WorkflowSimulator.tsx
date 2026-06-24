import React, { useState } from 'react';
import { UserPlus, ShieldAlert, Users, Compass, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkflowSimulator() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: '1. Owner Daftar Akun',
      shortTitle: 'Daftar Akun',
      icon: UserPlus,
      subtitle: 'Registrasi dalam 1 menit',
      description: 'Owner biro jasa mendaftarkan bisnis utamanya melalui form pendaftaran. Anda akan mendapatkan akses ke Core Panel Owner dan template database standar siap pakai.',
      illustration: {
        badge: 'Tahap Registrasi',
        title: 'Form Registrasi SatuJasa',
        fields: ['Nama Bisnis: Biro Jasa Sinar Depok', 'Whatsapp Owner: 0812-XXXX-XXXX', 'Rencana Cabang: 3 Tenant'],
        mockupText: 'Sistem langsung men-generate alamat subdomain mandiri khusus untuk Biro Jasa Anda.'
      }
    },
    {
      title: '2. Super Admin Verifikasi',
      shortTitle: 'Aktivasi Paket',
      icon: ShieldAlert,
      subtitle: 'Keamanan multi-tenant terjamin',
      description: 'Super Admin memverifikasi legalitas biro jasa, lalu mengaktifkan paket subscription sesuai pilihan model (Pro, Plus, Expert) dan mengatur batas pembuatan tenant.',
      illustration: {
        badge: 'Log Super Admin',
        title: 'Verifikasi & Lisensi Token',
        fields: ['Tenant UID: TENANT-9901-MAR', 'Paket Terpilih: Paket Plus (3 Tenant)', 'Status Subscription: AKTIF'],
        mockupText: 'Akses token di-inject ke secure database cloud. Owner siap menggunakan platform secara penuh.'
      }
    },
    {
      title: '3. Tambah Cabang & Admin',
      shortTitle: 'Tambah Cabang',
      icon: Users,
      subtitle: 'Delegasi wewenang operasional',
      description: 'Owner memasukkan data cabang (misal: Cabang Depok, Cabang Bekasi) dan membuat 1 akun login terpisah untuk admin/kurir masing-masing cabang tersebut.',
      illustration: {
        badge: 'Otorisasi Biro Jasa',
        title: 'Tambah Admin Cabang Baru',
        fields: ['Nama Cabang: Margonda Depok', 'Admin Ditugaskan: Rian Kurniawan', 'Akses Otoritas: Terkunci Cabang Depok'],
        mockupText: 'Setiap admin cabang memiliki halaman login terenkripsi. Stres mengawasi staf hilang sekejap!'
      }
    },
    {
      title: '4. Operasional Jalan & Pantau',
      shortTitle: 'Dashboard Live',
      icon: Compass,
      subtitle: 'Ucapkan selamat tinggal pada berkas berceceran',
      description: 'Admin lapangan mulai mengunggah data pemohon STNK. Posisi berkas ter-update otomatis ke lini masa. Owner bisa duduk tenang melihat omset mengalir di dashboard.',
      illustration: {
        badge: 'Monitor Owner',
        title: 'Monitoring Transaksi Aktif',
        fields: ['Samsat Depok: 42 Beras Proses', 'Samsat Jaksel: 78 Berkas Proses', 'Samsat Bekasi: 29 Berkas Proses'],
        mockupText: '100% visibilitas di saku Anda. Laporan keuangan ter-update tanpa admin mengirim WA manual!'
      }
    }
  ];

  const IconComponent = steps[activeStep].icon;

  return (
    <section className="bg-slate-50 py-20 border-b border-slate-100" id="workflow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Alur Kerja Platform</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2 sm:text-4xl">
            Sederhana, Cepat, dan Sistematis
          </h2>
          <p className="mt-4 text-base text-slate-500">
            Dari pendaftaran di web hingga dashboard pemantauan cabang Anda aktif hanya memerlukan 4 langkah praktis berikut.
          </p>
        </div>

        {/* Timeline Stepper UI (Clickable) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-12">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`relative flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10 scale-[1.02]'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-100/50 hover:text-slate-900'
                }`}
                id={`workflow-step-tab-${idx}`}
              >
                <StepIcon className="h-4.5 w-4.5 shrink-0" />
                <span className="truncate">{step.shortTitle}</span>
                {isSelected && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 transform rotate-45 hidden md:block" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Step Content layout */}
        <div className="mx-auto max-w-5xl rounded-3xl bg-white border border-slate-150 p-6 md:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 mb-4">
                Langkah {activeStep + 1} dari 4
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-950 tracking-tight">
                {steps[activeStep].title}
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
                {steps[activeStep].subtitle}
              </p>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed font-normal">
                {steps[activeStep].description}
              </p>

              {/* Dynamic steps highlights checklist */}
              <div className="mt-6 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Keamanan enkripsi multi-cabang terjamin
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Tanpa pungutan komisi per transaksi berkas
                </div>
              </div>

              {/* Navigation help */}
              <div className="mt-8 flex items-center gap-2">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => prev - 1)}
                  className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:opacity-50 cursor-pointer"
                >
                  Sebelumnya
                </button>
                <button
                  disabled={activeStep === 3}
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                >
                  Selanjutnya
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Right Screen Graphic Mockup Column */}
            <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-5 text-white border border-slate-800 shadow-xl overflow-hidden self-stretch flex flex-col justify-between">
              
              {/* Header simulator panel */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[9px] text-slate-500 font-mono tracking-widest">{steps[activeStep].illustration.badge}</span>
              </div>

              {/* Interactive Mockup Body Card */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <h4 className="text-xs font-bold text-blue-400 mb-3 flex items-center gap-1.5">
                  <IconComponent className="h-3.5 w-3.5" />
                  {steps[activeStep].illustration.title}
                </h4>

                <div className="space-y-2 mb-4">
                  {steps[activeStep].illustration.fields.map((field, fIdx) => (
                    <div key={fIdx} className="flex justify-between items-center bg-slate-900/50 rounded p-1.5 border border-slate-800/40">
                      <span className="text-[10px] text-slate-400 font-medium">Data Ke-{fIdx + 1}:</span>
                      <span className="text-[10px] text-slate-200 font-bold">{field}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-slate-500 leading-relaxed italic border-t border-slate-800 py-2">
                  ℹ️ {steps[activeStep].illustration.mockupText}
                </div>
              </div>

              {/* Action output simulated indicator */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-[9px] text-slate-400 flex justify-between items-center font-mono">
                <span>SYSTEM_TOKEN: OK</span>
                <span className="text-emerald-500 font-bold">✓ Ready to Process</span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
