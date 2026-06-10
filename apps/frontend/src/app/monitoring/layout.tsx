'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function MonitoringLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          py: 3,
          px: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          textAlign: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ fontSize: '24px', fontWeight: 700 }}>SatuJasa</Box>
        <Box sx={{ fontSize: '14px', opacity: 0.8 }}>Lacak Status Dokumen Anda</Box>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        {children}
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          px: 2,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Box sx={{ fontSize: '12px', color: 'text.secondary' }}>
          © 2026 SatuJasa. All rights reserved.
        </Box>
      </Box>
    </Box>
  );
}
