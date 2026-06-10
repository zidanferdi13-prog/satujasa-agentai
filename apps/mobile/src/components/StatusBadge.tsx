import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TransactionStatus, VALID_TRANSITIONS } from '@stnk/contracts';

const STATUS_COLORS: Record<TransactionStatus, { bg: string; text: string }> = {
  received: { bg: '#E8F5E9', text: '#2E7D32' },
  document_check: { bg: '#FFF3E0', text: '#E65100' },
  payment_pending: { bg: '#FCE4EC', text: '#C2185B' },
  processing: { bg: '#E3F2FD', text: '#1565C0' },
  at_samsat: { bg: '#F3E5F5', text: '#6A1B9A' },
  needs_revision: { bg: '#FFEBEE', text: '#C62828' },
  done: { bg: '#C8E6C9', text: '#1B5E20' },
  cancelled: { bg: '#EEEEEE', text: '#424242' },
};

const STATUS_LABELS: Record<TransactionStatus, string> = {
  received: 'Diterima',
  document_check: 'Cek Dokumen',
  payment_pending: 'Menunggu Bayar',
  processing: 'Proses',
  at_samsat: 'Di Samsat',
  needs_revision: 'Revisi Dokumen',
  done: 'Selesai',
  cancelled: 'Dibatalkan',
};

interface StatusBadgeProps {
  status: TransactionStatus;
  size?: 'small' | 'medium';
}

export function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];
  const fontSize = size === 'small' ? 12 : 14;
  const paddingVertical = size === 'small' ? 4 : 8;
  const paddingHorizontal = size === 'small' ? 8 : 12;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg, paddingVertical, paddingHorizontal },
      ]}
    >
      <Text style={[styles.text, { color: colors.text, fontSize }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
