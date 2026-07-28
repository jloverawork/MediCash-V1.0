import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SpecialtyPicker from '../components/SpecialtyPicker';
import ClinicPicker from '../components/ClinicPicker';
import DoctorPicker from '../components/DoctorPicker';
import CreditCalculator from '../components/CreditCalculator';
import MedicalFormUpload from '../components/MedicalFormUpload';
import { API_BASE_URL } from '../api/config';
import { COLORS } from '../theme/colors';

export default function HomeScreen({ user, onNavigateToRequests }) {
  const [step, setStep] = useState(1);

  // Catalog
  const [specialties, setSpecialties] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Selections
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Financial
  const [requestedAmount, setRequestedAmount] = useState('3500');
  const [installments, setInstallments] = useState(18);

  // Files
  const [medicalReportFile, setMedicalReportFile] = useState(null);
  const [clinicBudgetFile, setClinicBudgetFile] = useState(null);

  // Additional Form
  const [formData, setFormData] = useState({
    procedure_name: '',
    report_date: new Date().toISOString().split('T')[0],
    patient_cedula: user?.cedula || '',
    patient_phone: user?.phone || '',
    emergency_contact: '',
    medical_notes: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSpecialties();
    fetchClinics();
  }, []);

  useEffect(() => {
    if (selectedClinic && selectedSpecialty) {
      fetchDoctors(selectedSpecialty.id, selectedClinic.id);
    }
  }, [selectedClinic, selectedSpecialty]);

  const fetchSpecialties = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/catalog/specialties`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSpecialties(data);
        const neuro = data.find((s) => s.name.toLowerCase().includes('neurocirug'));
        if (neuro) setSelectedSpecialty(neuro);
      }
    } catch (e) {
      console.log('Error fetching specialties:', e);
    }
  };

  const fetchClinics = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/catalog/clinics`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setClinics(data);
        if (data.length > 0) setSelectedClinic(data[0]);
      }
    } catch (e) {
      console.log('Error fetching clinics:', e);
    }
  };

  const fetchDoctors = async (specialtyId, clinicId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/catalog/doctors?specialty_id=${specialtyId}&clinic_id=${clinicId}`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setDoctors(data);
        if (data.length > 0) setSelectedDoctor(data[0]);
        else setSelectedDoctor(null);
      }
    } catch (e) {
      console.log('Error fetching doctors:', e);
    }
  };

  const handleFormChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async () => {
    if (!medicalReportFile || !medicalReportFile.uri || !clinicBudgetFile || !clinicBudgetFile.uri) {
      Alert.alert('Documentos Requeridos', 'Por favor adjunta nuevamente el Informe Médico y el Presupuesto de la Clínica.');
      return;
    }

    if (!selectedClinic || !selectedDoctor || !selectedSpecialty) {
      Alert.alert('Selección Incompleta', 'Debes seleccionar una especialidad, clínica y cirujano.');
      return;
    }

    if (!formData.procedure_name || !requestedAmount) {
      Alert.alert('Campos Incompletos', 'Ingresa el nombre del procedimiento quirúrgico y el monto total.');
      return;
    }

    setSubmitting(true);

    try {
      const bodyFormData = new FormData();
      bodyFormData.append('patient_id', String(user?.id || ''));
      bodyFormData.append('clinic_id', String(selectedClinic?.id || ''));
      bodyFormData.append('doctor_id', String(selectedDoctor?.id || ''));
      bodyFormData.append('specialty_id', String(selectedSpecialty?.id || ''));
      bodyFormData.append('procedure_name', String(formData.procedure_name || ''));
      bodyFormData.append('requested_amount', String(requestedAmount || '0'));
      bodyFormData.append('down_payment_percentage', '20');
      bodyFormData.append('installments_count', String(installments || 6));
      bodyFormData.append('report_date', String(formData.report_date || ''));
      bodyFormData.append('medical_notes', String(formData.medical_notes || ''));
      bodyFormData.append('patient_cedula', String(formData.patient_cedula || ''));
      bodyFormData.append('patient_phone', String(formData.patient_phone || ''));
      bodyFormData.append('emergency_contact', String(formData.emergency_contact || ''));

      const formatFileObj = (fileObj, defaultName) => {
        let uri = fileObj.uri;
        let name = fileObj.name || defaultName;
        let type = fileObj.type || fileObj.mimeType || 'application/pdf';
        if (type === '*/*' || !type.includes('/')) {
          type = name.endsWith('.png') ? 'image/png' : name.endsWith('.jpg') || name.endsWith('.jpeg') ? 'image/jpeg' : 'application/pdf';
        }
        return {
          uri: String(uri),
          name: String(name),
          type: String(type),
        };
      };

      bodyFormData.append('medical_report', formatFileObj(medicalReportFile, 'informe.pdf'));
      bodyFormData.append('clinic_budget', formatFileObj(clinicBudgetFile, 'presupuesto.pdf'));

      // Use native XMLHttpRequest for direct FormData transmission in React Native
      const uploadWithXHR = (url, data) => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch (e) {
                resolve({ message: xhr.responseText });
              }
            } else {
              try {
                const errData = JSON.parse(xhr.responseText);
                reject(new Error(errData.error || `Error del servidor (${xhr.status})`));
              } catch (e) {
                reject(new Error(`Error del servidor (${xhr.status})`));
              }
            }
          };
          xhr.onerror = () => reject(new Error('Error de red al conectar con el servidor backend.'));
          xhr.ontimeout = () => reject(new Error('Tiempo de espera agotado al subir archivos.'));
          xhr.timeout = 30000;
          xhr.send(data);
        });
      };

      const data = await uploadWithXHR(`${API_BASE_URL}/api/requests`, bodyFormData);

      Alert.alert(
        '🎉 ¡Solicitud Enviada!',
        'Tu solicitud de crédito quirúrgico fue creada exitosamente y pasó a revisión por administración.',
        [
          {
            text: 'Ver Mis Solicitudes',
            onPress: () => {
              setStep(1);
              setMedicalReportFile(null);
              setClinicBudgetFile(null);
              if (onNavigateToRequests) onNavigateToRequests();
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Progress Steps */}
      <View style={styles.stepBar}>
        {[
          { s: 1, label: 'Especialidad' },
          { s: 2, label: 'Clínica' },
          { s: 3, label: 'Doctor' },
          { s: 4, label: 'Cuotas' },
          { s: 5, label: 'Anexos' },
        ].map((item) => (
          <TouchableOpacity
            key={item.s}
            disabled={item.s >= step}
            onPress={() => setStep(item.s)}
            style={styles.stepItem}
          >
            <View
              style={[
                styles.stepCircle,
                step === item.s && styles.stepCircleActive,
                step > item.s && styles.stepCircleCompleted,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  (step === item.s || step > item.s) && styles.stepNumberActive,
                ]}
              >
                {item.s}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                step === item.s && styles.stepLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Step Content */}
      {step === 1 && (
        <View style={styles.stepContent}>
          <SpecialtyPicker
            specialties={specialties}
            selectedSpecialty={selectedSpecialty}
            onSelectSpecialty={(s) => setSelectedSpecialty(s)}
          />
          <TouchableOpacity
            disabled={!selectedSpecialty}
            style={[styles.nextBtn, !selectedSpecialty && styles.btnDisabled]}
            onPress={() => setStep(2)}
          >
            <Text style={styles.nextBtnText}>Continuar a Selección de Clínica</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
            <Ionicons name="arrow-back" size={16} color={COLORS.textMuted} />
            <Text style={styles.backBtnText}>Volver a Especialidades</Text>
          </TouchableOpacity>

          <ClinicPicker
            clinics={clinics}
            selectedClinic={selectedClinic}
            onSelectClinic={(c) => setSelectedClinic(c)}
          />

          <TouchableOpacity
            disabled={!selectedClinic}
            style={[styles.nextBtn, !selectedClinic && styles.btnDisabled]}
            onPress={() => setStep(3)}
          >
            <Text style={styles.nextBtnText}>Continuar a Selección de Doctor</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
            <Ionicons name="arrow-back" size={16} color={COLORS.textMuted} />
            <Text style={styles.backBtnText}>Volver a Clínicas</Text>
          </TouchableOpacity>

          <DoctorPicker
            doctors={doctors}
            selectedSpecialty={selectedSpecialty}
            selectedClinic={selectedClinic}
            selectedDoctor={selectedDoctor}
            onSelectDoctor={(d) => setSelectedDoctor(d)}
          />

          <TouchableOpacity
            disabled={!selectedDoctor}
            style={[styles.nextBtn, !selectedDoctor && styles.btnDisabled]}
            onPress={() => setStep(4)}
          >
            <Text style={styles.nextBtnText}>Continuar a Cálculo de Cuotas</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}

      {step === 4 && (
        <View style={styles.stepContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(3)}>
            <Ionicons name="arrow-back" size={16} color={COLORS.textMuted} />
            <Text style={styles.backBtnText}>Volver a Especialista</Text>
          </TouchableOpacity>

          <CreditCalculator
            requestedAmount={requestedAmount}
            onAmountChange={setRequestedAmount}
            installments={installments}
            onInstallmentsChange={setInstallments}
          />

          <TouchableOpacity
            disabled={!requestedAmount || parseFloat(requestedAmount) <= 0}
            style={[
              styles.nextBtn,
              (!requestedAmount || parseFloat(requestedAmount) <= 0) && styles.btnDisabled,
            ]}
            onPress={() => setStep(5)}
          >
            <Text style={styles.nextBtnText}>Continuar a Anexos y Formulario</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}

      {step === 5 && (
        <View style={styles.stepContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(4)}>
            <Ionicons name="arrow-back" size={16} color={COLORS.textMuted} />
            <Text style={styles.backBtnText}>Volver a Cuotas</Text>
          </TouchableOpacity>

          <MedicalFormUpload
            formData={formData}
            onFormChange={handleFormChange}
            medicalReportFile={medicalReportFile}
            clinicBudgetFile={clinicBudgetFile}
            onMedicalReportChange={setMedicalReportFile}
            onClinicBudgetChange={setClinicBudgetFile}
          />

          <TouchableOpacity
            disabled={submitting || !medicalReportFile || !clinicBudgetFile}
            style={[
              styles.submitBtn,
              (submitting || !medicalReportFile || !clinicBudgetFile) && styles.btnDisabled,
            ]}
            onPress={handleSubmit}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.submitBtnText}>Enviar Solicitud a Revisión</Text>
                <Ionicons name="paper-plane" size={18} color={COLORS.white} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, paddingBottom: 40, gap: 16 },
  stepBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 12,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepCircleCompleted: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  stepNumberActive: {
    color: COLORS.white,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  stepLabelActive: {
    color: COLORS.primaryDark,
  },
  stepContent: {
    gap: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.white,
  },
  submitBtn: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
