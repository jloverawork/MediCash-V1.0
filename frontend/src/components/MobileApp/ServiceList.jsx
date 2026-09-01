import React from 'react';
import {
  FlaskConical,
  Activity,
  FileSearch,
  Zap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const iconMap = {
  FlaskConical,
  Activity,
  FileSearch,
  Zap
};

export default function ServiceList({ services, selectedService, onSelectService }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Servicios Médicos Diagnósticos</h2>
          <p className="text-xs text-slate-500 font-medium">Selecciona el estudio o laboratorio para tu crédito</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 shadow-sm">
          <Sparkles className="w-3 h-3 text-emerald-500 fill-emerald-500" /> Cobertura Inmediata
        </span>
      </div>

      <div className="space-y-3">
        {services.map((serv) => {
          const IconComponent = iconMap[serv.icon] || Activity;
          const isSelected = selectedService?.id === serv.id;

          return (
            <div
              key={serv.id}
              onClick={() => onSelectService(serv)}
              className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-600 shadow-md scale-[1.01]'
                  : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-3 rounded-xl border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 truncate">{serv.name}</h3>
                    {serv.category && (
                      <span className="inline-block text-[10px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 shrink-0">
                        {serv.category}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-medium">
                    {serv.description}
                  </p>

                  {serv.estimated_cost && (
                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500 font-semibold">Costo aprox. estudio:</span>
                      <span className="text-xs font-black text-emerald-700">
                        ${serv.estimated_cost} USD
                      </span>
                    </div>
                  )}
                </div>

                <div className="self-center shrink-0">
                  <div
                    className={`p-1.5 rounded-full ${
                      isSelected ? 'bg-emerald-600 text-white' : 'text-slate-400 bg-slate-100'
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
