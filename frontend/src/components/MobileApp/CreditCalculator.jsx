import React from 'react';
import { Calculator, DollarSign, CalendarCheck, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CreditCalculator({
  requestedAmount,
  onAmountChange,
  installments,
  onInstallmentsChange
}) {
  const totalAmount = parseFloat(requestedAmount) || 0;
  const downPayment = totalAmount * 0.20; // 20%
  const remaining = Math.max(0, totalAmount - downPayment);
  const installmentVal = installments > 0 ? remaining / installments : 0;

  const getEndDateStr = (numMonths) => {
    const d = new Date();
    d.setMonth(d.getMonth() + parseInt(numMonths || 0, 10));
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${monthNames[d.getMonth()]} de ${d.getFullYear()}`;
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-teal-600 text-white font-bold shadow-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Calculadora de Crédito MediCash</h3>
              <p className="text-xs text-slate-500 font-medium">Plan de financiamiento para tu cirugía</p>
            </div>
          </div>
          <span className="text-[11px] font-extrabold bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-full shadow-sm">
            Inicial 20% Base
          </span>
        </div>

        {/* Input Monto */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Monto Total del Presupuesto Quirúrgico ($ USD)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input
              type="number"
              min="100"
              step="50"
              value={requestedAmount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="Ej: 3500"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-4 text-slate-900 font-black text-lg focus:outline-none focus:border-teal-600 focus:bg-white transition"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            * El monto final será validado por administración según el Presupuesto adjunto de la clínica.
          </p>
        </div>

        {/* Selector de Cuotas */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Selecciona el Número de Cuotas
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[18, 24, 36, 48, 64].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onInstallmentsChange(num)}
                className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                  installments === num
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-300'
                }`}
              >
                {num} C
              </button>
            ))}
          </div>
        </div>

        {/* Breakdown Card */}
        {totalAmount > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Monto Total Cirugía:
              </span>
              <span className="text-sm font-black text-slate-900">
                ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Pago Inicial Solicitado (20%):
                </span>
                <span className="text-[10px] text-slate-500">Pagas al momento de la aprobación</span>
              </div>
              <span className="text-base font-black text-teal-700">
                ${downPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">
                  {installments} Cuotas Mensuales de:
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Saldo financiado: ${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-slate-900">
                  ${installmentVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="block text-[9px] text-slate-500 font-semibold">/ mes</span>
              </div>
            </div>

            {/* Fecha Estimada de Finalización */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center gap-2.5">
              <CalendarCheck className="w-5 h-5 text-teal-700 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-teal-900">Fecha Estimada de Finalización del Pago:</p>
                <p className="text-xs font-black text-teal-700">🗓️ {getEndDateStr(installments)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-100 p-3 rounded-xl border border-slate-200">
          <ShieldAlert className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>
            La administración de MediCash evaluará el informe médico y presupuesto para ratificar o ajustar la inicial y el cronograma de pago.
          </span>
        </div>
      </div>
    </div>
  );
}
