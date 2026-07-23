import React, { useContext } from 'react';
import { AgencyContext } from '../../context/AgencyContext';
import MetricCards from './components/MetricCards';
import AdminInternalTasks from './components/AdminInternalTasks';
import WorkerWorkflow from './components/WorkerWorkflow';
import SuggestionsWidget from './components/SuggestionsWidget';

const DashboardOverview = () => {
  const { 
    currentUser, 
    getFilteredBusinesses, 
    getFilteredTasks, 
    expandedBusinesses, 
    toggleBusinessExpansion, 
    toggleTaskStatus 
  } = useContext(AgencyContext);

  const myBusinesses = getFilteredBusinesses();
  const myTasks = getFilteredTasks();

  const totalBusinesses = myBusinesses.length;
  const pendingTasks = myTasks.filter(t => t.status === 'Pendiente').length;
  const completedTasks = myTasks.filter(t => t.status === 'Realizada').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Encabezado Principal */}
      <div>
        <h2 className="text-3xl font-bold text-white">¡Hola de nuevo, {currentUser?.name}!</h2>
        <p className="text-slate-400 text-sm mt-1">Este es el estado operativo de tus proyectos para el día de hoy.</p>
      </div>

      {/* Tarjetas de Métricas */}
      <MetricCards 
        totalBusinesses={totalBusinesses}
        pendingTasks={pendingTasks}
        completedTasks={completedTasks}
      />

      {/* Grid de Contenido Condicional */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <WorkerWorkflow 
            businesses={myBusinesses}
            tasks={myTasks}
            expandedBusinesses={expandedBusinesses}
            onToggleExpand={toggleBusinessExpansion}
            onToggleTaskStatus={toggleTaskStatus}
          />
        </div>

        {currentUser?.role === 'admin' && (
          <div className="lg:col-span-1">
            <AdminInternalTasks 
              tasks={myTasks}
              onToggleStatus={toggleTaskStatus}
            />
          </div>
        )}
      </div>
      <div className="mt-6">
        <SuggestionsWidget />
      </div>
    </div>
  );
};

export default DashboardOverview;