import React, { useState } from 'react';
import {
  Building2,
  UserCheck,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Award,
  Search,
  X,
  Stethoscope,
  ShieldCheck,
  User,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export function ProviderTabPicker({
  modality = 'specialties', // 'specialties' | 'services'
  clinics = [],
  doctors = [],
  selectedClinic,
  onSelectClinic,
  selectedDoctor,
  onSelectDoctor,
  onNextStep,
  providerType, // null | 'affiliated' | 'particular'
  setProviderType
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

  // IF NO TYPE SELECTED YET: SHOW THE 2 OPTION CARDS (LIKE STEP 1 / HUB)
  if (!providerType) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            {isSpecialty ? 'Selección de Tipo de Proveedor' : 'Selección de Tipo de Centro Diagnóstico'}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Selecciona la modalidad de tu proveedor médico para continuar
          </p>
        </div>

        <div className="space-y-3">
          {/* Card 1: Clínicas Afiliadas */}
          <div
            onClick={() => setProviderType('affiliated')}
            className="group cursor-pointer bg-white border-2 border-slate-200 hover:border-teal-600 rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-200 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {isSpecialty ? 'Clínicas Afiliadas MediCash' : 'Centros & Laboratorios Afiliados'}
                  </h4>
                  <div className="p-1 rounded-full bg-slate-100 group-hover:bg-teal-600 group-hover:text-white text-slate-400 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                  {isSpecialty
                    ? 'Explora nuestra red de clínicas y centros quirúrgicos certificados con convenio directo.'
                    : 'Explora nuestra red de centros diagnósticos e imagenología con cobertura MediCash.'}
                </p>

                <span className="inline-block text-[10px] text-teal-700 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded mt-2">
                  ✓ Ver lista completa de centros afiliados
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Especialistas Particulares */}
          <div
            onClick={() => setProviderType('particular')}
            className="group cursor-pointer bg-white border-2 border-slate-200 hover:border-emerald-600 rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200 shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {isSpecialty ? 'Especialistas / Consultorio Particular' : 'Proveedor / Laboratorio Particular'}
                  </h4>
                  <div className="p-1 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-400 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                  Atención médica directa con tu especialista de confianza o laboratorio independiente.
                </p>

                <span className="inline-block text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-2">
                  ✓ Ingresar datos de médico o centro privado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // IF TYPE SELECTED: SHOW THE SPECIFIC VIEW
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Sub Header Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setProviderType(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200 hover:bg-teal-100 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cambiar tipo de proveedor</span>
        </button>

        <span className="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
          {providerType === 'affiliated' ? 'Clínicas Afiliadas' : 'Especialistas Particulares'}
        </span>
      </div>

      {/* VIEW 1: AFILIADOS LIST */}
      {providerType === 'affiliated' ? (
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-black text-slate-900">
              {isSpecialty ? 'Selecciona la Clínica Afiliada' : 'Selecciona el Centro Afiliado'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Toca sobre el centro deseado para seleccionar e ingresar
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isSpecialty ? "Buscar clínica o centro..." : "Buscar centro diagnóstico o laboratorio..."}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-9 text-xs text-slate-900 focus:outline-none focus:border-teal-600 transition shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredClinics.map((clinic) => {
              const isSelected = selectedClinic?.id === clinic.id;

              return (
                <div
                  key={clinic.id}
                  onClick={() => handleSelectClinic(clinic)}
                  className={`relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-600 shadow-md scale-[1.01]'
                      : 'bg-white border-slate-200 hover:border-teal-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center p-3 gap-3">
                    <img
                      src={clinic.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150'}
                      alt={clinic.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{clinic.name}</h4>
                        <div className="p-1 rounded-full bg-teal-600 text-white shrink-0 ml-2">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {clinic.city} - {clinic.address}
                      </p>
                      <span className="inline-block text-[10px] text-teal-700 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded mt-1">
                        Tocar para seleccionar
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: PARTICULAR FORM */
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 font-medium">
            <p className="font-bold flex items-center gap-1.5 text-teal-800">
              <ShieldCheck className="w-4 h-4 text-teal-600" /> Cobertura con Especialista Particular
            </p>
            <p className="mt-1">
              Ingresa el nombre de tu médico o centro particular y presiona continuar.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre del Médico Especialista o Centro Particular:
              </label>
              <input
                type="text"
                value={particularDoctorName}
                onChange={(e) => {
                  setParticularDoctorName(e.target.value);
                  if (onSelectDoctor) {
                    onSelectDoctor({ id: 999, full_name: e.target.value || 'Médico Particular' });
                  }
                }}
                placeholder="Ej. Dr. Alejandro Gómez / Centro Diagnóstico Privado"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clínica o Consultorio donde se realizará:
              </label>
              <input
                type="text"
                value={particularCenterName}
                onChange={(e) => {
                  setParticularCenterName(e.target.value);
                  if (onSelectClinic) {
                    onSelectClinic({ id: 999, name: e.target.value || 'Consultorio Particular', city: 'Caracas' });
                  }
                }}
                placeholder="Ej. Consultorio Médico San Bernardino / Laboratorio Independiente"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600 transition"
              />
            </div>

            <button
              type="button"
              disabled={!particularDoctorName.trim() && !particularCenterName.trim()}
              onClick={() => {
                if (onNextStep) onNextStep();
              }}
              className="w-full bg-teal-600 text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-teal-700 transition disabled:opacity-50 mt-3"
            >
              <span>Continuar a Selección de Cuotas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ClinicPicker(props) {
  return <ProviderTabPicker {...props} providerType="affiliated" setProviderType={() => {}} />;
}

export function DoctorPicker({ doctors, selectedSpecialty, selectedClinic, selectedDoctor, onSelectDoctor }) {
  return (
    <div className="space-y-3">
      {doctors.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onSelectDoctor(doc)}
          className={`cursor-pointer rounded-2xl p-3.5 border flex items-center gap-3.5 ${
            selectedDoctor?.id === doc.id ? 'bg-teal-50 border-teal-600' : 'bg-white border-slate-200'
          }`}
        >
          <img src={doc.avatar_url} alt={doc.full_name} className="w-12 h-12 rounded-full border-2 border-teal-500" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900">{doc.full_name}</h4>
            <p className="text-xs text-teal-700">{doc.subspecialty || doc.specialty_name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProviderTabPicker;
