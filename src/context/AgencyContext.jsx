import React, { createContext, useState } from 'react';

export const AgencyContext = createContext();

const taskTemplates = [
  'Planificación de contenido', 'Revisión de métricas', 'Interacción con comunidad', 
  'Creación de gráficos', 'Redacción de copies', 'Reporte semanal'
];

const generateTasksForBusiness = (businessId) => {
  return taskTemplates.map((title, index) => {
    const uniqueId = Math.random().toString(36).substring(2, 7);
    return {
      id: `${businessId}-${index}-${uniqueId}`,
      title: title,
      businessId: businessId,
      status: 'Pendiente',
      dueDate: `2026-06-0${(index % 6) + 1}`, // Sincronizado para que caiga en la primera semana de junio de 2026
      notes: 'Tarea predeterminada del sistema.'
    };
  });
};

const initialBusinesses = [
  { id: '1', name: 'Tech Solutions', industry: 'Software', workerId: 'Ana Developer' },
  { id: '2', name: 'Green Cafe', industry: 'Gastronomía', workerId: 'Carlos Media' }
];

const initialTasks = [
  ...generateTasksForBusiness('1'),
  ...generateTasksForBusiness('2'),
  { id: 'admin-1', title: 'Reunión de equipo', businessId: 'admin', status: 'Pendiente', dueDate: '2026-06-28', notes: 'Revisión trimestral.' },
  { id: 'admin-2', title: 'Análisis de rendimiento', businessId: 'admin', status: 'Pendiente', dueDate: '2026-06-28', notes: 'Revisar métricas de trabajadores.' }
];

export const AgencyProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedBusinesses, setExpandedBusinesses] = useState({});
  const today = "2026-06-28"; // Sincronizado con la fecha real del sistema

  // Estados cargados en memoria (volátiles: se borran al recargar F5)
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [tasks, setTasks] = useState(initialTasks);

  // Mapeado a 'login' para compatibilidad con LoginView
  const login = (user, pass) => {
    if (pass === '123') {
      const lowerUser = user.toLowerCase();
      if (lowerUser === 'admin') { setCurrentUser({ name: 'Sergio Admin', role: 'admin' }); return { success: true }; }
      else if (lowerUser === 'ana') { setCurrentUser({ name: 'Ana Developer', role: 'worker' }); return { success: true }; }
      else if (lowerUser === 'carlos') { setCurrentUser({ name: 'Carlos Media', role: 'worker' }); return { success: true }; }
      else return { success: false, message: 'Usuario no encontrado' };
    } else {
      return { success: false, message: 'Contraseña incorrectas' };
    }
  };

  // Mapeado a 'logout' para compatibilidad con MainLayout
  const logout = () => {
    setCurrentUser(null);
  };

  const getFilteredBusinesses = () => {
    if (!currentUser) return [];
    return currentUser.role === 'admin' 
      ? businesses 
      : businesses.filter(b => b.workerId === currentUser.name);
  };

  const getFilteredTasks = () => {
    if (!currentUser) return [];
    return currentUser.role === 'admin' 
      ? tasks 
      : tasks.filter(t => getFilteredBusinesses().map(b => b.id).includes(t.businessId));
  };

  const toggleBusinessExpansion = (businessId) => {
    setExpandedBusinesses(prev => ({ ...prev, [businessId]: prev[businessId] === false }));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: t.status === 'Pendiente' ? 'Realizada' : 'Pendiente' } : t));
  };

  const addBusiness = (name, industry, workerId) => {
    const businessId = Date.now().toString();
    const newBusiness = { id: businessId, name, industry, workerId };
    const newTasks = generateTasksForBusiness(businessId);
    
    setBusinesses([...businesses, newBusiness]);
    setTasks([...tasks, ...newTasks]);
  };

  const addTask = (title, businessId, dueDate, notes) => {
    const newTask = { id: Date.now().toString(), title, businessId, status: 'Pendiente', dueDate, notes };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const editTask = (taskId, updatedTitle, updatedNotes) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, title: updatedTitle, notes: updatedNotes } : t));
  };

  return (
    <AgencyContext.Provider value={{
      currentUser,
      expandedBusinesses,
      today,
      businesses,
      tasks,
      login,
      logout,
      getFilteredBusinesses,
      getFilteredTasks,
      toggleBusinessExpansion,
      toggleTaskStatus,
      addBusiness,
      addTask,
      deleteTask,
      editTask
    }}>
      {children}
    </AgencyContext.Provider>
  );
};