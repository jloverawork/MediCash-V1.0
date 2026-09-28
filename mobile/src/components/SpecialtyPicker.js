import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const getIconName = (icon) => {
  switch (icon) {
    case 'Brain':
      return { lib: 'FontAwesome5', name: 'brain' };
    case 'HeartPulse':
      return { lib: 'FontAwesome5', name: 'heartbeat' };
    case 'Bone':
      return { lib: 'FontAwesome5', name: 'bone' };
    default:
      return { lib: 'FontAwesome5', name: 'stethoscope' };
  }
};

export default function SpecialtyPicker({ specialties, selectedSpecialty, onSelectSpecialty }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Especialidades Médicas</Text>
          <Text style={styles.subtitle}>Selecciona el área de tu intervención quirúrgica</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={12} color={COLORS.gold} />
          <Text style={styles.badgeText}>Financiamiento Activo</Text>
        </View>
      </View>

      <View style={styles.list}>
        {specialties.map((spec) => {
          const isSelected = selectedSpecialty?.id === spec.id;
          const isFeatured = spec.is_featured;
          const iconInfo = getIconName(spec.icon);

          return (
            <TouchableOpacity
              key={spec.id}
              activeOpacity={0.8}
              onPress={() => onSelectSpecialty(spec)}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
                isFeatured && !isSelected && styles.cardFeatured,
              ]}
            >
              {isFeatured && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>★ ESPECIALIDAD PRINCIPAL MEDICASH</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconBox,
                    isFeatured && styles.iconBoxFeatured,
                    isSelected && styles.iconBoxSelected,
                  ]}
                >
                  <FontAwesome5
                    name={iconInfo.name}
                    size={22}
                    color={isFeatured || isSelected ? COLORS.white : COLORS.primary}
                  />
                </View>

                <View style={styles.infoContainer}>
                  <View style={styles.nameRow}>
                    <Text style={styles.specName}>{spec.name}</Text>
                    {isFeatured && (
                      <View style={styles.coverageTag}>
                        <Ionicons name="shield-checkmark" size={12} color={COLORS.primary} />
                        <Text style={styles.coverageTagText}>Cobertura Total</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.specDescription} numberOfLines={2}>
                    {spec.description}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isSelected ? COLORS.primary : COLORS.textLight}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.goldLight,
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardFeatured: {
    borderColor: COLORS.primaryBorder,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 2,
  },
  featuredBadge: {
    position: 'absolute',
    top: -10,
    right: 14,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  featuredBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.white,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxFeatured: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  iconBoxSelected: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  coverageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  coverageTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  specDescription: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
});
