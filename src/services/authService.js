import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

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

      // Validación De Contraseña Almacenada En La Base De Datos
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
  }
};