import Link from 'next/link';
import splash from '../../../assets/splash.png';

export default function HeroSection() {
  return (
    <header className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="landing-texture absolute inset-0 -z-20 opacity-60" />
      <div className="absolute -right-28 top-24 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 left-8 -z-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />

      <div className="mx-auto grid max-w-container-max grid-cols-1 items-end gap-12 px-margin-mobile md:px-margin-desktop lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-sm font-bold uppercase tracking-[0.18em] text-primary">
            Platform kerja biro jasa STNK
          </p>
          <h1 className="mb-7 text-[44px] font-extrabold leading-[0.98] tracking-[-0.06em] text-on-surface md:text-[72px] lg:text-[86px]">
            Operasional STNK yang tidak lagi tercecer.
          </h1>
          <p className="mb-10 max-w-2xl text-body-lg text-on-surface-variant md:text-[20px]">
            SatuJasa membantu biro jasa mencatat transaksi, memantau proses dokumen,
            memberi kabar pelanggan, dan membaca performa cabang dari satu ruang kerja.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-label-md font-bold text-on-primary shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed-dim"
            >
              Daftar SatuJasa
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-lowest px-8 py-4 text-label-md font-bold text-primary transition-colors hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Masuk ke Dashboard
            </Link>
          </div>
        </div>

        <div className="relative lg:pb-4">
          <div className="glass-card soft-shadow relative overflow-hidden rounded-[2rem] p-3 md:p-4">
            <div className="relative overflow-hidden rounded-[1.6rem] bg-inverse-surface">
              <img
                src={splash.src}
                alt="Tampilan aplikasi SatuJasa"
                className="mx-auto block max-h-[620px] w-full object-contain object-top"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-3xl bg-surface-container-lowest/92 p-4 shadow-sm backdrop-blur md:inset-x-6 md:bottom-6">
                <p className="text-label-sm uppercase tracking-[0.14em] text-primary">Aset aplikasi asli</p>
                <p className="mt-1 text-sm font-bold text-on-surface md:text-base">
                  Visual landing sekarang memakai splash screen lokal, bukan mockup generik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
