import React from 'react';

const OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'Pendiente', label: 'Pendientes' },
  { value: 'Realizada', label: 'Realizadas' }
];

const TaskStatusFilter = ({ value, onChange }) => (
  <div className="flex items-center gap-1 bg-[#060814] border border-slate-800 rounded-xl p-1 w-full lg:w-auto">
    {OPTIONS.map(opt => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          value === opt.value
            ? 'bg-indigo-600 text-white shadow'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export default TaskStatusFilter;