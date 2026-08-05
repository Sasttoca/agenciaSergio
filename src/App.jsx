import React, { useState, useContext } from 'react';
import { AgencyContext } from './context/AgencyContext';
import LoginView from './features/auth/components/LoginView';
import MainLayout from './layouts/components/MainLayout';
import DashboardOverview from './features/dashboard/DashboardOverview';
import BusinessGrid from './features/businesses/components/BusinessGrid';
import CalendarView from './features/tasks/CalendarView';
import AdminView from './features/admin/components/AdminView';
import ClientView from './features/client/ClientView';
import UsersView from './features/users/UsersView';

function App() {
  const { currentUser, getFilteredBusinesses } = useContext(AgencyContext);
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Si No Hay Usuario Autenticado, Mostramos La Vista De Login Directamente
  if (!currentUser) {
    return <LoginView />;
  }

  // Redirección Directa Al Portal Del Cliente Según Su Rol
  if (currentUser.role === 'client') {
    return <ClientView />;
  }
  
  // Renderizado Condicional De Las Pestañas Internas De La Aplicación
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardOverview />;
      case 'Empresas':
        return <BusinessGrid businesses={getFilteredBusinesses()} />;
      case 'Tareas':
        return <CalendarView />;
      case 'Usuarios':
        return <UsersView />; // <-- Renderizado Del Módulo De Usuarios
      case 'Administracion':
        return <AdminView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
}

export default App;