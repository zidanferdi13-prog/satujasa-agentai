import Image from 'next/image';
import splash from '../../../assets/dashboard-superadmin.png';

const features = [
  {
    title: 'Transaksi punya jejak',
    desc: 'Setiap order punya status, biaya, dan riwayat update yang mudah dibuka kembali.',
  },
  {
    title: 'Nomor plat punya riwayat',
    desc: 'Admin tidak perlu mengulang pencarian dari nol saat pelanggan lama datang lagi.',
  },
  {
    title: 'Owner melihat semua cabang',
    desc: 'Pantau performa lokasi, admin, dan revenue dari satu ruang kerja yang sama.',
  },
];

const floatingTags = ['B 1842 XX • Diproses', 'WA update terkirim', 'Cabang Selatan'];

export default function SolutionSection() {
  return (
    <section className="py-20 md:py-28 overflow-hidden" id="solutions">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <figure className="relative overflow-hidden rounded-[36px] bg-[#0b1f3a] p-5 shadow-[0_28px_80px_rgba(11,31,58,0.18)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(97,97,255,0.34),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.18),transparent_26%)]" />
              <Image
                src={splash}
                alt="Tampilan dashboard operasional SatuJasa"
                className="relative mx-auto max-h-[540px] w-full object-contain object-top"
              />
            </figure>
            <div className="pointer-events-none absolute inset-x-4 -bottom-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {floatingTags.map((tag) => (
                <div key={tag} className="rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-center text-[11px] font-black text-[var(--landing-muted)] shadow-[0_14px_32px_rgba(43,50,91,0.14)] backdrop-blur">
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-primary font-bold tracking-[0.18em] text-xs uppercase">
              Solusi SatuJasa
            </span>
            <h2 className="mt-4 mb-6 text-[32px] md:text-[52px] leading-[0.98] tracking-[-0.045em] font-black text-[var(--landing-ink)]">
              Dari loket sampai laporan owner, satu alur yang sama.
            </h2>
            <p className="mb-8 text-base md:text-lg leading-8 text-[var(--landing-muted)]">
              SatuJasa merapikan kerja harian biro jasa: admin cukup update status berkas, owner langsung membaca kondisi cabang, pelanggan tidak perlu menebak progres.
            </p>
            <ul className="space-y-4">
              {features.map(({ title, desc }) => (
                <li key={title} className="flex items-start gap-4 rounded-3xl border border-[rgba(208,212,228,0.68)] bg-white p-4 shadow-[0_12px_34px_rgba(43,50,91,0.06)]">
                  <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#eeefff]">
                    <span className="material-symbols-outlined text-sm text-[#6161ff]">done</span>
                  </div>
                  <div>
                    <p className="font-black text-[var(--landing-ink)]">{title}</p>
                    <p className="text-sm leading-6 text-[var(--landing-muted)]">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
