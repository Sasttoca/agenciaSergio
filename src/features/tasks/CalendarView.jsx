import React, { useState, useContext } from 'react';
import { AgencyContext } from '../../context/AgencyContext';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';

const CalendarView = () => {
  const { 
    currentUser, 
    tasks, 
    businesses, 
    toggleTaskStatus, 
    today 
  } = useContext(AgencyContext);

  // Usamos new Date() para obtener automáticamente la fecha real actual
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [viewMode, setViewMode] = useState('monthly');
  const [filterBusiness, setFilterBusiness] = useState('all');

  const isAdmin = currentUser?.role === 'admin';

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'monthly') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setDate(prev.getDate() - 7);
      }
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'monthly') {
        newDate.setMonth(prev.getMonth() + 1);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  const getFilteredTasks = () => {
    // 1. Si el usuario es Cliente, filtramos estrictamente por su businessId
    if (currentUser?.role === 'client') {
      return tasks.filter(t => t.businessId === currentUser.businessId);
    }

    // 2. Lógica para Admin y Worker
    let userTasks = tasks;
    if (!isAdmin) {
      const myBusinessIds = businesses.filter(b => b.workerId === currentUser?.name).map(b => b.id);
      userTasks = tasks.filter(t => myBusinessIds.includes(t.businessId));
    }

    if (filterBusiness === 'all') {
      return userTasks;
    }
    return userTasks.filter(t => t.businessId === filterBusiness);
  };

  const visibleTasks = getFilteredTasks();
  const myBusinesses = isAdmin ? businesses : businesses.filter(b => b.workerId === currentUser?.name);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-[#0B132B] rounded-2xl border border-slate-800/80 p-6 shadow-lg shadow-black/20">
        <CalendarHeader 
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterBusiness={filterBusiness}
          setFilterBusiness={setFilterBusiness}
          businesses={myBusinesses}
          isAdmin={isAdmin}
        />
        
        <div className="mt-4">
          <CalendarGrid 
            currentDate={currentDate}
            viewMode={viewMode}
            tasks={visibleTasks}
            today={today}
            onToggleStatus={toggleTaskStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;