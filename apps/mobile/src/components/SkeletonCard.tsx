import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SkeletonCardProps {
  lines?: number;
  height?: number;
}

export function SkeletonCard({ lines = 3, height = 100 }: SkeletonCardProps) {
  return (
    <View style={[styles.card, { height }]}>
      {Array.from({ length: lines }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.skeleton,
            {
              width: i === lines - 1 ? '60%' : '100%',
              marginBottom: i < lines - 1 ? 12 : 0,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F4F1E9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  skeleton: {
    height: 14,
    backgroundColor: '#E0DAD5',
    borderRadius: 4,
  },
});
