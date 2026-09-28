import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function RequestTracker({ requests, onRefresh }) {
  if (!requests || requests.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Ionicons name="time-outline" size={40} color={COLORS.textLight} />
        <Text style={styles.emptyTitle}>Sin Solicitudes Activas</Text>
        <Text style={styles.emptySubtitle}>
          Aún no has solicitado ningún financiamiento médico. Selecciona una especialidad y solicita tu crédito quirúrgico.
        </Text>
      </View>
    );
  }

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <View style={[styles.badge, styles.badgeApproved]}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.accent} />
            <Text style={[styles.badgeText, styles.badgeTextApproved]}>Crédito Aprobado</Text>
          </View>
        );
      case 'REJECTED':
        return (
          <View style={[styles.badge, styles.badgeRejected]}>
            <Ionicons name="close-circle" size={14} color={COLORS.danger} />
            <Text style={[styles.badgeText, styles.badgeTextRejected]}>Solicitud Rechazada</Text>
          </View>
        );
      case 'UNDER_REVIEW':
        return (
          <View style={[styles.badge, styles.badgeReview]}>
            <Ionicons name="alert-circle" size={14} color={COLORS.gold} />
            <Text style={[styles.badgeText, styles.badgeTextReview]}>En Revisión Médica</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.badge, styles.badgePending]}>
            <Ionicons name="time" size={14} color={COLORS.gold} />
            <Text style={[styles.badgeText, styles.badgeTextPending]}>Pendiente</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Mis Solicitudes de Crédito</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Text style={styles.refreshBtn}>Actualizar Estatus</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {requests.map((req) => (
          <View key={req.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.reqId}>SOLICITUD #{req.id}</Text>
                <Text style={styles.procedureName} numberOfLines={1}>
                  {req.procedure_name}
                </Text>
                <Text style={styles.specName}>{req.specialty_name}</Text>
              </View>
              {renderStatusBadge(req.status)}
            </View>

            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Ionicons name="business-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.metaText} numberOfLines={1}>
                  <Text style={{ fontWeight: '700' }}>Clínica: </Text>
                  {req.clinic_name}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.metaText} numberOfLines={1}>
                  <Text style={{ fontWeight: '700' }}>Doctor: </Text>
                  {req.doctor_name}
                </Text>
              </View>
            </View>

            <View style={styles.financialRow}>
              <View style={styles.finCol}>
                <Text style={styles.finLabel}>Presupuesto Solicitado</Text>
                <Text style={styles.finVal}>
                  ${parseFloat(req.requested_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.finCol}>
                <Text style={styles.finLabel}>Inicial ({req.down_payment_percentage || 20}%)</Text>
                <Text style={styles.finValPrimary}>
                  ${parseFloat(req.down_payment_amount || req.requested_amount * 0.2).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.finCol}>
                <Text style={styles.finLabel}>{req.installments_count || 6} Cuotas de</Text>
                <Text style={styles.finVal}>
                  ${parseFloat(req.installment_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>

            {req.admin_notes ? (
              <View style={styles.notesBox}>
                <Text style={styles.notesTitle}>Nota de la Administración:</Text>
                <Text style={styles.notesText}>{req.admin_notes}</Text>
              </View>
            ) : null}
          </View>
        ))}
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
  refreshBtn: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  list: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  reqId: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.textLight,
  },
  procedureName: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textDark,
    marginTop: 1,
  },
  specName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeApproved: {
    backgroundColor: COLORS.accentLight,
  },
  badgeRejected: {
    backgroundColor: COLORS.dangerLight,
  },
  badgeReview: {
    backgroundColor: COLORS.goldLight,
  },
  badgePending: {
    backgroundColor: COLORS.cardAlt,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  badgeTextApproved: { color: COLORS.accent },
  badgeTextRejected: { color: COLORS.danger },
  badgeTextReview: { color: COLORS.gold },
  badgeTextPending: { color: COLORS.textMuted },
  metaBox: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textDark,
  },
  financialRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
  },
  finCol: {
    alignItems: 'center',
  },
  finLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  finVal: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textDark,
    marginTop: 2,
  },
  finValPrimary: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 2,
  },
  notesBox: {
    backgroundColor: COLORS.goldLight,
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.gold,
  },
  notesText: {
    fontSize: 11,
    color: COLORS.textDark,
    fontStyle: 'italic',
    marginTop: 2,
  },
});
