import React, { useState, useContext } from 'react';
import { AgencyContext } from '../../../context/AgencyContext';
import { Building2 } from 'lucide-react';

const BusinessForm = () => {
  const { workers, addBusiness } = useContext(AgencyContext);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [workerId, setWorkerId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !industry || !workerId) return;

    addBusiness(name, industry, workerId);
    setName('');
    setIndustry('');
    setWorkerId('');
  };

  return (
    <div className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-black/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Building2 className="text-indigo-500" size={20} /> Registrar Nuevo Negocio
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1.5">Nombre de la Empresa</label>
          <input 
            type="text"
            placeholder="Ej. Tech Solutions"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm placeholder:text-slate-600"
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1.5">Sector o Industria</label>
          <input 
            type="text"
            placeholder="Ej. Software, Gastronomía"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm placeholder:text-slate-600"
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1.5">Trabajador Asignado</label>
          <select 
            value={workerId} 
            onChange={(e) => setWorkerId(e.target.value)}
            className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none cursor-pointer text-slate-200"
            required
          >
            <option value="">Seleccionar Trabajador...</option>
            {workers.map((worker) => (
              <option key={worker.id} value={worker.name}>
                {worker.name}
              </option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm mt-2 shadow-lg shadow-indigo-600/10 active:scale-[0.98]"
        >
          <Building2 size={16} /> Registrar Negocio
        </button>
      </form>
    </div>
  );
};

export default BusinessForm;