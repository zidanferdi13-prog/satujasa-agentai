import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const roles = ['Super Admin', 'Owner', 'Admin User'];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>STNK Jasa</Text>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>MOBILE WORKSPACE</Text>
          <Text style={styles.title}>Layanan STNK dalam satu alur kerja.</Text>
          <Text style={styles.description}>
            Struktur awal aplikasi mobile untuk autentikasi, navigasi berbasis role,
            upload dokumen, dan integrasi API.
          </Text>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Belum terhubung ke autentikasi</Text>
          <Text style={styles.noticeText}>
            Role di bawah adalah preview. Session aman akan ditambahkan setelah kontrak backend disetujui.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Preview role</Text>
        {roles.map((role, index) => (
          <TouchableOpacity key={role} style={styles.roleButton} activeOpacity={0.75}>
            <Text style={styles.roleNumber}>0{index + 1}</Text>
            <Text style={styles.roleLabel}>{role}</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F1E9' },
  container: { padding: 24, paddingBottom: 48 },
  brand: { color: '#16201D', fontFamily: 'serif', fontSize: 24, fontWeight: '700', marginBottom: 68 },
  hero: { marginBottom: 34 },
  eyebrow: { color: '#8B572A', fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 16 },
  title: { color: '#16201D', fontFamily: 'serif', fontSize: 44, letterSpacing: -1.5, lineHeight: 47 },
  description: { color: '#65706B', fontSize: 16, lineHeight: 26, marginTop: 20 },
  notice: { backgroundColor: '#173F34', marginBottom: 40, padding: 24 },
  noticeTitle: { color: '#FFFFFF', fontFamily: 'serif', fontSize: 20, marginBottom: 8 },
  noticeText: { color: '#BED0CA', lineHeight: 21 },
  sectionTitle: { color: '#16201D', fontSize: 13, fontWeight: '800', letterSpacing: 1.5, marginBottom: 14, textTransform: 'uppercase' },
  roleButton: { alignItems: 'center', borderTopColor: '#D5CDBF', borderTopWidth: 1, flexDirection: 'row', paddingVertical: 20 },
  roleNumber: { color: '#8B572A', fontFamily: 'serif', marginRight: 18 },
  roleLabel: { color: '#16201D', flex: 1, fontSize: 18, fontWeight: '600' },
  arrow: { color: '#174B3B', fontSize: 22 },
});
