'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, Plus, Search, Smartphone } from 'lucide-react';
import { mockTransactions, type StnkTransaction, type DocumentStatus } from '@/data/landing';

export default function PublicTracker() {
  const [searchQuery, setSearchQuery] = useState<string>('INV-2026-001');
  const [searchedTransaction, setSearchedTransaction] = useState<StnkTransaction | null>(
    mockTransactions.find((t) => t.id === 'INV-2026-001') || null
  );
  const [errorText, setErrorText] = useState<string>('');

  const [showCreator, setShowCreator] = useState<boolean>(false);
  const [customTransactions, setCustomTransactions] = useState<StnkTransaction[]>([]);
  const [newCustomerName, setNewCustomerName] = useState<string>('');
  const [newPlate, setNewPlate] = useState<string>('');
  const [newService, setNewService] = useState<string>('Perpanjang STNK 5 Tahunan');
  const [newStatus, setNewStatus] = useState<DocumentStatus>('Cek Fisik');

  const handleSearch = (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault();
    const query = (customQuery || searchQuery).trim().toUpperCase();

    const allTxs = [...mockTransactions, ...customTransactions];
    const found = allTxs.find((t) => t.id === query);

    if (found) {
      setSearchedTransaction(found);
      setErrorText('');
    } else {
      setSearchedTransaction(null);
      setErrorText(`Nomor resi / invoice "${query}" tidak ditemukan di database sandbox.`);
    }
  };

  const handleCreateCustomResi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newPlate) return;

    const newId = `INV-TEST-${Math.floor(100 + Math.random() * 900)}`;
    const timeNow = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

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
      ],
    };

    setCustomTransactions((prev) => [newTx, ...prev]);
    setSearchedTransaction(newTx);
    setSearchQuery(newId);
    setErrorText('');
    setNewCustomerName('');
    setNewPlate('');
    setShowCreator(false);
  };

  const stages: { key: DocumentStatus; label: string }[] = [
    { key: 'Menerima Berkas', label: 'Berkas Masuk' },
    { key: 'Cek Fisik', label: 'Cek & Gesek Fisik' },
    { key: 'Proses Samsat', label: 'Proses Loket Samsat' },
    { key: 'STNK Selesai', label: 'STNK Selesai Cetak' },
  ];

  return (
    <section className="border-b border-slate-950 bg-slate-900 py-20 text-white" id="tracking-sandbox">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-400">
              <Smartphone className="h-3.5 w-3.5" />
              Portal Mandiri untuk Customer Anda
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Hilangkan 90% Chat WhatsApp yang Bertanya Status Berkas
            </h2>
            <p className="mt-4 text-sm font-normal leading-relaxed text-slate-300">
              Customer cukup memindai kode QR nota pembayaran atau memasukkan nomor resi pada HP mereka. Halaman tracking interaktif ini siap pakai pada subdomain bisnis Anda tanpa perlu biaya tambahan.
            </p>

            <div className="mt-8">
              <span className="mb-3 block text-xs font-bold text-slate-400">Klik salah satu resi sampel untuk demo:</span>
              <div className="flex flex-wrap gap-2">
                {mockTransactions.map((tx) => (
                  <button
                    key={tx.id}
                    type="button"
                    onClick={() => { setSearchQuery(tx.id); handleSearch(undefined, tx.id); }}
                    className={`cursor-pointer rounded-lg border px-2.5 py-1.5 font-mono text-xs font-bold transition-all ${
                      searchQuery === tx.id
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-750'
                    }`}
                  >
                    🚀 {tx.id} ({tx.status})
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800 pt-6">
              <button
                type="button"
                onClick={() => setShowCreator(!showCreator)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-750 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-750"
              >
                <Plus className="h-4 w-4 text-emerald-400" />
                Daftar & Buat Resi Simulasi Baru
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative flex min-h-[480px] flex-col justify-between rounded-3xl border-8 border-slate-800 bg-slate-950 p-4 shadow-2xl md:p-6">
              <div className="absolute left-1/2 top-2 z-10 h-4.5 w-24 -translate-x-1/2 rounded-full bg-slate-800" />

              {showCreator ? (
                <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Buat Resi / Invoice Simulasi Baru
                  </h4>
                  <form onSubmit={handleCreateCustomResi} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" required placeholder="Nama (Ariel / Susi)" value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} className="rounded border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                      <input type="text" required placeholder="Plat (B 1234 XYZ)" value={newPlate} onChange={e => setNewPlate(e.target.value)} className="rounded border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select value={newService} onChange={e => setNewService(e.target.value)} className="rounded border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option>Perpanjang STNK Mobil</option>
                        <option>Balik Nama Motor</option>
                        <option>Mutasi Keluar Kabupaten</option>
                      </select>
                      <select value={newStatus} onChange={e => setNewStatus(e.target.value as DocumentStatus)} className="rounded border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option value="Menerima Berkas">1. Berkas Masuk</option>
                        <option value="Cek Fisik">2. Cek Fisik Selesai</option>
                        <option value="Proses Samsat">3. Sedang di Samsat</option>
                        <option value="STNK Selesai">4. STNK Selesai Cetak</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 cursor-pointer rounded-xl bg-emerald-600 py-1.5 text-xs font-bold text-white hover:bg-emerald-500">Simpan & Tampilkan</button>
                      <button type="button" onClick={() => setShowCreator(false)} className="cursor-pointer rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300">Batal</button>
                    </div>
                  </form>
                </div>
              ) : null}

              <div className="mb-4">
                <form onSubmit={(e) => handleSearch(e)} className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
                    <input type="text" required placeholder="Masukkan Nomor Resi STNK..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 pl-10 pr-3 text-sm font-bold text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <button type="submit" className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500">
                    Lacak Berkas
                  </button>
                </form>
                {errorText && (
                  <p className="mt-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-[10px] text-rose-400">
                    ⚠️ {errorText}
                  </p>
                )}
              </div>

              {searchedTransaction ? (
                <div className="flex flex-1 flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <div className="border-b border-slate-800 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pemilik / Kendaraan</h4>
                        <p className="mt-0.5 text-sm font-bold text-white">{searchedTransaction.customerName}</p>
                      </div>
                      <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-xs font-extrabold text-teal-400 shadow-inner">
                        {searchedTransaction.vehiclePlate}
                      </span>
                    </div>
                  </div>

                  <div className="relative my-2 flex-1 space-y-3.5 py-4">
                    <div className="absolute bottom-2 left-[9px] top-2 w-0.5 bg-slate-800" />
                    {stages.map((stg, sIndex) => {
                      const isActive = stages.findIndex((s) => s.key === searchedTransaction.status) >= sIndex;
                      const isCurrent = searchedTransaction.status === stg.key;
                      return (
                        <div key={stg.key} className="relative z-10 flex items-start gap-4">
                          <div className={`flex h-5.5 w-5.5 items-center justify-center rounded-full border transition-all ${
                            isActive ? (isCurrent ? 'animate-pulse border-blue-500 bg-blue-600 text-white' : 'border-emerald-400 bg-emerald-500 text-white') : 'border-slate-800 bg-slate-950 text-slate-600'
                          }`}>
                            {isActive ? (isCurrent ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />) : <span className="font-mono text-[9px]">{sIndex + 1}</span>}
                          </div>
                          <div className="flex-1 text-xs">
                            <div className="flex justify-between">
                              <span className={`font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-600'}`}>{stg.label}</span>
                              {isActive ? <span className="text-[9px] text-slate-500">Terlewati</span> : null}
                            </div>
                            {isCurrent ? (
                              <p className="mt-1 rounded border border-slate-800 bg-slate-950 p-2 text-[10px] italic leading-normal text-slate-400">
                                {searchedTransaction.progressHistory.find(h => h.status === stg.key)?.description || 'Sedang dikerjakan.'}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 font-mono text-[10px] font-medium text-slate-500">
                    <span>Diperbarui pada: {searchedTransaction.updatedAt}</span>
                    <span className="flex items-center gap-0.5 font-bold text-emerald-500">🔒 Secured SSL</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
