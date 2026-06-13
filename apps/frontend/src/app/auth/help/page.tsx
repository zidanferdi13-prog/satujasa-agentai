import Link from 'next/link';
import Button from '@mui/material/Button';
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
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, marginBottom: 8, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff' }}>Hubungi bantuan</p>
        <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', color: '#333333' }}>
          Kendala login
        </h2>
        <p style={{ marginTop: 8, lineHeight: 1.75, color: '#535768' }}>
          Jelaskan kendala agar proses pengecekan lebih cepat.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {helpOptions.map((option) => (
          <div
            key={option}
            style={{ borderRadius: 6, border: '1px solid #d0d4e4', backgroundColor: '#ffffff', padding: 16, fontSize: 14, fontWeight: 700, color: '#333333' }}
          >
            {option}
          </div>
        ))}
      </div>

      <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AuthTextField label="Email akun" type="email" required fullWidth autoComplete="email" />
        <AuthTextField label="Nomor WhatsApp" type="tel" required fullWidth autoComplete="tel" />
        <AuthTextField label="Detail kendala" required fullWidth multiline minRows={4} />
        <Button
          type="button"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ py: 1.75 }}
        >
          Kirim Kendala Login
        </Button>
      </form>

      <div style={{ marginTop: 28, borderRadius: 24, padding: 20, textAlign: 'center', fontSize: 14, backgroundColor: '#f5f6f8', color: '#535768' }}>
        Ingin mencoba masuk lagi?{' '}
        <Link href="/auth/signin" style={{ fontWeight: 800, color: '#6161ff', textDecoration: 'none' }}>
          Kembali ke sign in
        </Link>
      </div>
    </AuthShell>
  );
}
