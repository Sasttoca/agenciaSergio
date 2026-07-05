import React from 'react';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';

const AdminInternalTasks = ({ tasks, onToggleStatus }) => {
  const adminTasks = tasks.filter(t => t.businessId === 'admin');

  return (
    <div className="bg-[#0B132B] rounded-2xl border border-slate-800/80 p-6 shadow-lg shadow-black/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>📋</span> Tareas Internas de Administración
      </h3>
      
      {adminTasks.length === 0 ? (
        <p className="text-slate-500 text-sm py-2">No hay tareas internas asignadas hoy.</p>
      ) : (
        <div className="space-y-3">
          {adminTasks.map(task => (
            <div 
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between ${
                task.status === 'Realizada'
                  ? 'bg-[#060814]/40 border-slate-800/50 opacity-60'
                  : 'bg-[#060814] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 mr-4">
                <button 
                  onClick={() => onToggleStatus(task.id)}
                  className={`mt-0.5 transition-colors ${
                    task.status === 'Realizada' ? 'text-emerald-400' : 'text-slate-500 hover:text-indigo-400'
                  }`}
                >
                  {task.status === 'Realizada' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <div>
                  <h4 className={`text-sm font-semibold text-white ${task.status === 'Realizada' ? 'line-through text-slate-500' : ''}`}>
                    {task.title}
                  </h4>
                  {task.notes && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.notes}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 bg-[#0B132B] px-2 py-1 rounded-md border border-slate-800/60 whitespace-nowrap">
                <Calendar size={12} />
                <span>{task.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInternalTasks;