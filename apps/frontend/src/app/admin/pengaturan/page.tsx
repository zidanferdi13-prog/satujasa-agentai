'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

export default function AdminPengaturanPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    app_name: '',
    support_email: '',
    support_phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.app_name.trim()) {
      setError('Nama aplikasi wajib diisi');
      return;
    }
    // TODO: connect to API endpoint when available
    setSuccess('Pengaturan berhasil disimpan');
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 640 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Pengaturan
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Kelola pengaturan umum aplikasi.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TextField
              label="Nama Aplikasi"
              fullWidth
              required
              placeholder="STNK Jasa"
              value={form.app_name}
              onChange={(e) => setForm({ ...form, app_name: e.target.value })}
            />
            <TextField
              label="Email Support"
              fullWidth
              type="email"
              placeholder="support@example.com"
              value={form.support_email}
              onChange={(e) => setForm({ ...form, support_email: e.target.value })}
            />
            <TextField
              label="No. Telepon Support"
              fullWidth
              type="tel"
              placeholder="08123456789"
              value={form.support_phone}
              onChange={(e) => setForm({ ...form, support_phone: e.target.value })}
            />

            <Button variant="outlined" onClick={() => router.back()} fullWidth sx={{ mb: 1 }}>
              Batal
            </Button>
            <Button type="submit" variant="contained" fullWidth>
              Simpan Pengaturan
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
