import React, { useState, useEffect } from 'react';
import { Activity, Search, Filter, CheckCircle2, XCircle, Clock, AlertCircle, Building2, FileText, ArrowUpRight, DollarSign, Users, ShieldCheck, Stethoscope, CreditCard, Calendar, Eye } from 'lucide-react';
import RequestDetailModal from './RequestDetailModal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'payments'

  // Credit Requests State
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Payments Management State
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, [selectedStatus]);

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [activeTab, paymentStatusFilter]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const url = selectedStatus === 'ALL'
        ? '/api/admin/credit-requests'
        : `/api/admin/credit-requests?status=${selectedStatus}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data);
      }
    } catch (err) {
      console.error('Error fetching admin requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchPayments = async () => {
    setLoadingPayments(true);
    try {
      const url = paymentStatusFilter === 'ALL'
        ? '/api/payments/admin/all-payments'
        : `/api/payments/admin/all-payments?status=${paymentStatusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPayments(data);
      }
    } catch (err) {
      console.error('Error fetching admin payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleVerifyPayment = async (scheduleId, newStatus) => {
    setVerifyingId(scheduleId);
    try {
      const res = await fetch(`/api/payments/admin/verify/${scheduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchPayments();
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleUpdateStatusInList = (updatedReq) => {
    setRequests((prev) => prev.map((r) => (r.id === updatedReq.id ? updatedReq : r)));
    fetchStats();
  };

  const filteredRequests = requests.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.patient_name?.toLowerCase().includes(term) ||
      r.procedure_name?.toLowerCase().includes(term) ||
      r.clinic_name?.toLowerCase().includes(term) ||
      r.patient_cedula?.toLowerCase().includes(term) ||
      r.id.toString().includes(term)
    );
  });

  const filteredPayments = payments.filter((p) => {
    const term = paymentSearchTerm.toLowerCase();
    return (
      p.patient_name?.toLowerCase().includes(term) ||
      p.patient_cedula?.toLowerCase().includes(term) ||
      p.procedure_name?.toLowerCase().includes(term) ||
      p.reference_number?.toLowerCase().includes(term) ||
      p.installment_number.toString().includes(term)
    );
  });

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aprobado
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rechazado
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> En Revisión
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Pendiente
          </span>
        );
    }
  };

  const renderPaymentStatusBadge = (status) => {
    switch (status) {
      case 'PAGADO':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pagado
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> En Mora
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pendiente
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner with Main Mode Switcher */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-200">
              Panel de Administración
            </span>
            <span className="text-xs text-slate-500 font-medium">• MediCash Venezuela</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {activeTab === 'requests' ? 'Gestión & Evaluación de Créditos Quirúrgicos' : 'Control & Verificación de Pagos de Cuotas'}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {activeTab === 'requests'
              ? 'Revisión de informes médicos, validación de presupuestos y aprobación de financiamiento.'
              : 'Verificación de transferencias, comprobantes bancarios y control de mora de pacientes.'}
          </p>
        </div>

        {/* Main Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
              activeTab === 'requests'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Solicitudes</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
              activeTab === 'payments'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Gestión de Pagos</span>
          </button>
        </div>
      </div>

      {/* ----------------- TAB 1: CREDIT REQUESTS ----------------- */}
      {activeTab === 'requests' && (
        <>
          {/* Stats KPI Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Solicitudes</span>
                  <FileText className="w-4 h-4 text-teal-600" />
                </div>
                <p className="text-2xl font-black text-slate-900">{stats.total_requests}</p>
                <span className="text-[10px] text-slate-500 font-medium">Registradas en plataforma</span>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-amber-600">
                  <span className="text-xs font-bold uppercase tracking-wider">Pendientes</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-2xl font-black text-amber-600">{stats.pending_count}</p>
                <span className="text-[10px] text-slate-500 font-medium">Requieren evaluación médica</span>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-teal-700">
                  <span className="text-xs font-bold uppercase tracking-wider">Aprobadas</span>
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                </div>
                <p className="text-2xl font-black text-teal-700">{stats.approved_count}</p>
                <span className="text-[10px] text-teal-700 font-bold">
                  ${parseFloat(stats.total_approved_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} financiados
                </span>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-rose-600">
                  <span className="text-xs font-bold uppercase tracking-wider">Clínicas / Doctores</span>
                  <Building2 className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-2xl font-black text-slate-900">{stats.active_clinics} / {stats.active_doctors}</p>
                <span className="text-[10px] text-slate-500 font-medium">Centros y especialistas</span>
              </div>
            </div>
          )}

          {/* Filter and Search Bar */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {[
                { id: 'ALL', label: 'Todas' },
                { id: 'PENDING', label: 'Pendientes' },
                { id: 'UNDER_REVIEW', label: 'En Revisión' },
                { id: 'APPROVED', label: 'Aprobadas' },
                { id: 'REJECTED', label: 'Rechazadas' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition shrink-0 ${
                    selectedStatus === tab.id
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por paciente, cédula, clínica..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600 transition"
              />
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {loadingRequests ? (
              <div className="p-12 text-center text-slate-500 font-medium text-sm">
                Cargando solicitudes de crédito...
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium text-sm">
                No se encontraron solicitudes que coincidan con la búsqueda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4"># ID</th>
                      <th className="py-3.5 px-4">Paciente</th>
                      <th className="py-3.5 px-4">Procedimiento</th>
                      <th className="py-3.5 px-4">Clínica & Doctor</th>
                      <th className="py-3.5 px-4 text-right">Monto Presupuesto</th>
                      <th className="py-3.5 px-4 text-center">Estatus</th>
                      <th className="py-3.5 px-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">#{req.id}</td>
                        <td className="py-4 px-4 font-semibold text-slate-900">
                          <div>{req.patient_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{req.patient_cedula}</div>
                        </td>
                        <td className="py-4 px-4 max-w-xs truncate font-medium text-slate-800">
                          <div>{req.procedure_name}</div>
                          <div className="text-[10px] text-teal-700 font-semibold">{req.specialty_name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-900">{req.clinic_name}</div>
                          <div className="text-[10px] text-slate-500">{req.doctor_name}</div>
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-slate-900 text-sm">
                          ${parseFloat(req.requested_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4 text-center">{renderStatusBadge(req.status)}</td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="inline-flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                          >
                            <span>Evaluar</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ----------------- TAB 2: PAYMENTS MANAGEMENT ----------------- */}
      {activeTab === 'payments' && (
        <>
          {/* Payment Status Filter Bar */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {[
                { id: 'ALL', label: 'Todas las Cuotas' },
                { id: 'PAGADO', label: 'Pagadas / Verificadas' },
                { id: 'PENDING', label: 'Pendientes' },
                { id: 'OVERDUE', label: 'En Mora ⚠️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPaymentStatusFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition shrink-0 ${
                    paymentStatusFilter === tab.id
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={paymentSearchTerm}
                onChange={(e) => setPaymentSearchTerm(e.target.value)}
                placeholder="Buscar por paciente, referencia, cédula..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600 transition"
              />
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {loadingPayments ? (
              <div className="p-12 text-center text-slate-500 font-medium text-sm">
                Cargando historial de pagos...
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium text-sm">
                No se encontraron cuotas que coincidan con la búsqueda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4"># Cuota</th>
                      <th className="py-3.5 px-4">Paciente</th>
                      <th className="py-3.5 px-4">Procedimiento & Clínica</th>
                      <th className="py-3.5 px-4">Vencimiento</th>
                      <th className="py-3.5 px-4 text-right">Monto Cuota</th>
                      <th className="py-3.5 px-4">Referencia / Método</th>
                      <th className="py-3.5 px-4 text-center">Estatus</th>
                      <th className="py-3.5 px-4 text-center">Acciones Verificación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          Cuota #{item.installment_number}
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-900">
                          <div>{item.patient_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{item.patient_cedula}</div>
                        </td>
                        <td className="py-4 px-4 max-w-xs truncate font-medium text-slate-800">
                          <div>{item.procedure_name}</div>
                          <div className="text-[10px] text-teal-700 font-semibold">{item.clinic_name}</div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-900">
                          📅 {item.due_date ? item.due_date.split('T')[0] : 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-slate-900 text-sm">
                          ${parseFloat(item.amount).toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          {item.reference_number ? (
                            <div>
                              <span className="font-mono font-bold text-slate-900 block">{item.reference_number}</span>
                              <span className="text-[10px] text-slate-500 font-semibold">{item.payment_method || 'Transferencia'}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Sin reporte</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">{renderPaymentStatusBadge(item.status)}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {item.status !== 'PAGADO' && (
                              <button
                                disabled={verifyingId === item.id}
                                onClick={() => handleVerifyPayment(item.id, 'PAGADO')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition shadow-sm"
                              >
                                Aprobar Pago
                              </button>
                            )}

                            {item.status !== 'OVERDUE' && (
                              <button
                                disabled={verifyingId === item.id}
                                onClick={() => handleVerifyPayment(item.id, 'OVERDUE')}
                                className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-rose-300 transition"
                              >
                                Marcar Mora
                              </button>
                            )}

                            {item.status === 'PAGADO' && (
                              <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verificado
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Detail & Evaluation Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleUpdateStatusInList}
        />
      )}
    </div>
  );
}
