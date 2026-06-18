'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

const plans = [
  {
    name: 'Free',
    desc: 'Coba platform tanpa biaya',
    price: 'Gratis',
    period: '',
    features: [
      { text: 'Akses login & lihat menu', available: true },
      { text: '0 Tenant', available: true },
      { text: '0 Admin User', available: true },
      { text: 'Transaksi & laporan', available: false },
    ],
    cta: 'Daftar Gratis',
    highlight: false,
  },
  {
    name: 'Pro',
    desc: 'Untuk biro jasa 1 cabang',
    price: 'Rp 49.999',
    period: '/bulan',
    features: [
      { text: '1 Tenant', available: true },
      { text: '1 Admin User', available: true },
      { text: 'Input & kelola transaksi', available: true },
      { text: 'Monitoring link pelanggan', available: true },
    ],
    cta: 'Pilih Pro',
    highlight: false,
  },
  {
    name: 'Plus',
    desc: 'Untuk biro jasa multi cabang',
    price: 'Rp 99.999',
    period: '/bulan',
    features: [
      { text: '3 Tenant', available: true },
      { text: '3 Admin User (1/tenant)', available: true },
      { text: 'Semua fitur Pro', available: true },
      { text: 'Laporan per cabang', available: true },
    ],
    cta: 'Pilih Plus',
    highlight: true,
    badge: 'Populer',
  },
  {
    name: 'Expert',
    desc: 'Kustomisasi penuh untuk skala besar',
    price: 'Custom',
    period: '',
    features: [
      { text: 'Unlimited Tenant', available: true },
      { text: 'Unlimited Admin User', available: true },
      { text: 'Limit diset super admin', available: true },
      { text: 'Priority support', available: true },
    ],
    cta: 'Hubungi Kami',
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <Box component="section" sx={{ bgcolor: '#ffffff', py: { xs: 8, md: 12 } }} id="pricing">
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.04em' }}>
            Pilih Paket Sesuai Kebutuhan Anda
          </Typography>
          <Typography sx={{ mt: 1, color: '#535768' }}>
            Transparan, tanpa biaya tersembunyi
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
                overflow: plan.badge ? 'visible' : undefined,
                ...(plan.highlight
                  ? {
                      bgcolor: '#6161ff',
                      color: '#ffffff',
                      border: '2px solid',
                      borderColor: 'rgba(97, 97, 255, 0.4)',
                      zIndex: 10,
                      boxShadow: '0 8px 32px rgba(97, 97, 255, 0.25)',
                    }
                  : {}),
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
                      bgcolor: '#535768',
                      color: '#ffffff',
                      px: 3,
                      py: 0.5,
                      borderRadius: '9999px',
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {plan.badge}
                  </Box>
                )}

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 0.5,
                    ...(plan.highlight ? { color: '#ffffff' } : {}),
                  }}
                >
                  {plan.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    mb: 3,
                    ...(plan.highlight ? { color: 'rgba(255, 255, 255, 0.7)' } : { color: '#535768' }),
                  }}
                >
                  {plan.desc}
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      ...(plan.highlight ? { color: '#ffffff' } : {}),
                    }}
                  >
                    {plan.price}
                  </Typography>
                  {plan.period && (
                    <Typography
                      component="span"
                      sx={plan.highlight ? { color: 'rgba(255, 255, 255, 0.7)' } : { color: '#535768' }}
                    >
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
                        gap: 1,
                        fontSize: 14,
                        ...(!f.available ? { opacity: 0.5 } : {}),
                      }}
                    >
                      <Box
                        component="span"
                        className="material-symbols-outlined"
                        sx={{
                          fontSize: 20,
                          ...(f.available
                            ? plan.highlight
                              ? { color: '#ffffff' }
                              : { color: '#535768' }
                            : {}),
                        }}
                      >
                        {f.available ? 'check_circle' : 'cancel'}
                      </Box>
                      {f.text}
                    </Box>
                  ))}
                </Box>

                <Button
                  variant={plan.highlight ? 'contained' : 'outlined'}
                  color={plan.highlight ? 'primary' : 'primary'}
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    ...(plan.highlight
                      ? {
                          bgcolor: '#ffffff',
                          color: '#6161ff',
                          fontWeight: 700,
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                        }
                      : plan.name === 'Expert'
                        ? {
                            borderColor: '#d0d4e4',
                            color: '#333333',
                            '&:hover': { borderColor: '#6161ff', color: '#6161ff' },
                          }
                        : {}),
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
