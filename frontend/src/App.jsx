import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import MobileContainer from './components/MobileApp/MobileContainer';
import AdminDashboard from './components/AdminWeb/AdminDashboard';
import { Smartphone, LayoutDashboard, Stethoscope, Sparkles } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'admin'

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-teal-600 selection:text-white">
        {/* View Mode Switcher Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-600 text-white font-extrabold shadow-md">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-slate-900 tracking-tight">MediCash</span>
                  <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                    Crédito Quirúrgico & Neurocirugía
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Financiamiento médico en cuotas para Venezuela (Pacientes + Administración)
                </p>
              </div>
            </div>

            {/* Switcher Buttons */}
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
                  viewMode === 'mobile'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Vista App Móvil (Paciente)</span>
              </button>

              <button
                onClick={() => setViewMode('admin')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
                  viewMode === 'admin'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Vista Web (Administración)</span>
              </button>
            </div>
          </div>
        </header>

        {/* View Body */}
        <main className="flex-1 p-4">
          {viewMode === 'mobile' ? (
            <div className="py-2">
              <MobileContainer />
            </div>
          ) : (
            <AdminDashboard />
          )}
        </main>
      </div>
    </AuthProvider>
  );
}
