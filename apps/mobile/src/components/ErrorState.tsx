import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({
  message,
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Terjadi Kesalahan</Text>
      <Text style={styles.message}>{message}</Text>
      {showRetry && onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Coba Lagi</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16201D',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#65706B',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#174B3B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
