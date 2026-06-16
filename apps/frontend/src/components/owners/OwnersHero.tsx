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
    { label: 'Total Owners', val: count, icon: 'groups', color: '#4f46e5' },
    { label: 'Active Subscription', val: active, icon: 'verified', color: '#22c55e' },
    { label: 'Tenant Terkait', val: tenants, icon: 'domain', color: '#8b5cf6' },
    { label: 'Admin User', val: admins, icon: 'manage_accounts', color: '#f59e0b' },
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(110deg, rgba(255,255,255,0.96) 0%, rgba(248,250,255,0.96) 48%, rgba(238,242,255,0.92) 100%)',
        border: '1px solid rgba(79, 70, 229, 0.10)',
        borderRadius: '28px',
        boxShadow: '0 20px 45px rgba(30, 41, 59, 0.07)',
        p: { xs: 3, md: 4 },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.25fr 0.75fr' },
        gap: { xs: 3, md: 4 },
        alignItems: 'center',
        mb: 3,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: 28, md: 34 },
            fontWeight: 800,
            mb: 1,
            color: '#1d2433',
            lineHeight: 1.15,
          }}
        >
          Manage Owners 👥
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280', mb: 2.5, fontSize: 15, lineHeight: 1.6 }}>
          Kelola owner, subscription tier, tenant, dan admin user dari satu pusat kendali.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, auto)' }, gap: 1.25, mb: 3 }}>
          {metrics.map((m) => (
            <Box
              key={m.label}
              sx={{
                border: '1px solid rgba(229, 233, 243, 0.9)',
                borderRadius: '14px',
                px: 1.5,
                py: 1.25,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'rgba(255,255,255,0.82)',
                boxShadow: '0 8px 18px rgba(30,41,59,0.04)',
              }}
            >
              <Box
                component="span"
                className="material-symbols-outlined"
                sx={{ fontSize: 19, color: m.color, lineHeight: 1 }}
              >
                {m.icon}
              </Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#394154', whiteSpace: 'nowrap' }}>
                {m.label}: <Box component="span" sx={{ color: '#1d2433' }}>{m.val}</Box>
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>}
            sx={{
              borderRadius: '14px',
              textTransform: 'none',
              bgcolor: 'var(--dash-primary)',
              px: 2.25,
              py: 1.15,
              fontWeight: 700,
              boxShadow: '0 10px 22px rgba(79, 70, 229, 0.24)',
              '&:hover': { bgcolor: 'var(--dash-primary-2)', boxShadow: '0 12px 28px rgba(79, 70, 229, 0.3)' },
            }}
          >
            Tambah Owner
          </Button>
          <Button
            variant="outlined"
            startIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>ios_share</span>}
            sx={{
              borderRadius: '14px',
              textTransform: 'none',
              color: '#535768',
              borderColor: 'var(--dash-line)',
              bgcolor: 'rgba(255,255,255,0.72)',
              px: 2.25,
              py: 1.15,
              fontWeight: 700,
              '&:hover': { borderColor: 'var(--dash-primary)', bgcolor: '#ffffff' },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', minHeight: 210, position: 'relative' }}>
        <Box sx={{ position: 'absolute', width: 190, height: 190, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.16), transparent 68%)' }} />
        <Box sx={{ position: 'relative', width: 220, height: 170 }}>
          <Box sx={{ position: 'absolute', right: 18, top: 8, width: 118, height: 86, borderRadius: '18px', background: '#ffffff', border: '1px solid #e5e9f3', boxShadow: '0 18px 38px rgba(30,41,59,0.10)', transform: 'rotate(5deg)', p: 1.5 }}>
            <Box sx={{ height: 8, width: '70%', borderRadius: 2, bgcolor: '#4f46e5', mb: 1 }} />
            <Box sx={{ height: 6, width: '90%', borderRadius: 2, bgcolor: '#e5e9f3', mb: 0.8 }} />
            <Box sx={{ height: 6, width: '55%', borderRadius: 2, bgcolor: '#e5e9f3' }} />
          </Box>
          <Box sx={{ position: 'absolute', left: 8, bottom: 10, width: 128, height: 104, borderRadius: '20px', background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)', boxShadow: '0 18px 40px rgba(79,70,229,0.24)', p: 2, color: '#fff' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>admin_panel_settings</span>
            <Typography sx={{ fontSize: 24, fontWeight: 800, lineHeight: 1, mt: 1 }}>{count}</Typography>
            <Typography sx={{ fontSize: 11, opacity: 0.86, mt: 0.5 }}>Registered owners</Typography>
          </Box>
          <Box sx={{ position: 'absolute', right: 4, bottom: 0, width: 54, height: 54, borderRadius: '16px', bgcolor: '#ecfdf3', border: '1px solid rgba(34,197,94,0.14)', display: 'grid', placeItems: 'center', boxShadow: '0 12px 24px rgba(34,197,94,0.12)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#22c55e' }}>trending_up</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
