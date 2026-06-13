import Link from 'next/link';
import Button from '@mui/material/Button';
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
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, marginBottom: 8, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff' }}>Sign up</p>
        <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', color: '#333333' }}>
          Daftar SatuJasa
        </h2>
        <p style={{ marginTop: 8, lineHeight: 1.75, color: '#535768' }}>
          Isi data awal bisnis untuk menyiapkan akun owner.
        </p>
      </div>

      <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AuthTextField label="Nama bisnis" required fullWidth autoComplete="organization" />
        <AuthTextField label="Nama pemilik" required fullWidth autoComplete="name" />
        <AuthTextField label="Email" type="email" required fullWidth autoComplete="email" />
        <AuthTextField label="Nomor WhatsApp" type="tel" required fullWidth autoComplete="tel" />
        <Button
          type="button"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ py: 1.75 }}
        >
          Ajukan Pendaftaran
        </Button>
      </form>

      <div style={{ marginTop: 28, borderRadius: 24, padding: 20, textAlign: 'center', fontSize: 14, backgroundColor: '#f5f6f8', color: '#535768' }}>
        Sudah punya akun?{' '}
        <Link href="/auth/signin" style={{ fontWeight: 800, color: '#6161ff', textDecoration: 'none' }}>
          Masuk sekarang
        </Link>
      </div>
    </AuthShell>
  );
}
