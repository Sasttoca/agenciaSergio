import { db } from './firebase'; 
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

// Nombre de la colección en Firestore
const COLLECTION_NAME = 'businesses';

export const businessService = {
  // 1. Leer los negocios desde la nube
  loadBusinesses: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const businesses = [];  
      
      querySnapshot.forEach((doc) => {
        // Unimos el ID generado por Firebase con los datos del documento
        businesses.push({ id: doc.id, ...doc.data() });
      });
      
      return businesses;
    } catch (error) {
      console.error("Error al cargar negocios desde Firestore: ", error);
      return [];
    }
  },

  // 2. Guardar un nuevo negocio en la nube de forma individual
  addBusiness: async (newBusiness) => {
    try {
      // Firebase genera automáticamente el ID único del documento
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        name: newBusiness.name,
        industry: newBusiness.industry,
        workerId: newBusiness.workerId
      });
      
      return { id: docRef.id, ...newBusiness };
    } catch (error) {
      console.error("Error al guardar el negocio en Firestore: ", error);
      throw error;
    }
  },

  // 3. Eliminar un negocio de la nube por su ID
  deleteBusiness: async (businessId) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, businessId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error al eliminar el negocio de Firestore: ", error);
      throw error;
    }
  }
};