import React, { useState } from 'react';
import { ShieldX, ShieldCheck, AlertCircle, TrendingUp, HelpCircle, ArrowRight, Ban, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PainPoints() {
  const [activeTab, setActiveTab] = useState<'sebelum' | 'sesudah'>('sebelum');

  const painPointsList = [
    {
      id: 1,
      issue: 'Cabang Jalan Sendiri',
      description: 'Setiap cabang menjalankan operasional tanpa standar pelaporan terpusat. Owner sulit mengetahui berkas apa saja yang sedang diproses di lapangan.',
      solution: 'Satu Dashboard Pusat',
      solDescription: 'Owner memantau posisi semua berkas aktif milik Depok, Jaksel, atau Bekasi langsung secara real-time dari satu ruangan kerja.'
    },
    {
      id: 2,
      issue: 'Pricing Bocor / Profit Hilang',
      description: 'Tarif jasa berbeda-beda antara admin. Selisih margin biaya nembak Samsat sering menguap tanpa pencatatan, mengurangi profit bersih owner.',
      solution: 'Standard Pricing Box',
      solDescription: 'Kunci standard pricelist perpanjang Plat Mobil/Motor khusus di tiap cabang. Margin terproteksi, manipulasi harga dinolkan.'
    },
    {
      id: 3,
      issue: 'Status Berkas Gaib',
      description: 'Customer menelepon admin puluhan kali sehari hanya untuk bertanya "STNK saya sudah jadi belum?". Admin pusing mencari tumpukan fisik lembaran.',
      solution: 'Public Resi Tracking',
      solDescription: 'Customer melacak progress berkas secara mandiri lewat link khusus. Kurir & Admin cukup perbarui status sekali klik di HP.'
    },
    {
      id: 4,
      issue: 'Laporan Revenue Manual Lambat',
      description: 'Owner biro jasa harus merekap kertas nota manual tiap akhir pekan dari admin cabang untuk tahu omset. Rawan selisih dan salah hitung.',
      solution: 'Laporan Keuangan Otomatis',
      solDescription: 'Laporan pendapatan terkumpul instan secara otomatis begitu berkas selesai dicetak. Statistik laba bersih disajikan dalam grafik visual.'
    }
  ];

  return (
    <section className="bg-slate-50 py-20 border-b border-slate-100" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header section with focus */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Analisis Operasional</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2 sm:text-4xl">
            Sering Mengalami Kebocoran di Cabang Biro Jasa Anda?
          </h2>
          <p className="mt-4 text-base text-slate-500">
            Mengurus ratusan berkas STNK, BPKB, mutasi, dan cek fisik dari banyak cabang dengan cara manual adalah resep utama kegagalan kontrol profit bisnis Anda.
          </p>

          {/* Toggle Interactive Tab switcher */}
          <div className="inline-flex rounded-xl bg-slate-200/60 p-1 mt-8 inline-block shadow-inner">
            <button
              onClick={() => setActiveTab('sebelum')}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sebelum' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ban className="h-4 w-4" />
              Cara Tradisional (Penuh Risiko)
            </button>
            <button
              onClick={() => setActiveTab('sesudah')}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sesudah' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
              Bersama SatuJasa STNK
            </button>
          </div>
        </div>

        {/* Content Section based on interactive activeTab */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {painPointsList.map((point) => (
              <div
                key={point.id}
                className={`rounded-2xl p-6 transition-all duration-300 border ${
                  activeTab === 'sebelum'
                    ? 'bg-rose-50/40 border-rose-100/80 hover:shadow-lg hover:shadow-rose-100/20'
                    : 'bg-emerald-50/40 border-emerald-100/80 hover:shadow-lg hover:shadow-emerald-100/20'
                }`}
              >
                {activeTab === 'sebelum' ? (
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 mb-4 font-bold">
                      <ShieldX className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-rose-500">Masalah Lapangan #{point.id}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{point.issue}</h3>
                    <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">{point.description}</p>
                    
                    <div className="mt-4 pt-3 border-t border-rose-100 flex items-center gap-2 text-[11px] text-rose-700 font-bold">
                      <AlertCircle className="h-4 w-4" />
                      Kerugian: Mengorbankan reputasi & bocor finansial kerja.
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4 font-bold animate-pulse">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-600">Proteksi SatuJasa #{point.id}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{point.solution}</h3>
                    <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">{point.solDescription}</p>

                    <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-700 font-bold">
                      <TrendingUp className="h-4 w-4" />
                      Manfaat: Pembagian tugas rapi & margin laba naik 22%.
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call-to-Action highlight within the section */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-blue-800/30">
            <div className="max-w-2xl">
              <h4 className="text-lg font-bold">Siap bermigrasi ke manajemen modern yang rapi?</h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Ribuan jam dihabiskan biro jasa untuk merapikan berkas di atas meja. Standarkan seluruh alur pencatatan dari satu ruang kontrol terpusat sekarang juga.
              </p>
            </div>
            <button
              onClick={() => {
                const element = document.getElementById('workflow');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 text-xs font-bold text-white transition-all shadow-md hover:scale-[1.02] cursor-pointer whitespace-nowrap"
              id="painpoint-workflow-btn"
            >
              Lihat Alur Kerja Platform
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
