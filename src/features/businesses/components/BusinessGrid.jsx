import React, { useState, useContext } from 'react';
import { Briefcase, User, Trash2, AlertTriangle, Pencil, X, Check, Users, Calendar, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import { AgencyContext } from '../../../context/AgencyContext';

const BusinessGrid = ({ businesses: propBusinesses }) => {
  const { 
    deleteBusiness, 
    updateBusiness, 
    renewBusinessSubscription,
    getSubscriptionStatus,
    getFilteredBusinesses, 
    workers, 
    users, 
    currentUser 
  } = useContext(AgencyContext);
  
  const isAdmin = currentUser?.role === 'admin';

  // Estados para modales de confirmación y edición
  const [businessToDelete, setBusinessToDelete] = useState(null);
  const [businessToRenew, setBusinessToRenew] = useState(null);
  const [renewingId, setRenewingId] = useState(null);

  const [businessToEdit, setBusinessToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    industry: '',
    selectedWorkers: [],
    paidUntil: ''
  });

  const businesses = propBusinesses || getFilteredBusinesses();
  const availableWorkers = (users || workers || []).filter(u => u.role === 'worker' || u.role === 'admin');

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleDeleteClick = (business) => {
    setBusinessToDelete(business);
  };

  const handleConfirmDelete = async () => {
    if (businessToDelete) {
      await deleteBusiness(businessToDelete.id);
      setBusinessToDelete(null);
    }
  };

  // --- LÓGICA DE RENOVACIÓN DE SUSCRIPCIÓN CON CONFIRMACIÓN ---
  const handleRenewClick = (business) => {
    setBusinessToRenew(business);
  };

  const handleConfirmRenew = async () => {
    if (!businessToRenew) return;
    const businessId = businessToRenew.id;
    setRenewingId(businessId);
    await renewBusinessSubscription(businessId);
    setRenewingId(null);
    setBusinessToRenew(null);
  };

  // --- LÓGICA DE EDICIÓN ---
  const handleEditClick = (business) => {
    setBusinessToEdit(business);

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
      selectedWorkers: initialSelected,
      paidUntil: business.paidUntil || ''
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

    const primaryWorker = editFormData.selectedWorkers[0] || 'Sin asignar';

    await updateBusiness(businessToEdit.id, {
      name: editFormData.name,
      industry: editFormData.industry,
      workerId: primaryWorker,
      workerIds: editFormData.selectedWorkers,
      paidUntil: editFormData.paidUntil
    });

    setBusinessToEdit(null);
  };

  const renderAssignedWorkers = (business) => {
    if (Array.isArray(business.workerIds) && business.workerIds.length > 0) {
      return business.workerIds.join(', ');
    }
    return business.workerId || 'Sin asignar';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No definida';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
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
            businesses.map(business => {
              const sub = getSubscriptionStatus(business);

              return (
                <div 
                  key={business.id}
                  className="relative bg-[#0B132B] p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-black/20 flex flex-col justify-between hover:border-slate-700 transition-colors group"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-4">
                        <Briefcase size={24} />
                      </div>

                      {/* Acciones EXCLUSIVAS del Administrador */}
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleRenewClick(business)}
                            disabled={renewingId === business.id}
                            className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-200 cursor-pointer"
                            title="Registrar pago (+1 Quincena)"
                          >
                            <CreditCard size={18} className={renewingId === business.id ? 'animate-pulse text-emerald-400' : ''} />
                          </button>
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

                    {/* Badge Informativo de Suscripción Quincenal */}
                    <div className="mt-4 p-3 bg-[#060814] rounded-xl border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Calendar size={13} className="text-indigo-400" />
                          Próximo Corte:
                        </span>
                        <span className="text-slate-200 font-medium">{formatDate(sub.nextBillingDate)}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50">
                        <span className="text-slate-400">Estado:</span>
                        {sub.status === 'active' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 size={11} />
                            Al día ({sub.daysRemaining} {sub.daysRemaining === 1 ? 'día' : 'días'})
                          </span>
                        )}
                        {sub.status === 'grace_period' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Clock size={11} />
                            En gracia ({Math.abs(sub.daysRemaining)}d vencido)
                          </span>
                        )}
                        {sub.status === 'suspended' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            <AlertTriangle size={11} />
                            Suspendido
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-800/60 mt-6 pt-4 flex items-center gap-2 text-sm text-slate-400">
                    <User size={16} className="text-indigo-400 shrink-0" />
                    <span className="truncate">
                      Encargado(s): <strong className="text-slate-200 font-semibold">{renderAssignedWorkers(business)}</strong>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE REGISTRO DE PAGO / RENOVACIÓN */}
      {businessToRenew && isAdmin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <CreditCard size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">Confirmar Registro de Pago</h3>
            </div>

            <div className="space-y-2">
              <p className="text-slate-300 text-sm leading-relaxed">
                ¿Deseas registrar el pago recibido y renovar la suscripción de <strong className="text-white font-semibold">"{businessToRenew.name}"</strong> por una quincena más?
              </p>
              <div className="text-xs text-slate-400 bg-[#060814] border border-slate-800 p-3 rounded-xl space-y-1">
                <p>• La vigencia se extenderá automáticamente al siguiente corte (día 15 o fin de mes).</p>
                <p>• El portal del cliente se mantendrá activo y al día.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBusinessToRenew(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRenew}
                disabled={renewingId === businessToRenew.id}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Check size={16} />
                <span>Confirmar Pago</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN DE NEGOCIO */}
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
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Fecha Límite / Próximo Corte Quincenal
                </label>
                <input
                  type="date"
                  value={editFormData.paidUntil}
                  onChange={(e) => setEditFormData({ ...editFormData, paidUntil: e.target.value })}
                  style={{ colorScheme: 'dark' }}
                  className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm cursor-pointer"
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

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
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