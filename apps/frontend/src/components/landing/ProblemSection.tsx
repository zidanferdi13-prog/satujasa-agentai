const problems = [
  {
    icon: 'search_off',
    title: 'Tracking Sulit',
    desc: 'Bingung mencari status dokumen pelanggan di tumpukan berkas manual?',
  },
  {
    icon: 'chat_error',
    title: 'Spam Pertanyaan',
    desc: 'Lelah membalas chat "Sudah sampai mana?" dari puluhan pelanggan setiap jam?',
  },
  {
    icon: 'account_tree',
    title: 'Data Terpencar',
    desc: 'Data antar cabang tidak sinkron dan sulit untuk diawasi secara real-time?',
  },
  {
    icon: 'query_stats',
    title: 'Laporan Buram',
    desc: 'Sulit menghitung laba bersih karena pencatatan pengeluaran yang tidak rapi.',
  },
];

export default function ProblemSection() {
  return (
    <section className="py-24 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest text-label-sm uppercase">
            Tantangan Bisnis
          </span>
          <h2 className="font-headline-lg text-headline-lg mt-4">
            Masih Kelola Bisnis Jasa Secara Manual?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="p-8 rounded-3xl bg-background hover:bg-surface-container transition-colors group"
            >
              <span className="material-symbols-outlined text-4xl text-error mb-4 block">
                {icon}
              </span>
              <h3 className="font-headline-md text-headline-md mb-4 text-[20px]">{title}</h3>
              <p className="text-on-surface-variant">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
