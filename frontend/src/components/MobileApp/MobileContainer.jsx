import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Activity,
  FilePlus,
  ClipboardList,
  User,
  LogOut,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PatientAuth from './PatientAuth';
import ModalidadHub from './ModalidadHub';
import SpecialtyList from './SpecialtyList';
import ServiceList from './ServiceList';
import ProviderTabPicker from './ClinicDoctorPicker';
import CreditCalculator from './CreditCalculator';
import MedicalFormWithUpload from './MedicalFormWithUpload';
import OpenNetworkDirectory from './OpenNetworkDirectory';
import RequestStatusTracker from './RequestStatusTracker';
import PatientPaymentsView from './PatientPaymentsView';
import PatientProfileView from './PatientProfileView';

export default function MobileContainer() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('new_request'); // 'new_request' | 'my_requests' | 'my_payments' | 'profile'

  // Modality Selection: null (Hub) | 'specialties' (Modalidad A) | 'services' (Modalidad B) | 'open_network' (Modalidad C)
  const [modality, setModality] = useState(null);

  // Stepper State (1 to 4)
  const [step, setStep] = useState(1);

  // Provider Type State for Step 2 (null | 'affiliated' | 'particular')
  const [providerType, setProviderType] = useState(null);

  // Catalog State
  const [specialties, setSpecialties] = useState([]);
  const [services, setServices] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Selections State
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Financial State
  const [requestedAmount, setRequestedAmount] = useState('3500');
  const [installments, setInstallments] = useState(18);

  // Files State
  const [medicalReportFile, setMedicalReportFile] = useState(null);
  const [clinicBudgetFile, setClinicBudgetFile] = useState(null);

  // Additional Form State
  const [formData, setFormData] = useState({
    procedure_name: '',
    report_date: new Date().toISOString().split('T')[0],
    patient_cedula: user?.cedula || '',
    patient_phone: user?.phone || '',
    emergency_contact: '',
    medical_notes: ''
  });

  // User Requests State
  const [userRequests, setUserRequests] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSpecialties();
    fetchServices();
    fetchClinics();
  }, []);

  useEffect(() => {
    if (user && user.role === 'PATIENT') {
      fetchMyRequests();
      setFormData((prev) => ({
        ...prev,
        patient_cedula: user.cedula || prev.patient_cedula,
        patient_phone: user.phone || prev.patient_phone
      }));
    }
  }, [user]);

  useEffect(() => {
    if (selectedClinic && selectedSpecialty) {
      fetchDoctors(selectedSpecialty.id, selectedClinic.id);
    }
  }, [selectedClinic, selectedSpecialty]);

  const fetchSpecialties = async () => {
    try {
      const res = await fetch('/api/catalog/specialties');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSpecialties(data);
        if (data.length > 0) setSelectedSpecialty(data[0]);
      }
    } catch (err) {
      console.error('Error fetching specialties:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/catalog/services');
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data);
        if (data.length > 0) setSelectedService(data[0]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchClinics = async () => {
    try {
      const res = await fetch('/api/catalog/clinics');
      const data = await res.json();
      if (Array.isArray(data)) {
        setClinics(data);
        if (data.length > 0) setSelectedClinic(data[0]);
      }
    } catch (err) {
      console.error('Error fetching clinics:', err);
    }
  };

  const fetchDoctors = async (specialtyId, clinicId) => {
    try {
      const res = await fetch(`/api/catalog/doctors?specialty_id=${specialtyId}&clinic_id=${clinicId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setDoctors(data);
        if (data.length > 0) setSelectedDoctor(data[0]);
        else setSelectedDoctor(null);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchMyRequests = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/requests/my-requests/${user.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setUserRequests(data);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const handleSelectModalidad = (selectedModality) => {
    setModality(selectedModality);
    setStep(1);
    setProviderType(null);
    setErrorMessage('');
    setSuccessMessage('');

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

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitCreditRequest = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!medicalReportFile || !clinicBudgetFile) {
      setErrorMessage('Debes adjuntar tanto la Orden/Informe Médico como el Presupuesto.');
      return;
    }

    const procName = formData.procedure_name || (modality === 'services' ? selectedService?.name : selectedSpecialty?.name);
    if (!procName || !requestedAmount) {
      setErrorMessage('Ingresa el nombre del procedimiento o estudio y el monto.');
      return;
    }

    setSubmitting(true);

    try {
      const bodyFormData = new FormData();
      bodyFormData.append('patient_id', user.id);
      bodyFormData.append('clinic_id', selectedClinic?.id || '1');
      bodyFormData.append('doctor_id', selectedDoctor?.id || '1');
      bodyFormData.append('specialty_id', selectedSpecialty?.id || '1');
      bodyFormData.append('procedure_name', procName);
      bodyFormData.append('requested_amount', requestedAmount);
      bodyFormData.append('down_payment_percentage', '20');
      bodyFormData.append('installments_count', installments.toString());
      bodyFormData.append('report_date', formData.report_date);
      bodyFormData.append('medical_notes', formData.medical_notes);
      bodyFormData.append('patient_cedula', formData.patient_cedula);
      bodyFormData.append('patient_phone', formData.patient_phone);
      bodyFormData.append('emergency_contact', formData.emergency_contact);

      bodyFormData.append('medical_report', medicalReportFile);
      bodyFormData.append('clinic_budget', clinicBudgetFile);

      const res = await fetch('/api/requests', {
        method: 'POST',
        body: bodyFormData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar solicitud.');
      }

      setSuccessMessage('¡Solicitud de financiamiento creada exitosamente! Ha pasado a estatus Pendiente por Revisión.');
      fetchMyRequests();

      setTimeout(() => {
        setActiveTab('my_requests');
        setModality(null);
        setStep(1);
        setMedicalReportFile(null);
        setClinicBudgetFile(null);
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-6 px-4">
        <PatientAuth />
      </div>
    );
  }

  // Dynamic step titles based on selected modality
  const isSpecialtyFlow = modality === 'specialties';

  const stepLabels = isSpecialtyFlow
    ? [
        { s: 1, label: 'Especialidad' },
        { s: 2, label: 'Proveedor' },
        { s: 3, label: 'Cuotas' },
        { s: 4, label: 'Recaudos' }
      ]
    : [
        { s: 1, label: 'Servicio' },
        { s: 2, label: 'Centro/Prov.' },
        { s: 3, label: 'Cuotas' },
        { s: 4, label: 'Recaudos' }
      ];

  return (
    <div className="max-w-md mx-auto my-4 bg-slate-50 border-[6px] border-slate-300 rounded-[40px] shadow-2xl overflow-hidden min-h-[750px] flex flex-col relative">
      {/* Smartphone Notch Header */}
      <div className="bg-white px-6 pt-3 pb-2.5 flex items-center justify-between border-b border-slate-200 shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-teal-600 text-white font-black shadow-sm">
            <Stethoscope className="w-4 h-4" />
          </div>
          <span className="font-black text-sm text-slate-900 tracking-tight">MediCash</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            {user.full_name.split(' ')[0]}
          </span>
          <button
            onClick={logout}
            title="Cerrar Sesión"
            className="p-1 text-slate-400 hover:text-slate-700 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {activeTab === 'my_requests' ? (
          <RequestStatusTracker requests={userRequests} onRefresh={fetchMyRequests} />
        ) : activeTab === 'my_payments' ? (
          <PatientPaymentsView user={user} />
        ) : activeTab === 'profile' ? (
          <PatientProfileView user={user} onLogout={logout} />
        ) : modality === null ? (
          /* PANTALLA DE ENTRADA / HUB PRINCIPAL */
          <ModalidadHub onSelectModalidad={handleSelectModalidad} />
        ) : modality === 'open_network' ? (
          /* MODALIDAD C: RED ABIERTA MEDICASH */
          <OpenNetworkDirectory
            onReturnToHub={() => setModality(null)}
            specialties={specialties}
            clinics={clinics}
          />
        ) : (
          /* MODALIDADES A Y B: WIZARDS DE SOLICITUD DE CRÉDITO */
          <div className="space-y-4">
            {/* Return to Main Hub Bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setModality(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200 hover:bg-teal-100 transition shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Cambiar Modalidad</span>
              </button>

              <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                {isSpecialtyFlow ? 'Modalidad A: Especialidades' : 'Modalidad B: Servicios'}
              </span>
            </div>

            {/* Stepper Dinámico (Pasos 1 al 4) */}
            <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center justify-between shadow-sm">
              {stepLabels.map((st) => (
                <div
                  key={st.s}
                  onClick={() => st.s < step && setStep(st.s)}
                  className={`flex flex-col items-center cursor-pointer transition ${
                    step === st.s
                      ? 'text-teal-700 font-bold'
                      : step > st.s
                      ? 'text-teal-600 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border ${
                      step === st.s
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm font-bold'
                        : step > st.s
                        ? 'bg-teal-50 text-teal-700 border-teal-300 font-bold'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {st.s}
                  </div>
                  <span className="text-[9px] mt-1 font-semibold">{st.label}</span>
                </div>
              ))}
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-teal-50 border border-teal-200 text-teal-800 text-xs p-3 rounded-xl font-medium">
                {successMessage}
              </div>
            )}

            {/* PASO 1: SELECCIÓN DE ESPECIALIDAD (MODALIDAD A) O SERVICIO MÉDICO (MODALIDAD B) */}
            {step === 1 && (
              <div className="space-y-4">
                {isSpecialtyFlow ? (
                  <SpecialtyList
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
              </div>
            )}

            {/* PASO 2: SELECCIÓN DE PROVEEDOR / CENTRO (TABS AFILIADOS vs PARTICULARES) */}
            {step === 2 && (
              <div className="space-y-4">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {isSpecialtyFlow ? 'Volver a Especialidades' : 'Volver a Servicios Médicos'}
                </button>

                <ProviderTabPicker
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
              </div>
            )}

            {/* PASO 3: SELECCIÓN DE CUOTAS (CALCULADORA DE AMORTIZACIÓN) */}
            {step === 3 && (
              <div className="space-y-4">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Volver a Selección de Proveedor
                </button>

                <CreditCalculator
                  requestedAmount={requestedAmount}
                  onAmountChange={setRequestedAmount}
                  installments={installments}
                  onInstallmentsChange={setInstallments}
                />

                <button
                  disabled={!requestedAmount || parseFloat(requestedAmount) <= 0}
                  onClick={() => setStep(4)}
                  className="w-full bg-teal-600 text-white font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-teal-700 transition disabled:opacity-50"
                >
                  <span>Continuar a Carga de Recaudos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* PASO 4: ANEXO DE RECAUDOS Y FORMULARIO DEL PACIENTE */}
            {step === 4 && (
              <div className="space-y-4">
                <button
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Volver a Calculadora
                </button>

                <MedicalFormWithUpload
                  formData={formData}
                  onFormChange={handleFormChange}
                  medicalReportFile={medicalReportFile}
                  clinicBudgetFile={clinicBudgetFile}
                  onMedicalReportChange={setMedicalReportFile}
                  onClinicBudgetChange={setClinicBudgetFile}
                />

                <button
                  disabled={submitting || !medicalReportFile || !clinicBudgetFile}
                  onClick={handleSubmitCreditRequest}
                  className="w-full bg-teal-600 text-white font-black py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-teal-700 transition text-base disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Procesando y Subiendo Documentos...</span>
                  ) : (
                    <>
                      <span>Enviar Solicitud a Revisión</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-2.5 flex items-center justify-around shrink-0 shadow-sm">
        <button
          onClick={() => {
            setActiveTab('new_request');
            setModality(null);
          }}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'new_request' ? 'text-teal-700 font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Inicio / Hub</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('my_requests');
            fetchMyRequests();
          }}
          className={`flex flex-col items-center gap-1 transition relative ${
            activeTab === 'my_requests' ? 'text-teal-700 font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px]">Mis Solicitudes</span>
          {userRequests.length > 0 && (
            <span className="absolute -top-1 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('my_payments')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'my_payments' ? 'text-teal-700 font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px]">Mis Pagos</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'profile' ? 'text-teal-700 font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Mi Perfil</span>
        </button>
      </div>
    </div>
  );
}
