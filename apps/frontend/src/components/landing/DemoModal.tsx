import React, { useState, useMemo } from 'react';
import { X, MessageSquare, CheckCircle2, ChevronRight, Sparkles, Building2, Phone, Mail, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DemoRequest } from '@/types';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
}

function recommendPlan(branchCount: number): string {
  if (branchCount > 3) return 'Expert';
  if (branchCount > 1) return 'Plus';
  return 'Pro';
}

export default function DemoModal({ isOpen, onClose, initialPlan = 'Pro' }: DemoModalProps) {
  const [formData, setFormData] = useState<DemoRequest>({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    branchCount: 3,
    selectedPlan: initialPlan,
    hasExperience: true,
  });

  const recommendedPlan = useMemo(() => recommendPlan(formData.branchCount), [formData.branchCount]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBranchCountChange = (value: number) => {
    setFormData(prev => ({ ...prev, branchCount: value, selectedPlan: recommendPlan(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const getEstimatedHoursSaved = () => {
    return formData.branchCount * 28; // Estimasi 28 jam hemat per cabang per bulan
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            id="modal-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100"
            id="demo-modal-container"
          >
            {/* Header Pattern Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              aria-label="Tutup"
              id="close-modal-btn"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSubmitted ? (
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 mb-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Prioritas Konsultasi Owner Biro Jasa
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Minta Demo Eksklusif SatuJasa STNK
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Bantu kami memahami skala operasional biro jasa Anda untuk menyusun skenario demo gratis yang paling relevan.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" id="demo-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Nama Lengkap Owner
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Pak/Bu..."
                          className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Nama Biro Jasa STNK
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.businessName}
                          onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                          placeholder="Biro Jasa STNK Sinar Mandiri..."
                          className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        No. WhatsApp (Aktif)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Contoh: 081234567890"
                          className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Email Kerja
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="owner@birojasa.com"
                          className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Branch Controller */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-700">Jumlah Cabang / Tenant Biro Jasa:</span>
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 mono-nums">
                        {formData.branchCount} Cabang / Tenant
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={formData.branchCount}
                      onChange={e => handleBranchCountChange(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                    />

                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 mono-nums">
                      <span>1 Cabang</span>
                      <span>3 Cabang</span>
                      <span>5 Cabang</span>
                      <span>10 Cabang</span>
                      <span>15+ Cabang</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 text-xs">
                      <div>
                        <p className="text-slate-400">Rekomendasi Paket:</p>
                        <p className="font-bold text-slate-800 text-sm">
                          Paket {formData.selectedPlan} {formData.selectedPlan === 'Expert' ? ' (Custom Limit)' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400">Potensi Hemat Operasional:</p>
                        <p className="font-bold text-emerald-600 text-sm flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          ± {getEstimatedHoursSaved()} Jam / Bulan
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-slate-400 py-1">
                    <input
                      type="checkbox"
                      id="terms-check"
                      required
                      defaultChecked
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="terms-check" className="cursor-pointer">
                      Saya setuju untuk dihubungi oleh Tim Ahli Operasional SatuJasa STNK via WhatsApp/Email untuk penjadwalan demo privat & uji coba gratis selama 14 hari.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 shadow-lg hover:shadow-indigo-600/10 transition-all cursor-pointer transition-transform active:translate-y-0.5 disabled:opacity-85"
                    id="submit-demo-form-btn"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Menyiapkan Skenario Demo...
                      </>
                    ) : (
                      <>
                        Minta Demo & Gratis Akses 14 Hari
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-6 md:p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 scale-110">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="mb-6">
                  <h4 className="text-2xl font-bold text-slate-900">
                    Skenario Demo Berhasil Dibuat!
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Terima kasih, Pak/Bu <span className="font-semibold text-slate-800">{formData.fullName}</span>. Tim kami sedang menyiapkan dashboard khusus untuk <span className="font-semibold text-slate-800">{formData.businessName}</span>.
                  </p>
                </div>

                {/* Personalized output recommendation results */}
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-left mb-6">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Analisis Kebutuhan Awal {formData.businessName}
                  </h5>

                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Rencana Jumlah Cabang/Tenant:</span>
                      <span className="font-semibold text-slate-800 mono-nums">{formData.branchCount} Cabang</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rekomendasi Paket Berlangganan:</span>
                      <span className="font-semibold text-blue-600">SatuJasa {formData.selectedPlan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimasi Penghematan Waktu:</span>
                      <span className="font-semibold text-emerald-600 mono-nums">{getEstimatedHoursSaved()} Jam Kerja / Bulan</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span>Status Akun Demo:</span>
                      <span className="font-bold text-amber-600 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        Menunggu Aktivasi Super Admin
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-blue-50/70 p-3 text-xs text-blue-800 leading-relaxed">
                    <strong>Langkah selanjutnya:</strong> Tim B2B Consult kami akan mengirimkan invoice gratis uji coba & link akses preview dashboard login berdurasi 14 hari langsung ke nomor <span className="font-mono font-bold">{formData.phone}</span> via WhatsApp dalam waktu maksimal 15 menit.
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/6281234567890?text=Halo%20SatuJasa%20STNK%2C%20saya%20${encodeURIComponent(formData.fullName)}%20dari%20${encodeURIComponent(formData.businessName)}%20ingin%20mengaktifkan%20demo%20untuk%20${formData.branchCount}%20cabang.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 text-sm transition-all shadow-md hover:shadow-emerald-600/10 cursor-pointer"
                  >
                    <MessageSquare className="h-4.5 w-4.5" />
                    Hubungi Via WhatsApp (Instan)
                  </a>
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold py-2.5 px-4 text-sm transition-all cursor-pointer"
                  >
                    Tutup Lampiran
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
