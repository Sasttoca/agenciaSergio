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
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-4">
         <h2 className="text-xl font-bold text-white flex items-center gap-2">
           <CalendarDays className="text-indigo-500" /> Calendario
         </h2>
         <div className="flex items-center gap-2 bg-[#060814] rounded-lg p-1 border border-slate-800 shadow-sm">
            <button onClick={onPrevMonth} className="p-1 hover:bg-slate-800 rounded text-slate-300 transition-colors">
              <ChevronLeft size={18}/>
            </button>
            <span className="text-sm font-semibold px-2 text-slate-200 capitalize min-w-[120px] text-center">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={onNextMonth} className="p-1 hover:bg-slate-800 rounded text-slate-300 transition-colors">
              <ChevronRight size={18}/>
            </button>
         </div>
      </div>

      <div className="flex gap-2">
        <select 
          className="bg-[#060814] p-2 rounded-lg text-sm text-slate-300 border border-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer" 
          value={viewMode} 
          onChange={(e) => setViewMode(e.target.value)}
        >
            <option value="monthly">Vista Mensual</option>
            <option value="weekly">Vista Semanal</option>
        </select>

        <select 
          className="bg-[#060814] p-2 rounded-lg text-sm text-slate-300 border border-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer max-w-[200px] truncate" 
          value={filterBusiness} 
          onChange={(e) => setFilterBusiness(e.target.value)}
        >
          <option value="all">{isAdmin ? 'Todos los negocios + Admin' : 'Todos los negocios'}</option>
          {isAdmin && <option value="admin">Solo Admin (Interno)</option>}
          {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
    </div>
  );
};

export default CalendarHeader;