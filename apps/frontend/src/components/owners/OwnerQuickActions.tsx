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
    <Card sx={{ p: 2.5, borderRadius: '22px', border: '1px solid #e8eaf0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 2, color: '#1a1d2e' }}>Quick Actions</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
        {actions.map((action) => (
          <Box key={action.label} component={Link} href={action.href} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: '14px', bgcolor: action.bgColor, textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white', color: action.color, fontSize: 18, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
              <span className="material-symbols-outlined">{action.icon}</span>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#2d3142' }}>{action.label}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
