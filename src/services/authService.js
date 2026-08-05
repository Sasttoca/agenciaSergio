import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export const authService = {
  // 1. Inicio De Sesión Con Validación De Suspensión Y Rol
  login: async (username, password) => {
    try {
      const cleanId = username.trim().toLowerCase();
      const userRef = doc(db, 'users', cleanId);
      const userSnap = await getDoc(userRef);

      // A. Verificamos Si El Usuario Existe
      if (!userSnap.exists()) {
        return { 
          success: false, 
          message: 'El usuario ingresado no existe.' 
        };
      }

      const userData = userSnap.data();

      // B. VERIFICACIÓN DE SUSPENSIÓN DE CUENTA
      if (userData.isSuspended === true || userData.isSuspended === 'true') {
        return { 
          success: false, 
          message: 'Acceso denegado: Esta cuenta se encuentra suspendida temporalmente.' 
        };
      }

      // C. Validamos Contraseña
      if (userData.password !== password) {
        return { 
          success: false, 
          message: 'Contraseña incorrecta.' 
        };
      }

      return { 
        success: true, 
        user: { id: userSnap.id, ...userData } 
      };

    } catch (error) {
      console.error("Error en authService.login:", error);
      return { 
        success: false, 
        message: 'Error al conectar con el servidor de autenticación.' 
      };
    }
  },

  // 2. Cargar Lista De Trabajadores
  getWorkers: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const workers = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.role === 'worker' || data.role === 'admin') {
          workers.push({ id: docSnap.id, ...data });
        }
      });
      return workers;
    } catch (error) {
      console.error("Error al obtener trabajadores:", error);
      return [];
    }
  }
};