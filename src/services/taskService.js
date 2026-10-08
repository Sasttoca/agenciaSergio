import {
  collection, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc, doc,
  serverTimestamp, deleteField
} from 'firebase/firestore';
import { db } from './firebase';

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

// Convierte Timestamps de Firestore a ISO; deja strings (datos viejos) tal cual
const toISO = (value) =>
  value && typeof value.toDate === 'function' ? value.toDate().toISOString() : (value ?? null);

const toMillis = (value) => {
  if (!value) return null;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
};

// Hora real del servidor de Firebase (no depende del reloj del dispositivo)
const getServerNow = async () => {
  const ref = doc(db, 'meta', 'serverTime');
  await setDoc(ref, { now: serverTimestamp() });
  const snap = await getDoc(ref);
  const now = snap.data()?.now;
  return now && typeof now.toMillis === 'function' ? now.toMillis() : null;
};

export const taskService = {
  // 1. Cargar todas las tareas desde Firestore
  loadTasks: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasks = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        tasks.push({
          id: docSnap.id,
          ...data,
          createdAt: toISO(data.createdAt),
          completedAt: toISO(data.completedAt)
        });
      });
      return tasks;
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      return [];
    }
  },

  // 2. Crear tarea: la fecha de creación la pone SIEMPRE el servidor
  addTask: async (taskData) => {
    try {
      const payload = { ...taskData, createdAt: serverTimestamp() };
      const docRef = await addDoc(collection(db, 'tasks'), payload);
      // Para la pantalla devolvemos una fecha aproximada; la real queda en Firestore
      return { id: docRef.id, ...taskData, createdAt: new Date().toISOString() };
    } catch (error) {
      console.error("Error al crear tarea:", error);
      throw error;
    }
  },

  // 3. Actualizar tarea. Si cambia el estado, maneja completedAt con la hora del servidor.
  //    Devuelve los campos a aplicar en el estado local.
  updateTask: async (taskId, updatedFields) => {
    try {
      const safeFields = { ...updatedFields };
      delete safeFields.createdAt;   // estas fechas no se pueden modificar desde la app
      delete safeFields.completedAt;

      const payload = { ...safeFields };
      const local = { ...safeFields };

      if (safeFields.status !== undefined) {
        if (safeFields.status === 'Realizada') {
          payload.completedAt = serverTimestamp();
          local.completedAt = new Date().toISOString();
        } else {
          payload.completedAt = deleteField();
          local.completedAt = null;
        }
      }

      await updateDoc(doc(db, 'tasks', taskId), payload);
      return local;
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      throw error;
    }
  },

  // 4. Eliminar tarea individual (guarda copia de respaldo antes de borrar)
  //    source: 'manual' (admin) o 'cascade' (al eliminar un negocio)
  deleteTask: async (taskId, source = 'manual') => {
    try {
      const taskRef = doc(db, 'tasks', taskId);

      try {
        const snap = await getDoc(taskRef);
        if (snap.exists()) {
          const data = snap.data();
          await setDoc(doc(db, 'deletedTasks', taskId), {
            id: taskId,
            ...data,
            deletedAt: serverTimestamp(),
            source
          });
        }
      } catch (backupError) {
        // Si falla el respaldo no bloqueamos la acción del admin
        console.warn("No se pudo guardar el respaldo de la tarea:", backupError);
      }

      await deleteDoc(taskRef);
      return true;
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      throw error;
    }
  },

  // 5. Depurar tareas REALIZADAS hace 30 días o más (según la hora del servidor)
  //    Las tareas pendientes nunca se borran automáticamente.
  cleanOldTasks: async (tasks) => {
    try {
      const candidates = tasks.filter(t => t.status === 'Realizada' && t.completedAt);
      if (candidates.length === 0) return [];

      const serverNow = await getServerNow();
      if (!serverNow) return []; // sin hora confiable no se borra nada

      const expired = candidates.filter(t => {
        const completedMs = toMillis(t.completedAt);
        return completedMs !== null && (serverNow - completedMs) >= THIRTY_DAYS_IN_MS;
      });
      if (expired.length === 0) return [];

      // Respaldo previo (usa el id de la tarea para no duplicar si dos dispositivos limpian a la vez)
      await Promise.all(expired.map(t =>
        setDoc(doc(db, 'deletedTasks', t.id), {
          ...t,
          deletedAt: serverTimestamp(),
          source: 'cleanup'
        })
      ));
      await Promise.all(expired.map(t => deleteDoc(doc(db, 'tasks', t.id))));

      return expired.map(t => t.id);
    } catch (error) {
      console.error("Error al ejecutar la depuración automática de tareas:", error);
      return [];
    }
  }
};