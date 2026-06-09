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
import { zodResolver } from 'hookform/resolvers/zod';
import api from '../../../src/lib/api';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { TenantServiceDTO, CreateTransactionRequest } from '@stnk/contracts';

const createTransactionSchema = z.object({
  customer_name: z.string().min(1, 'Nama customer wajib diisi'),
  customer_phone: z.string().min(10, 'Nomor HP tidak valid'),
  plate_number: z.string().min(1, 'Plat nomor wajib diisi'),
  vehicle_type: z.enum(['Motor', 'Mobil', 'Truk']),
  service_id: z.string().min(1, 'Pilih layanan'),
  total_cost: z.number().min(1, 'Biaya minimal Rp1'),
  notes: z.string().optional(),
});

type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

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
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      plate_number: '',
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
          '/admin-user/tenant/services'
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
      const payload: CreateTransactionRequest = {
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        plate_number: data.plate_number,
        vehicle_type: data.vehicle_type,
        service_id: data.service_id,
        total_cost: data.total_cost,
        notes: data.notes,
      };

      const response = await api.post('/admin-user/transactions', payload);
      
      Alert.alert('Sukses', 'Transaksi berhasil dibuat', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Gagal membuat transaksi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingServices) {
    return <LoadingSpinner />;
  }

  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Data Customer</Text>

          <Text style={styles.label}>Nama Customer</Text>
          <Controller
            control={control}
            name="customer_name"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.customer_name && styles.inputError]}
                  placeholder="Nama lengkap"
                  placeholderTextColor="#A0A0A0"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.customer_name && (
                  <Text style={styles.errorText}>{errors.customer_name.message}</Text>
                )}
              </>
            )}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Nomor HP</Text>
          <Controller
            control={control}
            name="customer_phone"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.customer_phone && styles.inputError]}
                  placeholder="08xx..."
                  placeholderTextColor="#A0A0A0"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                />
                {errors.customer_phone && (
                  <Text style={styles.errorText}>{errors.customer_phone.message}</Text>
                )}
              </>
            )}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Plat Nomor</Text>
          <Controller
            control={control}
            name="plate_number"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.plate_number && styles.inputError]}
                  placeholder="B 1234 ABC"
                  placeholderTextColor="#A0A0A0"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="characters"
                />
                {errors.plate_number && (
                  <Text style={styles.errorText}>{errors.plate_number.message}</Text>
                )}
              </>
            )}
          />

          <Text style={styles.sectionTitle}>Kendaraan & Layanan</Text>

          <Text style={styles.label}>Jenis Kendaraan</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowVehicleDropdown(!showVehicleDropdown)}
          >
            <Text style={styles.dropdownText}>{vehicleType}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          {showVehicleDropdown && (
            <View style={styles.dropdownMenu}>
              {['Motor', 'Mobil', 'Truk'].map((vehicle) => (
                <TouchableOpacity
                  key={vehicle}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setValue('vehicle_type', vehicle as any);
                    setShowVehicleDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{vehicle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={[styles.label, { marginTop: 16 }]}>Pilih Layanan</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowServiceDropdown(!showServiceDropdown)}
          >
            <Text style={styles.dropdownText}>
              {selectedService?.service_name || 'Pilih layanan'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          {showServiceDropdown && (
            <View style={[styles.dropdownMenu, { maxHeight: 200 }]}>
              {services
                .filter((s) => s.is_active)
                .map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={styles.dropdownItem}
                    onPress={() => handleServiceSelect(service)}
                  >
                    <Text style={styles.dropdownItemText}>
                      {service.service_name}
                    </Text>
                    <Text style={styles.dropdownItemPrice}>
                      Rp {parseInt(service.price).toLocaleString('id-ID')}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}

          <Text style={[styles.label, { marginTop: 16 }]}>Biaya (Rp)</Text>
          <Controller
            control={control}
            name="total_cost"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.total_cost && styles.inputError]}
                  placeholder="0"
                  placeholderTextColor="#A0A0A0"
                  value={value.toString()}
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  keyboardType="number-pad"
                />
                {errors.total_cost && (
                  <Text style={styles.errorText}>{errors.total_cost.message}</Text>
                )}
              </>
            )}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Catatan (opsional)</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Catatan tambahan..."
                placeholderTextColor="#A0A0A0"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
              />
            )}
          />

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
  container: { flex: 1, backgroundColor: '#F4F1E9' },
  keyboardView: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: {
    color: '#16201D',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
  },
  label: { color: '#16201D', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5CDBF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#16201D',
    marginBottom: 12,
  },
  inputError: { borderColor: '#D32F2F' },
  errorText: { color: '#D32F2F', fontSize: 12, marginBottom: 12 },
  textArea: { minHeight: 80, paddingTop: 12, textAlignVertical: 'top' },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5CDBF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dropdownText: { color: '#16201D', fontSize: 14 },
  dropdownArrow: { color: '#8B572A', fontSize: 12 },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5CDBF',
    borderRadius: 8,
    marginBottom: 12,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownItemText: { color: '#16201D', fontSize: 14 },
  dropdownItemPrice: { color: '#174B3B', fontWeight: '600', fontSize: 13 },
  button: {
    backgroundColor: '#174B3B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
