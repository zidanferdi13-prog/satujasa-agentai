import { Badge } from '../../components/ui'

type TransactionStatus = 'pending' | 'processing' | 'verified' | 'completed' | 'rejected'

const statusConfig: Record<TransactionStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'outline' },
  processing: { label: 'Processing', variant: 'secondary' },
  verified: { label: 'Verified', variant: 'default' },
  completed: { label: 'Completed', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
}

interface StatusBadgeProps {
  status: TransactionStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
