import { db } from './firebase'; 
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Nombre de la colección en Firestore
const COLLECTION_NAME = 'tasks';

export const taskService = {
  // 1. Leer todas las tareas desde la nube
  loadTasks: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const tasks = [];
      
      querySnapshot.forEach((doc) => {
        // Combinamos el ID único de Firestore con los campos de la tarea
        tasks.push({ id: doc.id, ...doc.data() });
      });
      
      return tasks;
    } catch (error) {
      console.error("Error al cargar tareas desde Firestore: ", error);
      return [];
    }
  },

  // 2. Guardar una nueva tarea en la nube
  addTask: async (newTask) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        title: newTask.title,
        businessId: newTask.businessId,
        dueDate: newTask.dueDate,
        status: newTask.status || 'Pendiente',
        notes: newTask.notes || ''
      });
      
      return { id: docRef.id, ...newTask };
    } catch (error) {
      console.error("Error al guardar la tarea en Firestore: ", error);
      throw error;
    }
  },

  // 3. Actualizar una tarea existente (útil para cambiar el estado o las notas)
  updateTask: async (taskId, updatedFields) => {
    try {
      const taskRef = doc(db, COLLECTION_NAME, taskId);
      await updateDoc(taskRef, updatedFields);
      return { id: taskId, ...updatedFields };
    } catch (error) {
      console.error("Error al actualizar la tarea en Firestore: ", error);
      throw error;
    }
  },

  // 4. Eliminar una tarea de la base de datos
  deleteTask: async (taskId) => {
    try {
      const taskRef = doc(db, COLLECTION_NAME, taskId);
      await deleteDoc(taskRef);
      return taskId;
    } catch (error) {
      console.error("Error al eliminar la tarea en Firestore: ", error);
      throw error;
    }
  }
};