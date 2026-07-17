import React, { useState } from 'react';
import { Plus, Calendar, FileText } from 'lucide-react';
//metodo para crear una nueva tarea mediante un formulario 
const TaskForm = ({ businesses, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [businessId, setBusinessId] = useState('admin');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    onAddTask(title, businessId, dueDate, notes);
    
    // Limpiamos todos los campos tras el registro exitoso
    setTitle('');
    setDueDate(''); 
    setNotes('');
  };

  return (
    <div className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-black/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FileText className="text-indigo-500" size={20} /> Asignar Nueva Tarea
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1.5">Título de la Tarea</label>
          <input 
            type="text"
            placeholder="Ej. Redacción de copies mensuales"
            className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm placeholder:text-slate-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1.5">¿A quien asignara la tarea?</label>
          <select 
            className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none cursor-pointer text-slate-200"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
          >
            <option value="admin">Administración Interna (Solo Admin)</option>
            {businesses.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.workerId})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1.5">día que se realizara la tarea</label>
          <div className="relative">
            <input 
              type="date"
              className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm cursor-pointer text-slate-200 scheme-dark" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1.5">Notas o Descripción (Opcional)</label>
          <textarea 
            placeholder="Detalles adicionales sobre los entregables..."
            rows="3"
            className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm placeholder:text-slate-600 resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm mt-2 shadow-lg shadow-indigo-600/10">
          <Plus size={16} /> Crear Tarea
        </button>
      </form>
    </div>
  );
};

export default TaskForm;