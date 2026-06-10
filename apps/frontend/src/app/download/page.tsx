import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';

const platforms = [
  {
    icon: 'desktop_windows',
    title: 'Web Based untuk PC',
    desc: 'Akses dashboard SatuJasa dari browser desktop untuk owner, admin cabang, dan operasional harian.',
    cta: 'Buka Web App',
    href: '/auth/signin',
  },
  {
    icon: 'android',
    title: 'APK Android untuk Mobile',
    desc: 'Gunakan aplikasi mobile untuk pekerjaan lapangan, pengecekan status, dan update proses lebih cepat.',
    cta: 'APK Segera Tersedia',
    href: '#apk-status',
  },
];

const features = [
  'Satu akun untuk akses web dan mobile',
  'Data transaksi tetap tersinkron antar perangkat',
  'Cocok untuk tim kantor dan tim lapangan',
];

export const metadata = {
  title: 'Download SatuJasa - Web Based & APK Android',
  description: 'Download aplikasi SatuJasa untuk Android dan akses dashboard web based dari PC.',
};

export default function DownloadPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-on-background">
      <div className="landing-texture absolute inset-0 -z-20 opacity-60" />
      <div className="absolute -right-28 top-24 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 left-8 -z-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />

      <Navbar fixed={false} />

      <section className="mx-auto max-w-container-max px-margin-mobile pb-20 pt-16 md:px-margin-desktop md:pb-28 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="mb-6 inline-flex rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-sm font-bold uppercase tracking-[0.18em] text-primary">
              Download aplikasi
            </p>
            <h1 className="max-w-4xl text-[44px] font-extrabold leading-[0.98] tracking-[-0.06em] text-on-surface md:text-[72px] lg:text-[86px]">
              SatuJasa bisa dipakai di PC dan Android.
            </h1>
          </div>
          <div className="rounded-[2rem] bg-inverse-surface p-6 text-inverse-on-surface soft-shadow md:p-8">
            <p className="text-body-lg leading-8 text-inverse-on-surface/78">
              Gunakan dashboard web based saat bekerja dari komputer, lalu lanjutkan operasional mobile
              lewat APK Android saat tim berada di lapangan.
            </p>
            <ul className="mt-8 space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm font-bold">
                  <span className="material-symbols-outlined mt-0.5 text-[20px] text-primary-fixed-dim">
                    check_circle
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2" id="apk-status">
          {platforms.map((platform) => (
            <article
              key={platform.title}
              className="rounded-[2rem] border border-outline-variant/70 bg-surface-container-lowest p-7 shadow-sm md:p-8"
            >
              <span className="material-symbols-outlined mb-8 block text-[42px] text-primary">
                {platform.icon}
              </span>
              <h2 className="mb-4 text-[28px] font-extrabold tracking-[-0.04em] text-on-surface">
                {platform.title}
              </h2>
              <p className="mb-8 leading-7 text-on-surface-variant">{platform.desc}</p>
              <Link
                href={platform.href}
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-label-md font-bold text-on-primary transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed-dim"
              >
                {platform.cta}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] border border-dashed border-outline bg-surface-container p-6 text-sm leading-7 text-on-surface-variant">
          File APK belum tersedia di repository. Setelah APK siap, letakkan di folder publik dan tombol
          Android bisa diarahkan langsung ke file download.
        </div>
      </section>
    </main>
  );
}
