'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface OwnersHeroProps {
  count: number;
  active: number;
  tenants: number;
  admins: number;
}

export default function OwnersHero({ count, active, tenants, admins }: OwnersHeroProps) {
  const metrics = [
    { label: 'Total Owners', val: count, icon: '👥' },
    { label: 'Active Subscription', val: active, icon: '✅' },
    { label: 'Tenant Terkait', val: tenants, icon: '🏢' },
    { label: 'Admin User', val: admins, icon: '👤' },
  ];

  return (
    <Box sx={{
      background: 'linear-gradient(110deg, rgba(255,255,255,0.95) 0%, rgba(246,248,255,0.96) 54%, rgba(238,242,255,0.92) 100%)',
      border: '1px solid #dfe4ff',
      borderRadius: '28px',
      p: 3,
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 200px' },
      gap: 3,
      mb: 3
    }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: '#1d2433' }}>Kelola Owner</Typography>
        <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>Kelola dan pantau seluruh owner di ekosistem SatuJasa</Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
          {metrics.map((m, i) => (
            <Box key={i} sx={{ border: '1px solid var(--dash-line)', borderRadius: '12px', px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'white' }}>
              <Typography sx={{ fontSize: 18 }}>{m.icon}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{m.label}: {m.val}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="contained" sx={{ borderRadius: '14px', textTransform: 'none', bgcolor: 'var(--dash-primary)' }}>＋ Tambah Owner</Button>
          <Button variant="outlined" sx={{ borderRadius: '14px', textTransform: 'none', color: 'var(--dash-muted)', borderColor: 'var(--dash-line)' }}>⇧ Export</Button>
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'grid' }, placeItems: 'center', bgcolor: 'rgba(255,255,255,0.5)', borderRadius: '20px' }}>
        <Box sx={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--dash-primary-soft)', border: '2px dashed var(--dash-primary)' }} />
      </Box>
    </Box>
  );
}
