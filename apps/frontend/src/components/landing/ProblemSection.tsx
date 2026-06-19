const problems = [
  {
    icon: 'manage_search',
    label: 'Status',
    title: 'Status berkas sulit dicari',
    desc: 'Tim harus membuka chat, catatan, dan tumpukan map hanya untuk menjawab satu pelanggan.',
  },
  {
    icon: 'forum',
    label: 'Chat',
    title: 'Pertanyaan pelanggan menumpuk',
    desc: 'Update “sudah sampai mana?” datang terus karena pelanggan tidak punya tempat cek sendiri.',
  },
  {
    icon: 'account_tree',
    label: 'Cabang',
    title: 'Cabang jalan sendiri-sendiri',
    desc: 'Owner sulit tahu transaksi, admin, dan performa tiap lokasi tanpa rekap manual.',
  },
  {
    icon: 'query_stats',
    label: 'Laporan',
    title: 'Profit tidak terlihat jelas',
    desc: 'Omzet, biaya, dan status proses tercatat terpisah sehingga keputusan bisnis terlambat.',
  },
];

export default function ProblemSection() {
  return (
    <section className="landing-dossier-grid bg-white py-20 md:py-28">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-primary font-bold tracking-[0.18em] text-xs uppercase">
            Sebelum ada ruang kendali
          </span>
          <h2 className="mt-4 text-[32px] md:text-[52px] leading-[0.98] tracking-[-0.045em] font-black text-[var(--landing-ink)]">
            Masalahnya bukan kurang kerja keras. Datanya terlalu menyebar.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map(({ icon, label, title, desc }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-[28px] border border-[rgba(208,212,228,0.72)] bg-[rgba(255,255,255,0.86)] p-6 shadow-[0_18px_55px_rgba(43,50,91,0.07)] transition-transform hover:-translate-y-1"
            >
              <div className="mb-8 inline-flex rounded-full bg-[#fff3bf] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#8a5a00]">
                {label}
              </div>
              <span className="material-symbols-outlined mb-4 block text-4xl text-[#ef4444]">
                {icon}
              </span>
              <h3 className="mb-3 text-xl font-black tracking-[-0.03em] text-[var(--landing-ink)]">{title}</h3>
              <p className="text-sm leading-7 text-[var(--landing-muted)]">{desc}</p>
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#6161ff]/5 transition-transform group-hover:scale-125" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
