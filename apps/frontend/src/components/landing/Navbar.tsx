import Link from 'next/link';
import icon from '../../../assets/icon.png';

type NavbarProps = {
  fixed?: boolean;
};

const navLinks = [
  { label: 'Fitur', href: '/#features' },
  { label: 'Solusi', href: '/#solutions' },
  { label: 'Harga', href: '/#pricing' },
  { label: 'Download', href: '/download' },
  { label: 'FAQ', href: '/#faq' },
];

export default function Navbar({ fixed = true }: NavbarProps) {
  return (
    <nav
      className={
        fixed
          ? 'fixed left-0 right-0 top-4 z-50 px-margin-mobile md:px-margin-desktop'
          : 'px-margin-mobile pt-4 md:px-margin-desktop'
      }
    >
      <div className="mx-auto flex max-w-container-max items-center justify-between rounded-full border border-outline-variant/70 bg-surface-container-lowest/85 px-4 py-3 shadow-sm backdrop-blur-xl md:px-6">
        <Link href="/" className="flex items-center gap-3 text-[18px] font-extrabold tracking-[-0.03em] text-primary">
          <img src={icon.src} alt="" className="h-8 w-8 rounded-xl" />
          <span>STNK SatuJasa</span>
        </Link>
        <div className="hidden items-center gap-7 rounded-full bg-surface-container px-6 py-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className="text-label-md text-on-surface-variant transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/auth/signin" className="hidden text-label-md text-on-surface-variant transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:inline">
            Masuk
          </Link>
          <Link href="/auth/signup" className="rounded-full bg-primary px-5 py-2.5 text-label-md text-on-primary shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed-dim">
            Daftar
          </Link>
        </div>
      </div>
    </nav>
  );
}
