// ─── Transaction State Machine ────────────────────────────────────────────────

export type TransactionStatus =
  | 'received'
  | 'document_check'
  | 'payment_pending'
  | 'processing'
  | 'at_samsat'
  | 'needs_revision'
  | 'done'
  | 'cancelled'

const TRANSITIONS: Record<TransactionStatus, TransactionStatus[]> = {
  received: ['document_check', 'cancelled'],
  document_check: ['payment_pending', 'needs_revision', 'cancelled'],
  needs_revision: ['document_check', 'cancelled'],
  payment_pending: ['processing', 'cancelled'],
  processing: ['at_samsat', 'cancelled'],
  at_samsat: ['done', 'cancelled'],
  done: [],
  cancelled: [],
}

export function isValidTransition(from: TransactionStatus, to: TransactionStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false
}

export function getAllowedTransitions(from: TransactionStatus): TransactionStatus[] {
  return TRANSITIONS[from] ?? []
}
