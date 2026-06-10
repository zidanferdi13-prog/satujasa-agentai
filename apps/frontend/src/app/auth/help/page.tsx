import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import AuthTextField from '@/components/auth/AuthTextField';

const helpOptions = [
  'Tidak bisa masuk meski password benar',
  'Email akun tidak ditemukan',
  'Akses role owner/admin belum sesuai',
];

export const metadata = {
  title: 'Bantuan Login - SatuJasa',
  description: 'Hubungi tim SatuJasa jika mengalami kendala login.',
};

export default function LoginHelpPage() {
  return (
    <AuthShell
      eyebrow="Bantuan login"
      title="Saat akses bermasalah, operasional tetap harus jalan."
      description="Kirim detail kendala login agar tim SatuJasa dapat membantu pengecekan akun, role, atau akses dashboard."
    >
      <div className="mb-6">
        <p className="text-label-sm font-bold uppercase tracking-[0.18em] text-primary">Hubungi bantuan</p>
        <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-[-0.04em] text-on-surface">
          Kendala login
        </h2>
        <p className="mt-2 leading-7 text-on-surface-variant">
          Jelaskan kendala agar proses pengecekan lebih cepat.
        </p>
      </div>

      <div className="mb-5 grid gap-2">
        {helpOptions.map((option) => (
          <div key={option} className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 text-sm font-bold text-on-surface">
            {option}
          </div>
        ))}
      </div>

      <form className="space-y-5">
        <AuthTextField label="Email akun" type="email" required fullWidth autoComplete="email" />
        <AuthTextField label="Nomor WhatsApp" type="tel" required fullWidth autoComplete="tel" />
        <AuthTextField label="Detail kendala" required fullWidth multiline minRows={4} />
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-4 text-label-md font-bold text-on-primary transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed-dim"
        >
          Kirim Kendala Login
        </button>
      </form>

      <div className="mt-7 rounded-3xl bg-surface-container p-5 text-center text-sm text-on-surface-variant">
        Ingin mencoba masuk lagi?{' '}
        <Link href="/auth/signin" className="font-extrabold text-primary hover:text-primary-container">
          Kembali ke sign in
        </Link>
      </div>
    </AuthShell>
  );
}
