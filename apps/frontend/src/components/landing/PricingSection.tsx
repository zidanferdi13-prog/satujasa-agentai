import React, { useState } from 'react';
import { Check, HelpCircle, ArrowRight, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingSectionProps {
  onOpenDemo: (plan: string) => void;
}

export default function PricingSection({ onOpenDemo }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState<boolean>(false);

  const plans = [
    {
      name: 'Free Preview',
      price: 0,
      description: 'Eksplorasi sandbox operasional interaktif SatuJasa STNK untuk memahami kapabilitas sistem.',
      features: [
        'Akses 1 Sandbox Terisolasi',
        'Maksimal 0 Tenant Aktif',
        'Maksimal 0 Admin Tambahan',
        'Batas 3 Resi Simulasi',
        'Melihat Dummy Laporan Laba',
        'Tanpa Custom Domain',
      ],
      notIncluded: [
        'Tambah Admin Cabang Lapangan',
        'Live Public Customer Tracking',
        'Aktivasi Premium Subdomain',
      ],
      badge: 'Sandbox Trial',
      cta: 'Coba Gratis',
      popular: false,
    },
    {
      name: 'Pro',
      price: 99000,
      yearlyDiscount: 79200, // IDR per month, billed yearly (20% off 99k)
      description: 'Sangat cocok untuk Biro Jasa STNK perorangan/tunggal yang ingin mengotomatiskan tracking status.',
      features: [
        'Akses 1 Tenant Cabang Aktif',
        'Maksimal 1 Akun Admin Cabang',
        'Sistem Core Pricing Engine',
        'Halaman Public Tracking Customer',
        'Monitor Progress Timeline Berkas',
        'Backup Database Bulanan',
        'WA Notification Terintegrasi',
      ],
      notIncluded: [
        'Multi-cabang / Multi-tenant',
        'Laporan Laba/Omset Konsolidasi',
      ],
      badge: 'Solusi Tunggal',
      cta: 'Mulai Paket Pro',
      popular: false,
    },
    {
      name: 'Plus',
      price: 249000,
      yearlyDiscount: 199200, // IDR per month, billed yearly (20% off 249k)
      description: 'Paling diminati! Solusi sempurna bagi Owner yang memiliki 2-3 cabang biro jasa STNK mandiri.',
      features: [
        'Akses S/D 3 Tenant Cabang Aktif',
        'Maksimal 3 Akun Admin Cabang',
        'Custom Pricing Khusus per Cabang',
        'Konsolidasi Pendapatan Gabungan',
        'Delegasi Multi-Admin Terisolasi',
        'Public Tracking Page Independen',
        'Premium Subdomain Sendiri',
        'WA Priority Broadcast Otomatis',
      ],
      notIncluded: [],
      badge: 'Rekomendasi Owner',
      cta: 'Mulai Paket Plus',
      popular: true,
    },
    {
      name: 'Expert',
      price: 649000,
      yearlyDiscount: 519200, // IDR per month, billed yearly (20% off 649k)
      description: 'Dirancang khusus untuk jaringan biro jasa STNK skala nasional dengan puluhan kantor cabang.',
      features: [
        'Akses Unlimited Tenant Cabang',
        'Unlimited Akun Admin Cabang',
        'Dedicated Cloud Core Instance',
        'Multi-Level Custom Profit Margin',
        'Ekspor Laporan Pajak & XLS instan',
        'Custom Logo/Branding di Web',
        'Dedicated Account Manager 24/7',
        'Prioritas Kecepatan Cetak Resi',
      ],
      notIncluded: [],
      badge: 'Skala Korporat',
      cta: 'Hubungi Tim Ahli',
      popular: false,
    }
  ];

  return (
    <section className="bg-white py-20 border-b border-slate-100" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header content with B2B value focus */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Investasi Operasional</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2 sm:text-4xl">
            Tumbuh Bersama Skema Subscription Tetap
          </h2>
          <p className="mt-4 text-base text-slate-500">
            Tanpa potongan persen hasil, tanpa tarif terselubung. Tingkatkan efisiensi kerja ratusan kali lipat dengan biaya tetap bulanan yang terjangkau.
          </p>

          {/* Interactive Monthly/Yearly toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-xs font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>
              Bayar Bulanan
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              id="pricing-billing-toggle"
              aria-label="Toggle annual billing"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isYearly ? 'translate-x-5 bg-blue-600' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>
              Bayar Tahunan
              <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                Hemat 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((p, idx) => {
            const displayPrice = isYearly && p.price > 0 ? p.yearlyDiscount : p.price;
            
            return (
              <div
                key={idx}
                className={`relative rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 ${
                  p.popular
                    ? 'border-blue-600 bg-blue-50/25 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl'
                    : 'border-slate-150 bg-white hover:border-slate-300 hover:-translate-y-1 shadow-sm'
                }`}
              >
                {/* Popularity indicator badge overlay */}
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-md">
                    👑 Terpopuler bagi Owner
                  </span>
                )}

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{p.badge}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 lines-clamp-2 leading-relaxed h-[36px]">{p.description}</p>
                  
                  {/* Price breakdown block */}
                  <div className="mt-5 pb-5 border-b border-slate-150 flex items-baseline">
                    <span className="text-xs font-bold text-slate-400">IDR</span>
                    <span className="text-2xl font-extrabold text-slate-900">
                      {displayPrice?.toLocaleString('id-ID') || '0'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-1">/bulan</span>
                  </div>

                  {/* Pricing Included Feature Checklist */}
                  <ul className="mt-6 space-y-3 text-xs leading-none">
                    {p.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 font-medium text-slate-700">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span>{f}</span>
                      </li>
                    ))}

                    {/* Excluded items mapping with visual indicator */}
                    {p.notIncluded.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 font-medium text-slate-400/80 decoration-slate-300">
                        <span className="h-1 w-1.5 bg-slate-300 rounded ml-1.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Submit action triggering the global modal */}
                <button
                  onClick={() => onOpenDemo(p.name)}
                  className={`mt-8 w-full rounded-xl py-3 text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    p.popular
                      ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-blue-600/25'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                  id={`select-plan-cta-${p.name.replace(' ', '-').toLowerCase()}`}
                >
                  {p.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Upgrade authorization reassurance notice to boost enterprise trust */}
        <div className="mt-12 rounded-2xl bg-slate-50 border border-slate-100 p-4 max-w-2xl mx-auto text-center">
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            🛡️ <strong>Sistem Kontrol Subscription Aman:</strong> Hak penentuan status upgrade dan kuota tenant dikendalikan penuh secara manual oleh <span className="text-slate-800">Super Admin</span> melalui persetujuan manual (bukan payment gateway otomatis). Ini menjamin tidak ada biaya tagihan kartu kredit misterius.
          </p>
        </div>

      </div>
    </section>
  );
}
