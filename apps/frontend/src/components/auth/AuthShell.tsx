import Link from 'next/link';
import icon from '../../../assets/icon.png';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

const benefits = [
  'Dashboard web untuk owner dan admin cabang',
  'Akses mobile Android untuk pekerjaan lapangan',
  'Data transaksi dan status dokumen tetap tersinkron',
];

export default function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-on-background">
      <div className="landing-texture absolute inset-0 -z-20 opacity-60" />
      <div className="absolute -right-28 top-20 -z-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-24 left-8 -z-10 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />

      <section className="mx-auto grid min-h-screen max-w-container-max grid-cols-1 gap-10 px-margin-mobile py-8 md:px-margin-desktop lg:grid-cols-[0.92fr_0.78fr] lg:items-center lg:gap-20">
        <aside className="hidden self-center lg:block">
          <div className="mb-10 flex items-center justify-between gap-6">
            <Link href="/" className="inline-flex items-center gap-3 text-[20px] font-extrabold tracking-[-0.03em] text-primary">
              <img src={icon.src} alt="" className="h-10 w-10 rounded-2xl" />
              <span>STNK SatuJasa</span>
            </Link>
            <p className="inline-flex shrink-0 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-sm font-bold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
          </div>

          <h1 className="max-w-2xl text-[50px] font-extrabold leading-[0.98] tracking-[-0.055em] text-on-surface xl:text-[58px]">
            {title}
          </h1>
          <p className="mt-7 max-w-xl text-body-lg leading-8 text-on-surface-variant">
            {description}
          </p>

          <div className="mt-10 rounded-[2rem] bg-inverse-surface p-6 text-inverse-on-surface soft-shadow">
            <p className="text-label-sm font-bold uppercase tracking-[0.16em] text-primary-fixed-dim">
              Satu platform
            </p>
            <ul className="mt-5 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm font-bold leading-6">
                  <span className="material-symbols-outlined mt-0.5 text-[20px] text-primary-fixed-dim">
                    check_circle
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center pt-10 md:pt-14 lg:min-h-0 lg:items-center lg:pt-0">
          <div className="w-full max-w-[460px]">
            <Link href="/" className="mb-8 flex items-center gap-3 text-[18px] font-extrabold tracking-[-0.03em] text-primary lg:hidden">
              <img src={icon.src} alt="" className="h-9 w-9 rounded-xl" />
              <span>STNK SatuJasa</span>
            </Link>
            <div className="rounded-[2rem] border border-outline-variant/70 bg-surface-container-lowest/95 p-6 shadow-sm backdrop-blur md:p-7">
              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
