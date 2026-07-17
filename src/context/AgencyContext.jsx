import React, { createContext, useState, useEffect } from 'react';
import { businessService } from '../services/businessService';
import { taskService } from '../services/taskService';

export const AgencyContext = createContext();

const taskTemplates = [
  'Planificación de contenido', 'Revisión de métricas', 'Interacción con comunidad', 
  'Creación de gráficos', 'Redacción de copies', 'Reporte semanal'
];

export const AgencyProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedBusinesses, setExpandedBusinesses] = useState({});
  const today = "2026-06-28";

  // Inicializamos los estados vacíos sin ningún dato quemado por defecto
  const [businesses, setBusinesses] = useState([]);
  const [tasks, setTasks] = useState([]);

  // 1. CARGA DE DATOS ASÍNCRONA DESDE FIRESTORE
  useEffect(() => {
    const fetchData = async () => {
      const loadedBusinesses = await businessService.loadBusinesses();
      const loadedTasks = await taskService.loadTasks();
      setBusinesses(loadedBusinesses);
      setTasks(loadedTasks);
    };
    fetchData();
  }, []);

  // Autenticación mockeada en memoria
  const login = (user, pass) => {
    if (pass === '123') {
      const lowerUser = user.toLowerCase();
      if (lowerUser === 'admin') { setCurrentUser({ name: 'Sergio Admin', role: 'admin' }); return { success: true }; }
      else if (lowerUser === 'ana') { setCurrentUser({ name: 'Ana Developer', role: 'worker' }); return { success: true }; }
      else if (lowerUser === 'carlos') { setCurrentUser({ name: 'Carlos Media', role: 'worker' }); return { success: true }; }
      else return { success: false, message: 'Usuario no encontrado' };
    } else {
      return { success: false, message: 'Contraseña incorrecta' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Filtros reactivos basados en el estado en memoria
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

  // 2. MODIFICAR ESTADO DE TAREA EN LA NUBE
  const toggleTaskStatus = async (taskId) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;
    
    const newStatus = taskToUpdate.status === 'Pendiente' ? 'Realizada' : 'Pendiente';
    
    await taskService.updateTask(taskId, { status: newStatus });
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  // 3. AGREGAR NEGOCIO TOTALMENTE VACÍO EN FIRESTORE
  const addBusiness = async (name, industry, workerId) => {
    // Registramos únicamente la empresa y obtenemos el ID real generado por Firebase
    const newBusiness = await businessService.addBusiness({ name, industry, workerId });
    setBusinesses(prev => [...prev, newBusiness]);
  };


  // 4. CREAR TAREA MANUAL EN FIRESTORE
  const addTask = async (title, businessId, dueDate, notes) => {
    const newTask = await taskService.addTask({ title, businessId, dueDate, notes, status: 'Pendiente' });
    setTasks(prev => [...prev, newTask]);
  };

  // 5. EDITAR TAREA EN FIRESTORE
  const editTask = async (taskId, updatedTitle, updatedNotes) => {
    await taskService.updateTask(taskId, { title: updatedTitle, notes: updatedNotes });
    setTasks(tasks.map(t => t.id === taskId ? { ...t, title: updatedTitle, notes: updatedNotes } : t));
  };

  // 6. ELIMINAR TAREA EN FIRESTORE
  const deleteTask = async (taskId) => {
    await taskService.deleteTask(taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
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