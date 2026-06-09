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
import api from '../../../src/lib/api';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { ErrorState } from '../../../src/components/ErrorState';
import { TenantServiceDTO } from '@stnk/contracts';

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
        '/admin-user/tenant/services'
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

  const handleSavePrice = async (serviceId: string) => {
    setSaving(true);
    try {
      const newPrice = parseInt(editingPrice);
      if (isNaN(newPrice) || newPrice < 1) {
        Alert.alert('Error', 'Harga harus lebih dari 0');
        return;
      }

      await api.patch(`/admin-user/tenant/services/${serviceId}`, {
        price: newPrice,
      });

      const updated = services.map((s) =>
        s.id === serviceId ? { ...s, price: editingPrice } : s
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
      await api.patch(`/admin-user/tenant/services/${service.id}`, {
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
              onPress={() => handleSavePrice(item.id)}
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
  container: { flex: 1, backgroundColor: '#F4F1E9' },
  content: { padding: 16, paddingBottom: 32 },
  header: { color: '#16201D', fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#65706B', fontSize: 14, marginTop: 4 },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D5CDBF',
    padding: 16,
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: { flex: 1 },
  serviceName: { color: '#16201D', fontWeight: '600', fontSize: 14 },
  serviceCode: { color: '#8B572A', fontSize: 12, marginTop: 2 },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleActive: { backgroundColor: '#C8E6C9' },
  toggleInactive: { backgroundColor: '#FFCDD2' },
  toggleText: { fontSize: 18, color: '#16201D' },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F4F1E9',
  },
  priceLabel: { color: '#65706B', fontSize: 12 },
  priceValue: { color: '#174B3B', fontWeight: '700', fontSize: 16, marginTop: 4 },
  priceInput: {
    flex: 1,
    backgroundColor: '#F4F1E9',
    borderWidth: 1,
    borderColor: '#D5CDBF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    color: '#16201D',
    marginRight: 8,
  },
  editButton: {
    backgroundColor: '#174B3B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  saveButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  saveButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  cancelButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
});
