import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, FileText, ExternalLink, Building2, UserCheck } from 'lucide-react';

export default function RequestStatusTracker({ requests, onRefresh }) {
  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-sm">
        <Clock className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Sin Solicitudes Activas</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
          Aún no has solicitado ningún financiamiento médico. Selecciona una especialidad y solicita tu crédito de operación.
        </p>
      </div>
    );
  }

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Crédito Aprobado
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-xs font-bold">
            <XCircle className="w-4 h-4 text-rose-600" /> Solicitud Rechazada
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600" /> En Revisión Médica
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 rounded-full text-xs font-bold">
            <Clock className="w-4 h-4 text-amber-500" /> Pendiente por Revisión
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Mis Solicitudes de Crédito</h2>
        <button
          onClick={onRefresh}
          className="text-xs text-teal-700 hover:text-teal-900 font-bold underline transition"
        >
          Actualizar Estatus
        </button>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-md hover:border-teal-300 transition"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">
                  Solicitud #{req.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{req.procedure_name}</h3>
                <p className="text-xs text-slate-500 font-medium">{req.specialty_name}</p>
              </div>
              <div>{renderStatusBadge(req.status)}</div>
            </div>

            {/* Clinic & Doctor Info */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block font-medium">Clínica:</span>
                  <span className="font-semibold text-slate-900 truncate block">{req.clinic_name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block font-medium">Doctor:</span>
                  <span className="font-semibold text-slate-900 truncate block">{req.doctor_name}</span>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-2 text-center bg-slate-100 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Presupuesto Solicitado</span>
                <span className="text-sm font-bold text-slate-900">
                  ${parseFloat(req.requested_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">
                  Inicial ({req.down_payment_percentage || 20}%)
                </span>
                <span className="text-sm font-bold text-teal-700">
                  ${parseFloat(req.down_payment_amount || req.requested_amount * 0.2).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">
                  {req.installments_count || 6} Cuotas de
                </span>
                <span className="text-sm font-bold text-slate-900">
                  ${parseFloat(req.installment_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Admin Notes if available */}
            {req.admin_notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
                <span className="font-bold text-amber-900 block mb-0.5">Nota de la Administración:</span>
                <p className="text-amber-800 italic">{req.admin_notes}</p>
              </div>
            )}

            {/* Attachments */}
            {req.attachments && req.attachments.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Documentos Anexados ({req.attachments.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {req.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs border border-slate-200 transition font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span className="max-w-[130px] truncate">
                        {att.attachment_type === 'MEDICAL_REPORT' ? 'Informe Médico' : 'Presupuesto'}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
