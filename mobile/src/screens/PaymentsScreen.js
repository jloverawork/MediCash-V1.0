import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../api/config';
import { COLORS } from '../theme/colors';

export default function PaymentsScreen({ user }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState({ totalPaid: 0, totalPending: 0, totalOverdue: 0 });
  const [schedules, setSchedules] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PAGADO' | 'PENDING' | 'OVERDUE'

  // Modal / Submit Support state
  const [uploadingSchedule, setUploadingSchedule] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('TRANSFERENCIA_BANESCO');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submittingSupport, setSubmittingSupport] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/payments/my-payments/${user.id}`);
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
        setSchedules(data.allSchedules || []);
      }
    } catch (err) {
      console.log('Error fetching patient payments:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePickReceipt = async () => {
    Alert.alert(
      'Soporte de Pago',
      'Selecciona el comprobante de pago:',
      [
        {
          text: '📄 Documento PDF / Captura',
          onPress: async () => {
            const res = await DocumentPicker.getDocumentAsync({
              type: ['application/pdf', 'image/*'],
              copyToCacheDirectory: true,
            });
            if (!res.canceled && res.assets && res.assets[0]) {
              const file = res.assets[0];
              setSelectedFile({
                uri: String(file.uri),
                name: String(file.name || `comprobante_${Date.now()}.pdf`),
                type: String(file.mimeType || 'application/pdf'),
              });
            }
          },
        },
        {
          text: '📷 Foto de Cámara / Galería',
          onPress: async () => {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
              Alert.alert('Permiso requerido', 'Acceso a galería requerido.');
              return;
            }
            const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
            if (!res.canceled && res.assets && res.assets[0]) {
              const img = res.assets[0];
              setSelectedFile({
                uri: String(img.uri),
                name: String(img.fileName || `comprobante_${Date.now()}.jpg`),
                type: String(img.mimeType || 'image/jpeg'),
              });
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleSendSupport = async () => {
    if (!referenceNumber.trim()) {
      Alert.alert('Campo Requerido', 'Por favor ingresa el número de referencia bancario.');
      return;
    }

    setSubmittingSupport(true);

    try {
      const bodyFormData = new FormData();
      bodyFormData.append('schedule_id', String(uploadingSchedule.id));
      bodyFormData.append('reference_number', referenceNumber);
      bodyFormData.append('payment_method', paymentMethod);

      if (selectedFile) {
        bodyFormData.append('payment_support', selectedFile);
      }

      // Send via XMLHttpRequest
      const uploadWithXHR = (url, data) => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              try {
                const err = JSON.parse(xhr.responseText);
                reject(new Error(err.error || `HTTP ${xhr.status}`));
              } catch (e) {
                reject(new Error(`Error ${xhr.status}`));
              }
            }
          };
          xhr.onerror = () => reject(new Error('Error de conexión al enviar pago.'));
          xhr.send(data);
        });
      };

      await uploadWithXHR(`${API_BASE_URL}/api/payments/submit-support`, bodyFormData);

      Alert.alert('🎉 Pago Registrado', 'Tu comprobante de pago fue registrado exitosamente.');
      setUploadingSchedule(null);
      setReferenceNumber('');
      setSelectedFile(null);
      fetchPayments();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmittingSupport(false);
    }
  };

  const filteredSchedules = schedules.filter((item) => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchPayments} colors={[COLORS.primary]} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis Pagos & Cronograma</Text>
        <Text style={styles.subtitle}>
          Control de cuotas quirúrgicas, estados de cuenta y comprobantes de pago
        </Text>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        <View style={[styles.kpiCard, { borderColor: COLORS.accent }]}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
          <Text style={styles.kpiVal}>${summary.totalPaid.toFixed(2)}</Text>
          <Text style={styles.kpiLabel}>Total Pagado</Text>
        </View>

        <View style={[styles.kpiCard, { borderColor: COLORS.primary }]}>
          <Ionicons name="time" size={20} color={COLORS.primary} />
          <Text style={styles.kpiVal}>${summary.totalPending.toFixed(2)}</Text>
          <Text style={styles.kpiLabel}>Por Pagar</Text>
        </View>

        <View style={[styles.kpiCard, { borderColor: COLORS.danger }]}>
          <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
          <Text style={[styles.kpiVal, { color: COLORS.danger }]}>${summary.totalOverdue.toFixed(2)}</Text>
          <Text style={styles.kpiLabel}>En Mora</Text>
        </View>
      </View>

      {/* Status Filter Tabs */}
      <View style={styles.filterRow}>
        {[
          { key: 'ALL', label: 'Todas' },
          { key: 'PAGADO', label: 'Pagadas' },
          { key: 'PENDING', label: 'Pendientes' },
          { key: 'OVERDUE', label: 'En Mora' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setFilterStatus(tab.key)}
            style={[styles.filterChip, filterStatus === tab.key && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, filterStatus === tab.key && styles.filterChipTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Form to submit support if schedule selected */}
      {uploadingSchedule && (
        <View style={styles.uploadCard}>
          <View style={styles.uploadCardHeader}>
            <Text style={styles.uploadCardTitle}>Registrar Pago - Cuota #{uploadingSchedule.installment_number}</Text>
            <TouchableOpacity onPress={() => setUploadingSchedule(null)}>
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.uploadCardDesc}>
            Monto a pagar: ${parseFloat(uploadingSchedule.amount).toFixed(2)} USD
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Número de Referencia Bancaria *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: REF-98402194 / 001849"
              value={referenceNumber}
              onChangeText={setReferenceNumber}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <TouchableOpacity style={styles.filePickerBtn} onPress={handlePickReceipt}>
            <Ionicons name="attach" size={20} color={COLORS.primary} />
            <Text style={styles.filePickerText}>
              {selectedFile ? `Adjunto: ${selectedFile.name}` : 'Adjuntar Comprobante (Foto / PDF)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={submittingSupport}
            style={styles.submitSupportBtn}
            onPress={handleSendSupport}
          >
            {submittingSupport ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitSupportText}>Confirmar y Enviar Pago</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Schedule Items List */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
      ) : filteredSchedules.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="calendar-outline" size={36} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No hay cuotas registradas para este filtro.</Text>
        </View>
      ) : (
        <View style={styles.scheduleList}>
          {filteredSchedules.map((item) => {
            const isPaid = item.status === 'PAGADO';
            const isOverdue = item.status === 'OVERDUE';

            return (
              <View
                key={item.id}
                style={[
                  styles.itemCard,
                  isPaid && styles.itemCardPaid,
                  isOverdue && styles.itemCardOverdue,
                ]}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={styles.installmentTitle}>Cuota #{item.installment_number}</Text>
                    <Text style={styles.itemClinic}>{item.clinic_name || 'Financiamiento Quirúrgico'}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      isPaid && styles.badgePaid,
                      isOverdue && styles.badgeOverdue,
                      !isPaid && !isOverdue && styles.badgePending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        isPaid && styles.textPaid,
                        isOverdue && styles.textOverdue,
                        !isPaid && !isOverdue && styles.textPending,
                      ]}
                    >
                      {isPaid ? '✓ PAGADO' : isOverdue ? '⚠️ EN MORA' : '⏳ PENDIENTE'}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemDetails}>
                  <View>
                    <Text style={styles.detailLabel}>Vencimiento:</Text>
                    <Text style={styles.detailVal}>📅 {item.due_date.split('T')[0]}</Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.detailLabel}>Monto Cuota:</Text>
                    <Text style={styles.amountVal}>
                      ${parseFloat(item.amount).toFixed(2)} USD
                    </Text>
                  </View>
                </View>

                {isPaid && item.reference_number ? (
                  <View style={styles.refBox}>
                    <Ionicons name="document-text-outline" size={14} color={COLORS.accent} />
                    <Text style={styles.refText}>
                      Ref: {item.reference_number} • Verificado por administración
                    </Text>
                  </View>
                ) : null}

                {isOverdue && (
                  <View style={styles.overdueAlert}>
                    <Ionicons name="alert-circle-outline" size={14} color={COLORS.danger} />
                    <Text style={styles.overdueAlertText}>
                      Esta cuota presenta atraso en el pago. Por favor envía tu comprobante.
                    </Text>
                  </View>
                )}

                {!isPaid && (
                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() => setUploadingSchedule(item)}
                  >
                    <Ionicons name="card-outline" size={16} color={COLORS.white} />
                    <Text style={styles.payBtnText}>Registrar / Enviar Pago</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, gap: 14, paddingBottom: 40 },
  header: { gap: 4 },
  title: { fontSize: 18, fontWeight: '900', color: COLORS.textDark },
  subtitle: { fontSize: 12, color: COLORS.textMuted, lineHeight: 16 },
  kpiRow: { flexDirection: 'row', gap: 8 },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    gap: 4,
    elevation: 1,
  },
  kpiVal: { fontSize: 13, fontWeight: '900', color: COLORS.textDark },
  kpiLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textMuted },
  filterRow: { flexDirection: 'row', gap: 6 },
  filterChip: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: { fontSize: 11, fontWeight: '700', color: COLORS.textDark },
  filterChipTextActive: { color: COLORS.white },
  scheduleList: { gap: 10 },
  itemCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  itemCardPaid: {
    borderColor: COLORS.accent,
    backgroundColor: '#F0FDF4',
  },
  itemCardOverdue: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemHeaderLeft: { gap: 2 },
  installmentTitle: { fontSize: 15, fontWeight: '900', color: COLORS.textDark },
  itemClinic: { fontSize: 11, color: COLORS.textMuted },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgePaid: { backgroundColor: '#DCFCE7' },
  badgePending: { backgroundColor: COLORS.primaryLight },
  badgeOverdue: { backgroundColor: '#FEE2E2' },
  statusBadgeText: { fontSize: 10, fontWeight: '900' },
  textPaid: { color: COLORS.accent },
  textPending: { color: COLORS.primaryDark },
  textOverdue: { color: COLORS.danger },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  detailLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  detailVal: { fontSize: 12, fontWeight: '800', color: COLORS.textDark },
  amountVal: { fontSize: 15, fontWeight: '900', color: COLORS.textDark },
  refBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 10,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  refText: { fontSize: 10, fontWeight: '700', color: COLORS.accent },
  overdueAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 10,
    borderColor: COLORS.danger,
    borderWidth: 1,
  },
  overdueAlertText: { fontSize: 10, fontWeight: '700', color: COLORS.danger },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    gap: 8,
    marginTop: 4,
  },
  payBtnText: { fontSize: 13, fontWeight: '800', color: COLORS.white },
  uploadCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    elevation: 3,
  },
  uploadCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  uploadCardTitle: { fontSize: 15, fontWeight: '900', color: COLORS.textDark },
  uploadCardDesc: { fontSize: 12, fontWeight: '800', color: COLORS.primaryDark },
  field: { gap: 4 },
  label: { fontSize: 11, fontWeight: '800', color: COLORS.textDark },
  input: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    height: 42,
    paddingHorizontal: 10,
    fontSize: 13,
    color: COLORS.textDark,
  },
  filePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  filePickerText: { fontSize: 12, fontWeight: '700', color: COLORS.primaryDark },
  submitSupportBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitSupportText: { fontSize: 14, fontWeight: '900', color: COLORS.white },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  emptyText: { fontSize: 12, color: COLORS.textMuted },
});
