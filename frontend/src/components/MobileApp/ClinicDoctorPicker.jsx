import React, { useState } from 'react';
import { Building2, UserCheck, MapPin, CheckCircle2, ChevronRight, Award, Search, X } from 'lucide-react';

export function ClinicPicker({ clinics, selectedClinic, onSelectClinic }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClinics = clinics.filter((clinic) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      clinic.name.toLowerCase().includes(query) ||
      (clinic.city && clinic.city.toLowerCase().includes(query)) ||
      (clinic.address && clinic.address.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-teal-600" />
          Selecciona la Clínica Afiliada
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Centros de salud certificados en Venezuela con convenio MediCash
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar clínica por nombre o ciudad..."
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

      {/* Clinics List */}
      {filteredClinics.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center text-xs text-slate-500 font-medium">
          No se encontraron clínicas para "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredClinics.map((clinic) => {
            const isSelected = selectedClinic?.id === clinic.id;

            return (
              <div
                key={clinic.id}
                onClick={() => onSelectClinic(clinic)}
                className={`relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-600 shadow-md'
                    : 'bg-white border-slate-200 hover:border-teal-300 shadow-sm'
                }`}
              >
                <div className="flex items-center p-3 gap-3">
                  <img
                    src={clinic.image_url}
                    alt={clinic.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{clinic.name}</h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {clinic.city} - {clinic.address}
                    </p>
                    <span className="inline-block text-[10px] text-teal-700 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded mt-1">
                      Convenio Quirúrgico Directo
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DoctorPicker({ doctors, selectedSpecialty, selectedClinic, selectedDoctor, onSelectDoctor }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = doctors.filter((doc) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      doc.full_name.toLowerCase().includes(query) ||
      (doc.subspecialty && doc.subspecialty.toLowerCase().includes(query)) ||
      (doc.specialty_name && doc.specialty_name.toLowerCase().includes(query)) ||
      (doc.mpps_code && doc.mpps_code.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-teal-600" />
          Selecciona el Médico Cirujano
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Especialistas de {selectedSpecialty?.name || 'la especialidad'} que operan en{' '}
          {selectedClinic?.name || 'la clínica seleccionada'}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar médico por nombre o subespecialidad..."
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

      {/* Doctors List */}
      {doctors.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center text-xs text-slate-500 font-medium">
          No hay cirujanos registrados para {selectedSpecialty?.name} en {selectedClinic?.name}.
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center text-xs text-slate-500 font-medium">
          No se encontraron médicos para "{searchQuery}".
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredDoctors.map((doc) => {
            const isSelected = selectedDoctor?.id === doc.id;

            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoctor(doc)}
                className={`cursor-pointer rounded-2xl p-3.5 border transition-all duration-200 flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-600 shadow-md'
                    : 'bg-white border-slate-200 hover:border-teal-300 shadow-sm'
                }`}
              >
                <img
                  src={doc.avatar_url}
                  alt={doc.full_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{doc.full_name}</h4>
                    {doc.mpps_code && (
                      <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {doc.mpps_code}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-teal-700 font-semibold mt-0.5 truncate">
                    {doc.subspecialty || doc.specialty_name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                    <Award className="w-3 h-3 text-amber-500" /> Especialista Afiliado a MediCash
                  </p>
                </div>
                <div className="shrink-0">
                  <div
                    className={`p-1.5 rounded-full ${
                      isSelected ? 'bg-teal-600 text-white' : 'text-slate-400 bg-slate-100'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ClinicPicker;
