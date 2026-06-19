'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface DashboardErrorBoundaryProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

interface DashboardErrorBoundaryState {
  hasError: boolean;
}

export default class DashboardErrorBoundary extends Component<DashboardErrorBoundaryProps, DashboardErrorBoundaryState> {
  state: DashboardErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): DashboardErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DashboardErrorBoundary caught an error', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: 280,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid #e5e9f3',
            bgcolor: '#ffffff',
            boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
          }}
        >
          <Box sx={{ maxWidth: 420 }}>
            <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 44, color: '#ef4444', mb: 1.5 }}>
              error
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#1d2433', mb: 1 }}>
              {this.props.title ?? 'Dashboard mengalami kendala'}
            </Typography>
            <Typography sx={{ fontSize: 14, lineHeight: 1.7, color: '#64748b', mb: 3 }}>
              {this.props.description ?? 'Ada komponen yang gagal dimuat. Muat ulang halaman untuk mencoba lagi.'}
            </Typography>
            <Button variant="contained" color="primary" onClick={this.handleReload} sx={{ borderRadius: 2, px: 3 }}>
              Muat ulang halaman
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}
