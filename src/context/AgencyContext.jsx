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

  // LÓGICA DE SUSCRIPCIONES Y COBROS QUINCENALES

  // Calcula la siguiente fecha de corte a partir de una fecha base
  const calculateNextBillingDate = (fromDate = new Date()) => {
    const base = new Date(fromDate);
    const year = base.getFullYear();
    const month = base.getMonth();
    const day = base.getDate();

    if (day < 15) {
      // Siguiente corte: Día 15 del mes actual
      return `${year}-${(month + 1).toString().padStart(2, '0')}-15`;
    } else {
      // Siguiente corte: Último día del mes actual (28, 29, 30 o 31)
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      if (day < lastDayOfMonth) {
        return `${year}-${(month + 1).toString().padStart(2, '0')}-${lastDayOfMonth.toString().padStart(2, '0')}`;
      } else {
        // Si ya pasó o es el fin de mes, el siguiente corte es el 15 del siguiente mes
        const nextMonth = new Date(year, month + 1, 15);
        const nextYear = nextMonth.getFullYear();
        const nextM = (nextMonth.getMonth() + 1).toString().padStart(2, '0');
        return `${nextYear}-${nextM}-15`;
      }
    }
  };

  // Obtiene el estado de suscripción detallado de un negocio
  const getSubscriptionStatus = (business) => {
    if (!business) return { status: 'active', daysRemaining: 0, nextBillingDate: today };

    // Si el negocio no tiene fecha registrada, asignamos el siguiente corte por defecto
    const targetDateStr = business.paidUntil || business.nextBillingDate || calculateNextBillingDate();
    
    const todayDate = new Date(`${today}T00:00:00`);
    const billingDate = new Date(`${targetDateStr}T00:00:00`);
    
    // Diferencia en días
    const diffTime = billingDate - todayDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0) {
      return {
        status: 'active', // Al día
        daysRemaining: diffDays,
        nextBillingDate: targetDateStr,
        isGracePeriod: false
      };
    } else if (diffDays >= -2) {
      return {
        status: 'grace_period', // En periodo de gracia (2 días de tolerancia)
        daysRemaining: diffDays,
        nextBillingDate: targetDateStr,
        isGracePeriod: true
      };
    } else {
      return {
        status: 'suspended', // Suspendido por falta de pago
        daysRemaining: diffDays,
        nextBillingDate: targetDateStr,
        isGracePeriod: false
      };
    }
  };

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

      // Garantizamos que 'workers' contenga estrictamente usuarios con rol 'worker'
      const onlyWorkers = loadedWorkers.filter(w => w.role === 'worker');

      setBusinesses(loadedBusinesses);
      setTasks(activeTasks);
      setSuggestions(loadedSuggestions);
      setWorkers(onlyWorkers);
      setUsers(loadedUsers);
    };
    fetchData();
  }, []);

  // 1.1. Autenticación Asíncrona Desde Firestore Con Control Estricto De Suspensión
  const login = async (user, pass) => {
    try {
      const result = await authService.login(user, pass);

      if (result && result.success) {
        if (result.user.role === 'client' && !result.user.businessId) {
          const firstBusinessId = businesses[0]?.id || 'client-business-id';
          result.user.businessId = firstBusinessId;
        }
        setCurrentUser(result.user);
      } else {
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

  // Filtros Reactivos Basados En El Estado En Memoria (Soporta Múltiples Encargados)
  const getFilteredBusinesses = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return businesses;
    
    return businesses.filter(b => {
      const isDirectWorker = b.workerId === currentUser.name;
      const isInWorkerIds = Array.isArray(b.workerIds) && (
        b.workerIds.includes(currentUser.id) || b.workerIds.includes(currentUser.name)
      );
      return isDirectWorker || isInWorkerIds;
    });
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

  // 3. Agregar Negocio En Firestore (Inicializa con la fecha del siguiente corte)
  const addBusiness = async (name, industry, workerId, workerIds = [], initialPaidUntil = null) => {
    const paidUntil = initialPaidUntil || calculateNextBillingDate();
    const newBusiness = await businessService.addBusiness({ 
      name, 
      industry, 
      workerId, 
      workerIds, 
      paidUntil
    });
    setBusinesses(prev => [...prev, newBusiness]);
  };

  // 3.1. Editar Negocio En Firestore
  const updateBusiness = async (businessId, updatedFields) => {
    try {
      if (businessService.updateBusiness) {
        await businessService.updateBusiness(businessId, updatedFields);
      }
      setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, ...updatedFields } : b));
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar el negocio en el contexto:", error);
      return { success: false, message: error.message };
    }
  };

  // 3.2. Renovar Suscripción / Registrar Pago de Negocio (+1 Quincena)
  const renewBusinessSubscription = async (businessId) => {
    try {
      const business = businesses.find(b => b.id === businessId);
      if (!business) return { success: false, message: 'Negocio no encontrado.' };

      let nextPaidUntil = '';

      if (business.paidUntil) {
        // Leemos directamente año, mes y día de la cadena YYYY-MM-DD para evitar desfases de zona horaria
        const [yearStr, monthStr, dayStr] = business.paidUntil.split('-');
        let year = parseInt(yearStr, 10);
        let month = parseInt(monthStr, 10) - 1; // 0 indexado en JS
        const day = parseInt(dayStr, 10);

        if (day <= 15) {
          // El corte previo era día 15 -> Pasa al último día del MISMO mes
          const lastDay = new Date(year, month + 1, 0).getDate();
          nextPaidUntil = `${year}-${(month + 1).toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
        } else {
          // El corte previo era fin de mes -> Pasa al día 15 del SIGUIENTE mes
          const nextMonthDate = new Date(year, month + 1, 15);
          const nYear = nextMonthDate.getFullYear();
          const nMonth = (nextMonthDate.getMonth() + 1).toString().padStart(2, '0');
          nextPaidUntil = `${nYear}-${nMonth}-15`;
        }
      } else {
        // Si no tenía fecha previa asignada, parte del siguiente corte general
        nextPaidUntil = calculateNextBillingDate();
      }

      await updateBusiness(businessId, { paidUntil: nextPaidUntil });
      return { success: true, nextPaidUntil };
    } catch (error) {
      console.error("Error al renovar suscripción:", error);
      return { success: false, message: error.message };
    }
  };

  // 3.3. Eliminar Negocio Y Sus Tareas Asociadas (Eliminación En Cascada)
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

    // Sincronización reactiva del estado 'workers' según el rol actualizado
    setWorkers(prev => {
      const userExists = prev.some(w => w.id === userId);
      const updatedUser = { ...prev.find(w => w.id === userId), ...updatedFields };

      if (updatedFields.role) {
        if (updatedFields.role === 'worker') {
          return userExists ? prev.map(w => w.id === userId ? updatedUser : w) : [...prev, updatedUser];
        } else {
          return prev.filter(w => w.id !== userId);
        }
      }

      return prev.map(w => w.id === userId ? { ...w, ...updatedFields } : w);
    });
  };

  // 11. Alternar Estado De Suspensión De Usuario En Firestore
  const toggleSuspendUser = async (userId, currentStatus) => {
    const newStatus = await userService.toggleSuspendUser(userId, currentStatus);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: newStatus } : u));

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
      updateBusiness,
      renewBusinessSubscription,
      getSubscriptionStatus,
      calculateNextBillingDate,
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