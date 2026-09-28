import React from 'react';
import { User, CreditCard, Mail, Phone, ShieldCheck, LogOut } from 'lucide-react';

export default function PatientProfileView({ user, onLogout }) {
  const handleLogoutClick = () => {
    if (window.confirm('¿Estás seguro de que deseas salir de tu cuenta?')) {
      onLogout();
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Main Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm space-y-4">
        <div className="w-20 h-20 rounded-full bg-teal-50 border-2 border-teal-500 flex items-center justify-center text-teal-600 shadow-inner">
          <User className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">{user?.full_name || 'Paciente'}</h2>
          <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mt-1">
            PACIENTE VERIFICADO
          </span>
        </div>

        {/* Info Rows Group */}
        <div className="w-full pt-4 border-t border-slate-100 space-y-3.5 text-left">
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block">Cédula de Identidad</span>
              <span className="text-sm font-extrabold text-slate-900">{user?.cedula || 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block">Correo Electrónico</span>
              <span className="text-sm font-extrabold text-slate-900">{user?.email || 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block">Teléfono Móvil</span>
              <span className="text-sm font-extrabold text-slate-900">{user?.phone || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-white border border-teal-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <ShieldCheck className="w-7 h-7 text-teal-600 shrink-0" />
        <div>
          <h4 className="text-xs font-black text-slate-900">Encriptación de Grado Médico</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
            Tus datos médicos y de crédito están resguardados bajo estándares HIPAA y cifrado SSL.
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={handleLogoutClick}
        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition"
      >
        <LogOut className="w-5 h-5" />
        <span>Cerrar Sesión de la App</span>
      </button>
    </div>
  );
}
