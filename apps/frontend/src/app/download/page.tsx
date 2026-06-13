'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Navbar from '@/components/landing/Navbar';

const platforms = [
  {
    icon: 'desktop_windows',
    title: 'Web Based untuk PC',
    desc: 'Akses dashboard SatuJasa dari browser desktop untuk owner, admin cabang, dan operasional harian.',
    cta: 'Buka Web App',
    href: '/auth/signin',
  },
  {
    icon: 'android',
    title: 'APK Android untuk Mobile',
    desc: 'Gunakan aplikasi mobile untuk pekerjaan lapangan, pengecekan status, dan update proses lebih cepat.',
    cta: 'APK Segera Tersedia',
    href: '#apk-status',
  },
];

const features = [
  'Satu akun untuk akses web dan mobile',
  'Data transaksi tetap tersinkron antar perangkat',
  'Cocok untuk tim kantor dan tim lapangan',
];

export default function DownloadPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f6f8' }}>
      {/* Top rainbow divider */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'conic-gradient(from 270deg, #8181ff 15%, #33dbdb 40%, #33d58e 55%, #ffd633 65%, #fc527d 85%, #8181ff 100%)',
          zIndex: 1,
        }}
      />

      <Navbar fixed={false} />

      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 5 },
          pb: { xs: 10, md: 16 },
          pt: { xs: 8, md: 12 },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '0.95fr 1.05fr' },
            gap: { xs: 6, lg: 12 },
            alignItems: 'end',
          }}
        >
          <Box>
            <Box
              sx={{
                display: 'inline-flex',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: '#d0d4e4',
                bgcolor: '#ffffff',
                px: 3,
                py: 1,
                mb: 4,
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: '#6161ff',
              }}
            >
              Download aplikasi
            </Box>
            <Box
              sx={{
                fontSize: { xs: 36, md: 56, lg: 68 },
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                color: '#333333',
                maxWidth: 640,
              }}
            >
              SatuJasa bisa dipakai di PC dan Android.
            </Box>
          </Box>

          <Card sx={{ bgcolor: '#333333', color: '#ffffff', borderRadius: 6, border: 'none' }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ fontSize: 16, lineHeight: 2, color: 'rgba(255,255,255,0.78)', mb: 3 }}>
                Gunakan dashboard web based saat bekerja dari komputer, lalu lanjutkan operasional mobile
                lewat APK Android saat tim berada di lapangan.
              </Box>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {features.map((feature) => (
                  <Box
                    key={feature}
                    component="li"
                    sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, fontSize: 14, fontWeight: 700, '& + &': { mt: 2 } }}
                  >
                    <Box component="span" className="material-symbols-outlined" sx={{ mt: 0.25, fontSize: 20, color: '#9ec7ff' }}>
                      check_circle
                    </Box>
                    {feature}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            mt: { xs: 8, md: 12 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
          id="apk-status"
        >
          {platforms.map((platform) => (
            <Card key={platform.title}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box component="span" className="material-symbols-outlined" sx={{ display: 'block', fontSize: 42, color: '#6161ff', mb: 4 }}>
                  {platform.icon}
                </Box>
                <Box sx={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', color: '#333333', mb: 2 }}>
                  {platform.title}
                </Box>
                <Box sx={{ fontSize: 14, lineHeight: 1.75, color: '#535768', mb: 4 }}>
                  {platform.desc}
                </Box>
                <Link href={platform.href} style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary" sx={{ borderRadius: '9999px', px: 3 }}>
                    {platform.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ mt: 4, borderRadius: 6, border: '1px dashed', borderColor: '#d0d4e4', bgcolor: '#ffffff', p: 3, fontSize: 14, lineHeight: 1.75, color: '#535768' }}>
          File APK belum tersedia di repository. Setelah APK siap, letakkan di folder publik dan tombol
          Android bisa diarahkan langsung ke file download.
        </Box>
      </Box>
    </Box>
  );
}
