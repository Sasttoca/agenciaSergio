import React from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

const CalendarHeader = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  viewMode,
  setViewMode,
  filterBusiness,
  setFilterBusiness,
  businesses,
  isAdmin
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
      {/* Bloque Superior: Título + Navegador de Mes/Año */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-start gap-3 w-full lg:w-auto">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CalendarDays className="text-indigo-500 shrink-0" size={22} />
          <span>Calendario</span>
        </h2>

        {/* Controles de Navegación de Fecha */}
        <div className="flex items-center justify-between sm:justify-start gap-2 bg-[#060814] rounded-xl p-1.5 border border-slate-800 shadow-sm w-full sm:w-auto">
          <button 
            type="button"
            onClick={onPrevMonth} 
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Mes anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs sm:text-sm font-semibold px-2 text-slate-200 capitalize flex-1 sm:flex-none sm:min-w-[130px] text-center select-none truncate">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            type="button"
            onClick={onNextMonth} 
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Mes siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Bloque Inferior: Filtros de Vista y Negocios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2.5 w-full lg:w-auto">
        <select 
          className="w-full lg:w-auto bg-[#060814] px-3 py-2 rounded-xl text-xs sm:text-sm text-slate-200 border border-slate-800 focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer" 
          value={viewMode} 
          onChange={(e) => setViewMode(e.target.value)}
        >
          <option value="monthly">Vista Mensual</option>
          <option value="weekly">Vista Semanal</option>
        </select>

        <select 
          className="w-full lg:w-auto bg-[#060814] px-3 py-2 rounded-xl text-xs sm:text-sm text-slate-200 border border-slate-800 focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer max-w-full lg:max-w-[220px] truncate" 
          value={filterBusiness} 
          onChange={(e) => setFilterBusiness(e.target.value)}
        >
          <option value="all">{isAdmin ? 'Todos los negocios + Admin' : 'Todos los negocios'}</option>
          {isAdmin && <option value="admin">Solo Admin (Interno)</option>}
          {businesses.map(b => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CalendarHeader;