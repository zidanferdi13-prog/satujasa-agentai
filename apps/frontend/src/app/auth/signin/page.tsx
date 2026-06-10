'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Alert from '@mui/material/Alert';
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
        <p className="text-label-sm font-bold uppercase tracking-[0.18em] text-primary">Sign in</p>
        <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-[-0.04em] text-on-surface">
          Masuk dashboard
        </h2>
        <p className="mt-2 leading-7 text-on-surface-variant">
          Gunakan email dan password yang terdaftar.
        </p>
      </div>

      {isError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {(error as Error)?.message ?? 'Login gagal. Periksa email dan password Anda.'}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div className="flex items-center justify-between gap-4 text-sm">
          <Link href="/auth/forgot-password" className="font-bold text-primary hover:text-primary-container">
            Lupa password?
          </Link>
          <Link href="/auth/help" className="font-bold text-on-surface-variant hover:text-primary">
            Kendala login
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-label-md font-bold text-on-primary transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed-dim"
        >
          {isPending && <CircularProgress size={18} color="inherit" />}
          {isPending ? 'Memproses…' : 'Masuk Dashboard'}
        </button>
      </form>

      <div className="mt-7 rounded-3xl bg-surface-container p-5 text-center text-sm text-on-surface-variant">
        Belum punya akun?{' '}
        <Link href="/auth/signup" className="font-extrabold text-primary hover:text-primary-container">
          Daftar SatuJasa
        </Link>
      </div>
    </AuthShell>
  );
}
