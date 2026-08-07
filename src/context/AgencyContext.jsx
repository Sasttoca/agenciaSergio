import React, { createContext, useState, useEffect } from 'react';
import { businessService } from '../services/businessService';
import { taskService } from '../services/taskService';
import { suggestionService } from '../services/suggestionService';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

export const AgencyContext = createContext();

export const AgencyProvider = ({ children }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedBusinesses, setExpandedBusinesses] = useState({});
  const [businesses, setBusinesses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [users, setUsers] = useState([]);

  // Calculamos Dinámicamente El Día De Hoy En Formato YYYY-MM-DD (Hora Local)
  const getTodayFormatted = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getTodayFormatted();

  // 1. Carga De Datos Asíncrona Desde Firestore
  useEffect(() => {
    const fetchData = async () => {
      const loadedBusinesses = await businessService.loadBusinesses();
      const loadedTasks = await taskService.loadTasks();
      const loadedSuggestions = await suggestionService.loadSuggestions();
      const loadedWorkers = await authService.getWorkers();
      const loadedUsers = await userService.getUsers();
      
      // Limpiamos las tareas con más de 15 días en Firestore
      const deletedIds = await taskService.cleanOldTasks(loadedTasks);
      const activeTasks = loadedTasks.filter(t => !deletedIds.includes(t.id));

      setBusinesses(loadedBusinesses);
      setTasks(activeTasks);
      setSuggestions(loadedSuggestions);
      setWorkers(loadedWorkers);
      setUsers(loadedUsers);
    };
    fetchData();
  }, []);

  // 1.1. Autenticación Asíncrona Desde Firestore Con Control Estricto De Suspensión
  const login = async (user, pass) => {
    try {
      const result = await authService.login(user, pass);

      if (result && result.success) {
        // Si El Usuario Es Un Cliente Y No Tiene Un BusinessId Explícito En Su Documento De Firestore, Le Asociamos El Primero
        if (result.user.role === 'client' && !result.user.businessId) {
          const firstBusinessId = businesses[0]?.id || 'client-business-id';
          result.user.businessId = firstBusinessId;
        }
        setCurrentUser(result.user);
      } else {
        // Reseteamos Sesión Si La Autenticación Falla O La Cuenta Está Suspendida
        setCurrentUser(null);
      }
      return result;
    } catch (error) {
      console.error("Error al procesar login en el contexto:", error);
      setCurrentUser(null);
      return { success: false, message: 'Error al procesar el inicio de sesión.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Filtros Reactivos Basados En El Estado En Memoria
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

  // 2. Modificar Estado De Tarea En La Nube
  const toggleTaskStatus = async (taskId) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;
    
    const newStatus = taskToUpdate.status === 'Pendiente' ? 'Realizada' : 'Pendiente';
    
    await taskService.updateTask(taskId, { status: newStatus });
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  // 3. Agregar Negocio Totalmente Vacío En Firestore
  const addBusiness = async (name, industry, workerId) => {
    const newBusiness = await businessService.addBusiness({ name, industry, workerId });
    setBusinesses(prev => [...prev, newBusiness]);
  };

  // 3.1. Eliminar Negocio Y Sus Tareas Asociadas (Eliminación En Cascada)
  const deleteBusiness = async (businessId) => {
    try {
      const tasksToDelete = tasks.filter(t => t.businessId === businessId);

      const deletePromises = tasksToDelete.map(t => taskService.deleteTask(t.id));
      await Promise.all(deletePromises);

      await businessService.deleteBusiness(businessId);

      setBusinesses(prev => prev.filter(b => b.id !== businessId));
      setTasks(prev => prev.filter(t => t.businessId !== businessId));
    } catch (error) {
      console.error("Error Al Procesar La Eliminación En Cascada: ", error);
    }
  };

  // 4. Crear Tarea Manual En Firestore
  const addTask = async (title, businessId, dueDate, notes) => {
    const newTask = await taskService.addTask({ title, businessId, dueDate, notes, status: 'Pendiente' });
    setTasks(prev => [...prev, newTask]);
  };

  // 5. Editar Tarea En Firestore
  const editTask = async (taskId, updatedTitle, updatedNotes) => {
    await taskService.updateTask(taskId, { title: updatedTitle, notes: updatedNotes });
    setTasks(tasks.map(t => t.id === taskId ? { ...t, title: updatedTitle, notes: updatedNotes } : t));
  };

  // 6. Eliminar Tarea En Firestore
  const deleteTask = async (taskId) => {
    await taskService.deleteTask(taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  // 7. Función Para Agregar Una Sugerencia
  const addSuggestion = async (text) => {
    if (!currentUser || currentUser.role !== 'client') return;
    const newSugg = await suggestionService.addSuggestion({
      businessId: currentUser.businessId,
      author: currentUser.name,
      text
    });
    setSuggestions(prev => [newSugg, ...prev]);
  };

  // 8. Función Para Reiniciar El Histórico De Sugerencias
  const clearSuggestions = async () => {
    await suggestionService.clearSuggestions(suggestions);
    setSuggestions([]);
  };

  // 9. Registrar Nuevo Usuario En Firestore
  const addUser = async (userData) => {
    const newUser = await userService.createUser(userData);
    setUsers(prev => [...prev, newUser]);
    if (newUser.role === 'worker') {
      setWorkers(prev => [...prev, newUser]);
    }
  };

  // 10. Editar Credenciales O Rol De Usuario En Firestore
  const updateUser = async (userId, updatedFields) => {
    await userService.updateUser(userId, updatedFields);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
    if (updatedFields.name || updatedFields.role) {
      setWorkers(prev => prev.map(w => w.id === userId ? { ...w, ...updatedFields } : w));
    }
  };

  // 11. Alternar Estado De Suspensión De Usuario En Firestore
  const toggleSuspendUser = async (userId, currentStatus) => {
    const newStatus = await userService.toggleSuspendUser(userId, currentStatus);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: newStatus } : u));

    // Si El Usuario Que Fue Suspendido Es El Misma Que Tiene La Sesión Iniciada, Se Le Cierra Sesión De Inmediato
    if (currentUser && currentUser.id === userId && newStatus) {
      setCurrentUser(null);
    }
  };

  // 12. Eliminar Usuario En Firestore
  const deleteUser = async (userId) => {
    await userService.deleteUser(userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    setWorkers(prev => prev.filter(w => w.id !== userId));
  };

  return (
    <AgencyContext.Provider value={{
      currentUser,
      expandedBusinesses,
      today,
      businesses,
      tasks,
      suggestions,
      workers,
      users,
      login,
      logout,
      getFilteredBusinesses,
      getFilteredTasks,
      toggleBusinessExpansion,
      toggleTaskStatus,
      addBusiness,
      deleteBusiness,
      addSuggestion,
      clearSuggestions,
      addTask,
      deleteTask,
      editTask,
      addUser,
      updateUser,
      toggleSuspendUser,
      deleteUser
    }}>
      {children}
    </AgencyContext.Provider>
  );
};