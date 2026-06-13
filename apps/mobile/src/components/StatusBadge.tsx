import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TransactionStatus } from '@/contracts';
import { colors, radius, typography, spacing } from '@/theme/designTokens';

const STATUS_COLORS: Record<TransactionStatus, { bg: string; text: string }> = {
  DRAFT: { bg: '#FFF8E1', text: '#F57F17' },
  DOKUMEN_DITERIMA: { bg: '#E3F2FD', text: '#1565C0' },
  PROSES_SAMSAT: { bg: '#F3E5F5', text: '#6A1B9A' },
  MENUNGGU_PEMBAYARAN: { bg: '#FCE4EC', text: '#C2185B' },
  SELESAI: { bg: colors.mint, text: '#1B5E20' },
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
  const c = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: c.bg },
        isSmall ? styles.badgeSmall : styles.badgeMedium,
      ]}
    >
      <Text style={[styles.text, { color: c.text }, isSmall ? styles.textSmall : styles.textMedium]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.badges,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingVertical: 2,
    paddingHorizontal: spacing[8],
  },
  badgeMedium: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  text: {
    fontWeight: typography.weights.medium,
  },
  textSmall: {
    fontSize: typography.sizes.caption,
  },
  textMedium: {
    fontSize: typography.sizes.bodySm,
  },
});
