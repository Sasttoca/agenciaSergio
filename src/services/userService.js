import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export const userService = {
  // 1. Obtener todos los usuarios de la colección 'users'
  getUsers: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = [];
      querySnapshot.forEach((docSnap) => {
        users.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      return users;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  },

  // 2. Crear un nuevo usuario en Firestore (ID es el username en minúsculas)
  createUser: async ({ username, name, password, role, businessId = null }) => {
    try {
      const cleanId = username.trim().toLowerCase();
      const userRef = doc(db, 'users', cleanId);

      const userData = {
        name,
        password,
        role,
        isSuspended: false,
        ...(businessId && { businessId })
      };

      await setDoc(userRef, userData);
      return { id: cleanId, ...userData };
    } catch (error) {
      console.error('Error al registrar usuario en Firestore:', error);
      throw error;
    }
  },

  // 3. Actualizar datos o credenciales de un usuario
  updateUser: async (userId, updatedFields) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, updatedFields);
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  // 4. Cambiar estado de suspensión (Bloqueo de acceso)
  toggleSuspendUser: async (userId, currentStatus) => {
    try {
      const userRef = doc(db, 'users', userId);
      const newStatus = !currentStatus;
      await updateDoc(userRef, { isSuspended: newStatus });
      return newStatus;
    } catch (error) {
      console.error('Error al cambiar suspensión de usuario:', error);
      throw error;
    }
  },

  // 5. Eliminar usuario permanentemente de Firestore
  deleteUser: async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
};