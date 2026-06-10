'use client';

import Chip from '@mui/material/Chip';
import type { TransactionStatus } from '@/types/transaction';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/stateMachine';

interface StatusBadgeProps {
  status: TransactionStatus;
  size?: 'small' | 'medium';
}

export default function StatusBadge({ status, size = 'small' }: StatusBadgeProps) {
  return (
    <Chip
      label={STATUS_LABELS[status]}
      color={STATUS_COLORS[status] as 'default' | 'info' | 'warning' | 'primary' | 'secondary' | 'success' | 'error'}
      size={size}
      variant="filled"
    />
  );
}
