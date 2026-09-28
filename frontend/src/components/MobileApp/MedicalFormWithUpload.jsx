import React from 'react';
import { FileText, UploadCloud, CheckCircle2, FileCheck, AlertCircle, Trash2, Calendar, Phone, CreditCard, UserPlus, Info } from 'lucide-react';

export default function MedicalFormWithUpload({
  formData,
  onFormChange,
  medicalReportFile,
  clinicBudgetFile,
  onMedicalReportChange,
  onClinicBudgetChange
}) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          Datos del Procedimiento y Anexos Requeridos
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Ingresa la información clave y adjunta el informe médico y el presupuesto de la clínica para procesar la solicitud.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Nombre de la Operación */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Nombre / Tipo de Cirugía *
          </label>
          <input
            type="text"
            required
            value={formData.procedure_name}
            onChange={(e) => onFormChange('procedure_name', e.target.value)}
            placeholder="Ej: Microdiscectomía Lumbar L4-L5 / Craneotomía"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition"
          />
        </div>

        {/* Fecha del Informe Médico & Cédula */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Fecha del Informe *
            </label>
            <input
              type="date"
              required
              value={formData.report_date}
              onChange={(e) => onFormChange('report_date', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" /> Cédula Paciente *
            </label>
            <input
              type="text"
              required
              value={formData.patient_cedula}
              onChange={(e) => onFormChange('patient_cedula', e.target.value)}
              placeholder="V-18452930"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Teléfono & Emergencia */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" /> Teléfono Móvil *
            </label>
            <input
              type="text"
              required
              value={formData.patient_phone}
              onChange={(e) => onFormChange('patient_phone', e.target.value)}
              placeholder="+58 414 1234567"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5 text-slate-500" /> Contacto Emergencia *
            </label>
            <input
              type="text"
              required
              value={formData.emergency_contact}
              onChange={(e) => onFormChange('emergency_contact', e.target.value)}
              placeholder="Familiar / Teléfono"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Resumen o Notas */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Resumen o Notas Médicas Importantes
          </label>
          <textarea
            rows={2}
            value={formData.medical_notes}
            onChange={(e) => onFormChange('medical_notes', e.target.value)}
            placeholder="Describa brevemente el diagnóstico o recomendación médica del cirujano..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4 text-teal-600" /> Adjuntar Documentos Obligatorios
          </h4>
          <span className="text-[10px] text-slate-500 font-medium">PDF, JPG o PNG (Max 15MB)</span>
        </div>

        {/* Informe Médico File Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            1. Informe Médico Firmado por el Cirujano *
          </label>
          {medicalReportFile ? (
            <div className="bg-teal-50 border border-teal-300 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCheck className="w-5 h-5 text-teal-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{medicalReportFile.name}</p>
                  <p className="text-[10px] text-teal-700 font-medium">
                    {(medicalReportFile.size / (1024 * 1024)).toFixed(2)} MB - Listo para enviar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onMedicalReportChange(null)}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition">
              <UploadCloud className="w-7 h-7 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-900">Subir Informe Médico</span>
              <span className="text-[10px] text-slate-500 font-medium">
                Haz clic para seleccionar o arrastra el archivo aquí
              </span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => e.target.files?.[0] && onMedicalReportChange(e.target.files[0])}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Presupuesto Clínica File Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            2. Presupuesto Oficial Emitido por la Clínica *
          </label>
          {clinicBudgetFile ? (
            <div className="bg-teal-50 border border-teal-300 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCheck className="w-5 h-5 text-teal-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{clinicBudgetFile.name}</p>
                  <p className="text-[10px] text-teal-700 font-medium">
                    {(clinicBudgetFile.size / (1024 * 1024)).toFixed(2)} MB - Listo para enviar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onClinicBudgetChange(null)}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition">
              <UploadCloud className="w-7 h-7 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-900">Subir Presupuesto de la Clínica</span>
              <span className="text-[10px] text-slate-500 font-medium">
                Haz clic para seleccionar o arrastra el archivo aquí
              </span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => e.target.files?.[0] && onClinicBudgetChange(e.target.files[0])}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
