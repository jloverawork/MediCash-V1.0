import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const iconMap = {
  FlaskConical: 'vial',
  Activity: 'heartbeat',
  FileSearch: 'x-ray',
  Zap: 'bolt',
  Stethoscope: 'stethoscope',
  Ambulance: 'ambulance',
};

export default function ServiceList({ services, selectedService, onSelectService }) {
  const defaultServices = [
    {
      id: 1,
      name: 'Perfil 20 Completo',
      category: 'Laboratorio Clínico',
      description: 'Hematología completa, glucemia, urea, creatinina, perfil lipídico y examen de orina.',
      estimated_cost: 45,
      icon: 'FlaskConical',
    },
    {
      id: 2,
      name: 'Eco Abdominal Doppler HD',
      category: 'Imagenología Avanzada',
      description: 'Ultrasonografía abdominal en alta definición para hígado, vesícula, páncreas y riñones.',
      estimated_cost: 70,
      icon: 'Activity',
    },
    {
      id: 3,
      name: 'Rayos X Digitales Torácicos y Columna',
      category: 'Radiología',
      description: 'Radiología digital de alta resolución con informe médico radiológico en 24h.',
      estimated_cost: 50,
      icon: 'FileSearch',
    },
    {
      id: 4,
      name: 'Electromiografía de 4 Extremidades',
      category: 'Neurofisiología',
      description: 'Estudio de velocidad de conducción nerviosa y evaluación de neuropatías compresivas.',
      estimated_cost: 120,
      icon: 'Zap',
    },
    {
      id: 5,
      name: 'Consulta Médica Especializada',
      category: 'Consultorio',
      description: 'Evaluación por médico especialista con emisión de orden e informe médico.',
      estimated_cost: 60,
      icon: 'Stethoscope',
    },
    {
      id: 6,
      name: 'Traslado en Ambulancia Equipada',
      category: 'Emergencia & Traslados',
      description: 'Unidad de soporte vital con personal paramédico dentro de la zona metropolitana.',
      estimated_cost: 100,
      icon: 'Ambulance',
    },
  ];

  const listToRender = services && services.length > 0 ? services : defaultServices;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Servicios Médicos Diagnósticos</Text>
          <Text style={styles.subtitle}>Selecciona el estudio o laboratorio para tu crédito</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={10} color={COLORS.accent} />
          <Text style={styles.badgeText}>Cobertura Inmediata</Text>
        </View>
      </View>

      <View style={styles.list}>
        {listToRender.map((serv) => {
          const isSelected = selectedService?.id === serv.id;
          const faIcon = iconMap[serv.icon] || 'notes-medical';

          return (
            <TouchableOpacity
              key={serv.id}
              activeOpacity={0.8}
              onPress={() => onSelectService(serv)}
              style={[styles.card, isSelected && styles.cardSelected]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                  <FontAwesome5
                    name={faIcon}
                    size={20}
                    color={isSelected ? COLORS.white : COLORS.accent}
                  />
                </View>

                <View style={styles.cardMain}>
                  <View style={styles.titleRow}>
                    <Text style={styles.servName} numberOfLines={1}>
                      {serv.name}
                    </Text>
                    {serv.category ? (
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{serv.category}</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.servDesc} numberOfLines={2}>
                    {serv.description}
                  </Text>

                  {serv.estimated_cost ? (
                    <View style={styles.costRow}>
                      <Text style={styles.costLabel}>Costo aprox. estudio:</Text>
                      <Text style={styles.costVal}>${serv.estimated_cost} USD</Text>
                    </View>
                  ) : null}
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isSelected ? COLORS.accent : COLORS.textLight}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accentLight,
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
  },
  cardSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentLight,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.accentLight,
    borderColor: '#A7F3D0',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  cardMain: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  servName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  servDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  costLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  costVal: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.accent,
  },
});
