const features = [
  {
    icon: 'inventory_2',
    title: 'Manajemen Transaksi',
    desc: 'Input data STNK/BPKB, biaya, dan estimasi waktu selesai dalam sekejap.',
  },
  {
    icon: 'public',
    title: 'Tracking Publik',
    desc: 'Link tracking khusus untuk pelanggan tanpa perlu login ke sistem.',
  },
  {
    icon: 'hub',
    title: 'Multi Cabang',
    desc: 'Kelola banyak lokasi operasional dalam satu platform dashboard pusat.',
  },
  {
    icon: 'analytics',
    title: 'Revenue Analytics',
    desc: 'Analisis omzet dan profit harian, mingguan, hingga bulanan secara otomatis.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-surface-container py-24" id="features">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <p className="text-label-sm font-bold uppercase tracking-[0.18em] text-primary">
            Fitur inti
          </p>
          <h2 className="max-w-3xl text-headline-lg font-extrabold tracking-[-0.04em]">
            Dibuat untuk alur kerja biro jasa, bukan dashboard generik.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          {features.map(({ icon, title, desc }, index) => (
            <article
              key={title}
              className={`rounded-[2rem] bg-surface-container-lowest p-7 ring-1 ring-outline-variant/70 transition-transform hover:-translate-y-1 ${index === 0 ? 'lg:row-span-2 lg:p-9' : ''}`}
            >
              <span className="material-symbols-outlined mb-6 block text-3xl text-primary">
                {icon}
              </span>
              <h3 className="mb-3 text-[20px] font-extrabold tracking-[-0.02em]">{title}</h3>
              <p className="mb-6 text-sm leading-6 text-on-surface-variant">{desc}</p>
              <button className="flex items-center gap-2 text-label-sm font-bold text-primary transition-colors hover:text-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                Pelajari selengkapnya
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
