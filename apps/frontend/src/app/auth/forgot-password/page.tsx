import Link from 'next/link';
import Button from '@mui/material/Button';
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
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, marginBottom: 8, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff' }}>Lupa password</p>
        <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', color: '#333333' }}>
          Reset password
        </h2>
        <p style={{ marginTop: 8, lineHeight: 1.75, color: '#535768' }}>
          Masukkan email akun yang terdaftar untuk proses bantuan reset.
        </p>
      </div>

      <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AuthTextField label="Email terdaftar" type="email" required fullWidth autoComplete="email" />
        <Button
          type="button"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ py: 1.75 }}
        >
          Minta Bantuan Reset
        </Button>
      </form>

      <div style={{ marginTop: 28, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', fontSize: 14 }}>
        <Link href="/auth/signin" style={{ borderRadius: 24, padding: 16, textAlign: 'center', fontWeight: 700, color: '#6161ff', textDecoration: 'none', backgroundColor: '#f5f6f8', display: 'block' }}>
          Kembali masuk
        </Link>
        <Link href="/auth/help" style={{ borderRadius: 24, padding: 16, textAlign: 'center', fontWeight: 700, color: '#535768', textDecoration: 'none', backgroundColor: '#f5f6f8', display: 'block' }}>
          Hubungi bantuan
        </Link>
      </div>
    </AuthShell>
  );
}
