import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle2, AlertCircle, Clock, UploadCloud, FileCheck, DollarSign, X } from 'lucide-react';

export default function PatientPaymentsView({ user }) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalPaid: 0, totalPending: 0, totalOverdue: 0 });
  const [schedules, setSchedules] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Submit support state
  const [uploadingSchedule, setUploadingSchedule] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('TRANSFERENCIA_BANESCO');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/payments/my-payments/${user.id}`);
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
        setSchedules(data.allSchedules || []);
      }
    } catch (err) {
      console.error('Error fetching patient payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSupport = async (e) => {
    e.preventDefault();
    if (!referenceNumber.trim()) {
      alert('Ingresa el número de referencia bancaria.');
      return;
    }

    setSubmitting(true);
    try {
      const bodyFormData = new FormData();
      bodyFormData.append('schedule_id', uploadingSchedule.id);
      bodyFormData.append('reference_number', referenceNumber);
      bodyFormData.append('payment_method', paymentMethod);

      if (selectedFile) {
        bodyFormData.append('payment_support', selectedFile);
      }

      const res = await fetch('/api/payments/submit-support', {
        method: 'POST',
        body: bodyFormData
      });

      if (!res.ok) throw new Error('Error al registrar pago');

      alert('¡Comprobante de pago enviado con éxito!');
      setUploadingSchedule(null);
      setReferenceNumber('');
      setSelectedFile(null);
      fetchPayments();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSchedules = schedules.filter((item) => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-teal-600" />
          Mis Pagos & Cronograma
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Estado de cuenta, cuotas mensuales y comprobantes de pago
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Pagado</span>
          <span className="text-sm font-black text-emerald-700">${summary.totalPaid.toFixed(2)}</span>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-xl p-2.5 text-center">
          <span className="text-[10px] font-bold text-teal-800 uppercase block">Por Pagar</span>
          <span className="text-sm font-black text-teal-700">${summary.totalPending.toFixed(2)}</span>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-center">
          <span className="text-[10px] font-bold text-rose-800 uppercase block">En Mora</span>
          <span className="text-sm font-black text-rose-700">${summary.totalOverdue.toFixed(2)}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1">
        {[
          { key: 'ALL', label: 'Todas' },
          { key: 'PAGADO', label: 'Pagadas' },
          { key: 'PENDING', label: 'Pendientes' },
          { key: 'OVERDUE', label: 'En Mora' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`py-1.5 rounded-lg text-xs font-bold transition ${
              filterStatus === tab.key
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Upload Modal Form */}
      {uploadingSchedule && (
        <form onSubmit={handleSendSupport} className="bg-white border-2 border-teal-500 rounded-2xl p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-900">
              Registrar Pago - Cuota #{uploadingSchedule.installment_number}
            </h4>
            <button type="button" onClick={() => setUploadingSchedule(null)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs font-bold text-teal-700">
            Monto a pagar: ${parseFloat(uploadingSchedule.amount).toFixed(2)} USD
          </p>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Número de Referencia Bancario *
            </label>
            <input
              type="text"
              required
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Ej: REF-98402194 / 001849"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Comprobante o Capture (Foto / PDF)
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm hover:bg-teal-700 transition"
          >
            {submitting ? 'Enviando Pago...' : 'Confirmar y Enviar Pago'}
          </button>
        </form>
      )}

      {/* Schedule Items List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500 font-medium">Cargando cronograma...</div>
      ) : filteredSchedules.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 font-medium">
          No hay cuotas registradas para este filtro.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredSchedules.map((item) => {
            const isPaid = item.status === 'PAGADO';
            const isOverdue = item.status === 'OVERDUE';

            return (
              <div
                key={item.id}
                className={`border rounded-2xl p-3.5 space-y-2 transition ${
                  isPaid
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : isOverdue
                    ? 'bg-rose-50/60 border-rose-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Cuota #{item.installment_number}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{item.clinic_name || 'Financiamiento'}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isPaid
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : isOverdue
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-teal-50 text-teal-800 border-teal-200'
                    }`}
                  >
                    {isPaid ? '✓ PAGADO' : isOverdue ? '⚠️ EN MORA' : '⏳ PENDIENTE'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-600 font-medium">📅 Vence: {item.due_date.split('T')[0]}</span>
                  <span className="font-black text-slate-900">${parseFloat(item.amount).toFixed(2)} USD</span>
                </div>

                {isPaid && item.reference_number && (
                  <div className="text-[10px] font-bold text-emerald-700 bg-white p-2 rounded-xl border border-emerald-200">
                    Ref: {item.reference_number} • Verificado por administración
                  </div>
                )}

                {isOverdue && (
                  <div className="text-[10px] font-bold text-rose-700 bg-white p-2 rounded-xl border border-rose-200">
                    Esta cuota presenta mora. Por favor envía tu comprobante.
                  </div>
                )}

                {!isPaid && (
                  <button
                    onClick={() => setUploadingSchedule(item)}
                    className="w-full bg-teal-600 text-white font-bold text-xs py-2 rounded-xl hover:bg-teal-700 transition"
                  >
                    Registrar / Enviar Pago
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
