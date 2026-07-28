import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function DoctorPicker({
  doctors,
  selectedSpecialty,
  selectedClinic,
  selectedDoctor,
  onSelectDoctor,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = doctors.filter((doc) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      doc.full_name.toLowerCase().includes(query) ||
      (doc.subspecialty && doc.subspecialty.toLowerCase().includes(query)) ||
      (doc.specialty_name && doc.specialty_name.toLowerCase().includes(query)) ||
      (doc.mpps_code && doc.mpps_code.toLowerCase().includes(query))
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Selecciona el Médico Cirujano</Text>
        <Text style={styles.sectionSubtitle}>
          Especialistas de {selectedSpecialty?.name || 'la especialidad'} que operan en{' '}
          {selectedClinic?.name || 'la clínica seleccionada'}
        </Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar médico por nombre o subespecialidad..."
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

      {/* List of Doctors */}
      {doctors.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="people-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No hay cirujanos registrados</Text>
          <Text style={styles.emptyText}>
            Actualmente no hay especialistas de {selectedSpecialty?.name} disponibles en {selectedClinic?.name}.
          </Text>
        </View>
      ) : filteredDoctors.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="search-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No se encontraron médicos para "{searchQuery}"</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {filteredDoctors.map((doc) => {
            const isSelected = selectedDoctor?.id === doc.id;

            return (
              <TouchableOpacity
                key={doc.id}
                activeOpacity={0.8}
                onPress={() => onSelectDoctor(doc)}
                style={[styles.docCard, isSelected && styles.docCardSelected]}
              >
                <Image source={{ uri: doc.avatar_url }} style={styles.docAvatar} />
                <View style={styles.docInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.docName} numberOfLines={1}>
                      {doc.full_name}
                    </Text>
                    {doc.mpps_code && (
                      <View style={styles.codeBadge}>
                        <Text style={styles.codeText}>{doc.mpps_code}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.docSub}>{doc.subspecialty || doc.specialty_name}</Text>
                  <Text style={styles.docAffiliate}>★ Especialista Afiliado a MediCash</Text>
                </View>
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'chevron-forward'}
                  size={20}
                  color={isSelected ? COLORS.primary : COLORS.textLight}
                />
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
    lineHeight: 16,
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
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  docCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 2,
  },
  docAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  docInfo: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  codeBadge: {
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  docSub: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  docAffiliate: {
    fontSize: 10,
    color: COLORS.gold,
    fontWeight: '600',
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
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
