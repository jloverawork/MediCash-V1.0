import React from 'react';
import {
  Stethoscope,
  Activity,
  Globe2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  Brain,
  Bone,
  UserCheck,
  FlaskConical,
  Scan,
  FileSearch,
  Zap,
  Building2,
  MapPin,
  ArrowRight
} from 'lucide-react';

export default function ModalidadHub({ onSelectModalidad }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
            <Sparkles className="w-3 h-3 text-emerald-300" /> Sistema de Financiamiento Salud
          </span>
          <h1 className="text-xl font-black tracking-tight leading-tight">
            Selecciona la Línea de Servicio MediCash
          </h1>
          <p className="text-xs text-teal-100/90 font-medium leading-relaxed">
            Obtén financiamiento en cuotas o explora nuestro directorio médico en Venezuela.
          </p>
        </div>
      </div>

      {/* Main Options Grid */}
      <div className="space-y-4">
        {/* Option 1: Especialidades con Financiamiento */}
        <div
          onClick={() => onSelectModalidad('specialties')}
          className="group relative cursor-pointer bg-white border-2 border-slate-200 hover:border-teal-600 rounded-3xl p-5 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-gradient-to-l from-teal-600 to-emerald-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-bl-2xl uppercase tracking-wider shadow-sm">
            ★ Crédito Quirúrgico / Clínico
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
              <Stethoscope className="w-7 h-7" />
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 pr-12">
                <h3 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                  1. Especialidades con Financiamiento
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Financiamiento de cirugías, tratamientos e intervenciones clínicas complejas en plazos adaptables.
              </p>

              {/* Tags for Options */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                  <Stethoscope className="w-3 h-3 text-teal-600" /> Medicina Interna
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                  <Brain className="w-3 h-3 text-teal-600" /> Neurocirugía
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                  <Bone className="w-3 h-3 text-teal-600" /> Traumatología
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                  <UserCheck className="w-3 h-3 text-teal-600" /> Psicología
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-teal-700 font-extrabold group-hover:translate-x-1 transition-transform">
                <span>Iniciar Solicitud de Crédito</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Option 2: Servicios con Financiamiento */}
        <div
          onClick={() => onSelectModalidad('services')}
          className="group relative cursor-pointer bg-white border-2 border-slate-200 hover:border-teal-600 rounded-3xl p-5 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-bl-2xl uppercase tracking-wider shadow-sm">
            ⚡ Crédito para Diagnósticos
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
              <Activity className="w-7 h-7" />
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 pr-12">
                <h3 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                  2. Servicios con Financiamiento
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Financiamiento rápido para exámenes de laboratorio, imágenes médicas y estudios de neurofisiología.
              </p>

              {/* Tags for Options */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                  <FlaskConical className="w-3 h-3 text-emerald-600" /> Perfil 20
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                  <Activity className="w-3 h-3 text-emerald-600" /> Eco Abdominal
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                  <FileSearch className="w-3 h-3 text-emerald-600" /> Rayos X
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                  <Zap className="w-3 h-3 text-emerald-600" /> Electromiografía
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-teal-700 font-extrabold group-hover:translate-x-1 transition-transform">
                <span>Solicitar Crédito de Estudios</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Option 3: Red Abierta MediCash (Secundario / Informativo) */}
        <div
          onClick={() => onSelectModalidad('open_network')}
          className="group relative cursor-pointer bg-slate-50/70 border-2 border-slate-200 hover:border-slate-400 rounded-3xl p-5 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-slate-100 text-slate-600 font-extrabold text-[10px] px-3 py-1 rounded-bl-2xl uppercase tracking-wider border-b border-l border-slate-200">
            ℹ Directorio Informativo
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-white text-slate-600 border border-slate-200 group-hover:bg-slate-700 group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
              <Globe2 className="w-7 h-7" />
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 pr-12">
                <h3 className="text-base font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                  3. Red Abierta MediCash
                </h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Directorio médico integral para consultar especialistas por rama y centros diagnósticos sin flujo de cuotas.
              </p>

              {/* Tags for Options */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded-lg border border-slate-200">
                  <UserCheck className="w-3 h-3 text-slate-500" /> Especialistas
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded-lg border border-slate-200">
                  <Building2 className="w-3 h-3 text-slate-500" /> Servicios y Centros
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded-lg border border-slate-200">
                  <MapPin className="w-3 h-3 text-slate-500" /> Filtros por Ubicación
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 font-bold group-hover:text-slate-900 group-hover:translate-x-1 transition-transform">
                <span>Explorar Directorio Médico</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
