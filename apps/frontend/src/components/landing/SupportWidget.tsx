import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Headphones, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface SupportWidgetProps {
  onOpenDemo: (plan: string) => void;
}

export default function SupportWidget({ onOpenDemo }: SupportWidgetProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasNewNotification, setHasNewNotification] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'options' | 'chat'>('options');
  const [customName, setCustomName] = useState<string>('');
  const [customPhone, setCustomPhone] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Suggested messages for quick conversion
  const conversionPrompts = [
    {
      id: 'plan_pro',
      label: 'Tanya Paket Pro (Rp 99rb) 🚀',
      message: 'Halo Tim SatuJasa, saya tertarik dengan Paket Pro seharga Rp 99rb/bulan. Bagaimana cara memulainya?',
      action: 'demo',
      plan: 'Pro'
    },
    {
      id: 'tracking',
      label: 'Cara kerja Public Tracking? 🔍',
      message: 'Halo, saya mau tanya bagaimana skema fitur Public Tracking untuk customer biro jasa saya?',
      action: 'chat_reply',
      reply: 'Fitur Public Tracking memungkinkan pelanggan Anda melacak status STNK/BPKB mereka secara langsung lewat website Anda hanya dengan memasukkan nomor resi, tanpa perlu login. Ini menghemat 80% waktu telpon masuk admin Anda!'
    },
    {
      id: 'custom_branch',
      label: 'Mau coba demo kelola cabang 🏢',
      message: 'Halo, saya memiliki lebih dari 1 cabang biro jasa STNK dan ingin demo fitur pengelolaan cabang terintegrasi.',
      action: 'demo',
      plan: 'Plus'
    },
    {
      id: 'consultation',
      label: 'Konsultasi Gratis via WA 💬',
      message: 'Halo SatuJasa, saya mau konsultasi gratis dulu mengenai kebutuhan sistem operasional biro jasa saya.',
      action: 'whatsapp'
    }
  ];

  // Auto notification indicator dismissal on click
  const handleToggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewNotification(false);
    }
  };

  const handleSelectPrompt = (prompt: typeof conversionPrompts[0]) => {
    if (prompt.action === 'demo') {
      onOpenDemo(prompt.plan || 'Pro');
      setIsOpen(false);
    } else if (prompt.action === 'whatsapp') {
      const waNumber = '6281234567890';
      const encodedText = encodeURIComponent(prompt.message);
      window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank');
      setIsOpen(false);
    } else if (prompt.action === 'chat_reply') {
      setCustomMessage(prompt.message);
      setActiveTab('chat');
    }
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customPhone) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      
      // Automatic follow up with custom pre-configured messaging to Whatsapp redirect after 1.5 seconds
      const waNumber = '6281234567890';
      const formattedMsg = `Halo SatuJasa, saya ${customName} dari Biro Jasa STNK. No WA: ${customPhone}. \n\nPesan: ${customMessage || 'Saya ingin bertanya tentang SatuJasa STNK.'}`;
      const encodedText = encodeURIComponent(formattedMsg);
      
      setTimeout(() => {
        window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank');
      }, 1500);

    }, 1000);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setCustomName('');
    setCustomPhone('');
    setCustomMessage('');
    setActiveTab('options');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]" id="floating-support-container">
      {/* Dynamic Pop-up Notification / Welcome Prompt */}
      <AnimatePresence>
        {!isOpen && hasNewNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 mb-2 pointer-events-auto"
            id="notification-bubble"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Bantuan Bisnis STNK</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setHasNewNotification(false); }}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1">SatuJasa AI Assistant</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Apakah Anda mengelola lebih dari 100 berkas STNK per bulan? Yuk diskusikan diskon khusus untuk Anda!
                </p>
                <button
                  onClick={handleToggleWidget}
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Mulai Chat <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Support Box Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute bottom-16 right-0 w-[350px] md:w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[550px]"
            id="support-chat-widget"
          >
            {/* Header section with brand and CS status */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                      <Headphones className="h-5 w-5 text-sky-200" />
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-none tracking-tight">SatuJasa Live Support</h3>
                    <p className="text-[11px] text-sky-100 font-medium mt-1 inline-flex items-center gap-1">
                      Online • Siap membantu biro jasa Anda
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleToggleWidget}
                  className="p-1 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                  aria-label="Close support box"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Body content tabs */}
            <div className="flex-1 overflow-y-auto p-5 bg-slate-50 min-h-[300px] h-[380px]">
              
              <AnimatePresence mode="wait">
                {activeTab === 'options' ? (
                  <motion.div
                    key="options-tab"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    {/* Welcome CS message bubble */}
                    <div className="flex gap-2.5 items-start">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-sm border border-slate-100 text-xs">
                        <p className="text-slate-800 font-semibold mb-1">Halo! Selamat datang di SatuJasa 👋</p>
                        <p className="text-slate-600 leading-relaxed">
                          Kami siap membantu Anda mendigitalisasi operasional biro jasa STNK. Silakan pilih salah satu menu respons cepat di bawah untuk respon instan:
                        </p>
                      </div>
                    </div>

                    {/* Preconfigured conversion buttons */}
                    <div className="space-y-2 pl-9">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Topik Populer</p>
                      {conversionPrompts.map((prompt) => (
                        <button
                          key={prompt.id}
                          onClick={() => handleSelectPrompt(prompt)}
                          className="w-full text-left bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl p-3 text-xs font-semibold text-slate-700 hover:text-blue-900 transition-all shadow-sm flex items-center justify-between group cursor-pointer"
                        >
                          <span>{prompt.label}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 pl-9">
                      <button
                        onClick={() => setActiveTab('chat')}
                        className="w-full text-center py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Tulis Pesan Kustom Anda
                      </button>
                    </div>

                  </motion.div>
                ) : (
                  <motion.div
                    key="chat-tab"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4"
                  >
                    <button
                      onClick={() => setActiveTab('options')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline mb-1"
                    >
                      ← Kembali ke Menu Pilihan
                    </button>

                    {/* Chat Bubble reply simulation */}
                    <div className="flex gap-2.5 items-start">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-sm border border-slate-100 text-xs">
                        <p className="text-slate-800 font-semibold mb-1">Hubungi Langsung Spesialis Kami</p>
                        <p className="text-slate-600 leading-relaxed">
                          Isi data di bawah ini untuk terhubung langsung via WhatsApp prioritas dengan tim kami, lengkap dengan riwayat pertanyaan Anda.
                        </p>
                      </div>
                    </div>

                    {/* Contact submit form */}
                    {!isSubmitted ? (
                      <form onSubmit={handleSubmitContact} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Biro Jasa / Seseorang *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Contoh: Biro Jasa Rahmat"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">No. WhatsApp Aktif *</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="Contoh: 081234567890"
                            value={customPhone}
                            onChange={(e) => setCustomPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pesan / Pertanyaan Anda</label>
                          <textarea 
                            rows={2}
                            placeholder="Apa yang ingin Anda konsultasikan?"
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        >
                          {loading ? 'Menyiapkan...' : 'Kirim & Terhubung ke WA 📲'}
                        </button>
                      </form>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                          <Check className="h-5 w-5" />
                        </div>
                        <h4 className="font-bold text-emerald-900 text-sm">Data Berhasil Terkirim!</h4>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                          Terima kasih! Kami sedang mengalihkan Anda ke ruang chat WhatsApp prioritas tim SatuJasa...
                        </p>
                        
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleResetForm}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            Hubungi topik lain
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Support Widget Footer banner standard */}
            <div className="bg-slate-100 border-t border-slate-200/60 p-3 text-center text-[10px] text-slate-500 font-medium">
              Powered by <span className="font-bold text-slate-700">SatuJasa Automation</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Main Button */}
      <motion.button
        onClick={handleToggleWidget}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/45 transition-all text-center focus:outline-none z-50 cursor-pointer relative"
        id="support-floating-button"
        aria-label="Open helper support options"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="message-icon"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageSquare className="h-6 w-6" />
              
              {/* Notification red dot count */}
              {hasNewNotification && (
                <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 bg-rose-500 rounded-full border-2 border-indigo-600 flex items-center justify-center text-[8px] font-extrabold text-white">
                  1
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
