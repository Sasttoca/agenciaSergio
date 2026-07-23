import React, { useContext } from 'react';
import { AgencyContext } from '../../context/AgencyContext';
import CalendarView from '../tasks/CalendarView';
import SuggestionBox from './SuggestionBox';
import { Building2, Tag, UserCheck, LogOut } from 'lucide-react';

const ClientView = () => {
  const { currentUser, businesses, logout } = useContext(AgencyContext);

  // Buscar la información específica del negocio del cliente
  const business = businesses.find(b => b.id === currentUser?.businessId);

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col">
      {/* Header exclusivo para Cliente */}
      <header className="h-16 bg-[#0B132B] border-b border-slate-800/80 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-indigo-600/20">
            A
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide leading-none">AgencySergio</h1>
            <span className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">Portal de Cliente</span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="flex items-center gap-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 transition-all"
        >
          <LogOut size={14} />
          <span>Cerrar Sesión</span>
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Card Informativa de la Empresa del Cliente */}
        <div className="bg-[#0B132B] border border-slate-800/80 rounded-2xl p-6 flex flex-wrap gap-6 items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Tu Empresa</span>
            <h1 className="text-2xl font-black text-white flex items-center gap-2.5 mt-1">
              <Building2 className="text-indigo-500" size={26} />
              {business?.name || 'Mi Empresa'}
            </h1>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2.5 bg-[#060814] px-4 py-2.5 rounded-xl border border-slate-800">
              <Tag size={16} className="text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Sector / Industria</p>
                <p className="text-xs font-semibold text-slate-200">{business?.industry || 'Sin especificar'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-[#060814] px-4 py-2.5 rounded-xl border border-slate-800">
              <UserCheck size={16} className="text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Gestor Asignado</p>
                <p className="text-xs font-semibold text-slate-200">{business?.workerId || 'Agencia'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rejilla: Calendario Filtrado + Caja de Comentarios */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarView />
          </div>
          <div className="lg:col-span-1">
            <SuggestionBox />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientView;