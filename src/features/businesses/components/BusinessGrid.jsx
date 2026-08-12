import React, { useState, useContext } from 'react';
import { Briefcase, User, Trash2, AlertTriangle, Pencil, X, Check, Users } from 'lucide-react';
import { AgencyContext } from '../../../context/AgencyContext';

const BusinessGrid = ({ businesses: propBusinesses }) => {
  // Consumimos el contexto con las funciones de eliminación, edición, lista de usuarios/workers y el usuario actual
  const { deleteBusiness, updateBusiness, getFilteredBusinesses, workers, users, currentUser } = useContext(AgencyContext);
  
  // Validamos si el usuario actual tiene el rol de administrador
  const isAdmin = currentUser?.role === 'admin';

  // Estado para controlar qué negocio se quiere eliminar
  const [businessToDelete, setBusinessToDelete] = useState(null);

  // Estado para controlar qué negocio se está editando y los datos de su formulario
  const [businessToEdit, setBusinessToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    industry: '',
    selectedWorkers: []
  });

  // Lógica de obtención de negocios (prop o contexto)
  const businesses = propBusinesses || getFilteredBusinesses();

  // Lista de gestores disponibles (workers o admin)
  const availableWorkers = (users || workers || []).filter(u => u.role === 'worker' || u.role === 'admin');

  // --- LOGICA DE ELIMINACIÓN ---
  const handleDeleteClick = (business) => {
    setBusinessToDelete(business);
  };

  const handleConfirmDelete = async () => {
    if (businessToDelete) {
      await deleteBusiness(businessToDelete.id);
      setBusinessToDelete(null);
    }
  };

  // --- LÓGICA DE EDICIÓN ---
  const handleEditClick = (business) => {
    setBusinessToEdit(business);

    // Mapeo inicial de encargados actuales (soporta formato antiguo en string o formato nuevo en array)
    let initialSelected = [];
    if (Array.isArray(business.workerIds) && business.workerIds.length > 0) {
      initialSelected = business.workerIds;
    } else if (business.workerId) {
      const match = availableWorkers.find(w => w.name === business.workerId || w.id === business.workerId);
      if (match) initialSelected = [match.name];
      else initialSelected = [business.workerId];
    }

    setEditFormData({
      name: business.name || '',
      industry: business.industry || '',
      selectedWorkers: initialSelected
    });
  };

  const handleToggleWorker = (workerName) => {
    setEditFormData(prev => {
      const exists = prev.selectedWorkers.includes(workerName);
      return {
        ...prev,
        selectedWorkers: exists
          ? prev.selectedWorkers.filter(w => w !== workerName)
          : [...prev.selectedWorkers, workerName]
      };
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!businessToEdit) return;

    // Primer encargado como fallback de compatibilidad para vistas legadas
    const primaryWorker = editFormData.selectedWorkers[0] || 'Sin asignar';

    await updateBusiness(businessToEdit.id, {
      name: editFormData.name,
      industry: editFormData.industry,
      workerId: primaryWorker,
      workerIds: editFormData.selectedWorkers
    });

    setBusinessToEdit(null);
  };

  // Función auxiliar para renderizar el texto de encargados en la tarjeta
  const renderAssignedWorkers = (business) => {
    if (Array.isArray(business.workerIds) && business.workerIds.length > 0) {
      return business.workerIds.join(', ');
    }
    return business.workerId || 'Sin asignar';
  };

  return (
    <>
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

                    {/* Acciones de Edición y Eliminación EXCLUSIVAS del Administrador */}
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEditClick(business)}
                          className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all duration-200 cursor-pointer"
                          title="Editar negocio"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(business)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 cursor-pointer"
                          title="Eliminar negocio"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h4 className="text-xl font-bold text-white">{business.name}</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Sector: <span className="text-slate-300 font-medium">{business.industry}</span>
                  </p>
                </div>
                
                <div className="border-t border-slate-800/60 mt-6 pt-4 flex items-center gap-2 text-sm text-slate-400">
                  <User size={16} className="text-indigo-400 shrink-0" />
                  <span className="truncate">
                    Encargado(s): <strong className="text-slate-200 font-semibold">{renderAssignedWorkers(business)}</strong>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL DE EDICIÓN DE NEGOCIO (Solo Administrador) */}
      {businessToEdit && isAdmin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Pencil size={18} />
                </div>
                <h3 className="text-lg font-bold text-white">Editar Negocio</h3>
              </div>
              <button 
                onClick={() => setBusinessToEdit(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Sector o Industria
                </label>
                <input
                  type="text"
                  value={editFormData.industry}
                  onChange={(e) => setEditFormData({ ...editFormData, industry: e.target.value })}
                  className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
                  <span>Community Managers Encargados</span>
                  <span className="text-[10px] text-indigo-400 font-normal">Selección múltiple</span>
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {availableWorkers.map((worker) => {
                    const isSelected = editFormData.selectedWorkers.includes(worker.name);
                    return (
                      <div
                        key={worker.id || worker.name}
                        onClick={() => handleToggleWorker(worker.name)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-[#060814] border-slate-800/80 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Users size={14} className={isSelected ? 'text-indigo-400' : 'text-slate-500'} />
                          <span className="text-xs font-medium">{worker.name}</span>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-indigo-600 border-indigo-500' : 'border-slate-700'
                        }`}>
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setBusinessToEdit(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-colors cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN (Solo Administrador) */}
      {businessToDelete && isAdmin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-black/80 space-y-5">
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl">
                <AlertTriangle size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">Confirmar acción</h3>
            </div>

            <div className="space-y-2">
              <p className="text-slate-300 text-sm leading-relaxed">
                ¿Desea eliminar a <strong className="text-white font-semibold">"{businessToDelete.name}"</strong> de la lista de negocios clientes?
              </p>
              <p className="text-xs text-red-400/90 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                ⚠️ Al eliminar este negocio se borrarán de forma definitiva todas sus tareas asociadas tanto en el sistema como en la base de datos de Firebase.
              </p>
            </div>

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