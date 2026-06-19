'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { visuallyHidden } from '@mui/utils';

const plans = [
  {
    name: 'Loket',
    desc: 'Untuk biro jasa perorangan',
    price: 'Gratis',
    period: '',
    features: [
      { text: '1 Tenant / Loket', available: true },
      { text: '1 Admin User', available: true },
      { text: 'Link tracking pelanggan', available: true },
      { text: 'Laporan harian', available: false },
    ],
    cta: 'Daftar Gratis',
    href: '/auth/signup',
    highlight: false,
  },
  {
    name: 'Cabang',
    desc: 'Untuk bisnis yang berkembang',
    price: 'Rp 49rb',
    period: '/bulan',
    features: [
      { text: '1 Tenant / Cabang', available: true },
      { text: 'Unlimited Transaksi', available: true },
      { text: 'Input & kelola berkas', available: true },
      { text: 'Dashboard operasional', available: true },
    ],
    cta: 'Pilih Cabang',
    href: '/auth/signup?plan=cabang',
    highlight: false,
  },
  {
    name: 'Owner',
    desc: 'Paling pas untuk multi cabang',
    price: 'Rp 99rb',
    period: '/bulan',
    features: [
      { text: '3 Tenant / Cabang', available: true },
      { text: '3 Admin User (1/tenant)', available: true },
      { text: 'Monitoring semua cabang', available: true },
      { text: 'Laporan revenue detail', available: true },
    ],
    cta: 'Mulai Sekarang',
    href: '/auth/signup?plan=owner',
    highlight: true,
    badge: 'Populer',
  },
  {
    name: 'Expert',
    desc: 'Kustomisasi untuk skala besar',
    price: 'Custom',
    period: '',
    features: [
      { text: 'Unlimited Tenant', available: true },
      { text: 'Unlimited Admin User', available: true },
      { text: 'Super admin access', available: true },
      { text: 'Priority support', available: true },
    ],
    cta: 'Hubungi Kami',
    href: '/auth/signup?plan=expert',
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <Box component="section" sx={{ bgcolor: '#f5f6f8', py: { xs: 8, md: 12 } }} id="pricing">
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography
            sx={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff', mb: 1.5 }}
          >
            Pilihan paket
          </Typography>
          <Typography component="h2" variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', color: '#1d2433' }}>
            Transparan, sesuai skala bisnis Anda.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {plans.map((plan) => (
            <Card
              key={plan.name}
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                border: plan.highlight ? '2px solid #6161ff' : '1px solid rgba(208, 212, 228, 0.72)',
                boxShadow: plan.highlight ? '0 24px 60px rgba(97, 97, 255, 0.18)' : '0 16px 45px rgba(43, 50, 91, 0.06)',
                overflow: plan.badge ? 'visible' : 'hidden',
                ...(plan.highlight ? { transform: { lg: 'scale(1.05)' }, zIndex: 10 } : {}),
              }}
            >
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {plan.badge && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: '#6161ff',
                      color: '#ffffff',
                      px: 2.5,
                      py: 0.6,
                      borderRadius: 5,
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                    }}
                  >
                    {plan.badge}
                  </Box>
                )}

                <Typography component="h3" variant="h5" sx={{ fontWeight: 900, mb: 0.5, color: '#1d2433' }}>
                  {plan.name}
                </Typography>
                <Typography sx={{ fontSize: 14, mb: 3, color: '#535768', fontWeight: 500 }}>
                  {plan.desc}
                </Typography>

                <Box sx={{ mb: 4, display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#1d2433' }}>
                    {plan.price}
                  </Typography>
                  {plan.period && (
                    <Typography sx={{ color: '#535768', fontSize: 14, fontWeight: 700 }}>
                      {plan.period}
                    </Typography>
                  )}
                </Box>

                <Box
                  component="ul"
                  sx={{
                    listStyle: 'none',
                    p: 0,
                    m: 0,
                    mb: 4,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                  }}
                >
                  {plan.features.map((f) => (
                    <Box
                      component="li"
                      key={f.text}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                        fontSize: 14,
                        fontWeight: 500,
                        color: f.available ? '#535768' : 'rgba(83, 87, 104, 0.4)',
                      }}
                    >
                      <Box
                        component="span"
                        aria-hidden="true"
                        className="material-symbols-outlined"
                        sx={{
                          fontSize: 18,
                          color: f.available ? '#10b981' : 'rgba(83, 87, 104, 0.4)',
                        }}
                      >
                        {f.available ? 'check_circle' : 'cancel'}
                      </Box>
                      <Box component="span" sx={visuallyHidden}>
                        {f.available ? 'Termasuk: ' : 'Tidak termasuk: '}
                      </Box>
                      {f.text}
                    </Box>
                  ))}
                </Box>

                <Button
                  component={Link}
                  href={plan.href}
                  variant={plan.highlight ? 'contained' : 'outlined'}
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    borderRadius: 8,
                    fontWeight: 800,
                    textTransform: 'none',
                    fontSize: 15,
                    ...(plan.highlight ? { boxShadow: '0 8px 24px rgba(97, 97, 255, 0.3)' } : { bgcolor: '#ffffff' }),
                  }}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
