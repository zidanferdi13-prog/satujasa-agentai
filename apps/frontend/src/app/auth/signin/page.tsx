'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AuthShell from '@/components/auth/AuthShell';
import AuthTextField from '@/components/auth/AuthTextField';
import { useLogin } from '@/hooks/useLogin';

export default function SignInPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, isError, error } = useLogin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <AuthShell
      eyebrow="Masuk dashboard"
      title="Lanjutkan operasional tanpa data tercecer."
      description="Masuk ke ruang kerja SatuJasa untuk mengelola transaksi, status dokumen, dan cabang dari web based maupun mobile Android."
    >
      <div className="mb-6">
        <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: '#6161ff' }}>Sign in</p>
        <h2 className="m-0 text-[30px] font-extrabold leading-tight tracking-[-0.04em]" style={{ color: '#333333' }}>
          Masuk dashboard
        </h2>
        <p className="mt-2 leading-7" style={{ color: '#535768' }}>
          Gunakan email dan password yang terdaftar.
        </p>
      </div>

      {isError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {(error as Error)?.message ?? 'Login gagal. Periksa email dan password Anda.'}
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AuthTextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          autoComplete="email"
          autoFocus
        />
        <AuthTextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          autoComplete="current-password"
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: 14 }}>
          <Link href="/auth/forgot-password" style={{ fontWeight: 700, color: '#6161ff', textDecoration: 'none' }}>
            Lupa password?
          </Link>
          <Link href="/auth/help" style={{ fontWeight: 700, color: '#535768', textDecoration: 'none' }}>
            Kendala login
          </Link>
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isPending}
          fullWidth
          size="large"
          sx={{ py: 1.75 }}
        >
          {isPending && <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />}
          {isPending ? 'Memproses…' : 'Masuk Dashboard'}
        </Button>
      </form>

      <div className="mt-7 rounded-3xl p-5 text-center text-sm" style={{ backgroundColor: '#f5f6f8', color: '#535768' }}>
        Belum punya akun?{' '}
        <Link href="/auth/signup" style={{ fontWeight: 800, color: '#6161ff', textDecoration: 'none' }}>
          Daftar SatuJasa
        </Link>
      </div>
    </AuthShell>
  );
}
