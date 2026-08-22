// features/dashboard/components/WorkerWorkflow.jsx
import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Calendar, CheckCircle2, Circle, Search, 
  Building2, X, Pencil, Trash2, AlertTriangle, Edit3 
} from 'lucide-react';

const WorkerWorkflow = ({ 
  businesses, 
  tasks, 
  expandedBusinesses, 
  onToggleExpand, 
  onToggleTaskStatus,
  currentUser,
  onUpdateTask,
  onDeleteTask
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para Edición de Tarea
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  // Estado para Confirmación de Borrado
  const [taskToDelete, setTaskToDelete] = useState(null);

  const isAdmin = currentUser?.role === 'admin';

  // Filtrado de negocios por nombre o sector
  const filteredBusinesses = businesses.filter(business => {
    const term = searchTerm.toLowerCase();
    return business.name?.toLowerCase().includes(term) || business.industry?.toLowerCase().includes(term);
  });

  // Manejadores de Edición
  const handleOpenEdit = (task) => {
    setTaskToEdit(task);
    setEditTitle(task.title || '');
    setEditNotes(task.notes || '');
    setEditDueDate(task.dueDate || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!taskToEdit || !onUpdateTask) return;

    await onUpdateTask(taskToEdit.id, {
      title: editTitle,
      notes: editNotes,
      dueDate: editDueDate
    });

    setTaskToEdit(null);
  };

  // Manejador de Borrado
  const handleConfirmDelete = async () => {
    if (taskToDelete && onDeleteTask) {
      await onDeleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Encabezado y Filtro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          Flujo de Trabajo por Negocios
        </h3>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#060814] border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {businesses.length === 0 ? (
        <p className="text-slate-500 text-sm bg-[#0B132B] p-6 rounded-2xl border border-slate-800 text-center">
          No tienes negocios asignados actualmente.
        </p>
      ) : filteredBusinesses.length === 0 ? (
        <div className="bg-[#0B132B] p-8 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
          <Building2 size={24} className="mx-auto mb-2 text-slate-600" />
          No se encontraron empresas que coincidan con "<span className="text-white">{searchTerm}</span>".
        </div>
      ) : (
        filteredBusinesses.map(business => {
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
              {/* Acordeón Header */}
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

              {/* Lista de Tareas */}
              {isExpanded && (
                <div className="border-t border-slate-800/60 p-4 bg-[#060814]/30 space-y-2">
                  {businessTasks.length === 0 ? (
                    <p className="text-xs text-slate-500 py-2 pl-2">Este negocio no tiene tareas programadas.</p>
                  ) : (
                    businessTasks.map(task => (
                      <div 
                        key={task.id}
                        className={`p-3 rounded-xl border transition-all flex items-start justify-between group/task ${
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

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-slate-500 bg-[#0B132B] px-2 py-0.5 rounded border border-slate-800/60 whitespace-nowrap">
                            <Calendar size={11} />
                            <span>{task.dueDate}</span>
                          </div>

                          {/* Botones Exclusivos para Administrador */}
                          {isAdmin && (
                            <div className="flex items-center gap-1 ml-1 opacity-80 group-hover/task:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleOpenEdit(task)}
                                className="p-1 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                title="Editar tarea"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setTaskToDelete(task)}
                                className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                title="Eliminar tarea"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
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

      {/* MODAL EDICIÓN DE TAREA */}
      {taskToEdit && isAdmin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Edit3 className="text-indigo-500" size={18} /> Editar Tarea
            </h4>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">Título de la Tarea</label>
                <input 
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">Detalles / Indicaciones (Opcional)</label>
                <textarea 
                  rows="3"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">Fecha de Entrega</label>
                <input 
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setTaskToEdit(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold transition-colors text-sm shadow-lg shadow-indigo-600/20"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓN DE BORRADO DE TAREA */}
      {taskToDelete && isAdmin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>

            <h4 className="text-lg font-bold text-white mb-2">¿Eliminar esta tarea?</h4>

            <p className="text-xs text-slate-400 mb-6">
              Esta acción eliminará de forma permanente la tarea <span className="text-white font-medium">"{taskToDelete.title}"</span>.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setTaskToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors text-sm shadow-lg shadow-rose-600/20"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerWorkflow;