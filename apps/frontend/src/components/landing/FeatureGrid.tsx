import React from 'react';
import {
  Users,
  Settings,
  Database,
  Search,
  BookOpen,
  DollarSign,
  Smartphone,
  ShieldCheck,
  MapPin,
  Sparkles,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeatureGrid() {
  const features = [
    {
      icon: Database,
      title: 'Multi-Tenant Isolation',
      benefit: 'Database Cabang Mandiri',
      description: 'Seluruh berkas transaksi, admin, dan pricing dari masing-masing kantor cabang tersimpan aman di ruang lingkup (tenant) yang terisolasi total.',
      iconColor: 'text-blue-500 bg-blue-50',
    },
    {
      icon: Users,
      title: 'Admin Assignment Area',
      benefit: 'Tugaskan Admin Secara Rapi',
      description: 'Kunci otorisasi staf lapangan Anda. Admin Depok tidak bisa mengintip berkas Jakarta, meyakinkan tidak ada kebocoran data sensitif.',
      iconColor: 'text-indigo-500 bg-indigo-50',
    },
    {
      icon: DollarSign,
      title: 'Branch Custom Pricing Engine',
      benefit: 'Daftar Harga Biaya Khusus',
      description: 'Atur profit margin jasa BPKB atau mutasi secara individual menyesuaikan dengan jarak, overhead lokal, dan samsat setempat di masing-masing cabang.',
      iconColor: 'text-emerald-500 bg-emerald-50',
    },
    {
      icon: Search,
      title: 'Live Tracking Stage Timeline',
      benefit: 'Pelacakan Status Berkas Real-time',
      description: 'Monitor transisi berkas dari status "Cek Fisik", "Proses Samsat", hingga "STNK Selesai" dengan log audit tanggal dan jam yang mendalam.',
      iconColor: 'text-sky-500 bg-sky-50',
    },
    {
      icon: BookOpen,
      title: 'Centralized Revenue Metrics',
      benefit: 'Laporan Omset Terpusat',
      description: 'Grafik ringkasan laporan pendapatan laba bersih bulanan otomatis dari semua cabang langsung terkonsolidasi tanpa perlu file excel manual.',
      iconColor: 'text-amber-500 bg-amber-50',
    },
    {
      icon: Lock,
      title: 'Subscription Tier Control',
      benefit: 'Kontrol Langganan Pemilik',
      description: 'Sebagai model bisnis SaaS, Super Admin platform bisa membatasi jumlah pembuatan cabang, jumlah admin, dan masa aktif paket owner secara ketat.',
      iconColor: 'text-rose-500 bg-rose-50',
    },
    {
      icon: Smartphone,
      title: 'Samsat Field Mobile Friendly',
      benefit: 'Mudah Diakses di Lokasi Samsat',
      description: 'Responsif luar biasa untuk staf lapangan yang memotret bukti gesekan cek fisik kendaraan atau mengunggah resi cetak langsung lewat browser HP.',
      iconColor: 'text-violet-500 bg-violet-50 border border-violet-100',
    },
    {
      icon: ShieldCheck,
      title: 'Public Status Tracking Page',
      benefit: 'Halaman Lacak Khusus Customer',
      description: 'Bagikan nomor invoice kepada klien utama. Mereka bisa memonitor status berkas sendiri tanpa perlu meramaikan percakapan CS WhatsApp.',
      iconColor: 'text-teal-500 bg-teal-50',
    }
  ];

  return (
    <section className="bg-white py-20 border-b border-slate-100" id="feature-grid-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header summary of features */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Fitur Unggulan</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2 sm:text-4xl">
            Satu Sistem Lengkap untuk Memimpin Pasar Biro Jasa STNK
          </h2>
          <p className="mt-4 text-base text-slate-500">
            SatuJasa STNK memangkas jam kerja administratif Anda sampai 70% dan meningkatkan kepuasan customer lewat transparansi alur pencatatan modern.
          </p>
        </div>

        {/* Feature Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon wrap */}
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feat.iconColor} mb-5 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <span className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">
                    {feat.title}
                  </span>
                  
                  <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">
                    {feat.benefit}
                  </h3>
                  
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>

                {/* Decorative bottom line */}
                <div className="mt-4 h-1 w-0 bg-blue-600 rounded-full group-hover:w-16 transition-all duration-300" />
              </div>
            );
          })}
        </div>

        {/* Interactive small hint under the grid */}
        <div className="mt-12 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Ingin kustomisasi alur Samsat khusus di area Anda? Hubungi kami untuk kebutuhan custom.</span>
        </div>

      </div>
    </section>
  );
}
