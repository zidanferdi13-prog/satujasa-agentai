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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TenantServiceDTO } from '@stnk/contracts';

// Helper to fix Zod resolver typing issue with @hookform/resolvers@3.x
const getZodResolver = (schema: any) => zodResolver(schema);

const createTransactionSchema = z.object({
  customer_name: z.string().min(1, 'Nama customer wajib diisi'),
  customer_phone: z.string().min(10, 'Nomor HP tidak valid'),
  vehicle_plate: z.string().min(3, 'Plat nomor minimal 3 karakter').max(12, 'Plat nomor maksimal 12 karakter'),
  vehicle_type: z.enum(['Motor', 'Mobil', 'Truk']),
  service_id: z.string().min(1, 'Pilih layanan'),
  total_cost: z.number().min(1, 'Biaya minimal Rp1'),
  notes: z.string().optional(),
});

type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

interface CreateAdminTransactionPayload {
  customer_name: string;
  customer_phone: string;
  vehicle_plate: string;
  service_id: string;
  total_cost: number;
  additional_cost?: number;
  notes?: string;
}

export default function NewTransactionScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<TenantServiceDTO[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedServicePrice, setSelectedServicePrice] = useState<number>(0);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateTransactionFormData>({
    resolver: getZodResolver(createTransactionSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      vehicle_plate: '',
      vehicle_type: 'Mobil',
      service_id: '',
      total_cost: 0,
      notes: '',
    },
  });

  const vehicleType = watch('vehicle_type');
  const selectedServiceId = watch('service_id');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get<{ data: TenantServiceDTO[] }>(
          '/admin-user/services'
        );
        setServices(response.data.data);
      } catch (err) {
        Alert.alert('Error', 'Gagal memuat layanan');
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceSelect = (service: TenantServiceDTO) => {
    setValue('service_id', service.id);
    setValue('total_cost', parseInt(service.price));
    setSelectedServicePrice(parseInt(service.price));
    setShowServiceDropdown(false);
  };

  const onSubmit = async (data: CreateTransactionFormData) => {
    setIsSubmitting(true);
    try {
      const payload: CreateAdminTransactionPayload = {
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        vehicle_plate: data.vehicle_plate,
        service_id: data.service_id,
        total_cost: data.total_cost,
        notes: data.notes,
      };

      await api.post('/admin-user/transactions', payload);

      Alert.alert('Berhasil', 'Transaksi berhasil dibuat', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Gagal membuat transaksi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingServices) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Transaksi Baru</Text>
            <Text style={styles.subtitle}>Input data customer dan layanan</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nama Customer</Text>
            <Controller
              control={control}
              name="customer_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    style={[styles.input, errors.customer_name && styles.inputError]}
                    placeholder="Nama customer"
                    placeholderTextColor="#A0A0A0"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoCapitalize="words"
                    editable={!isSubmitting}
                  />
                  {errors.customer_name && (
                    <Text style={styles.errorText}>{errors.customer_name.message}</Text>
                  )}
                </>
              )}
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Nomor HP</Text>
            <Controller
              control={control}
              name="customer_phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    style={[styles.input, errors.customer_phone && styles.inputError]}
                    placeholder="Nomor HP"
                    placeholderTextColor="#A0A0A0"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    keyboardType="phone-pad"
                    editable={!isSubmitting}
                  />
                  {errors.customer_phone && (
                    <Text style={styles.errorText}>{errors.customer_phone.message}</Text>
                  )}
                </>
              )}
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Plat Nomor</Text>
            <Controller
              control={control}
              name="vehicle_plate"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    style={[styles.input, errors.vehicle_plate && styles.inputError]}
                    placeholder="Plat nomor (contoh: B 1234 ABC)"
                    placeholderTextColor="#A0A0A0"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoCapitalize="characters"
                    editable={!isSubmitting}
                  />
                  {errors.vehicle_plate && (
                    <Text style={styles.errorText}>{errors.vehicle_plate.message}</Text>
                  )}
                </>
              )}
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Jenis Kendaraan</Text>
            <TouchableOpacity
              style={[styles.input, styles.dropdown]}
              onPress={() => setShowVehicleDropdown(!showVehicleDropdown)}
              disabled={isSubmitting}
            >
              <Text style={styles.dropdownText}>
                {vehicleType} {showVehicleDropdown ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {showVehicleDropdown && (
              <View style={styles.dropdownMenu}>
                {['Motor' as const, 'Mobil' as const, 'Truk' as const].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setValue('vehicle_type', type);
                      setShowVehicleDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={[styles.label, { marginTop: 20 }]}>Layanan</Text>
            <TouchableOpacity
              style={[styles.input, styles.dropdown]}
              onPress={() => setShowServiceDropdown(!showServiceDropdown)}
              disabled={isSubmitting}
            >
              <Text style={styles.dropdownText}>
                {selectedServiceId ? services.find(s => s.id === selectedServiceId)?.service_name : 'Pilih layanan'}
                {showServiceDropdown ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {showServiceDropdown && services.length > 0 && (
              <View style={styles.dropdownMenu}>
                {services.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={styles.dropdownItem}
                    onPress={() => handleServiceSelect(service)}
                  >
                    <Text style={styles.dropdownText}>{service.service_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={[styles.label, { marginTop: 20 }]}>Total Biaya</Text>
            <TextInput
              style={styles.input}
              value={selectedServicePrice.toString()}
              editable={false}
              keyboardType="number-pad"
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Catatan</Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Catatan tambahan (opsional)"
                    placeholderTextColor="#A0A0A0"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    multiline
                    numberOfLines={3}
                    editable={!isSubmitting}
                  />
                  {errors.notes && (
                    <Text style={styles.errorText}>{errors.notes.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F1E9' },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'space-between', padding: 24 },
  header: { marginBottom: 40, marginTop: 20 },
  title: {
    color: '#16201D',
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: { color: '#8B572A', fontSize: 14, fontWeight: '600' },
  form: { marginBottom: 40 },
  label: {
    color: '#16201D',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5CDBF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#16201D',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dropdown: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#16201D',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D5CDBF',
    marginTop: 4,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFE9',
  },
  inputError: { borderColor: '#D32F2F' },
  errorText: { color: '#D32F2F', fontSize: 12, marginBottom: 12 },
  button: {
    backgroundColor: '#174B3B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
