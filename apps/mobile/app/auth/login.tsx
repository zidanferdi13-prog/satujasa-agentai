import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { storeToken } from '@/lib/auth';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AuthResponse, UserDTO } from '@/contracts';

// Helper to fix Zod resolver typing issue with @hookform/resolvers@3.x
// Use any for the schema to bypass generic constraint
const getZodResolver = (schema: any) => zodResolver(schema);

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Helper to convert AuthResponse.user to UserDTO
const toUserDTO = (user: AuthResponse['user']): UserDTO => ({
  id: user.id,
  email: user.email,
  phone: user.phone,
  role: user.role,
  owner_id: null,
  tenant_id: null,
  created_at: new Date().toISOString(),
});

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const setError = useAuthStore((state) => state.setError);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: getZodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { user, accessToken } = response.data;

      // Store token securely
      await storeToken(accessToken);

      // Update auth state - convert AuthResponse.user to UserDTO
      setUser(toUserDTO(user));

      // Reset form
      reset();

      // Navigate to dashboard
      router.replace('/(app)');
    } catch (err: any) {
      const message =
        err?.message || 'Login gagal. Periksa email dan password Anda.';
      setError(message);
      Alert.alert('Login Gagal', message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
            <Text style={styles.brand}>STNK Jasa</Text>
            <Text style={styles.subtitle}>Admin User</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Email Anda"
                    placeholderTextColor="#A0A0A0"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </>
              )}
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="Password Anda"
                    placeholderTextColor="#A0A0A0"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    secureTextEntry
                    editable={!isLoading}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
                  )}
                </>
              )}
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Sedang login...' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Akses Admin User untuk input transaksi dan kelola berkas.
            </Text>
          </View>
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
  brand: {
    color: '#16201D',
    fontFamily: 'serif',
    fontSize: 32,
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
    marginBottom: 4,
  },
  inputError: { borderColor: '#D32F2F' },
  errorText: { color: '#D32F2F', fontSize: 12, marginBottom: 12 },
  button: {
    backgroundColor: '#174B3B',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 32,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  footer: { marginTop: 20 },
  footerText: { color: '#65706B', fontSize: 13, lineHeight: 20, textAlign: 'center' },
});
