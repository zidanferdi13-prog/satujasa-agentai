'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Link from 'next/link';

interface QuickAction {
  icon: string;
  label: string;
  href: string;
  color: string;
  bgColor: string;
}

export default function OwnerQuickActions() {
  const actions: QuickAction[] = [
    { icon: 'add_business', label: 'Tambah Tenant', href: '/owner/tenant/baru', color: '#6254f3', bgColor: '#f0eeff' },
    { icon: 'person_add', label: 'Tambah Admin', href: '/owner/admin-users/baru', color: '#2388ff', bgColor: '#e8f4ff' },
    { icon: 'receipt_long', label: 'Buat Transaksi', href: '/owner/tenant', color: '#22c7b8', bgColor: '#e6faf8' },
    { icon: 'analytics', label: 'Lihat Laporan', href: '/owner/laporan', color: '#f6a326', bgColor: '#fff4e6' },
  ];

  return (
    <Card sx={{ p: 3, borderRadius: '22px', border: '1px solid #e5e9f3', boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)', background: 'rgba(255,255,255,0.94)' }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 0.25 }}>Quick Actions</Typography>
        <Typography sx={{ fontSize: 13, color: '#8a91a3' }}>Shortcut untuk operasi utama</Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
        {actions.map((action) => (
          <Box key={action.label} component={Link} href={action.href} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: '16px', bgcolor: action.bgColor, textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer', border: '1px solid transparent', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(30, 41, 59, 0.12)', borderColor: '#e5e9f3' } }}>
            <Box sx={{ width: 42, height: 42, borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white', color: action.color, fontSize: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <span className="material-symbols-outlined">{action.icon}</span>
            </Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1d2433' }}>{action.label}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
