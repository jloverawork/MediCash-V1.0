import React from 'react';
import { Brain, HeartPulse, Bone, Stethoscope, Activity, UserCheck, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';

const iconMap = {
  Brain,
  HeartPulse,
  Bone,
  Stethoscope,
  Activity,
  UserCheck
};

export default function SpecialtyList({ specialties, selectedSpecialty, onSelectSpecialty }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Especialidades Médicas</h2>
          <p className="text-xs text-slate-500 font-medium">Selecciona el área de tu intervención quirúrgica</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200 shadow-sm">
          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" /> Financiamiento Activo
        </span>
      </div>

      <div className="space-y-3">
        {specialties.map((spec) => {
          const IconComponent = iconMap[spec.icon] || Activity;
          const isSelected = selectedSpecialty?.id === spec.id;
          const isFeatured = spec.is_featured;

          return (
            <div
              key={spec.id}
              onClick={() => onSelectSpecialty(spec)}
              className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
                isSelected
                  ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-600 shadow-md scale-[1.01]'
                  : isFeatured
                  ? 'bg-white border-teal-200 hover:border-teal-400 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {isFeatured && (
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                  ★ Especialidad Principal MediCash
                </div>
              )}

              <div className="flex items-start gap-3.5">
                <div
                  className={`p-3 rounded-xl border ${
                    isFeatured
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : isSelected
                      ? 'bg-teal-100 text-teal-800 border-teal-300'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 truncate">{spec.name}</h3>
                    {isFeatured && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-teal-700 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                        <ShieldCheck className="w-3 h-3 text-teal-600" /> Cobertura Total
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {spec.description}
                  </p>
                </div>

                <div className="self-center">
                  <div
                    className={`p-1.5 rounded-full ${
                      isSelected ? 'bg-teal-600 text-white' : 'text-slate-400 bg-slate-100'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
