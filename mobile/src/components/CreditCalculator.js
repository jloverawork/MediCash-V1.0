import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function CreditCalculator({
  requestedAmount,
  onAmountChange,
  installments,
  onInstallmentsChange,
}) {
  const totalAmount = parseFloat(requestedAmount) || 0;
  const downPayment = totalAmount * 0.20;
  const remaining = Math.max(0, totalAmount - downPayment);
  const installmentVal = installments > 0 ? remaining / installments : 0;

  const getEndDateStr = (numMonths) => {
    const d = new Date();
    d.setMonth(d.getMonth() + parseInt(numMonths || 0, 10));
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${monthNames[d.getMonth()]} de ${d.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.iconBox}>
            <FontAwesome5 name="calculator" size={16} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.title}>Calculadora de Crédito MediCash</Text>
            <Text style={styles.subtitle}>Plan de financiamiento para tu cirugía</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Inicial 20% Base</Text>
        </View>
      </View>

      {/* Input Monto */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Monto Total del Presupuesto Quirúrgico ($ USD)</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={requestedAmount}
            onChangeText={onAmountChange}
            placeholder="Ej: 3500"
            placeholderTextColor={COLORS.textLight}
          />
        </View>
        <Text style={styles.fieldHint}>
          * El monto final será validado por administración según el Presupuesto adjunto de la clínica.
        </Text>
      </View>

      {/* Selector Cuotas */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Selecciona el Número de Cuotas</Text>
        <View style={styles.grid}>
          {[18, 24, 36, 48, 64].map((num) => {
            const isSelected = installments === num;
            return (
              <TouchableOpacity
                key={num}
                activeOpacity={0.8}
                onPress={() => onInstallmentsChange(num)}
                style={[styles.installmentButton, isSelected && styles.installmentButtonSelected]}
              >
                <Text
                  style={[
                    styles.installmentText,
                    isSelected && styles.installmentTextSelected,
                  ]}
                >
                  {num} Cuotas
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Summary Breakdown */}
      {totalAmount > 0 && (
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>✦ Monto Total Cirugía:</Text>
            <Text style={styles.breakdownValBold}>
              ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <View>
              <Text style={styles.breakdownLabelPrimary}>✓ Pago Inicial Solicitado (20%):</Text>
              <Text style={styles.breakdownSub}>Pagas al momento de la aprobación</Text>
            </View>
            <Text style={styles.breakdownValPrimary}>
              ${downPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <View>
              <Text style={styles.breakdownLabel}>
                {installments} Cuotas Mensuales de:
              </Text>
              <Text style={styles.breakdownSub}>
                Saldo financiado: ${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.breakdownValLarge}>
                ${installmentVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.breakdownUnit}>/ mes</Text>
            </View>
          </View>

          {/* Fecha de Finalización */}
          <View style={styles.endDateCard}>
            <Ionicons name="calendar-sharp" size={18} color={COLORS.primaryDark} />
            <View style={{ flex: 1 }}>
              <Text style={styles.endDateTitle}>Fecha Estimada de Finalización del Pago:</Text>
              <Text style={styles.endDateValue}>🗓️ {getEndDateStr(installments)}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.disclaimerBox}>
        <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.primary} />
        <Text style={styles.disclaimerText}>
          La administración de MediCash evaluará el informe médico y presupuesto para ratificar o ajustar la inicial y el cronograma de pago.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 16,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textMuted,
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  fieldHint: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  installmentButton: {
    width: '23%',
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  installmentButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  installmentText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  installmentTextSelected: {
    color: COLORS.white,
  },
  breakdownCard: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  breakdownLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  breakdownLabelPrimary: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  breakdownSub: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  breakdownValBold: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  breakdownValPrimary: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  breakdownValLarge: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  breakdownUnit: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  endDateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 10,
    marginTop: 4,
  },
  endDateTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  endDateValue: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textDark,
    marginTop: 2,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryLight,
    padding: 10,
    borderRadius: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.primaryDark,
    lineHeight: 14,
  },
});
