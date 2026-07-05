const LOCAL_STORAGE_KEY = 'agency_businesses';

// Datos semilla por si el almacenamiento local está vacío
const defaultBusinesses = [
  { id: 'b1', name: 'Alpha Digital', industry: 'Marketing', workerId: 'Ana Developer' },
  { id: 'b2', name: 'Nova Store', industry: 'E-commerce', workerId: 'Carlos Media' },
  { id: 'b3', name: 'Infinity Tech', industry: 'Software', workerId: 'Ana Developer' }
];

export const businessService = {
  loadBusinesses: () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultBusinesses));
      return defaultBusinesses;
    }
    return JSON.parse(stored);
  },

  saveBusinesses: (businesses) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(businesses));
  }
};