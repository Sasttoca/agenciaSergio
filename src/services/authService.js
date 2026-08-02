import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "./firebase";

export const authService = {
  // Inicia Sesión Consultando Directamente El Documento En Firestore
  login: async (username, password) => {
    try {
      const cleanUsername = username.trim().toLowerCase();
      const userRef = doc(db, 'users', cleanUsername);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return { success: false, message: 'Usuario No Encontrado' };
      }

      const userData = userSnap.data();

      if (userData.password !== password) {
        return { success: false, message: 'Contraseña Incorrecta' };
      }

      return {
        success: true,
        user: {
          id: userSnap.id,
          name: userData.name,
          role: userData.role,
          businessId: userData.businessId || null
        }
      };
    } catch (error) {
      console.error('Error Al Verificar Credenciales En Firestore:', error);
      return { success: false, message: 'Error De Conexión Con La Base De Datos' };
    }
  },

  // Obtiene La Lista Dinámica De Todos Los Trabajadores (Rol 'worker')
  getWorkers: async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'worker'));
      const querySnapshot = await getDocs(q);
      
      const workers = [];
      querySnapshot.forEach((docSnap) => {
        workers.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      return workers;
    } catch (error) {
      console.error('Error Al Cargar Trabajadores:', error);
      return [];
    }
  }
};