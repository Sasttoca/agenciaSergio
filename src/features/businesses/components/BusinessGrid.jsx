import React, { useState, useContext } from 'react';
import { Briefcase, User, Trash2, AlertTriangle } from 'lucide-react';
import { AgencyContext } from '../../../context/AgencyContext';

const BusinessGrid = ({ businesses: propBusinesses }) => {
  // 1. Consumimos deleteBusiness y la función para obtener los negocios filtrados por rol
  const { deleteBusiness, getFilteredBusinesses } = useContext(AgencyContext);
  
  // Estado para controlar qué negocio se quiere eliminar y abrir el modal
  const [businessToDelete, setBusinessToDelete] = useState(null);

  // 2. Lógica inteligente: Si el padre le pasa negocios, usa esos; si no, los trae directo del contexto en tiempo real
  const businesses = propBusinesses || getFilteredBusinesses();

  const handleDeleteClick = (business) => {
    setBusinessToDelete(business);
  };

  const handleConfirmDelete = async () => {
    if (businessToDelete) {
      await deleteBusiness(businessToDelete.id);
      setBusinessToDelete(null); // Cierra el modal automáticamente
    }
  };

  return (
    <>
      {/* Contenedor con padding para separar de los bordes */}
      <div className="p-6 md:p-8 w-full">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.length === 0 ? (
            <p className="text-slate-500 text-sm bg-[#0B132B] p-6 rounded-2xl border border-slate-800 text-center col-span-full">
              No hay negocios registrados en este momento.
            </p>
          ) : (
            businesses.map(business => (
              <div 
                key={business.id}
                className="relative bg-[#0B132B] p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-black/20 flex flex-col justify-between hover:border-slate-700 transition-colors group"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-4">
                      <Briefcase size={24} />
                    </div>

                    {/* Botón de eliminar con papelera */}
                    <button 
                      onClick={() => handleDeleteClick(business)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 cursor-pointer"
                      title="Eliminar negocio"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <h4 className="text-xl font-bold text-white">{business.name}</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Sector: <span className="text-slate-300 font-medium">{business.industry}</span>
                  </p>
                </div>
                
                <div className="border-t border-slate-800/60 mt-6 pt-4 flex items-center gap-2 text-sm text-slate-400">
                  <User size={16} className="text-indigo-400" />
                  <span>
                    Encargado: <strong className="text-slate-200 font-semibold">{business.workerId}</strong>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* MODAL DE CONFIRMACIÓN PERSONALIZADO */}
      {businessToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-black/80 space-y-5 transform scale-100 transition-transform">
            
            {/* Encabezado de Advertencia */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl">
                <AlertTriangle size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">Confirmar acción</h3>
            </div>

            {/* Contenido / Pregunta */}
            <div className="space-y-2">
              <p className="text-slate-300 text-sm leading-relaxed">
                ¿Desea eliminar a <strong className="text-white font-semibold">"{businessToDelete.name}"</strong> de la lista de negocios clientes?
              </p>
              <p className="text-xs text-red-400/90 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                ⚠️ Al eliminar este negocio se borrarán de forma definitiva todas sus tareas asociadas tanto en el sistema como en la base de datos de Firebase.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setBusinessToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/15 transition-colors cursor-pointer"
              >
                Eliminar Cliente
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default BusinessGrid;