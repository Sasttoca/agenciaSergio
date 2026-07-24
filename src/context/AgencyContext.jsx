import React, { createContext, useState, useEffect } from 'react';
import { businessService } from '../services/businessService';
import { taskService } from '../services/taskService';
import { suggestionService } from '../services/suggestionService';

export const AgencyContext = createContext();

export const AgencyProvider = ({ children }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedBusinesses, setExpandedBusinesses] = useState({});
  // Calculamos dinámicamente el día de HOY en formato YYYY-MM-DD (hora local)
  const getTodayFormatted = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getTodayFormatted();

// Asegúrate de incluir 'today' dentro del Provider value:
// <AgencyContext.Provider value={{ ..., today }}>

  // Inicializamos los estados vacíos sin ningún dato quemado por defecto
  const [businesses, setBusinesses] = useState([]);
  const [tasks, setTasks] = useState([]);

  // 1. CARGA DE DATOS ASÍNCRONA DESDE FIRESTORE
  useEffect(() => {
    const fetchData = async () => {
      const loadedBusinesses = await businessService.loadBusinesses();
      const loadedTasks = await taskService.loadTasks();
      const loadedSuggestions = await suggestionService.loadSuggestions();
      setBusinesses(loadedBusinesses);
      setTasks(loadedTasks);
      setSuggestions(loadedSuggestions);
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
      else if (lowerUser === 'cliente') { 
        // Asocia un ID de negocio existente
        const firstBusinessId = businesses[0]?.id || 'client-business-id';
        setCurrentUser({ name: 'Cliente Marca', role: 'client', businessId: firstBusinessId }); 
        return { success: true };
      }  
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

  // 3.1. ELIMINAR NEGOCIO Y SUS TAREAS ASOCIADAS (ELIMINACIÓN EN CASCADA)
  const deleteBusiness = async (businessId) => {
    try {
      // A. Identificamos todas las tareas asociadas al negocio
      const tasksToDelete = tasks.filter(t => t.businessId === businessId);

      // B. Las eliminamos de Firestore en paralelo
      const deletePromises = tasksToDelete.map(t => taskService.deleteTask(t.id));
      await Promise.all(deletePromises);

      // C. Eliminamos el negocio de Firestore
      await businessService.deleteBusiness(businessId);

      // D. Actualizamos el estado local de React filtrando lo eliminado
      setBusinesses(prev => prev.filter(b => b.id !== businessId));
      setTasks(prev => prev.filter(t => t.businessId !== businessId));
    } catch (error) {
      console.error("Error al procesar la eliminación en cascada: ", error);
    }
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

  // Función para agregar una sugerencia
  const addSuggestion = async (text) => {
    if (!currentUser || currentUser.role !== 'client') return;
    const newSugg = await suggestionService.addSuggestion({
      businessId: currentUser.businessId,
      author: currentUser.name,
      text
    });
    setSuggestions(prev => [newSugg, ...prev]);
  };

  // Función para reiniciar el histórico de sugerencias
  const clearSuggestions = async () => {
    await suggestionService.clearSuggestions(suggestions);
    setSuggestions([]);
  };
  

  return (
    <AgencyContext.Provider value={{
      currentUser,
      expandedBusinesses,
      today,
      businesses,
      tasks,
      suggestions,
      login,
      logout,
      getFilteredBusinesses,
      getFilteredTasks,
      toggleBusinessExpansion,
      toggleTaskStatus,
      addBusiness,
      deleteBusiness, // <-- Pasamos el método para consumirlo en la UI
      addSuggestion,
      clearSuggestions,
      addTask,
      deleteTask,
      editTask
    }}>
      {children}
    </AgencyContext.Provider>
  );
};