// ─── Transaction State Machine ────────────────────────────────────────────────

export type TransactionStatus =
  | 'DRAFT'
  | 'DOKUMEN_DITERIMA'
  | 'PROSES_SAMSAT'
  | 'MENUNGGU_PEMBAYARAN'
  | 'SELESAI'
  | 'DIBATALKAN'

const TRANSITIONS: Record<TransactionStatus, TransactionStatus[]> = {
  DRAFT: ['DOKUMEN_DITERIMA', 'DIBATALKAN'],
  DOKUMEN_DITERIMA: ['PROSES_SAMSAT', 'DIBATALKAN'],
  PROSES_SAMSAT: ['MENUNGGU_PEMBAYARAN', 'DIBATALKAN'],
  MENUNGGU_PEMBAYARAN: ['SELESAI', 'DIBATALKAN'],
  SELESAI: [],
  DIBATALKAN: [],
}

export function isValidTransition(from: TransactionStatus, to: TransactionStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false
}

export function getAllowedTransitions(from: TransactionStatus): TransactionStatus[] {
  return TRANSITIONS[from] ?? []
}
