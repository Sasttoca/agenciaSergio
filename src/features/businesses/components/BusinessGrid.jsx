import React from 'react';
import { Briefcase, User } from 'lucide-react';

const BusinessGrid = ({ businesses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.length === 0 ? (
        <p className="text-slate-500 text-sm bg-[#0B132B] p-6 rounded-2xl border border-slate-800 text-center col-span-full">
          No hay negocios registrados en este momento.
        </p>
      ) : (
        businesses.map(business => (
          <div 
            key={business.id}
            className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-black/20 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-4">
                <Briefcase size={24} />
              </div>
              <h4 className="text-xl font-bold text-white">{business.name}</h4>
              <p className="text-sm text-slate-400 mt-1">Sector: <span className="text-slate-300 font-medium">{business.industry}</span></p>
            </div>
            
            <div className="border-t border-slate-800/60 mt-6 pt-4 flex items-center gap-2 text-sm text-slate-400">
              <User size={16} className="text-indigo-400" />
              <span>Encargado: <strong className="text-slate-200 font-semibold">{business.workerId}</strong></span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BusinessGrid;