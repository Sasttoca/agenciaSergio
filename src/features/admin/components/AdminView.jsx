import React, { useContext } from 'react';
import { AgencyContext } from '../../../context/AgencyContext';
import BusinessForm from './BusinessForm';
import TaskForm from './TaskForm';

const AdminView = () => {
  const { 
    currentUser, 
    businesses, 
    addBusiness, 
    addTask 
  } = useContext(AgencyContext);

  // Control de seguridad por si intentan forzar la vista desde la consola
  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-950/20 border border-red-900/40 p-6 rounded-2xl text-center">
          <p className="text-red-400 font-semibold text-sm">Acceso denegado. No tienes permisos de administrador para ver esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Encabezado del Módulo */}
      <div>
        <h2 className="text-3xl font-bold text-white">Panel de Administración</h2>
        <p className="text-slate-400 text-sm mt-1">Configura nuevas cuentas de empresas aliadas y delega responsabilidades operativas.</p>
      </div>

      {/* Grid de Formularios Operativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <BusinessForm onAddBusiness={addBusiness} />
        <TaskForm businesses={businesses} onAddTask={addTask} />
      </div>
    </div>
  );
};

export default AdminView;