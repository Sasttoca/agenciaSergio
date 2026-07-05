const LOCAL_STORAGE_KEY = 'agency_tasks';

// Datos semilla basados en la fecha actual del sistema
const defaultTasks = [
  { id: 't1', title: 'Reunión de alineación mensual', businessId: 'admin', dueDate: '2026-06-28', status: 'Pendiente', notes: 'Revisar KPI generales con el equipo.' },
  { id: 't2', title: 'Diseño de parrilla de contenido', businessId: 'b2', dueDate: '2026-06-28', status: 'Pendiente', notes: 'Mínimo 12 posts para aprobación.' },
  { id: 't3', title: 'Optimización de base de datos', businessId: 'b1', dueDate: '2026-06-29', status: 'Realizada', notes: 'Limpieza de logs antiguos.' },
  { id: 't4', title: 'Despliegue de landing page', businessId: 'b3', dueDate: '2026-06-30', status: 'Pendiente', notes: 'Verificar certificados SSL antes de lanzar.' }
];

export const taskService = {
  loadTasks: () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultTasks));
      return defaultTasks;
    }
    return JSON.parse(stored);
  },

  saveTasks: (tasks) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }
};