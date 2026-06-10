import type { TransactionStatus } from '@stnk/contracts'
import { VALID_TRANSITIONS } from '@stnk/contracts'

/**
 * Validates whether a status transition is allowed.
 */
export function isValidTransition(from: TransactionStatus, to: TransactionStatus): boolean {
  const allowed = VALID_TRANSITIONS[from]
  return allowed.includes(to)
}

/**
 * Gets all valid next statuses from the current status.
 */
export function getValidNextStatuses(current: TransactionStatus): TransactionStatus[] {
  return VALID_TRANSITIONS[current]
}

/**
 * Human-readable status labels (Indonesian).
 */
export const STATUS_LABELS: Record<TransactionStatus, string> = {
  received: 'Diterima',
  document_check: 'Pemeriksaan Dokumen',
  payment_pending: 'Menunggu Pembayaran',
  processing: 'Sedang Diproses',
  at_samsat: 'Di Samsat',
  needs_revision: 'Perlu Revisi',
  done: 'Selesai',
  cancelled: 'Dibatalkan',
}
