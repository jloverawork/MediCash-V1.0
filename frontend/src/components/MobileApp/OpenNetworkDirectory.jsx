import React, { useState } from 'react';
import {
  Globe2,
  Stethoscope,
  Building2,
  Search,
  MapPin,
  Filter,
  Phone,
  Award,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  FlaskConical,
  Activity,
  FileSearch,
  Zap,
  ArrowLeft,
  Calendar,
  ExternalLink
} from 'lucide-react';

export default function OpenNetworkDirectory({ onReturnToHub, specialties = [], clinics = [] }) {
  const [activeCategory, setActiveCategory] = useState('specialists'); // 'specialists' | 'services'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState(null);

  // Mock specialists directory with full details for open network
  const mockSpecialists = [
    {
      id: 1,
      full_name: 'Dr. Roberto Mendoza',
      branch: 'Medicina Interna',
      subspecialty: 'Medicina Crítica e Intensiva',
      mpps: 'MPPS 45.892',
      city: 'Caracas',
      clinic: 'Clínica San Sofía',
      address: 'El Cafetal, Av. Principal',
      phone: '+58 412-5550192',
      experience: '16 años de experiencia',
      rating: '4.9 ★★★★★',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
      availability: 'Lunes a Viernes (8:00 AM - 4:00 PM)'
    },
    {
      id: 2,
      full_name: 'Dra. María Elena Rivas',
      branch: 'Neurocirugía',
      subspecialty: 'Cirugía de Columna y Base de Cráneo',
      mpps: 'MPPS 52.104',
      city: 'Caracas',
      clinic: 'Centro Médico Docente La Trinidad',
      address: 'La Trinidad, Av. Intercomunal',
      phone: '+58 414-9988112',
      experience: '14 años de experiencia',
      rating: '5.0 ★★★★★',
      avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78341?w=150',
      availability: 'Martes, Jueves y Sábados'
    },
    {
      id: 3,
      full_name: 'Dr. Carlos Eduardo Páez',
      branch: 'Traumatología',
      subspecialty: 'Ortopedia y Reemplazos Articulares',
      mpps: 'MPPS 39.420',
      city: 'Valencia',
      clinic: 'Policlínica Metropolitana Valencia',
      address: 'El Viñedo, Av. Bolivar Norte',
      phone: '+58 424-3344556',
      experience: '20 años de experiencia',
      rating: '4.8 ★★★★★',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
      availability: 'Lunes, Miércoles y Viernes'
    },
    {
      id: 4,
      full_name: 'Dra. Patricia Salazar',
      branch: 'Psicología',
      subspecialty: 'Psicología Clínica y Evaluación Neurocognitiva',
      mpps: 'FPV 12.450',
      city: 'Maracaibo',
      clinic: 'Centro de Especialidades Médicas Zulia',
      address: 'Bella Vista, Av. 4',
      phone: '+58 416-7788990',
      experience: '11 años de experiencia',
      rating: '4.9 ★★★★★',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
      availability: 'Consultas Presenciales y Online'
    }
  ];

  // Mock services directory for open network
  const mockDiagnosticServices = [
    {
      id: 201,
      name: 'Perfil 20 Completo',
      category: 'Laboratorio Clínico',
      center: 'Laboratorio Clínico BioSalud',
      city: 'Caracas',
      address: 'Chacao, Av. Francisco de Miranda',
      phone: '+58 212-9510011',
      coverage: 'Cobertura Nacional',
      price: '$45.00 USD',
      icon: FlaskConical
    },
    {
      id: 202,
      name: 'Eco Abdominal Doppler HD',
      category: 'Imagenología Avanzada',
      center: 'Centro de Imagenología Diagnostic MediCash',
      city: 'Caracas',
      address: 'Las Mercedes, Calle París',
      phone: '+58 212-9934455',
      coverage: 'Equipos 4D Alta Definición',
      price: '$70.00 USD',
      icon: Activity
    },
    {
      id: 203,
      name: 'Rayos X Digitales Torácicos y Columna',
      category: 'Radiología',
      center: 'Centro Radiológico Digital',
      city: 'Valencia',
      address: 'Naguanagua, Av. Universidad',
      phone: '+58 241-8866554',
      coverage: 'Entrega Digital Inmediata',
      price: '$50.00 USD',
      icon: FileSearch
    },
    {
      id: 204,
      name: 'Electromiografía de 4 Extremidades',
      category: 'Neurofisiología',
      center: 'Instituto Neurofisiológico de Venezuela',
      city: 'Caracas',
      address: 'San Bernardino, Av. Juan Germán Roscio',
      phone: '+58 212-5743322',
      coverage: 'Informe Médico Neurológico Especializado',
      price: '$120.00 USD',
      icon: Zap
    }
  ];

  const filteredSpecialists = mockSpecialists.filter((doc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doc.full_name.toLowerCase().includes(q) ||
      doc.branch.toLowerCase().includes(q) ||
      doc.subspecialty.toLowerCase().includes(q) ||
      doc.clinic.toLowerCase().includes(q);

    const matchesBranch = selectedBranch === 'all' || doc.branch === selectedBranch;
    const matchesCity = selectedCity === 'all' || doc.city === selectedCity;

    return matchesSearch && matchesBranch && matchesCity;
  });

  const filteredServices = mockDiagnosticServices.filter((srv) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      srv.name.toLowerCase().includes(q) ||
      srv.category.toLowerCase().includes(q) ||
      srv.center.toLowerCase().includes(q);

    const matchesCity = selectedCity === 'all' || srv.city === selectedCity;

    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Bar with Return Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReturnToHub}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 hover:bg-teal-100 transition shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Hub Principal</span>
        </button>

        <span className="text-[10px] font-extrabold bg-slate-900 text-teal-400 px-2.5 py-1 rounded-full border border-slate-800">
          Red Abierta MediCash
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-1 shadow-md">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-teal-400" />
          <h2 className="text-base font-black tracking-tight">Directorio Informativo Médico</h2>
        </div>
        <p className="text-xs text-slate-300 font-medium">
          Consulta especialistas afiliados por rama médica, ubicación y centros diagnósticos disponibles.
        </p>
      </div>

      {/* Category Tabs: Category 1 (Specialists) vs Category 2 (Services) */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl border border-slate-300">
        <button
          onClick={() => {
            setActiveCategory('specialists');
            setSelectedDoctorProfile(null);
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
            activeCategory === 'specialists'
              ? 'bg-white text-slate-900 shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4 text-teal-600" />
          <span>Categoría 1: Especialistas</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('services');
            setSelectedDoctorProfile(null);
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
            activeCategory === 'services'
              ? 'bg-white text-slate-900 shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span>Categoría 2: Servicios Diagnósticos</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeCategory === 'specialists'
                ? 'Buscar por médico, especialidad o clínica...'
                : 'Buscar por examen, laboratorio o ciudad...'
            }
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:outline-none focus:border-teal-600 transition shadow-sm"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex gap-2">
          {activeCategory === 'specialists' && (
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-2.5 text-[11px] font-bold text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="all">Todas las Especialidades</option>
              <option value="Medicina Interna">Medicina Interna</option>
              <option value="Neurocirugía">Neurocirugía</option>
              <option value="Traumatología">Traumatología</option>
              <option value="Psicología">Psicología</option>
            </select>
          )}

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-2.5 text-[11px] font-bold text-slate-700 focus:outline-none focus:border-teal-600"
          >
            <option value="all">Todas las Ciudades</option>
            <option value="Caracas">Caracas</option>
            <option value="Valencia">Valencia</option>
            <option value="Maracaibo">Maracaibo</option>
          </select>
        </div>
      </div>

      {/* CATEGORY 1: SPECIALISTS LIST */}
      {activeCategory === 'specialists' && (
        <div className="space-y-3">
          {filteredSpecialists.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 font-medium">
              No se encontraron especialistas con los criterios seleccionados.
            </div>
          ) : (
            filteredSpecialists.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm hover:border-teal-400 transition"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={doc.avatar}
                    alt={doc.full_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-600 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-900 truncate">{doc.full_name}</h3>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {doc.rating}
                      </span>
                    </div>

                    <p className="text-xs text-teal-700 font-extrabold mt-0.5">{doc.branch}</p>
                    <p className="text-[11px] text-slate-600 font-medium truncate">{doc.subspecialty}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {doc.mpps}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {doc.experience}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600 font-medium">
                  <p className="flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="font-bold text-slate-900">{doc.clinic}</span> ({doc.city})
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {doc.address}
                  </p>
                  <p className="flex items-center gap-1.5 text-teal-800 font-bold">
                    <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    {doc.phone}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CATEGORY 2: DIAGNOSTIC SERVICES LIST */}
      {activeCategory === 'services' && (
        <div className="space-y-3">
          {filteredServices.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 font-medium">
              No se encontraron servicios diagnósticos disponibles para los filtros.
            </div>
          ) : (
            filteredServices.map((srv) => {
              const IconComp = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm hover:border-emerald-400 transition"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200 shrink-0">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-black text-slate-900 truncate">{srv.name}</h3>
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                          {srv.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-bold mt-1">{srv.center}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {srv.city} - {srv.address}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {srv.coverage}
                        </span>
                        <span className="text-xs font-black text-emerald-700">{srv.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
