import React, { useState, useContext } from 'react';
import { AgencyContext } from '../../context/AgencyContext';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import { X, CheckCircle, Clock } from 'lucide-react';

const CalendarView = () => {
  const { 
    currentUser, 
    tasks, 
    businesses, 
    toggleTaskStatus, 
    today 
  } = useContext(AgencyContext);

  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [viewMode, setViewMode] = useState('monthly');
  const [filterBusiness, setFilterBusiness] = useState('all');
  
  // Estado para controlar la ventana emergente del día seleccionado
  const [selectedDayData, setSelectedDayData] = useState(null);

  const isAdmin = currentUser?.role === 'admin';
  const isClient = currentUser?.role === 'client';

  // Navegación hacia el mes/semana anterior
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'monthly') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setDate(prev.getDate() - 7);
      }
      return newDate;
    });
  };

  // Navegación hacia el mes/semana siguiente
  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'monthly') {
        newDate.setMonth(prev.getMonth() + 1);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  // Filtro de tareas según el rol y el negocio seleccionado
  const getFilteredTasks = () => {
    if (currentUser?.role === 'client') {
      return tasks.filter(t => t.businessId === currentUser.businessId);
    }

    let userTasks = tasks;
    if (!isAdmin) {
      const myBusinessIds = businesses.filter(b => b.workerId === currentUser?.name).map(b => b.id);
      userTasks = tasks.filter(t => myBusinessIds.includes(t.businessId));
    }

    if (filterBusiness === 'all') {
      return userTasks;
    }
    return userTasks.filter(t => t.businessId === filterBusiness);
  };

  const visibleTasks = getFilteredTasks();
  const myBusinesses = isAdmin ? businesses : businesses.filter(b => b.workerId === currentUser?.name);

  // Callback para guardar el día seleccionado cuando se hace clic en una casilla
  const handleSelectDayTasks = (dateStr, dayTasks) => {
    setSelectedDayData({ dateStr, dayTasks });
  };

  // Mantiene las tareas del modal sincronizadas en tiempo real con el contexto global
  const currentSelectedTasks = selectedDayData 
    ? visibleTasks.filter(t => t.dueDate === selectedDayData.dateStr) 
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-[#0B132B] rounded-2xl border border-slate-800/80 p-6 shadow-lg shadow-black/20">
        <CalendarHeader 
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterBusiness={filterBusiness}
          setFilterBusiness={setFilterBusiness}
          businesses={myBusinesses}
          isAdmin={isAdmin}
        />
        
        <div className="mt-4">
          <CalendarGrid 
            currentDate={currentDate}
            viewMode={viewMode}
            tasks={visibleTasks}
            today={today}
            onToggleStatus={toggleTaskStatus}
            onSelectDayTasks={handleSelectDayTasks}
          />
        </div>
      </div>

      {/* VENTANA EMERGENTE / MODAL RESPONSIVO */}
      {selectedDayData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[85vh] flex flex-col">
            
            {/* Cabecera del Modal */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Tareas del Día
                </h3>
                <p className="text-xs text-indigo-400 font-semibold mt-0.5 capitalize">
                  {new Date(selectedDayData.dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <button 
                onClick={() => setSelectedDayData(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Listado de Tareas del Día */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {currentSelectedTasks.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">No hay tareas para este día.</p>
              ) : (
                currentSelectedTasks.map(task => {
                  const isCompleted = task.status === 'Realizada';
                  return (
                    <div
                      key={task.id}
                      // Solo permite marcar/desmarcar si NO es cliente
                      onClick={() => !isClient && toggleTaskStatus(task.id)}
                      className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                        !isClient 
                          ? 'cursor-pointer select-none active:scale-[0.99] hover:border-slate-700' 
                          : 'cursor-default'
                      } ${
                        isCompleted 
                          ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400/80' 
                          : 'bg-[#060814] border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle className="text-emerald-400" size={18} />
                        ) : (
                          <Clock className="text-amber-400" size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className={`font-semibold text-sm break-words ${isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                            {task.title}
                          </p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 shrink-0 ${
                            isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        {task.notes && (
                          <p className="text-xs text-slate-400 mt-1 italic break-words">
                            {task.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pie del Modal */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
              <button
                onClick={() => setSelectedDayData(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;