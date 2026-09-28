import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../theme/colors';

export default function MedicalFormUpload({
  formData,
  onFormChange,
  medicalReportFile,
  clinicBudgetFile,
  onMedicalReportChange,
  onClinicBudgetChange,
}) {
  const pickFile = async (type) => {
    try {
      Alert.alert(
        'Adjuntar Documento',
        'Selecciona la fuente del archivo:',
        [
          {
            text: '📄 Documento PDF',
            onPress: async () => {
              const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
              });
              if (!result.canceled && result.assets && result.assets[0]) {
                const file = result.assets[0];
                const fileName = file.name || file.uri.split('/').pop() || `documento_${Date.now()}.pdf`;
                const fileType = file.mimeType || (fileName.endsWith('.png') ? 'image/png' : fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? 'image/jpeg' : 'application/pdf');
                
                const fileObj = {
                  uri: String(file.uri),
                  name: String(fileName),
                  type: String(fileType),
                  size: Number(file.size || 0),
                };
                if (type === 'report') onMedicalReportChange(fileObj);
                else onClinicBudgetChange(fileObj);
              }
            },
          },
          {
            text: '📷 Foto de Cámara / Galería',
            onPress: async () => {
              const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!permission.granted) {
                Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para seleccionar la foto.');
                return;
              }
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
              });
              if (!result.canceled && result.assets && result.assets[0]) {
                const img = result.assets[0];
                const imgName = img.fileName || img.uri.split('/').pop() || `foto_${Date.now()}.jpg`;
                const imgType = img.mimeType || 'image/jpeg';
                
                const fileObj = {
                  uri: String(img.uri),
                  name: String(imgName),
                  type: String(imgType),
                  size: Number(img.fileSize || 500000),
                };
                if (type === 'report') onMedicalReportChange(fileObj);
                else onClinicBudgetChange(fileObj);
              }
            },
          },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Datos del Procedimiento y Anexos Requeridos</Text>
        <Text style={styles.subtitle}>
          Ingresa la información clave y adjunta el informe médico y el presupuesto de la clínica para procesar la solicitud.
        </Text>
      </View>

      {/* Form Fields */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nombre / Tipo de Cirugía *</Text>
        <TextInput
          style={styles.input}
          value={formData.procedure_name}
          onChangeText={(v) => onFormChange('procedure_name', v)}
          placeholder="Ej: Microdiscectomía Lumbar L4-L5 / Craneotomía"
          placeholderTextColor={COLORS.textLight}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Fecha Informe *</Text>
          <TextInput
            style={styles.input}
            value={formData.report_date}
            onChangeText={(v) => onFormChange('report_date', v)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Cédula Paciente *</Text>
          <TextInput
            style={styles.input}
            value={formData.patient_cedula}
            onChangeText={(v) => onFormChange('patient_cedula', v)}
            placeholder="V-18452930"
            placeholderTextColor={COLORS.textLight}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Teléfono Móvil *</Text>
          <TextInput
            style={styles.input}
            value={formData.patient_phone}
            onChangeText={(v) => onFormChange('patient_phone', v)}
            placeholder="+58 414 1234567"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Contacto Emergencia *</Text>
          <TextInput
            style={styles.input}
            value={formData.emergency_contact}
            onChangeText={(v) => onFormChange('emergency_contact', v)}
            placeholder="Familiar / Teléfono"
            placeholderTextColor={COLORS.textLight}
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Resumen o Notas Médicas Importantes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={3}
          value={formData.medical_notes}
          onChangeText={(v) => onFormChange('medical_notes', v)}
          placeholder="Describa brevemente el diagnóstico o recomendación médica del cirujano..."
          placeholderTextColor={COLORS.textLight}
        />
      </View>

      {/* File Upload Section */}
      <View style={styles.uploadSection}>
        <Text style={styles.uploadTitle}>DOCUMENTOS OBLIGATORIOS</Text>

        {/* 1. Medical Report File */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>1. Informe Médico Firmado por Cirujano *</Text>
          {medicalReportFile ? (
            <View style={styles.fileSelectedBox}>
              <Ionicons name="document-text" size={24} color={COLORS.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName} numberOfLines={1}>{medicalReportFile.name}</Text>
                <Text style={styles.fileSize}>
                  {(medicalReportFile.size / (1024 * 1024)).toFixed(2)} MB - Listo
                </Text>
              </View>
              <TouchableOpacity onPress={() => onMedicalReportChange(null)}>
                <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={() => pickFile('report')}>
              <Ionicons name="cloud-upload-outline" size={28} color={COLORS.primary} />
              <Text style={styles.uploadBtnText}>Adjuntar Informe Médico (PDF/Foto)</Text>
              <Text style={styles.uploadSubText}>Presiona para abrir galería o archivos del teléfono</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 2. Clinic Budget File */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>2. Presupuesto Oficial Emitido por la Clínica *</Text>
          {clinicBudgetFile ? (
            <View style={styles.fileSelectedBox}>
              <Ionicons name="document-text" size={24} color={COLORS.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName} numberOfLines={1}>{clinicBudgetFile.name}</Text>
                <Text style={styles.fileSize}>
                  {(clinicBudgetFile.size / (1024 * 1024)).toFixed(2)} MB - Listo
                </Text>
              </View>
              <TouchableOpacity onPress={() => onClinicBudgetChange(null)}>
                <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={() => pickFile('budget')}>
              <Ionicons name="cloud-upload-outline" size={28} color={COLORS.primary} />
              <Text style={styles.uploadBtnText}>Adjuntar Presupuesto de Clínica (PDF/Foto)</Text>
              <Text style={styles.uploadSubText}>Presiona para abrir galería o archivos del teléfono</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  input: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: COLORS.textDark,
  },
  textArea: {
    height: 70,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  uploadSection: {
    gap: 14,
    marginTop: 4,
  },
  uploadTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  uploadBox: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primaryBorder,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  uploadSubText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  fileSelectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  fileSize: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
});
