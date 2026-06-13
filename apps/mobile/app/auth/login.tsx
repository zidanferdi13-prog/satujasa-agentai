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
import { colors, spacing, radius, cardShadow, typography, themeStyles } from '@/theme/designTokens';

const getZodResolver = (schema: any) => zodResolver(schema);

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

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

      await storeToken(accessToken);

      setUser(toUserDTO(user));

      reset();

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
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Brand Header */}
          <View style={styles.brandSection}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandMark}>S</Text>
            </View>
            <Text style={styles.brandName}>STNK Jasa</Text>
            <Text style={styles.brandTagline}>Admin User</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Masuk</Text>
            <Text style={styles.cardSubtitle}>
              Masukkan email dan password Anda
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      placeholder="contoh@email.com"
                      placeholderTextColor={colors.iron}
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

              <Text style={[styles.label, { marginTop: spacing[20] ?? 20 }]}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      style={[styles.input, errors.password && styles.inputError]}
                      placeholder="Password"
                      placeholderTextColor={colors.iron}
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
                style={[themeStyles.primaryButton, styles.submitButton]}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                <Text style={themeStyles.primaryButtonText}>
                  {isLoading ? 'Memproses...' : 'Masuk'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
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
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.cloud },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[24],
    paddingVertical: spacing[40],
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing[32],
  },
  brandBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.mondayViolet,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[16],
  },
  brandMark: {
    fontSize: 28,
    fontWeight: typography.weights.bold,
    color: colors.snow,
  },
  brandName: {
    fontSize: 28,
    fontWeight: typography.weights.bold,
    color: colors.ink,
    marginBottom: spacing[8],
  },
  brandTagline: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.medium,
    color: colors.mondayViolet,
  },
  card: {
    backgroundColor: colors.snow,
    borderRadius: radius.cards,
    padding: spacing[24],
    ...cardShadow('default'),
    marginBottom: spacing[24],
  },
  cardTitle: {
    fontSize: typography.sizes.subheading,
    fontWeight: typography.weights.medium,
    color: colors.ink,
    marginBottom: spacing[8],
  },
  cardSubtitle: {
    fontSize: typography.sizes.bodySm,
    color: colors.slate,
    marginBottom: spacing[24],
  },
  formSection: {
    gap: spacing[8],
  },
  label: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.medium,
    color: colors.ink,
    marginBottom: spacing[8],
  },
  input: {
    backgroundColor: colors.snow,
    borderWidth: 1,
    borderColor: colors.pebble,
    borderRadius: radius.inputs,
    paddingHorizontal: spacing[16],
    paddingVertical: 14,
    fontSize: typography.sizes.body,
    color: colors.ink,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.caption,
    marginTop: spacing[4] ?? 4,
  },
  submitButton: {
    marginTop: spacing[24],
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: spacing[24],
  },
  footerText: {
    fontSize: typography.sizes.bodySm,
    color: colors.slate,
    textAlign: 'center',
  },
});
