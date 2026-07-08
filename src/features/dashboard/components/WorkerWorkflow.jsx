import React from 'react';
import { ChevronDown, ChevronUp, Calendar, CheckCircle2, Circle } from 'lucide-react';

const WorkerWorkflow = ({ businesses, tasks, expandedBusinesses, onToggleExpand, onToggleTaskStatus }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
         Flujo de Trabajo por Negocios
      </h3>

      {businesses.length === 0 ? (
        <p className="text-slate-500 text-sm bg-[#0B132B] p-6 rounded-2xl border border-slate-800 text-center">
          No tienes negocios asignados actualmente.
        </p>
      ) : (
        businesses.map(business => {
          const businessTasks = tasks.filter(t => t.businessId === business.id);
          const isExpanded = expandedBusinesses[business.id] !== false;

          const totalTasks = businessTasks.length;
          const completedTasks = businessTasks.filter(t => t.status === 'Realizada').length;
          const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <div 
              key={business.id} 
              className="bg-[#0B132B] rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg shadow-black/20"
            >
              {/* Encabezado del Acordeón */}
              <div 
                onClick={() => onToggleExpand(business.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#111A36] transition-colors select-none"
              >
                <div>
                  <h4 className="text-base font-bold text-white">{business.name}</h4>
                  <p className="text-xs text-indigo-400 font-medium mt-0.5">{business.industry}</p>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="text-xs bg-[#060814] border border-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-medium">
                    {businessTasks.filter(t => t.status === 'Pendiente').length} pendientes
                  </span>
                  <span className="text-xs bg-[#060814] border border-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-medium">
                    {percentage}% completado
                  </span>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Lista de Tareas Desplegable */}
              {isExpanded && (
                <div className="border-t border-slate-800/60 p-4 bg-[#060814]/30 space-y-2">
                  {businessTasks.length === 0 ? (
                    <p className="text-xs text-slate-500 py-2 pl-2">Este negocio no tiene tareas programadas.</p>
                  ) : (
                    businessTasks.map(task => (
                      <div 
                        key={task.id}
                        className={`p-3 rounded-xl border transition-all flex items-start justify-between ${
                          task.status === 'Realizada'
                            ? 'bg-[#060814]/20 border-slate-900 opacity-50'
                            : 'bg-[#060814] border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 mr-4">
                          <button 
                            onClick={() => onToggleTaskStatus(task.id)}
                            className={`mt-0.5 transition-colors ${
                              task.status === 'Realizada' ? 'text-emerald-400' : 'text-slate-500 hover:text-indigo-400'
                            }`}
                          >
                            {task.status === 'Realizada' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          </button>
                          <div>
                            <p className={`text-sm font-medium text-white ${task.status === 'Realizada' ? 'line-through text-slate-500' : ''}`}>
                              {task.title}
                            </p>
                            {task.notes && (
                              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{task.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 bg-[#0B132B] px-2 py-0.5 rounded border border-slate-800/60 whitespace-nowrap">
                          <Calendar size={11} />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default WorkerWorkflow;