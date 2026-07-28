import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function ClinicDoctorPicker({
  clinics,
  doctors,
  selectedClinic,
  selectedDoctor,
  onSelectClinic,
  onSelectDoctor,
}) {
  return (
    <View style={styles.container}>
      {/* 1. Clinics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Selecciona la Clínica Afiliada</Text>
        <Text style={styles.sectionSubtitle}>
          Centros de salud certificados en Venezuela con convenio MediCash
        </Text>

        <View style={styles.list}>
          {clinics.map((clinic) => {
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
                      <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
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
      </View>

      {/* 2. Doctors Section */}
      {selectedClinic && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Selecciona el Neurocirujano / Especialista</Text>
          <Text style={styles.sectionSubtitle}>
            Médicos cirujanos afiliados a {selectedClinic.name}
          </Text>

          {doctors.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No hay cirujanos registrados para esta clínica.</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {doctors.map((doc) => {
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
                      name="chevron-forward"
                      size={20}
                      color={isSelected ? COLORS.primary : COLORS.textLight}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  section: {
    gap: 8,
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
    padding: 10,
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
    gap: 2,
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
    backgroundColor: COLORS.cardAlt,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textMuted,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  docInfo: {
    flex: 1,
    gap: 2,
  },
  docName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  codeBadge: {
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeText: {
    fontSize: 9,
    fontFamily: 'Platform',
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
});
