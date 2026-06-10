import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import AuthTextField from '@/components/auth/AuthTextField';

export const metadata = {
  title: 'Daftar SatuJasa',
  description: 'Daftarkan bisnis jasa STNK Anda untuk memakai SatuJasa.',
};

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Pendaftaran"
      title="Mulai rapikan bisnis jasa STNK dari satu akun."
      description="Daftarkan bisnis Anda untuk menyiapkan akses owner, admin cabang, dashboard web based, dan mobile Android."
    >
      <div className="mb-6">
        <p className="text-label-sm font-bold uppercase tracking-[0.18em] text-primary">Sign up</p>
        <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-[-0.04em] text-on-surface">
          Daftar SatuJasa
        </h2>
        <p className="mt-2 leading-7 text-on-surface-variant">
          Isi data awal bisnis untuk menyiapkan akun owner.
        </p>
      </div>

      <form className="space-y-5">
        <AuthTextField label="Nama bisnis" required fullWidth autoComplete="organization" />
        <AuthTextField label="Nama pemilik" required fullWidth autoComplete="name" />
        <AuthTextField label="Email" type="email" required fullWidth autoComplete="email" />
        <AuthTextField label="Nomor WhatsApp" type="tel" required fullWidth autoComplete="tel" />
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-4 text-label-md font-bold text-on-primary transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed-dim"
        >
          Ajukan Pendaftaran
        </button>
      </form>

      <div className="mt-7 rounded-3xl bg-surface-container p-5 text-center text-sm text-on-surface-variant">
        Sudah punya akun?{' '}
        <Link href="/auth/signin" className="font-extrabold text-primary hover:text-primary-container">
          Masuk sekarang
        </Link>
      </div>
    </AuthShell>
  );
}
