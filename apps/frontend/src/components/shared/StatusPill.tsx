'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Variant = 'success' | 'warning' | 'error' | 'info';

interface StatusPillProps {
  status: string;
  variant: Variant;
}

const variantStyles: Record<Variant, { bg: string; dot: string }> = {
  success: {
    bg: 'var(--color-success-bg, rgba(16, 185, 129, 0.12))',
    dot: 'var(--color-success, #10b981)',
  },
  warning: {
    bg: 'var(--color-warning-bg, rgba(245, 158, 11, 0.12))',
    dot: 'var(--color-warning, #f59e0b)',
  },
  error: {
    bg: 'var(--color-error-bg, rgba(239, 68, 68, 0.12))',
    dot: 'var(--color-error, #ef4444)',
  },
  info: {
    bg: 'var(--color-info-bg, rgba(59, 130, 246, 0.12))',
    dot: 'var(--color-info, #3b82f6)',
  },
};

export default function StatusPill({ status, variant }: StatusPillProps) {
  const styles = variantStyles[variant];

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        borderRadius: '12px',
        px: '12px',
        py: '4px',
        backgroundColor: styles.bg,
        fontSize: 12,
        fontWeight: 700,
        lineHeight: '20px',
        color: styles.dot,
        whiteSpace: 'nowrap',
        border: `1px solid ${styles.dot}22`,
      }}
    >
      <Box
        component="span"
        sx={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: styles.dot,
          flexShrink: 0,
        }}
      />
      <Typography
        component="span"
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: styles.dot,
          lineHeight: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {status}
      </Typography>
    </Box>
  );
}
