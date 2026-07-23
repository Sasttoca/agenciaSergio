import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const COLLECTION_NAME = 'suggestions';

export const suggestionService = {
  // Cargar todas las sugerencias
  loadSuggestions: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error al cargar sugerencias de Firestore: ", error);
      return [];
    }
  },

  // Crear un nuevo comentario con: id, businessId, author, text, date
  addSuggestion: async (suggestionData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...suggestionData,
        date: new Date().toISOString()
      });
      return { id: docRef.id, ...suggestionData, date: new Date().toISOString() };
    } catch (error) {
      console.error("Error al guardar sugerencia: ", error);
      throw error;
    }
  },

  // Eliminar sugerencias en lote (reiniciar histórico)
  clearSuggestions: async (suggestionsList) => {
    try {
      const deletePromises = suggestionsList.map(item => 
        deleteDoc(doc(db, COLLECTION_NAME, item.id))
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error al borrar el histórico de sugerencias: ", error);
      throw error;
    }
  }
};