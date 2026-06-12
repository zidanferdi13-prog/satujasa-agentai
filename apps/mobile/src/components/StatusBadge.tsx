import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TransactionStatus } from '@/contracts';

const STATUS_COLORS: Record<TransactionStatus, { bg: string; text: string }> = {
  DRAFT: { bg: '#FFF8E1', text: '#F57F17' },
  DOKUMEN_DITERIMA: { bg: '#E3F2FD', text: '#1565C0' },
  PROSES_SAMSAT: { bg: '#F3E5F5', text: '#6A1B9A' },
  MENUNGGU_PEMBAYARAN: { bg: '#FCE4EC', text: '#C2185B' },
  SELESAI: { bg: '#C8E6C9', text: '#1B5E20' },
  DIBATALKAN: { bg: '#EEEEEE', text: '#424242' },
};

const STATUS_LABELS: Record<TransactionStatus, string> = {
  DRAFT: 'Draft',
  DOKUMEN_DITERIMA: 'Dokumen Diterima',
  PROSES_SAMSAT: 'Proses Samsat',
  MENUNGGU_PEMBAYARAN: 'Menunggu Pembayaran',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Dibatalkan',
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
