import React, { useEffect, useMemo, useState } from 'react';
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
import {
  CreateTransactionFeeDetail,
  TenantServiceDTO,
  TransactionRequirementFee,
  TransactionRequirementsResponse,
  VehicleTypeCode,
  vehicleTypeCodes,
} from '@/contracts';

const getZodResolver = (schema: z.ZodTypeAny) => zodResolver(schema);

const JABAR_CITIES = [
  { code: 'BDG', name: 'Bandung' },
  { code: 'BGR', name: 'Bogor' },
  { code: 'BKS', name: 'Bekasi' },
  { code: 'DPK', name: 'Depok' },
  { code: 'CMH', name: 'Cimahi' },
  { code: 'CRB', name: 'Cirebon' },
  { code: 'TSM', name: 'Tasikmalaya' },
  { code: 'SBG', name: 'Subang' },
  { code: 'KRW', name: 'Karawang' },
  { code: 'SKB', name: 'Sukabumi' },
];

const createTransactionSchema = z.object({
  customer_name: z.string().min(1, 'Nama customer wajib diisi'),
  customer_phone: z.string().min(10, 'Nomor HP tidak valid'),
  vehicle_plate: z.string().min(3, 'Plat nomor minimal 3 karakter').max(12, 'Plat nomor maksimal 12 karakter'),
  vehicle_type_code: z.enum(vehicleTypeCodes),
  service_id: z.string().min(1, 'Pilih layanan'),
  province_code: z.string().min(1),
  city_code: z.string().optional(),
  tax_due_date: z.string().optional(),
  notes: z.string().optional(),
});

type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

interface CreateAdminTransactionPayload {
  customer_name: string;
  customer_phone: string;
  vehicle_plate: string;
  vehicle_type_code: VehicleTypeCode;
  service_id: string;
  province_code: string;
  city_code?: string;
  city_name?: string;
  tax_due_date?: string;
  additional_cost: number;
  fee_details: CreateTransactionFeeDetail[];
  notes?: string;
}

function money(value: string | number) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
}

function numericValue(value: string) {
  return Number(value.replace(/[^0-9]/g, '') || 0);
}

export default function NewTransactionScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<TenantServiceDTO[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [requirementsLoading, setRequirementsLoading] = useState(false);
  const [requirementError, setRequirementError] = useState<string | null>(null);
  const [fees, setFees] = useState<TransactionRequirementFee[]>([]);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateTransactionFormData>({
    resolver: getZodResolver(createTransactionSchema),
    defaultValues: {
      customer_name: '', customer_phone: '', vehicle_plate: '', vehicle_type_code: 'MOTOR',
      service_id: '', province_code: 'JABAR', city_code: 'BDG', tax_due_date: '', notes: '',
    },
  });

  const selectedServiceId = watch('service_id');
  const vehicleTypeCode = watch('vehicle_type_code');
  const cityCode = watch('city_code');
  const totalPreview = useMemo(() => fees.reduce((sum, fee) => sum + numericValue(fee.amount), 0), [fees]);

  useEffect(() => {
    api.get<{ data: TenantServiceDTO[] }>('/admin-user/services')
      .then((response) => setServices(response.data.data))
      .catch(() => Alert.alert('Error', 'Gagal memuat layanan'))
      .finally(() => setLoadingServices(false));
  }, []);

  useEffect(() => {
    if (!selectedServiceId || !vehicleTypeCode) {
      setFees([]);
      return;
    }
    setRequirementsLoading(true);
    setRequirementError(null);
    api.get<TransactionRequirementsResponse>('/admin-user/transactions/requirements', {
      params: { service_id: selectedServiceId, vehicle_type_code: vehicleTypeCode, province_code: 'JABAR', city_code: cityCode },
    }).then((response) => {
      setFees(response.data.fees.map((fee) => ({ ...fee, amount: fee.amount ?? fee.defaultAmount })));
    }).catch((err) => {
      setFees([]);
      setRequirementError(err?.response?.data?.error || 'Gagal memuat komponen biaya');
    }).finally(() => setRequirementsLoading(false));
  }, [selectedServiceId, vehicleTypeCode, cityCode]);

  const selectedCity = JABAR_CITIES.find((city) => city.code === cityCode) ?? JABAR_CITIES[0];
  const selectedServiceName = services.find((service) => service.id === selectedServiceId)?.service_name ?? 'Pilih layanan';

  const handleFeeChange = (componentCode: string, text: string) => {
    setFees((current) => current.map((fee) => fee.componentCode === componentCode ? { ...fee, amount: numericValue(text).toString() } : fee));
  };

  const onSubmit = async (data: CreateTransactionFormData) => {
    if (fees.length === 0) {
      Alert.alert('Biaya belum siap', 'Pilih layanan/kendaraan dan tunggu komponen biaya tampil.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: CreateAdminTransactionPayload = {
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        vehicle_plate: data.vehicle_plate,
        vehicle_type_code: data.vehicle_type_code,
        service_id: data.service_id,
        province_code: data.province_code,
        city_code: data.city_code,
        city_name: selectedCity.name,
        tax_due_date: data.tax_due_date || undefined,
        additional_cost: 0,
        fee_details: fees.map((fee) => ({ component_code: fee.componentCode, amount: numericValue(fee.amount) })),
        notes: data.notes,
      };
      await api.post('/admin-user/transactions', payload);
      Alert.alert('Berhasil', 'Transaksi berhasil dibuat', [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Error', 'Gagal membuat transaksi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingServices) return <LoadingSpinner />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}><Text style={styles.title}>Transaksi Baru</Text><Text style={styles.subtitle}>Input data, komponen biaya, dan checklist backend</Text></View>
          <View style={styles.form}>
            <Field control={control} name="customer_name" label="Nama Customer" placeholder="Nama customer" error={errors.customer_name?.message} editable={!isSubmitting} />
            <Field control={control} name="customer_phone" label="Nomor HP" placeholder="Nomor HP" error={errors.customer_phone?.message} editable={!isSubmitting} keyboardType="phone-pad" />
            <Field control={control} name="vehicle_plate" label="Plat Nomor" placeholder="D 1234 ABC" error={errors.vehicle_plate?.message} editable={!isSubmitting} autoCapitalize="characters" />
            <Dropdown label="Jenis Kendaraan" value={vehicleTypeCode} open={showVehicleDropdown} setOpen={setShowVehicleDropdown} options={vehicleTypeCodes.map((code) => ({ key: code, label: code, onPress: () => setValue('vehicle_type_code', code) }))} disabled={isSubmitting} />
            <Dropdown label="Layanan" value={selectedServiceName} open={showServiceDropdown} setOpen={setShowServiceDropdown} options={services.map((service) => ({ key: service.id, label: service.service_name, onPress: () => setValue('service_id', service.id) }))} disabled={isSubmitting} />
            <Dropdown label="Kota / Kabupaten (Jabar)" value={selectedCity.name} open={showCityDropdown} setOpen={setShowCityDropdown} options={JABAR_CITIES.map((city) => ({ key: city.code, label: city.name, onPress: () => setValue('city_code', city.code) }))} disabled={isSubmitting} />
            <Field control={control} name="tax_due_date" label="Jatuh Tempo Pajak (opsional)" placeholder="YYYY-MM-DD" editable={!isSubmitting} />

            <View style={styles.feeBox}>
              <Text style={styles.sectionTitle}>Komponen Biaya</Text>
              {requirementsLoading && <Text style={styles.helperText}>Memuat biaya dari backend...</Text>}
              {requirementError && <Text style={styles.errorText}>{requirementError}</Text>}
              {!requirementsLoading && fees.map((fee) => (
                <View key={fee.componentCode} style={styles.feeRow}>
                  <View style={styles.feeInfo}><Text style={styles.feeName}>{fee.componentName}</Text><Text style={styles.helperText}>{fee.source === 'tenant_pricing' ? 'Biaya sistem terkunci' : fee.componentCode}</Text></View>
                  <TextInput style={[styles.feeInput, !fee.isEditable && styles.lockedInput]} value={money(fee.amount)} onChangeText={(text) => handleFeeChange(fee.componentCode, text)} editable={fee.isEditable && !isSubmitting} keyboardType="number-pad" />
                </View>
              ))}
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Preview Total</Text><Text style={styles.totalValue}>{money(totalPreview)}</Text></View>
            </View>

            <Controller control={control} name="notes" render={({ field: { onChange, value } }) => <><Text style={styles.label}>Catatan</Text><TextInput style={[styles.input, styles.textArea]} placeholder="Catatan tambahan (opsional)" placeholderTextColor="#A0A0A0" onChangeText={onChange} value={value} multiline numberOfLines={3} editable={!isSubmitting} /></>} />
          </View>
          <TouchableOpacity style={[styles.button, (isSubmitting || requirementsLoading) && styles.buttonDisabled]} onPress={handleSubmit(onSubmit)} disabled={isSubmitting || requirementsLoading}><Text style={styles.buttonText}>{isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}</Text></TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ control, name, label, placeholder, error, editable, keyboardType, autoCapitalize }: any) {
  return <><Text style={styles.label}>{label}</Text><Controller control={control} name={name} render={({ field: { onChange, onBlur, value } }) => <><TextInput style={[styles.input, error && styles.inputError]} placeholder={placeholder} placeholderTextColor="#A0A0A0" onChangeText={onChange} onBlur={onBlur} value={value} editable={editable} keyboardType={keyboardType} autoCapitalize={autoCapitalize} />{error && <Text style={styles.errorText}>{error}</Text>}</>} /></>;
}

function Dropdown({ label, value, open, setOpen, options, disabled }: { label: string; value: string; open: boolean; setOpen: (open: boolean) => void; options: { key: string; label: string; onPress: () => void }[]; disabled: boolean }) {
  return <><Text style={styles.label}>{label}</Text><TouchableOpacity style={[styles.input, styles.dropdown]} onPress={() => setOpen(!open)} disabled={disabled}><Text style={styles.dropdownText}>{value} {open ? '▲' : '▼'}</Text></TouchableOpacity>{open && <View style={styles.dropdownMenu}>{options.map((item) => <TouchableOpacity key={item.key} style={styles.dropdownItem} onPress={() => { item.onPress(); setOpen(false); }}><Text style={styles.dropdownText}>{item.label}</Text></TouchableOpacity>)}</View>}</>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F1E9' }, container: { flex: 1 }, scrollContent: { padding: 24, paddingBottom: 32 }, header: { marginBottom: 24, marginTop: 20 },
  title: { color: '#16201D', fontFamily: 'serif', fontSize: 28, fontWeight: '700', marginBottom: 8 }, subtitle: { color: '#8B572A', fontSize: 14, fontWeight: '600' }, form: { marginBottom: 24 },
  label: { color: '#16201D', fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 }, input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D5CDBF', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, fontSize: 14, color: '#16201D' },
  textArea: { minHeight: 80, textAlignVertical: 'top' }, dropdown: { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }, dropdownText: { fontSize: 14, color: '#16201D' }, dropdownMenu: { backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D5CDBF', marginTop: 4, maxHeight: 220, overflow: 'hidden' }, dropdownItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F0EFE9' },
  inputError: { borderColor: '#D32F2F' }, errorText: { color: '#D32F2F', fontSize: 12, marginBottom: 8 }, helperText: { color: '#65706B', fontSize: 12 }, feeBox: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16, marginTop: 20 }, sectionTitle: { color: '#16201D', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  feeRow: { borderBottomWidth: 1, borderBottomColor: '#F0EFE9', paddingVertical: 10 }, feeInfo: { marginBottom: 8 }, feeName: { color: '#16201D', fontWeight: '700', fontSize: 13 }, feeInput: { backgroundColor: '#F9F7F2', borderWidth: 1, borderColor: '#D5CDBF', borderRadius: 8, padding: 10, color: '#16201D', fontWeight: '700' }, lockedInput: { backgroundColor: '#ECE7DC', color: '#65706B' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#D5CDBF' }, totalLabel: { color: '#16201D', fontWeight: '700' }, totalValue: { color: '#174B3B', fontWeight: '800' },
  button: { backgroundColor: '#174B3B', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 }, buttonDisabled: { opacity: 0.6 }, buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
