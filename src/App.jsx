import React, { useState, useContext } from 'react';
import { AgencyContext } from './context/AgencyContext';
import LoginView from './features/auth/components/LoginView';
import MainLayout from './layouts/components/MainLayout';
import DashboardOverview from './features/dashboard/DashboardOverview';
import BusinessGrid from './features/businesses/components/BusinessGrid';
import CalendarView from './features/tasks/CalendarView';
import AdminView from './features/admin/components/AdminView';

function App() {
  const { currentUser, getFilteredBusinesses } = useContext(AgencyContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Si no hay usuario autenticado, mostramos la vista de Login directamente
  if (!currentUser) {
    return <LoginView />;
  }

  // Renderizado condicional de las pestañas internas de la aplicación
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'businesses':
        return <BusinessGrid businesses={getFilteredBusinesses()} />;
      case 'tasks':
        return <CalendarView />;
      case 'admin':
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