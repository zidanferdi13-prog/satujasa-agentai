import splash from '../../../assets/splash.png';

const features = [
  {
    title: 'Transaction Lifecycle',
    desc: 'Pantau tiap tahap berkas dari draft hingga selesai.',
  },
  {
    title: 'Database Kendaraan Terpusat',
    desc: 'History lengkap setiap nomor plat yang pernah diproses.',
  },
  {
    title: 'Branch Monitoring',
    desc: 'Akses data semua cabang dalam satu login Owner.',
  },
];

export default function SolutionSection() {
  return (
    <section className="py-24 overflow-hidden" id="solutions">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <figure className="soft-shadow overflow-hidden rounded-[2rem] bg-inverse-surface p-4">
              <img
                src={splash.src}
                alt="Splash screen aplikasi SatuJasa"
                className="mx-auto max-h-[540px] w-full object-contain object-top"
              />
            </figure>
          </div>
          <div className="lg:w-1/2">
            <span className="text-primary font-bold tracking-widest text-label-sm uppercase">
              Solusi SatuJasa
            </span>
            <h2 className="font-headline-lg text-headline-lg mt-4 mb-6">
              Pusat Kendali Bisnis Jasa STNK Anda
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
              Kami menghadirkan infrastruktur digital yang dirancang khusus untuk alur kerja
              biro jasa. Dari pendaftaran pelanggan hingga pelaporan owner.
            </p>
            <ul className="space-y-4">
              {features.map(({ title, desc }) => (
                <li key={title} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm">done</span>
                  </div>
                  <div>
                    <p className="font-bold">{title}</p>
                    <p className="text-on-surface-variant text-sm">{desc}</p>
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
