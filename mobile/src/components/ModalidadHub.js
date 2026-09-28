import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function ModalidadHub({ onSelectModalidad }) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header Banner */}
      <View style={styles.bannerCard}>
        <View style={styles.badgeRow}>
          <Ionicons name="sparkles" size={12} color="#6EE7B7" />
          <Text style={styles.badgeText}>SISTEMA DE FINANCIAMIENTO SALUD</Text>
        </View>
        <Text style={styles.bannerTitle}>
          Selecciona la Línea de Servicio MediCash
        </Text>
        <Text style={styles.bannerDesc}>
          Obtén financiamiento en cuotas o explora nuestro directorio médico en Venezuela.
        </Text>
      </View>

      {/* Main Options */}
      <View style={styles.optionsList}>
        {/* Option 1: Modalidad A */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onSelectModalidad('specialties')}
          style={styles.optionCard}
        >
          <View style={styles.cardHeaderTag}>
            <Text style={styles.cardHeaderTagText}>★ CRÉDITO QUIRÚRGICO / CLÍNICO</Text>
          </View>

          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, styles.iconTeal]}>
              <FontAwesome5 name="stethoscope" size={24} color={COLORS.white} />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>
                1. Especialidades con Financiamiento
              </Text>

              <Text style={styles.cardDesc}>
                Financiamiento de cirugías, tratamientos e intervenciones clínicas complejas en plazos adaptables.
              </Text>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                <View style={styles.tagChip}>
                  <FontAwesome5 name="briefcase-medical" size={10} color={COLORS.primary} />
                  <Text style={styles.tagChipText}>Medicina Interna</Text>
                </View>
                <View style={styles.tagChip}>
                  <FontAwesome5 name="brain" size={10} color={COLORS.primary} />
                  <Text style={styles.tagChipText}>Neurocirugía</Text>
                </View>
                <View style={styles.tagChip}>
                  <FontAwesome5 name="bone" size={10} color={COLORS.primary} />
                  <Text style={styles.tagChipText}>Traumatología</Text>
                </View>
                <View style={styles.tagChip}>
                  <FontAwesome5 name="user-md" size={10} color={COLORS.primary} />
                  <Text style={styles.tagChipText}>Psicología</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <Text style={styles.actionText}>Iniciar Solicitud de Crédito</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.primaryDark} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Option 2: Modalidad B */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onSelectModalidad('services')}
          style={styles.optionCard}
        >
          <View style={[styles.cardHeaderTag, styles.cardHeaderTagEmerald]}>
            <Text style={styles.cardHeaderTagText}>⚡ CRÉDITO PARA DIAGNÓSTICOS</Text>
          </View>

          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, styles.iconEmerald]}>
              <FontAwesome5 name="notes-medical" size={24} color={COLORS.white} />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>
                2. Servicios con Financiamiento
              </Text>

              <Text style={styles.cardDesc}>
                Financiamiento rápido para exámenes de laboratorio, imágenes médicas y estudios de neurofisiología.
              </Text>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                <View style={styles.tagChip}>
                  <FontAwesome5 name="vial" size={10} color={COLORS.accent} />
                  <Text style={styles.tagChipText}>Perfil 20</Text>
                </View>
                <View style={styles.tagChip}>
                  <FontAwesome5 name="heartbeat" size={10} color={COLORS.accent} />
                  <Text style={styles.tagChipText}>Eco Abdominal</Text>
                </View>
                <View style={styles.tagChip}>
                  <FontAwesome5 name="x-ray" size={10} color={COLORS.accent} />
                  <Text style={styles.tagChipText}>Rayos X</Text>
                </View>
                <View style={styles.tagChip}>
                  <FontAwesome5 name="bolt" size={10} color={COLORS.accent} />
                  <Text style={styles.tagChipText}>Electromiografía</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <Text style={[styles.actionText, { color: COLORS.accent }]}>Solicitar Crédito de Estudios</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.accent} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Option 3: Modalidad C */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onSelectModalidad('open_network')}
          style={[styles.optionCard, styles.optionCardSlate]}
        >
          <View style={[styles.cardHeaderTag, styles.cardHeaderTagSlate]}>
            <Text style={styles.cardHeaderTagTextSlate}>ℹ DIRECTORIO INFORMATIVO</Text>
          </View>

          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, styles.iconSlate]}>
              <FontAwesome5 name="globe" size={24} color={COLORS.white} />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitleSlate}>
                3. Red Abierta MediCash
              </Text>

              <Text style={styles.cardDesc}>
                Directorio médico integral para consultar especialistas por rama y centros diagnósticos sin flujo de cuotas.
              </Text>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                <View style={styles.tagChipSlate}>
                  <FontAwesome5 name="user-check" size={10} color={COLORS.textMuted} />
                  <Text style={styles.tagChipTextSlate}>Especialistas</Text>
                </View>
                <View style={styles.tagChipSlate}>
                  <FontAwesome5 name="hospital" size={10} color={COLORS.textMuted} />
                  <Text style={styles.tagChipTextSlate}>Servicios & Centros</Text>
                </View>
                <View style={styles.tagChipSlate}>
                  <FontAwesome5 name="map-marker-alt" size={10} color={COLORS.textMuted} />
                  <Text style={styles.tagChipTextSlate}>Filtros Ubicación</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <Text style={[styles.actionText, { color: COLORS.textDark }]}>Explorar Directorio Médico</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.textDark} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 16,
    gap: 16,
    paddingBottom: 30,
  },
  bannerCard: {
    backgroundColor: COLORS.textDark,
    borderRadius: 24,
    padding: 20,
    gap: 8,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#6EE7B7',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 26,
  },
  bannerDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
  optionsList: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 2,
    borderRadius: 24,
    padding: 16,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  optionCardSlate: {
    backgroundColor: '#F8FAFC',
    borderColor: COLORS.borderDark,
  },
  cardHeaderTag: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardHeaderTagEmerald: {
    backgroundColor: COLORS.accent,
  },
  cardHeaderTagSlate: {
    backgroundColor: COLORS.border,
  },
  cardHeaderTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  cardHeaderTagTextSlate: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTeal: {
    backgroundColor: COLORS.primary,
  },
  iconEmerald: {
    backgroundColor: COLORS.accent,
  },
  iconSlate: {
    backgroundColor: COLORS.textMuted,
  },
  cardInfo: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  cardTitleSlate: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  tagChipSlate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagChipTextSlate: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
});
