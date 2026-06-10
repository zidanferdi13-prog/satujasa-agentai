import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import AuthTextField from '@/components/auth/AuthTextField';

export const metadata = {
  title: 'Lupa Password - SatuJasa',
  description: 'Minta bantuan reset password akun SatuJasa.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Reset akses"
      title="Pulihkan akses tanpa mengganggu operasional."
      description="Masukkan email akun Anda. Tim SatuJasa dapat membantu proses reset password sesuai data yang terdaftar."
    >
      <div className="mb-6">
        <p className="text-label-sm font-bold uppercase tracking-[0.18em] text-primary">Lupa password</p>
        <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-[-0.04em] text-on-surface">
          Reset password
        </h2>
        <p className="mt-2 leading-7 text-on-surface-variant">
          Masukkan email akun yang terdaftar untuk proses bantuan reset.
        </p>
      </div>

      <form className="space-y-5">
        <AuthTextField label="Email terdaftar" type="email" required fullWidth autoComplete="email" />
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-4 text-label-md font-bold text-on-primary transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed-dim"
        >
          Minta Bantuan Reset
        </button>
      </form>

      <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2">
        <Link href="/auth/signin" className="rounded-2xl bg-surface-container p-4 text-center font-bold text-primary hover:bg-surface-container-high">
          Kembali masuk
        </Link>
        <Link href="/auth/help" className="rounded-2xl bg-surface-container p-4 text-center font-bold text-on-surface-variant hover:text-primary">
          Hubungi bantuan
        </Link>
      </div>
    </AuthShell>
  );
}
