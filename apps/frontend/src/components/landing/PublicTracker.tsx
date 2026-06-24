import React, { useState } from 'react';
import { Search, MapPin, CheckCircle2, Clock, Calendar, AlertTriangle, ArrowRight, RefreshCw, Smartphone, Plus } from 'lucide-react';
import { StnkTransaction, DocumentStatus } from '@/types';
import { mockTransactions } from '@/data';

export default function PublicTracker() {
  const [searchQuery, setSearchQuery] = useState<string>('INV-2026-001');
  const [searchedTransaction, setSearchedTransaction] = useState<StnkTransaction | null>(
    mockTransactions.find(t => t.id === 'INV-2026-001') || null
  );
  const [errorText, setErrorText] = useState<string>('');

  // Create Custom Simulation State
  const [showCreator, setShowCreator] = useState<boolean>(false);
  const [customTransactions, setCustomTransactions] = useState<StnkTransaction[]>([]);
  const [newCustomerName, setNewCustomerName] = useState<string>('');
  const [newPlate, setNewPlate] = useState<string>('');
  const [newService, setNewService] = useState<string>('Perpanjang STNK 5 Tahunan');
  const [newStatus, setNewStatus] = useState<DocumentStatus>('Cek Fisik');

  const handleSearch = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery || searchQuery).trim().toUpperCase();
    
    // Look in default + custom txs
    const allTxs = [...mockTransactions, ...customTransactions];
    const found = allTxs.find(t => t.id === query);

    if (found) {
      setSearchedTransaction(found);
      setErrorText('');
    } else {
      setSearchedTransaction(null);
      setErrorText(`Nomor resi / invoice "${query}" tidak ditemukan di database sandbox. Silakan coba salah satu invoice contoh di bawah ini atau buat resi kustom.`);
    }
  };

  const handleCreateCustomResi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newPlate) return;

    const newId = `INV-TEST-${Math.floor(100 + Math.random() * 900)}`;
    const timeNow = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newTx: StnkTransaction = {
      id: newId,
      tenantName: 'SatuJasa - Cabang Kustom Anda',
      customerName: newCustomerName,
      vehiclePlate: newPlate.toUpperCase(),
      vehicleModel: 'Honda PCX 160 / Toyota Innova',
      serviceType: newService,
      grandTotal: 350000,
      status: newStatus,
      updatedAt: 'Baru saja dibuat',
      progressHistory: [
        { status: 'Menerima Berkas', time: timeNow, description: 'Berkas diterima lengkap di meja administrasi cabang.', completed: true },
        { status: 'Cek Fisik', time: newStatus !== 'Menerima Berkas' ? timeNow : 'Pending', description: 'Nomor mesin & rangka lolos uji cek fisik di Samsat regional.', completed: newStatus !== 'Menerima Berkas' },
        { status: 'Proses Samsat', time: (newStatus === 'Proses Samsat' || newStatus === 'STNK Selesai') ? timeNow : 'Pending', description: 'Loket administrasi Samsat sedang mencetak plat nomor & lembar pajak.', completed: (newStatus === 'Proses Samsat' || newStatus === 'STNK Selesai') },
        { status: 'STNK Selesai', time: newStatus === 'STNK Selesai' ? timeNow : 'Pending', description: 'Dokumen STNK resmi telah diterbitkan kembali dan divalidasi.', completed: newStatus === 'STNK Selesai' },
      ]
    };

    setCustomTransactions(prev => [newTx, ...prev]);
    setSearchedTransaction(newTx);
    setSearchQuery(newId);
    setErrorText('');
    
    // Clear creator form
    setNewCustomerName('');
    setNewPlate('');
    setShowCreator(false);
  };

  // Pre-filled search triggers
  const handleQuickFill = (id: string) => {
    setSearchQuery(id);
    handleSearch(undefined, id);
  };

  // Stepper helper
  const stages: { key: DocumentStatus; label: string }[] = [
    { key: 'Menerima Berkas', label: 'Berkas Masuk' },
    { key: 'Cek Fisik', label: 'Cek & Gesek Fisik' },
    { key: 'Proses Samsat', label: 'Proses Loket Samsat' },
    { key: 'STNK Selesai', label: 'STNK Selesai Cetak' }
  ];

  const getStageIndex = (status: DocumentStatus) => {
    const keys = stages.map(s => s.key);
    return keys.indexOf(status);
  };

  return (
    <section className="bg-slate-900 py-20 text-white border-b border-slate-950" id="tracking-sandbox">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text / Guide Panel */}
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 text-xs font-bold text-blue-400 mb-4">
              <Smartphone className="h-3.5 w-3.5" />
              Portal Mandiri untuk Customer Anda
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Hilangkan 90% Chat WhatsApp yang Bertanya Status Berkas
            </h2>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed font-normal">
              Customer cukup memindai kode QR nota pembayaran atau memasukkan nomor resi pada HP mereka. Halaman tracking interaktif ini siap pakai pada subdomain bisnis Anda tanpa perlu biaya tambahan.
            </p>

            {/* Quick Fill Action Badges */}
            <div className="mt-8">
              <span className="text-xs font-bold text-slate-400 block mb-3">Klik salah satu resi sampel untuk demo:</span>
              <div className="flex flex-wrap gap-2">
                {mockTransactions.map((tx) => (
                  <button
                    key={tx.id}
                    onClick={() => handleQuickFill(tx.id)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                      searchQuery === tx.id
                        ? 'bg-blue-600 text-white border border-blue-600'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-750 border border-slate-700'
                    }`}
                  >
                    🚀 {tx.id} ({tx.status})
                  </button>
                ))}
              </div>
            </div>

            {/* Sandbox Creator Switcher button */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <button
                onClick={() => setShowCreator(!showCreator)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-750 px-4 py-2.5 text-xs font-bold text-slate-200 cursor-pointer"
                id="toggle-custom-resi-creator"
              >
                <Plus className="h-4 w-4 text-emerald-400" />
                Daftar & Buat Resi Simulasi Baru
              </button>
            </div>
          </div>

          {/* Right Live Interactive Phone/Tracker Frame */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border-8 border-slate-800 bg-slate-950 p-4 md:p-6 shadow-2xl relative min-h-[480px] flex flex-col justify-between">
              
              {/* Phone Camera Notch simulator */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4.5 w-24 bg-slate-800 rounded-full z-10" />

              {/* Top Sandbox Creator Form overlay */}
              {showCreator ? (
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 mb-4">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
                    Buat Resi / Invoice Simulasi Baru
                  </h4>
                  <form onSubmit={handleCreateCustomResi} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Nama Pemilik STNK (Ariel / Susi)"
                        value={newCustomerName}
                        onChange={e => setNewCustomerName(e.target.value)}
                        className="rounded border border-slate-800 bg-slate-950 p-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Plat Kendaraan (B 1234 XYZ)"
                        value={newPlate}
                        onChange={e => setNewPlate(e.target.value)}
                        className="rounded border border-slate-800 bg-slate-950 p-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newService}
                        onChange={e => setNewService(e.target.value)}
                        className="rounded border border-slate-800 bg-slate-950 p-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                      >
                        <option>Perpanjang STNK Mobil</option>
                        <option>Balik Nama Motor</option>
                        <option>Mutasi Keluar Kabupaten</option>
                      </select>

                      <select
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value as DocumentStatus)}
                        className="rounded border border-slate-800 bg-slate-950 p-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                      >
                        <option value="Menerima Berkas">1. Berkas Masuk</option>
                        <option value="Cek Fisik">2. Cek Fisik Selesai</option>
                        <option value="Proses Samsat">3. Sedang di Samsat</option>
                        <option value="STNK Selesai">4. STNK Selesai Cetak</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-1.5 text-xs font-bold text-white transition-all cursor-pointer"
                      >
                        Simpan & Tampilkan Tracking
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreator(false)}
                        className="rounded-xl bg-slate-800 hover:bg-slate-750 px-3 py-1.5 text-xs font-bold text-slate-300"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {/* Main Search Input Form for Clients */}
              <div className="mb-4">
                <form onSubmit={(e) => handleSearch(e)} className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Masukkan Nomor Resi STNK..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-white placeholder-slate-600 font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-xs px-4 py-2.5 shadow-lg shadow-blue-500/20 cursor-pointer"
                    id="submit-resi-search-btn"
                  >
                    Lacak Berkas
                  </button>
                </form>

                {errorText && (
                  <p className="mt-2 text-[10px] text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    ⚠️ {errorText}
                  </p>
                )}
              </div>

              {/* Tracking Result Screen */}
              {searchedTransaction ? (
                <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 flex-1 flex flex-col justify-between">
                  
                  {/* Customer Information Header */}
                  <div className="pb-3 border-b border-slate-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pemilik / Kendaraan</h4>
                        <p className="text-sm font-bold text-white mt-0.5">{searchedTransaction.customerName}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block rounded bg-zinc-800 px-2 py-0.5 text-xs font-mono font-extrabold text-teal-400 shadow-inner">
                          {searchedTransaction.vehiclePlate}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                      <div>
                        <span>Nomor Invoice:</span>
                        <p className="font-mono text-white font-bold">{searchedTransaction.id}</p>
                      </div>
                      <div>
                        <span>Layanan Samsat:</span>
                        <p className="text-white font-bold">{searchedTransaction.serviceType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progressive Timeline checklist */}
                  <div className="py-4 space-y-3.5 relative flex-1 my-2">
                    
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-800" />

                    {stages.map((stg, sIndex) => {
                      const isActive = getStageIndex(searchedTransaction.status) >= sIndex;
                      const isCurrent = searchedTransaction.status === stg.key;
                      
                      return (
                        <div key={stg.key} className="flex gap-4 items-start relative z-10">
                          {/* Indicator Circle */}
                          <div className={`h-5.5 w-5.5 rounded-full flex items-center justify-center border transition-all ${
                            isActive
                              ? isCurrent
                                ? 'bg-blue-600 border-blue-500 text-white animate-pulse'
                                : 'bg-emerald-500 border-emerald-400 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-600'
                          }`}>
                            {isActive ? (
                              isCurrent ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <span className="text-[9px] font-mono">{sIndex + 1}</span>
                            )}
                          </div>

                          {/* Detail Texts */}
                          <div className="flex-1 text-xs">
                            <div className="flex justify-between">
                              <span className={`font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-600'}`}>
                                {stg.label}
                              </span>
                              {isActive && (
                                <span className="text-[9px] text-slate-500">Terlewati</span>
                              )}
                            </div>
                            {isCurrent && (
                              <p className="text-[10px] text-slate-400 mt-1 leading-normal italic bg-slate-950 p-2 rounded border border-slate-800">
                                {searchedTransaction.progressHistory.find(h => h.status === stg.key)?.description || 'Sedang dikerjakan.'}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Handle special 'Terhambat' alert display */}
                    {searchedTransaction.status === 'Terhambat' && (
                      <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2 mt-4 animate-bounce">
                        <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-rose-400 mt-0.5" />
                        <div>
                          <strong className="text-white block font-bold">⚠️ Syarat Berkas Terhambat:</strong>
                          {searchedTransaction.progressHistory.find(h => h.status === 'Terhambat')?.description}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Customer action button */}
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-medium font-mono">
                    <span>Diperbarui pada: {searchedTransaction.updatedAt}</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                      🔒 Secured SSL
                    </span>
                  </div>

                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-10 flex-grow flex flex-col items-center justify-center text-center">
                  <span className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-500 mb-3 font-bold text-lg font-serif">?</span>
                  <p className="text-sm text-slate-400">Silakan masukkan invoice di atas atau klik salah satu nomor resi contoh.</p>
                </div>
              )}

              {/* Secure certification seal */}
              <div className="mt-4 text-center text-[9px] text-slate-600 tracking-wider">
                PROSES ENKRIPSI NOMOR RANGKA & MESIN TERLINDUNGI PPDB BIRO JASA KORLANTAS POLRI
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
