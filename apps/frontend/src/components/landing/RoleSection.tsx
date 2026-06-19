const roles = [
  {
    icon: 'store',
    title: 'Owner',
    desc: 'Melihat laporan semua cabang, paket aktif, revenue, dan aktivitas admin.',
  },
  {
    icon: 'person',
    title: 'Admin Cabang',
    desc: 'Input transaksi, update status berkas, dan mengelola komunikasi pelanggan.',
  },
  {
    icon: 'visibility',
    title: 'Pelanggan',
    desc: 'Cek status lewat link tracking tanpa perlu login ke dashboard internal.',
  },
];

export default function RoleSection() {
  return (
    <section className="bg-[#0b1f3a] py-20 md:py-28 text-white">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="text-[#fff3bf] font-bold tracking-[0.18em] text-xs uppercase">
              Akses per peran
            </span>
            <h2 className="mt-4 mb-6 text-[32px] md:text-[52px] leading-[0.98] tracking-[-0.045em] font-black">
              Satu sistem, kontrol berbeda untuk tiap tim.
            </h2>
            <p className="text-white/70 mb-8 text-base md:text-lg leading-8">
              Owner membaca performa, admin mengurus proses, pelanggan cukup melihat status. Data sensitif tetap berada di role yang tepat.
            </p>
            <div className="space-y-3 max-w-lg">
              {roles.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 flex gap-3 backdrop-blur"
                >
                  <span className="material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-[#fff3bf] text-xl">{icon}</span>
                  <div>
                    <p className="font-black text-white text-sm">{title}</p>
                    <p className="text-xs leading-relaxed text-white/60">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-[36px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
            <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_30%_20%,rgba(97,97,255,0.35),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.18),transparent_28%)]" />
            <div className="relative space-y-4">
              <div className="rounded-[28px] bg-white p-5 text-[#1d2433] shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
                <div className="mb-4 flex items-center justify-between text-xs font-black text-[#535768]">
                  <span>Owner view</span>
                  <span className="rounded-full bg-[#eeefff] px-3 py-1 text-[#6161ff]">Semua cabang</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['3 Tenant', '128 Berkas', '98.2% Sukses'].map((item) => (
                    <div key={item} className="rounded-2xl bg-[#f5f6f8] p-3 text-xs font-black">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white/90 p-4 text-[#1d2433]">
                  <p className="text-xs font-black text-[#6161ff]">Admin Cabang</p>
                  <p className="mt-2 text-sm font-black">B 1842 XX</p>
                  <p className="text-xs text-[#535768]">Status: Diproses Samsat</p>
                </div>
                <div className="rounded-[24px] bg-[#fff3bf] p-4 text-[#8a5a00]">
                  <p className="text-xs font-black uppercase tracking-[0.12em]">Pelanggan</p>
                  <p className="mt-2 text-sm font-black">Update terkirim</p>
                  <p className="text-xs opacity-75">Link tracking aktif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
