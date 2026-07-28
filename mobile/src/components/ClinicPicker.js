import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function ClinicPicker({
  clinics,
  selectedClinic,
  onSelectClinic,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClinics = clinics.filter((clinic) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      clinic.name.toLowerCase().includes(query) ||
      (clinic.city && clinic.city.toLowerCase().includes(query)) ||
      (clinic.address && clinic.address.toLowerCase().includes(query))
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Selecciona la Clínica Afiliada</Text>
        <Text style={styles.sectionSubtitle}>
          Centros de salud certificados en Venezuela con convenio MediCash
        </Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar clínica por nombre o ciudad..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* List of Clinics */}
      {filteredClinics.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="business-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No se encontraron clínicas para "{searchQuery}"</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {filteredClinics.map((clinic) => {
            const isSelected = selectedClinic?.id === clinic.id;

            return (
              <TouchableOpacity
                key={clinic.id}
                activeOpacity={0.8}
                onPress={() => onSelectClinic(clinic)}
                style={[styles.clinicCard, isSelected && styles.clinicCardSelected]}
              >
                <Image source={{ uri: clinic.image_url }} style={styles.clinicImage} />
                <View style={styles.clinicInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.clinicName} numberOfLines={1}>
                      {clinic.name}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                    )}
                  </View>
                  <Text style={styles.clinicAddress} numberOfLines={1}>
                    📍 {clinic.city} - {clinic.address}
                  </Text>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Convenio Quirúrgico Directo</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
  },
  list: {
    gap: 10,
    marginTop: 4,
  },
  clinicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  clinicCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 2,
  },
  clinicImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  clinicInfo: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clinicName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  clinicAddress: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
