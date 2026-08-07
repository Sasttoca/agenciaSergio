import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export const taskService = {
  // 1. Cargar todas las tareas desde Firestore
  loadTasks: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasks = [];
      querySnapshot.forEach((docSnap) => {
        tasks.push({ id: docSnap.id, ...docSnap.data() });
      });
      return tasks;
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      return [];
    }
  },

  // 2. Crear tarea registrando la fecha de creación en formato ISO
  addTask: async (taskData) => {
    try {
      const payload = {
        ...taskData,
        createdAt: taskData.createdAt || new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'tasks'), payload);
      return { id: docRef.id, ...payload };
    } catch (error) {
      console.error("Error al crear tarea:", error);
      throw error;
    }
  },

  // 3. Actualizar tarea
  updateTask: async (taskId, updatedFields) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, updatedFields);
      return true;
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      throw error;
    }
  },

  // 4. Eliminar tarea individual
  deleteTask: async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      return true;
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      throw error;
    }
  },

  // 5. Depurar automáticamente tareas con más de 15 días de antigüedad
  cleanOldTasks: async (tasks) => {
    try {
      const FIFTEEN_DAYS_IN_MS = 15 * 24 * 60 * 60 * 1000;
      const now = new Date().getTime();

      // Filtramos las tareas que tienen createdAt y superan los 15 días
      const oldTasks = tasks.filter(task => {
        if (!task.createdAt) return false;
        const taskDate = new Date(task.createdAt).getTime();
        return (now - taskDate) >= FIFTEEN_DAYS_IN_MS;
      });

      if (oldTasks.length > 0) {
        // Eliminamos en paralelo en Firestore
        const deletePromises = oldTasks.map(task => deleteDoc(doc(db, 'tasks', task.id)));
        await Promise.all(deletePromises);
      }

      // Retornamos las IDs de las tareas eliminadas
      return oldTasks.map(t => t.id);
    } catch (error) {
      console.error("Error al ejecutar la depuración automática de tareas:", error);
      return [];
    }
  }
};