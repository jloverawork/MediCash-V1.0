import React, { useState } from 'react';
import { X, FileText, CheckCircle2, XCircle, AlertCircle, Building2, User, ExternalLink, Calculator, ShieldCheck, DollarSign, Calendar, FileCheck } from 'lucide-react';

export default function RequestDetailModal({ request, onClose, onUpdateStatus }) {
  if (!request) return null;

  const [status, setStatus] = useState(request.status || 'PENDING');
  const [approvedAmount, setApprovedAmount] = useState(
    request.approved_amount !== null && request.approved_amount !== undefined
      ? request.approved_amount
      : request.requested_amount
  );
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(
    request.down_payment_percentage || 20
  );
  const [installmentsCount, setInstallmentsCount] = useState(
    request.installments_count || 6
  );
  const [adminNotes, setAdminNotes] = useState(request.admin_notes || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Live Calculations
  const numApproved = parseFloat(approvedAmount) || 0;
  const numDownPct = parseFloat(downPaymentPercentage) || 0;
  const calculatedDownAmount = (numApproved * (numDownPct / 100)).toFixed(2);
  const remainingToFinance = Math.max(0, numApproved - calculatedDownAmount);
  const calculatedInstallment = installmentsCount > 0 ? (remainingToFinance / installmentsCount).toFixed(2) : 0;

  const handleSave = async (newStatus) => {
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/credit-requests/${request.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          approved_amount: approvedAmount,
          down_payment_percentage: downPaymentPercentage,
          installments_count: installmentsCount,
          admin_notes: adminNotes
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar solicitud.');
      }

      onUpdateStatus(data.credit_request);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="bg-teal-600 text-white font-mono font-black text-xs px-2.5 py-1 rounded-lg">
              SOLICITUD #{request.id}
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900">{request.procedure_name}</h2>
              <p className="text-xs text-slate-500 font-medium">
                Paciente: {request.patient_name} ({request.patient_cedula})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full bg-white border border-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Information & Attachments */}
            <div className="space-y-4">
              {/* Surgical & Patient Info */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Información Quirúrgica & Médica
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Especialidad:</span>
                    <span className="font-semibold text-slate-900">{request.specialty_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Clínica Afiliada:</span>
                    <span className="font-semibold text-slate-900">
                      {request.clinic_name} ({request.clinic_city})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Neurocirujano / Doctor:</span>
                    <span className="font-semibold text-slate-900">{request.doctor_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Fecha de Informe Médico:</span>
                    <span className="font-semibold text-slate-900">
                      {request.report_date
                        ? new Date(request.report_date).toLocaleDateString('es-VE')
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Teléfono Contacto:</span>
                    <span className="font-semibold text-slate-900">
                      {request.patient_phone || request.patient_user_phone}
                    </span>
                  </div>
                </div>

                {request.medical_notes && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] text-slate-500 block font-bold">Resumen Médico / Síntomas:</span>
                    <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 mt-1 italic">
                      "{request.medical_notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Attachments Section */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>Documentos Anexados</span>
                  <span className="text-[10px] text-teal-700 font-bold font-mono">Revisión Obligatoria</span>
                </h3>

                {!request.attachments || request.attachments.length === 0 ? (
                  <p className="text-xs text-slate-500 italic font-medium">
                    No hay archivos adjuntos en esta solicitud.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {request.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileCheck className="w-5 h-5 text-teal-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {att.attachment_type === 'MEDICAL_REPORT'
                                ? 'Informe Médico Firmado'
                                : 'Presupuesto de la Clínica'}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate font-medium">{att.file_name}</p>
                          </div>
                        </div>
                        <a
                          href={att.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-teal-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-teal-700 transition shrink-0 shadow-sm"
                        >
                          <span>Ver Documento</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Financial Adjustment & Evaluation Form */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-4 shadow-sm">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-teal-600" />
                  Ajustes Financieros por Administración
                </h3>

                {/* Monto Solicitado Original */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Presupuesto Adjunto Solicitado:</span>
                  <span className="font-black text-slate-900 text-sm">
                    ${parseFloat(request.requested_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Monto Aprobado Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monto Aprobado ($ USD)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 font-bold text-base focus:outline-none focus:border-teal-600 transition"
                  />
                </div>

                {/* Porcentaje Inicial & N° Cuotas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Inicial (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={downPaymentPercentage}
                      onChange={(e) => setDownPaymentPercentage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-teal-700 font-bold text-sm focus:outline-none focus:border-teal-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      N° Cuotas
                    </label>
                    <select
                      value={installmentsCount}
                      onChange={(e) => setInstallmentsCount(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 font-bold text-sm focus:outline-none focus:border-teal-600 transition"
                    >
                      <option value={3}>3 Cuotas</option>
                      <option value={6}>6 Cuotas</option>
                      <option value={9}>9 Cuotas</option>
                      <option value={12}>12 Cuotas</option>
                    </select>
                  </div>
                </div>

                {/* Calculated Live Breakdown */}
                <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl space-y-1.5 text-xs text-teal-900 font-medium">
                  <div className="flex justify-between">
                    <span>Monto Inicial a Pagar ({numDownPct}%):</span>
                    <span className="font-bold text-teal-700">${calculatedDownAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saldo Financiado ({installmentsCount} cuotas):</span>
                    <span className="font-bold text-slate-900">${remainingToFinance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-teal-200 pt-1.5 font-bold">
                    <span>Valor por Cuota:</span>
                    <span className="text-sm font-black text-teal-700">${calculatedInstallment} / cuota</span>
                  </div>
                </div>

                {/* Admin Notes Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Observaciones o Notas de Administración para el Paciente
                  </label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Escriba aquí los términos de aprobación, solicitud de aclaratoria o motivo de rechazo..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Estatus Actual:</span>
            <span className="text-xs font-extrabold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
              {request.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={saving}
              onClick={() => handleSave('REJECTED')}
              className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-300 transition"
            >
              Rechazar Solicitud
            </button>

            <button
              disabled={saving}
              onClick={() => handleSave('UNDER_REVIEW')}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs px-4 py-2.5 rounded-xl border border-amber-300 transition"
            >
              Marcar En Revisión
            </button>

            <button
              disabled={saving}
              onClick={() => handleSave('APPROVED')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition"
            >
              {saving ? 'Guardando...' : 'Aprobar Crédito Quirúrgico'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
