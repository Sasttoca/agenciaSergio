import React from 'react';
import { Building2, ClipboardList, CheckCircle } from 'lucide-react';

const MetricCards = ({ totalBusinesses, pendingTasks, completedTasks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800/80 flex items-center shadow-lg shadow-black/20">
        <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-xl mr-4">
          <Building2 size={24} />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium">Negocios Asignados</p>
          <p className="text-2xl font-bold text-white mt-1">{totalBusinesses}</p>
        </div>
      </div>

      <div className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800/80 flex items-center shadow-lg shadow-black/20">
        <div className="p-4 bg-amber-500/10 text-amber-400 rounded-xl mr-4">
          <ClipboardList size={24} />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium">Tareas Pendientes</p>
          <p className="text-2xl font-bold text-white mt-1">{pendingTasks}</p>
        </div>
      </div>

      <div className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800/80 flex items-center shadow-lg shadow-black/20">
        <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl mr-4">
          <CheckCircle size={24} />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium">Tareas Realizadas</p>
          <p className="text-2xl font-bold text-white mt-1">{completedTasks}</p>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;