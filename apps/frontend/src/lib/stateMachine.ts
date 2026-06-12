import type { TransactionStatus } from '@/types/transaction';

export const STATUS_TRANSITIONS: Record<TransactionStatus, TransactionStatus[]> = {
  received: ['document_check', 'cancelled'],
  document_check: ['payment_pending', 'needs_revision', 'cancelled'],
  needs_revision: ['document_check', 'cancelled'],
  payment_pending: ['processing', 'cancelled'],
  processing: ['at_samsat', 'cancelled'],
  at_samsat: ['done', 'cancelled'],
  done: [],
  cancelled: [],
  DRAFT: ['DOKUMEN_DITERIMA', 'DIBATALKAN'],
  DOKUMEN_DITERIMA: ['PROSES_SAMSAT', 'DIBATALKAN'],
  PROSES_SAMSAT: ['MENUNGGU_PEMBAYARAN', 'DIBATALKAN'],
  MENUNGGU_PEMBAYARAN: ['SELESAI', 'DIBATALKAN'],
  SELESAI: [],
  DIBATALKAN: [],
};

export function getNextStatuses(current: TransactionStatus): TransactionStatus[] {
  return STATUS_TRANSITIONS[current] ?? [];
}

export function isFinalStatus(status: TransactionStatus): boolean {
  return status === 'done' || status === 'cancelled' || status === 'SELESAI' || status === 'DIBATALKAN';
}

export const STATUS_LABELS: Record<TransactionStatus, string> = {
  received: 'Diterima',
  document_check: 'Cek Dokumen',
  needs_revision: 'Perlu Revisi',
  payment_pending: 'Menunggu Bayar',
  processing: 'Diproses',
  at_samsat: 'Di Samsat',
  done: 'Selesai',
  cancelled: 'Dibatalkan',
  DRAFT: 'Draft',
  DOKUMEN_DITERIMA: 'Dokumen Diterima',
  PROSES_SAMSAT: 'Proses Samsat',
  MENUNGGU_PEMBAYARAN: 'Menunggu Pembayaran',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Dibatalkan',
};

export const STATUS_COLORS: Record<TransactionStatus, string> = {
  received: 'default',
  document_check: 'info',
  needs_revision: 'warning',
  payment_pending: 'warning',
  processing: 'primary',
  at_samsat: 'secondary',
  done: 'success',
  cancelled: 'error',
  DRAFT: 'default',
  DOKUMEN_DITERIMA: 'info',
  PROSES_SAMSAT: 'warning',
  MENUNGGU_PEMBAYARAN: 'warning',
  SELESAI: 'success',
  DIBATALKAN: 'error',
};
