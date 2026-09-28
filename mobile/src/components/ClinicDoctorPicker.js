import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function ClinicDoctorPicker({
  modality = 'specialties', // 'specialties' | 'services'
  clinics = [],
  doctors = [],
  selectedClinic,
  selectedDoctor,
  onSelectClinic,
  onSelectDoctor,
  onNextStep,
  providerType, // null | 'affiliated' | 'particular'
  setProviderType,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [particularDoctorName, setParticularDoctorName] = useState('');
  const [particularCenterName, setParticularCenterName] = useState('');

  const isSpecialty = modality === 'specialties';

  const filteredClinics = clinics.filter((clinic) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      clinic.name.toLowerCase().includes(query) ||
      (clinic.city && clinic.city.toLowerCase().includes(query)) ||
      (clinic.address && clinic.address.toLowerCase().includes(query))
    );
  });

  const handleSelectClinic = (clinic) => {
    if (onSelectClinic) onSelectClinic(clinic);
    if (onNextStep) onNextStep();
  };

  // IF NO TYPE SELECTED YET: SHOW THE 2 OPTION CARDS
  if (!providerType) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isSpecialty ? 'Selección de Tipo de Proveedor' : 'Selección de Tipo de Centro Diagnóstico'}
          </Text>
          <Text style={styles.subtitle}>
            Selecciona la modalidad de tu proveedor médico para continuar
          </Text>
        </View>

        <View style={styles.cardList}>
          {/* Card 1: Clínicas Afiliadas */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setProviderType('affiliated')}
            style={styles.typeCard}
          >
            <View style={styles.typeCardRow}>
              <View style={[styles.typeIconBox, styles.typeIconTeal]}>
                <FontAwesome5 name="hospital" size={22} color={COLORS.white} />
              </View>

              <View style={styles.typeMain}>
                <View style={styles.titleRow}>
                  <Text style={styles.typeTitle}>
                    {isSpecialty ? 'Clínicas Afiliadas MediCash' : 'Centros & Laboratorios Afiliados'}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
                </View>

                <Text style={styles.typeDesc}>
                  {isSpecialty
                    ? 'Explora nuestra red de clínicas y centros quirúrgicos certificados con convenio directo.'
                    : 'Explora nuestra red de centros diagnósticos e imagenología con cobertura MediCash.'}
                </Text>

                <View style={styles.tagChip}>
                  <Text style={styles.tagChipText}>✓ Ver lista completa de centros afiliados</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 2: Especialistas Particulares */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setProviderType('particular')}
            style={styles.typeCard}
          >
            <View style={styles.typeCardRow}>
              <View style={[styles.typeIconBox, styles.typeIconEmerald]}>
                <FontAwesome5 name="user-md" size={22} color={COLORS.white} />
              </View>

              <View style={styles.typeMain}>
                <View style={styles.titleRow}>
                  <Text style={styles.typeTitle}>
                    {isSpecialty ? 'Especialistas / Consultorio Particular' : 'Proveedor / Laboratorio Particular'}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.accent} />
                </View>

                <Text style={styles.typeDesc}>
                  Atención médica directa con tu especialista de confianza o laboratorio independiente.
                </Text>

                <View style={[styles.tagChip, { backgroundColor: COLORS.accentLight, borderColor: '#A7F3D0' }]}>
                  <Text style={[styles.tagChipText, { color: COLORS.accent }]}>
                    ✓ Ingresar datos de médico o centro privado
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // IF TYPE SELECTED: SHOW THE SPECIFIC VIEW
  return (
    <View style={styles.container}>
      {/* Sub Header Navigation Bar */}
      <View style={styles.navSubBar}>
        <TouchableOpacity
          onPress={() => setProviderType(null)}
          style={styles.backTypeBtn}
        >
          <Ionicons name="arrow-back" size={14} color={COLORS.primaryDark} />
          <Text style={styles.backTypeBtnText}>Cambiar tipo de proveedor</Text>
        </TouchableOpacity>

        <View style={styles.badgeType}>
          <Text style={styles.badgeTypeText}>
            {providerType === 'affiliated' ? 'Clínicas Afiliadas' : 'Especialistas Particulares'}
          </Text>
        </View>
      </View>

      {/* VIEW 1: AFILIADOS LIST */}
      {providerType === 'affiliated' ? (
        <View style={styles.section}>
          <Text style={styles.title}>
            {isSpecialty ? 'Selecciona la Clínica Afiliada' : 'Selecciona el Centro Afiliado'}
          </Text>
          <Text style={styles.subtitle}>
            Toca sobre el centro deseado para seleccionar e ingresar
          </Text>

          {/* Search Input Bar */}
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={16} color={COLORS.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder={isSpecialty ? 'Buscar clínica o centro...' : 'Buscar centro diagnóstico o laboratorio...'}
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={COLORS.textLight} />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.cardList}>
            {filteredClinics.map((clinic) => {
              const isSelected = selectedClinic?.id === clinic.id;

              return (
                <TouchableOpacity
                  key={clinic.id}
                  activeOpacity={0.8}
                  onPress={() => handleSelectClinic(clinic)}
                  style={[styles.clinicCard, isSelected && styles.clinicCardSelected]}
                >
                  <Image source={{ uri: clinic.image_url }} style={styles.clinicImage} />
                  <View style={styles.clinicInfo}>
                    <View style={styles.titleRow}>
                      <Text style={styles.clinicName} numberOfLines={1}>
                        {clinic.name}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={isSelected ? COLORS.primary : COLORS.textLight}
                      />
                    </View>
                    <Text style={styles.clinicAddress} numberOfLines={1}>
                      📍 {clinic.city} - {clinic.address}
                    </Text>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>Tocar para seleccionar</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        /* VIEW 2: PARTICULAR FORM */
        <View style={styles.particularCard}>
          <View style={styles.infoAlert}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoAlertTitle}>Cobertura con Especialista Particular</Text>
              <Text style={styles.infoAlertDesc}>
                Ingresa el nombre de tu médico o centro particular y presiona continuar.
              </Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nombre del Médico Especialista o Centro Particular:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Dr. Alejandro Gómez / Centro Diagnóstico Privado"
              placeholderTextColor={COLORS.textLight}
              value={particularDoctorName}
              onChangeText={(val) => {
                setParticularDoctorName(val);
                if (onSelectDoctor) {
                  onSelectDoctor({ id: 999, full_name: val || 'Médico Particular' });
                }
              }}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Clínica o Consultorio donde se realizará:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Consultorio Médico San Bernardino / Laboratorio Independiente"
              placeholderTextColor={COLORS.textLight}
              value={particularCenterName}
              onChangeText={(val) => {
                setParticularCenterName(val);
                if (onSelectClinic) {
                  onSelectClinic({ id: 999, name: val || 'Consultorio Particular', city: 'Caracas' });
                }
              }}
            />
          </View>

          <TouchableOpacity
            disabled={!particularDoctorName.trim() && !particularCenterName.trim()}
            style={[
              styles.nextBtn,
              (!particularDoctorName.trim() && !particularCenterName.trim()) && styles.btnDisabled,
            ]}
            onPress={() => {
              if (onNextStep) onNextStep();
            }}
          >
            <Text style={styles.nextBtnText}>Continuar a Selección de Cuotas</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  header: {
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  navSubBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backTypeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  backTypeBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  badgeType: {
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeTypeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  cardList: {
    gap: 12,
  },
  typeCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 2,
    borderRadius: 18,
    padding: 14,
    elevation: 2,
  },
  typeCardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIconTeal: {
    backgroundColor: COLORS.primary,
  },
  typeIconEmerald: {
    backgroundColor: COLORS.accent,
  },
  typeMain: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textDark,
    flex: 1,
  },
  typeDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
  },
  tagChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  tagChipText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 42,
    gap: 8,
    marginTop: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textDark,
  },
  section: {
    gap: 10,
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
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  clinicInfo: {
    flex: 1,
    gap: 2,
  },
  clinicName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
    flex: 1,
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
  particularCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  infoAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  infoAlertTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  infoAlertDesc: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  fieldGroup: {
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  input: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 12,
    color: COLORS.textDark,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  nextBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.white,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
