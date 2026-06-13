import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import api from '@/lib/api';
import { colors, spacing, radius, cardShadow, typography, themeStyles } from '@/theme/designTokens';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { TenantServiceDTO } from '@/contracts';

export default function ServicesScreen() {
  const [services, setServices] = useState<TenantServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setError(null);
      const response = await api.get<{ data: TenantServiceDTO[] }>(
        '/admin-user/services'
      );
      setServices(response.data.data);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat harga layanan');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPrice = (service: TenantServiceDTO) => {
    setEditingId(service.id);
    setEditingPrice(service.price);
  };

  const handleSavePrice = async (service: TenantServiceDTO) => {
    setSaving(true);
    try {
      const newPrice = parseInt(editingPrice);
      if (isNaN(newPrice) || newPrice < 1) {
        Alert.alert('Error', 'Harga harus lebih dari 0');
        return;
      }

      await api.post('/admin-user/services', {
        service_id: service.service_id,
        price: newPrice,
        is_active: service.is_active,
      });

      const updated = services.map((s) =>
        s.id === service.id ? { ...s, price: editingPrice } : s
      );
      setServices(updated);
      setEditingId(null);
      Alert.alert('Sukses', 'Harga berhasil diperbarui');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Gagal update harga');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (service: TenantServiceDTO) => {
    try {
      await api.post('/admin-user/services', {
        service_id: service.service_id,
        price: Number(service.price),
        is_active: !service.is_active,
      });

      const updated = services.map((s) =>
        s.id === service.id ? { ...s, is_active: !s.is_active } : s
      );
      setServices(updated);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Gagal update status');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState message={error} onRetry={fetchServices} />
      </SafeAreaView>
    );
  }

  const renderService = ({ item }: { item: TenantServiceDTO }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.service_name}</Text>
          <Text style={styles.serviceCode}>{item.service_code}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            item.is_active ? styles.toggleActive : styles.toggleInactive,
          ]}
          onPress={() => handleToggleActive(item)}
        >
          <Text style={styles.toggleText}>
            {item.is_active ? '✓' : '✗'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.priceRow}>
        {editingId === item.id ? (
          <>
            <TextInput
              style={styles.priceInput}
              value={editingPrice}
              onChangeText={setEditingPrice}
              keyboardType="number-pad"
              placeholder="Harga"
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSavePrice(item)}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditingId(null)}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View>
              <Text style={styles.priceLabel}>Harga</Text>
              <Text style={styles.priceValue}>
                Rp {parseInt(item.price).toLocaleString('id-ID')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditPrice(item)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Harga Layanan Tenant</Text>
        <Text style={styles.subtitle}>
          Kelola harga layanan untuk tenant Anda
        </Text>

        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cloud },
  content: { padding: spacing[16], paddingBottom: spacing[32] },
  header: { color: colors.ink, fontSize: typography.sizes.subheading, fontWeight: typography.weights.bold },
  subtitle: { color: colors.slate, fontSize: typography.sizes.bodySm, marginTop: spacing[4] ?? 4 },
  serviceCard: {
    backgroundColor: colors.snow,
    borderRadius: radius.cards,
    padding: spacing[16],
    marginBottom: spacing[12] ?? 12,
    ...cardShadow('default'),
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[12] ?? 12,
  },
  serviceInfo: { flex: 1 },
  serviceName: { color: colors.ink, fontWeight: typography.weights.medium, fontSize: typography.sizes.body },
  serviceCode: { color: colors.slate, fontSize: typography.sizes.caption, marginTop: 2 },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleActive: { backgroundColor: colors.mint },
  toggleInactive: { backgroundColor: colors.sky },
  toggleText: { fontSize: 18 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[12] ?? 12,
    borderTopWidth: 1,
    borderTopColor: colors.fog,
  },
  priceLabel: { color: colors.slate, fontSize: typography.sizes.caption },
  priceValue: { color: colors.mondayViolet, fontWeight: typography.weights.bold, fontSize: typography.sizes.body, marginTop: spacing[4] ?? 4 },
  priceInput: {
    flex: 1,
    backgroundColor: colors.cloud,
    borderWidth: 1,
    borderColor: colors.pebble,
    borderRadius: radius.inputs,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[8],
    fontSize: typography.sizes.bodySm,
    color: colors.ink,
    marginRight: spacing[8],
  },
  editButton: {
    backgroundColor: colors.mondayViolet,
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[8],
    borderRadius: radius.badges,
  },
  editButtonText: { color: colors.snow, fontWeight: typography.weights.medium, fontSize: typography.sizes.caption },
  saveButton: {
    backgroundColor: colors.forest,
    paddingHorizontal: spacing[12] ?? 12,
    paddingVertical: spacing[8],
    borderRadius: radius.badges,
    marginRight: spacing[8],
  },
  saveButtonText: { color: colors.snow, fontWeight: typography.weights.medium, fontSize: typography.sizes.caption },
  cancelButton: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing[12] ?? 12,
    paddingVertical: spacing[8],
    borderRadius: radius.badges,
  },
  cancelButtonText: { color: colors.snow, fontWeight: typography.weights.medium, fontSize: typography.sizes.caption },
});
