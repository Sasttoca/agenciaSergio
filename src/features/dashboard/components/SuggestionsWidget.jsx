import React, { useContext } from 'react';
import { AgencyContext } from '../../../context/AgencyContext';
import { MessageSquare, RotateCcw, Building2, Calendar } from 'lucide-react';

const SuggestionsWidget = () => {
  const { currentUser, suggestions, businesses, clearSuggestions } = useContext(AgencyContext);

  const isAdmin = currentUser?.role === 'admin';

  // Permisos: Admin ve todo el historial; Worker solo sugerencias de sus empresas asignadas
  const visibleSuggestions = suggestions.filter(s => {
    if (isAdmin) return true;
    const myBusinessIds = businesses
      .filter(b => b.workerId === currentUser?.name)
      .map(b => b.id);
    return myBusinessIds.includes(s.businessId);
  });

  const getBusinessName = (businessId) => {
    const found = businesses.find(b => b.id === businessId);
    return found ? found.name : 'Empresa';
  };

  return (
    <div className="bg-[#0B132B] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
      {/* Encabezado del Widget */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-indigo-400" size={20} />
          <h3 className="text-base font-bold text-white">Buzón de Sugerencias</h3>
          <span className="bg-indigo-600/20 text-indigo-400 text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">
            {visibleSuggestions.length}
          </span>
        </div>

        {/* Lógica de reinicio / gestión del histórico (Solo Admin) */}
        {isAdmin && visibleSuggestions.length > 0 && (
          <button
            onClick={clearSuggestions}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded-xl font-medium"
            title="Reiniciar el histórico de sugerencias acumuladas"
          >
            <RotateCcw size={14} />
            <span>Reiniciar Histórico</span>
          </button>
        )}
      </div>

      {/* Lista de Sugerencias */}
      {visibleSuggestions.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-800/80 rounded-xl">
          <p className="text-xs text-slate-500 italic">No hay sugerencias o comentarios pendientes.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
          {visibleSuggestions.map(item => (
            <div key={item.id} className="bg-[#060814] border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs border-b border-slate-800/50 pb-2">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Building2 size={14} />
                  {getBusinessName(item.businessId)}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{item.text}</p>
              <div className="text-[10px] text-slate-500 text-right font-medium">
                Cliente: <span className="text-slate-400">{item.author}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionsWidget;