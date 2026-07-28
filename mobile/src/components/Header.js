import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function Header({ user, onLogout }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="stethoscope" size={16} color={COLORS.white} />
        </View>
        <Text style={styles.logoTitle}>MediCash</Text>
      </View>

      {user && (
        <View style={styles.userRow}>
          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText}>{user.full_name?.split(' ')[0] || 'Paciente'}</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 12,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userBadge: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.dangerLight,
    borderColor: COLORS.danger,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.danger,
  },
});
