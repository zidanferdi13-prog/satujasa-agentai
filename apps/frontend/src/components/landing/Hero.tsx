import React, { useState } from 'react';
import { Play, Sparkles, Building2, TrendingUp, Users, FileText, CheckCircle2, RefreshCw, Layers, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BranchTenant, StnkTransaction } from '@/types';
import { mockTenants, mockTransactions } from '@/data';

interface HeroProps {
  onOpenDemo: (plan: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export default function Hero({ onOpenDemo, onScrollToSection }: HeroProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [transactions, setTransactions] = useState<StnkTransaction[]>(mockTransactions);
  const [justProcessedId, setJustProcessedId] = useState<string | null>(null);

  // Manage transaction simulation
  const handleSimulateProcess = (id: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        let nextStatus = t.status;
        if (t.status === 'Menerima Berkas') nextStatus = 'Cek Fisik';
        else if (t.status === 'Cek Fisik') nextStatus = 'Proses Samsat';
        else if (t.status === 'Proses Samsat') nextStatus = 'STNK Selesai';
        else if (t.status === 'STNK Selesai') nextStatus = 'Diterima Customer';
        else nextStatus = 'Cek Fisik'; // loop around as sandbox

        return { ...t, status: nextStatus, updatedAt: 'Baru Saja diupdate' };
      }
      return t;
    }));
    setJustProcessedId(id);
    setTimeout(() => setJustProcessedId(null), 1500);
  };

  // Calculate dynamic statistics based on active filter
  const activeBranchData = mockTenants.find(t => t.id === selectedBranch);

  const totalActiveOrders = selectedBranch === 'all'
    ? mockTenants.reduce((sum, b) => sum + b.activeOrders, 0)
    : activeBranchData?.activeOrders || 0;

  const totalRevenue = selectedBranch === 'all'
    ? mockTenants.reduce((sum, b) => sum + b.revenueThisMonth, 0)
    : activeBranchData?.revenueThisMonth || 0;

  const filteredTransactions = selectedBranch === 'all'
    ? transactions
    : transactions.filter(t => t.tenantName.includes(activeBranchData?.city || ''));

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] pb-20 pt-24 text-slate-800 border-b border-slate-200/60" id="hero-section">
      {/* Visual background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/70 via-[#F8FAFC] to-[#F8FAFC]" />
      <div className="absolute top-1/4 left-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-10 right-20 h-96 w-96 rounded-full bg-sky-500/5 blur-3xl" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#0F172A_1px,transparent_1px),linear-gradient(to_bottom,#0F172A_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 self-start rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              SaaS Multi-Tenant Khusus Biro Jasa STNK
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-tight"
            >
              Kelola Seluruh <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Biro Jasa STNK</span> dalam Satu Dashboard
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base text-slate-600 leading-relaxed font-normal"
            >
              Kontrol cabang, tugaskan admin, atur standarisasi margin pricing, pantau real-time revenue, dan mudahkan customer melacak posisi berkas BPKB/STNK mereka secara otomatis.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <button
                onClick={() => onOpenDemo('Pro')}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                id="hero-request-demo-btn"
              >
                Minta Demo & Free Trial
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onScrollToSection('workflow')}
                className="flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-sm px-6 py-3.5 transition-all shadow-sm cursor-pointer"
                id="hero-learn-more-btn"
              >
                <Play className="h-4 w-4 text-blue-600 fill-blue-600" />
                Lihat Cara Kerja
              </button>
            </motion.div>

            {/* Micro value indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500"
            >
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                Multi-Tenant Ready
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                Atur Pricing per Cabang
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                Public Tracking Resi
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                Laporan Omset Instan
              </div>
            </motion.div>
          </div>

          {/* Right Live Interactive Mockup Dashboard (High engagement!) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-100 overflow-hidden p-4 sm:p-5"
            >
              {/* Fake OSX Window Buttons */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-400 pl-2 font-mono">dashboard_owner_satujasa.config</span>
                </div>
                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1 text-[10px] text-blue-600 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Simulasi Dashboard
                </div>
              </div>

              {/* Dynamic Branch Filter Switcher */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    Monitoring Lintas Tenant / Cabang
                  </h4>
                  <p className="text-[10px] text-slate-400">Pilih cabang di bawah untuk mensimulasikan isolasi data SaaS</p>
                </div>

                {/* Dropdown / Tag select simulator */}
                <div className="flex flex-wrap gap-1" id="branch-sandbox-filter">
                  <button
                    onClick={() => setSelectedBranch('all')}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      selectedBranch === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Semua Cabang ({mockTenants.length})
                  </button>
                  {mockTenants.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBranch(b.id)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer ${
                        selectedBranch === b.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {b.city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animated Stat KPIs Card panel */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 hover:border-slate-200 transition-colors">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total Berkas Aktif</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-extrabold tracking-tight text-slate-800 mono-nums">
                      {totalActiveOrders}
                    </span>
                    <span className="text-[9px] text-emerald-600 flex items-center gap-0.5 font-bold">
                      <TrendingUp className="h-2.5 w-2.5" /> +15%
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 hover:border-slate-200 transition-colors">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Omset Berkas Jasa</span>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-[9px] font-bold text-slate-400">IDR</span>
                    <span className="text-xl font-extrabold tracking-tight text-emerald-600 mono-nums">
                      {totalRevenue.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 rounded-xl bg-slate-50 p-3 border border-slate-100 hover:border-slate-200 transition-colors">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">System Status</span>
                  <p className="mt-1 font-bold text-emerald-600 text-xs flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sandbox OK
                  </p>
                </div>
              </div>

              {/* Action Simulation Helper Banner */}
              <div className="mb-3 rounded-lg bg-blue-50 border border-blue-100 p-2.5 text-[11px] text-blue-700 leading-relaxed flex items-center justify-between">
                <div>
                  💡 <strong>Uji Coba Interaktif:</strong> Klik tombol <strong className="text-white bg-blue-600 px-1 py-0.5 rounded cursor-pointer">Perbarui Status</strong> pada baris transaksi untuk mensimulasikan sistem tracking real-time.
                </div>
              </div>

              {/* Transaction List Visual Grid */}
              <div className="rounded-xl bg-slate-50 border border-slate-200/60 overflow-x-auto">
                <table className="w-full text-[11px] text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/60 font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="px-3 py-2 text-[10px]">No. Invoice</th>
                      <th className="px-3 py-2 text-[10px]">Customer / Plat</th>
                      <th className="px-3 py-2 text-[10px]">Jenis Layanan</th>
                      <th className="px-3 py-2 text-[10px]">Status Berkas</th>
                      <th className="px-3 py-2 text-[10px] text-center">Aksi Simulasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-medium">
                    {filteredTransactions.map((tr) => (
                      <tr key={tr.id} className="hover:bg-white transition-colors bg-white/40">
                        <td className="px-3 py-2.5 text-slate-755 font-mono font-bold">
                          {tr.id}
                          {justProcessedId === tr.id && (
                            <span className="ml-1 rounded bg-blue-600 px-1.5 py-0.5 text-[8px] text-white">Updated</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="text-slate-800 font-bold">{tr.customerName}</div>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded inline-block mt-0.5 font-bold">
                            {tr.vehiclePlate}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-600 font-medium">
                          {tr.serviceType}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            tr.status === 'STNK Selesai' || tr.status === 'Diterima Customer'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : tr.status === 'Terhambat'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : tr.status === 'Proses Samsat'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              tr.status === 'STNK Selesai' || tr.status === 'Diterima Customer'
                                ? 'bg-emerald-500'
                                : tr.status === 'Terhambat'
                                ? 'bg-rose-500'
                                : tr.status === 'Proses Samsat'
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`} />
                            {tr.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => handleSimulateProcess(tr.id)}
                            className="inline-flex items-center gap-1 rounded bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold px-2 py-1 text-[9px] transition-all cursor-pointer border border-blue-200/50"
                            id={`simulate-btn-${tr.id}`}
                          >
                            <RefreshCw className="h-2.5 w-2.5" />
                            Perbarui Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dynamic Pricing Engine Mini Mockup at the bottom */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500">Margin Cabang Sekejap:</span>
                  {selectedBranch === 'all' ? (
                    <span className="italic text-slate-400 font-medium">Bervariasi di tiap cabang</span>
                  ) : (
                    <div className="flex gap-2">
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                        🚗 Mobil: IDR {activeBranchData?.pricing.perpanjangStnkMobil.toLocaleString('id-ID')}
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                        🏍️ Motor: IDR {activeBranchData?.pricing.perpanjangStnkMotor.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end font-semibold">
                  <span>✓ Data Cabang Terenkripsi Aman</span>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
