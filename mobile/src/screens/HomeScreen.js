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
import ModalidadHub from '../components/ModalidadHub';
import SpecialtyPicker from '../components/SpecialtyPicker';
import ServiceList from '../components/ServiceList';
import ClinicDoctorPicker from '../components/ClinicDoctorPicker';
import CreditCalculator from '../components/CreditCalculator';
import MedicalFormUpload from '../components/MedicalFormUpload';
import OpenNetworkDirectory from '../components/OpenNetworkDirectory';
import { API_BASE_URL } from '../api/config';
import { COLORS } from '../theme/colors';

export default function HomeScreen({ user, onNavigateToRequests }) {
  // Modality Selection: null (Hub) | 'specialties' (Modalidad A) | 'services' (Modalidad B) | 'open_network' (Modalidad C)
  const [modality, setModality] = useState(null);

  // Stepper State (1 to 4)
  const [step, setStep] = useState(1);

  // Provider Type State for Step 2 (null | 'affiliated' | 'particular')
  const [providerType, setProviderType] = useState(null);

  // Catalog
  const [specialties, setSpecialties] = useState([]);
  const [services, setServices] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Selections
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
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
    fetchServices();
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
        if (data.length > 0) setSelectedSpecialty(data[0]);
      }
    } catch (e) {
      console.log('Error fetching specialties:', e);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/catalog/services`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data);
        if (data.length > 0) setSelectedService(data[0]);
      }
    } catch (e) {
      console.log('Error fetching services:', e);
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

  const handleSelectModalidad = (selectedModality) => {
    setModality(selectedModality);
    setStep(1);
    setProviderType(null);

    if (selectedModality === 'specialties') {
      if (selectedSpecialty) {
        setFormData((prev) => ({ ...prev, procedure_name: `Intervención de ${selectedSpecialty.name}` }));
      }
      setRequestedAmount('3500');
    } else if (selectedModality === 'services') {
      if (selectedService) {
        setFormData((prev) => ({ ...prev, procedure_name: selectedService.name }));
        if (selectedService.estimated_cost) {
          setRequestedAmount(selectedService.estimated_cost.toString());
        } else {
          setRequestedAmount('150');
        }
      }
    }
  };

  const handleSelectForFinancing = (item, type) => {
    if (type === 'specialty') {
      setModality('specialties');
      setSelectedDoctor({ id: item.id || 999, full_name: item.full_name });
      setSelectedClinic({ id: 999, name: item.clinic || 'Clínica Afiliada', city: item.city || 'Caracas' });
      setFormData((prev) => ({ ...prev, procedure_name: `Consulta con ${item.full_name}` }));
      setRequestedAmount('1500');
      setStep(3);
    } else {
      setModality('services');
      setSelectedService(item);
      setFormData((prev) => ({ ...prev, procedure_name: item.name }));
      if (item.price) {
        const cleanPrice = item.price.replace(/[^0-9.]/g, '');
        if (cleanPrice) setRequestedAmount(cleanPrice);
      }
      setStep(3);
    }
  };

  const handleFormChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async () => {
    if (!medicalReportFile || !medicalReportFile.uri || !clinicBudgetFile || !clinicBudgetFile.uri) {
      Alert.alert('Documentos Requeridos', 'Por favor adjunta nuevamente la Orden/Informe Médico y el Presupuesto.');
      return;
    }

    const procName = formData.procedure_name || (modality === 'services' ? selectedService?.name : selectedSpecialty?.name);
    if (!procName || !requestedAmount) {
      Alert.alert('Campos Incompletos', 'Ingresa el nombre del procedimiento o estudio y el monto total.');
      return;
    }

    setSubmitting(true);

    try {
      const bodyFormData = new FormData();
      bodyFormData.append('patient_id', String(user?.id || ''));
      bodyFormData.append('clinic_id', String(selectedClinic?.id || '1'));
      bodyFormData.append('doctor_id', String(selectedDoctor?.id || '1'));
      bodyFormData.append('specialty_id', String(selectedSpecialty?.id || '1'));
      bodyFormData.append('procedure_name', String(procName));
      bodyFormData.append('requested_amount', String(requestedAmount || '0'));
      bodyFormData.append('down_payment_percentage', '20');
      bodyFormData.append('installments_count', String(installments || 18));
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

      await uploadWithXHR(`${API_BASE_URL}/api/requests`, bodyFormData);

      Alert.alert(
        '🎉 ¡Solicitud Enviada!',
        'Tu solicitud de crédito fue creada exitosamente y pasó a revisión por administración.',
        [
          {
            text: 'Ver Mis Solicitudes',
            onPress: () => {
              setModality(null);
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

  // IF NO MODALITY SELECTED: SHOW MODALIDAD HUB
  if (modality === null) {
    return <ModalidadHub onSelectModalidad={handleSelectModalidad} />;
  }

  // IF MODALITY C: SHOW OPEN NETWORK DIRECTORY
  if (modality === 'open_network') {
    return (
      <OpenNetworkDirectory
        onReturnToHub={() => setModality(null)}
      />
    );
  }

  // MODALITIES A & B: STEPPER WIZARDS
  const isSpecialtyFlow = modality === 'specialties';
  const stepLabels = isSpecialtyFlow
    ? [
        { s: 1, label: 'Especialidad' },
        { s: 2, label: 'Proveedor' },
        { s: 3, label: 'Cuotas' },
        { s: 4, label: 'Recaudos' },
      ]
    : [
        { s: 1, label: 'Servicio' },
        { s: 2, label: 'Centro/Prov.' },
        { s: 3, label: 'Cuotas' },
        { s: 4, label: 'Recaudos' },
      ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Top Change Modality Bar */}
      <View style={styles.modalityBar}>
        <TouchableOpacity
          onPress={() => setModality(null)}
          style={styles.changeModalityBtn}
        >
          <Ionicons name="arrow-back" size={14} color={COLORS.primaryDark} />
          <Text style={styles.changeModalityText}>← Cambiar Modalidad</Text>
        </TouchableOpacity>

        <View style={styles.modalityTag}>
          <Text style={styles.modalityTagText}>
            {isSpecialtyFlow ? 'Modalidad A: Especialidades' : 'Modalidad B: Servicios'}
          </Text>
        </View>
      </View>

      {/* Progress Steps */}
      <View style={styles.stepBar}>
        {stepLabels.map((item) => (
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

      {/* STEP 1: SELECCIÓN DE ESPECIALIDAD (MODALIDAD A) O SERVICIO MÉDICO (MODALIDAD B) */}
      {step === 1 && (
        <View style={styles.stepContent}>
          {isSpecialtyFlow ? (
            <SpecialtyPicker
              specialties={specialties}
              selectedSpecialty={selectedSpecialty}
              onSelectSpecialty={(s) => {
                setSelectedSpecialty(s);
                setFormData((prev) => ({ ...prev, procedure_name: `Intervención de ${s.name}` }));
                setStep(2);
              }}
            />
          ) : (
            <ServiceList
              services={services}
              selectedService={selectedService}
              onSelectService={(srv) => {
                setSelectedService(srv);
                setFormData((prev) => ({ ...prev, procedure_name: srv.name }));
                if (srv.estimated_cost) {
                  setRequestedAmount(srv.estimated_cost.toString());
                }
                setStep(2);
              }}
            />
          )}
        </View>
      )}

      {/* STEP 2: SELECCIÓN DE PROVEEDOR / CENTRO */}
      {step === 2 && (
        <View style={styles.stepContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
            <Ionicons name="arrow-back" size={14} color={COLORS.textMuted} />
            <Text style={styles.backBtnText}>
              {isSpecialtyFlow ? 'Volver a Especialidades' : 'Volver a Servicios Médicos'}
            </Text>
          </TouchableOpacity>

          <ClinicDoctorPicker
            modality={modality}
            clinics={clinics}
            doctors={doctors}
            selectedClinic={selectedClinic}
            onSelectClinic={setSelectedClinic}
            selectedDoctor={selectedDoctor}
            onSelectDoctor={setSelectedDoctor}
            onNextStep={() => setStep(3)}
            providerType={providerType}
            setProviderType={setProviderType}
          />
        </View>
      )}

      {/* STEP 3: CALCULADORA DE CUOTAS */}
      {step === 3 && (
        <View style={styles.stepContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
            <Ionicons name="arrow-back" size={14} color={COLORS.textMuted} />
            <Text style={styles.backBtnText}>Volver a Selección de Proveedor</Text>
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
            onPress={() => setStep(4)}
          >
            <Text style={styles.nextBtnText}>Continuar a Carga de Recaudos</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 4: ANEXOS Y FORMULARIO DE RECAUDOS */}
      {step === 4 && (
        <View style={styles.stepContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(3)}>
            <Ionicons name="arrow-back" size={14} color={COLORS.textMuted} />
            <Text style={styles.backBtnText}>Volver a Calculadora</Text>
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
  container: { padding: 16, paddingBottom: 40, gap: 14 },
  modalityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  changeModalityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  changeModalityText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  modalityTag: {
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  modalityTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  stepBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 10,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
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
    fontSize: 11,
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
    gap: 14,
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
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.white,
  },
  submitBtn: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 15,
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
