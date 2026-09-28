import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function ProfileScreen({ user, onLogout }) {
  const handleLogoutConfirm = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Cerrar Sesión',
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={40} color={COLORS.primary} />
        </View>

        <Text style={styles.userName}>{user?.full_name || 'Paciente'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>PACIENTE VERIFICADO</Text>
        </View>

        {/* Info Rows */}
        <View style={styles.infoGroup}>
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={20} color={COLORS.primary} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Cédula de Identidad</Text>
              <Text style={styles.infoValue}>{user?.cedula || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Correo Electrónico</Text>
              <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Teléfono Móvil</Text>
              <Text style={styles.infoValue}>{user?.phone || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Security Banner */}
      <View style={styles.securityBox}>
        <Ionicons name="shield-checkmark-sharp" size={24} color={COLORS.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.securityTitle}>Encriptación de Grado Médico</Text>
          <Text style={styles.securityDesc}>
            Tus datos médicos y de crédito están resguardados bajo estándares HIPAA y cifrado SSL.
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleLogoutConfirm}
        style={styles.logoutBtn}
      >
        <Ionicons name="log-out-outline" size={22} color={COLORS.white} />
        <Text style={styles.logoutBtnText}>Cerrar Sesión de la App</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20, gap: 16, paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  roleBadge: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  infoGroup: {
    width: '100%',
    gap: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  infoTextGroup: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  securityDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    borderRadius: 16,
    height: 52,
    gap: 10,
    marginTop: 8,
    elevation: 3,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.white,
  },
});
