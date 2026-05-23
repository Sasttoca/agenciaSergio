import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BriefcaseBusiness, 
  CalendarDays, 
  CheckSquare, 
  PlusCircle,
  Menu,
  Settings,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  LogOut,
  Lock,
  Users,
  X
} from 'lucide-react';

const taskTemplates = [
  'Planificación de contenido', 'Revisión de métricas', 'Interacción con comunidad', 
  'Creación de gráficos', 'Redacción de copies', 'Reporte semanal'
];

const generateTasksForBusiness = (businessId) => {
  return taskTemplates.map((title, index) => ({
    id: `${businessId}-${index}`,
    title: title,
    businessId: businessId,
    status: 'Pendiente',
    dueDate: `2026-06-0${(index % 6) + 1}`,
    notes: 'Tarea predeterminada del sistema.'
  }));
};

const initialBusinesses = [
  { id: '1', name: 'Tech Solutions', industry: 'Software', workerId: 'Ana Developer' },
  { id: '2', name: 'Green Cafe', industry: 'Gastronomía', workerId: 'Carlos Media' }
];

const initialTasks = [
  ...generateTasksForBusiness('1'),
  ...generateTasksForBusiness('2'),
  { id: 'admin-1', title: 'Reunión de equipo', businessId: 'admin', status: 'Pendiente', dueDate: '2026-05-24', notes: 'Revisión trimestral.' },
  { id: 'admin-2', title: 'Análisis de rendimiento', businessId: 'admin', status: 'Pendiente', dueDate: '2026-05-25', notes: 'Revisar métricas de trabajadores.' }
];

const CustomModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const LoginView = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex justify-center mb-6 text-indigo-600"><Lock size={48} /></div>
        <h2 className="text-2xl font-bold text-center mb-6">AgencySergio Login</h2>
        <input 
          placeholder="Usuario (admin, ana, carlos)" 
          className="w-full p-3 mb-4 border rounded-xl"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Contraseña (123)" 
          className="w-full p-3 mb-6 border rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">Entrar</button>
      </form>
    </div>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedBusinesses, setExpandedBusinesses] = useState({});
  const today = "2026-05-23";
  
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const [editForm, setEditForm] = useState({ title: '', notes: '' });

  const [businesses, setBusinesses] = useState(() => {
    const saved = localStorage.getItem('agency-businesses');
    return saved ? JSON.parse(saved) : initialBusinesses;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('agency-tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('agency-businesses', JSON.stringify(businesses));
    localStorage.setItem('agency-tasks', JSON.stringify(tasks));
  }, [businesses, tasks]);

  const handleLogin = (user, pass) => {
    if (pass === '123') {
      if (user === 'admin') setCurrentUser({ name: 'Admin', role: 'admin' });
      else if (user === 'ana') setCurrentUser({ name: 'Ana Developer', role: 'worker' });
      else if (user === 'carlos') setCurrentUser({ name: 'Carlos Media', role: 'worker' });
      else alert('Usuario no encontrado');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const getFilteredBusinesses = () => {
    return currentUser.role === 'admin' ? businesses : businesses.filter(b => b.workerId === currentUser.name);
  };

  const getFilteredTasks = () => {
    return currentUser.role === 'admin' 
      ? tasks.filter(t => t.businessId === 'admin')
      : tasks.filter(t => getFilteredBusinesses().map(b => b.id).includes(t.businessId));
  };

  const toggleBusinessExpansion = (businessId) => {
    setExpandedBusinesses(prev => ({ ...prev, [businessId]: !prev[businessId] }));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: t.status === 'Pendiente' ? 'Realizada' : 'Pendiente' } : t));
  };

  const openDeleteModal = (task) => {
    setModal({ isOpen: true, type: 'delete', data: task });
  };

  const openEditModal = (task) => {
    setEditForm({ title: task.title, notes: task.notes });
    setModal({ isOpen: true, type: 'edit', data: task });
  };

  const executeDelete = () => {
    setTasks(tasks.filter(t => t.id !== modal.data.id));
    setModal({ isOpen: false, type: null, data: null });
  };

  const executeEdit = () => {
    setTasks(tasks.map(t => t.id === modal.data.id ? { ...t, title: editForm.title, notes: editForm.notes } : t));
    setModal({ isOpen: false, type: null, data: null });
  };

  const handleAddBusiness = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const businessId = Date.now().toString();
    const newBusiness = {
      id: businessId,
      name: formData.get('name'),
      industry: formData.get('industry'),
      workerId: formData.get('workerId'),
    };
    
    const newTasks = generateTasksForBusiness(businessId);
    setBusinesses([...businesses, newBusiness]);
    setTasks([...tasks, ...newTasks]);
    e.target.reset();
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTask = {
      id: Date.now().toString(),
      title: formData.get('title'),
      businessId: formData.get('businessId'),
      status: 'Pendiente',
      dueDate: formData.get('dueDate'),
      notes: formData.get('notes'),
    };
    setTasks([...tasks, newTask]);
    e.target.reset();
  };

  const CalendarView = () => {
    const [viewMode, setViewMode] = useState('monthly');
    const [filterBusiness, setFilterBusiness] = useState('all');
    const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1));

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    const filteredTasks = (currentUser.role === 'admin') 
      ? tasks.filter(t => t.businessId === 'admin')
      : (filterBusiness === 'all' ? getFilteredTasks() : getFilteredTasks().filter(t => t.businessId === filterBusiness));

    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-slate-800">Calendario</h2>
             <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                <button onClick={prevMonth} className="p-1 hover:bg-white rounded shadow"><ChevronLeft size={18}/></button>
                <span className="text-sm font-semibold px-2">{currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                <button onClick={nextMonth} className="p-1 hover:bg-white rounded shadow"><ChevronRight size={18}/></button>
             </div>
          </div>
          <select className="bg-slate-100 p-2 rounded-lg text-sm border-none focus:ring-0" value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
              <option value="monthly">Vista Mensual</option>
              <option value="weekly">Vista Semanal</option>
          </select>
          {currentUser.role !== 'admin' && (
            <select className="bg-slate-100 p-2 rounded-lg text-sm border-none focus:ring-0" value={filterBusiness} onChange={(e) => setFilterBusiness(e.target.value)}>
              <option value="all">Todos los negocios</option>
              {getFilteredBusinesses().map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          )}
        </div>
        {viewMode === 'monthly' ? (
          <div className="grid grid-cols-7 gap-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => <div key={d} className="text-center font-bold text-slate-400 text-sm py-2">{d}</div>)}
            {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1).map(day => {
              const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const dayTasks = filteredTasks.filter(t => t.dueDate === dateStr);
              return (
                <div key={day} className="h-24 border border-slate-100 rounded-lg p-2 hover:bg-slate-50 transition-colors overflow-y-auto">
                  <span className="text-sm font-medium text-slate-700">{day}</span>
                  {dayTasks.map(task => (
                    <div key={task.id} className={`text-[10px] p-1 mt-1 rounded truncate cursor-pointer ${task.status === 'Realizada' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {task.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ) : <div className="text-center py-20 text-slate-500">Vista semanal en desarrollo...</div>}
      </div>
    );
  };

  const TeamView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Progreso del Equipo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['Ana Developer', 'Carlos Media'].map(worker => {
          const workerBusinesses = businesses.filter(b => b.workerId === worker);
          const workerTasks = tasks.filter(t => workerBusinesses.map(b => b.id).includes(t.businessId));
          const completed = workerTasks.filter(t => t.status === 'Realizada').length;
          const total = workerTasks.length || 1;
          const percent = Math.round((completed / total) * 100);

          return (
            <div key={worker} className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-lg">{worker}</h3>
              <p className="text-sm text-slate-500 mb-4">{workerBusinesses.length} negocios a cargo</p>
              <div className="w-full bg-slate-200 rounded-full h-4 mb-2"><div className="bg-indigo-600 h-4 rounded-full transition-all" style={{ width: `${percent}%` }}></div></div>
              <p className="text-xs text-slate-400 text-right">{percent}% de tareas completadas</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const AdminView = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Administración</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleAddBusiness} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><PlusCircle className="text-indigo-600" /> Crear Negocio</h3>
          <div className="space-y-4">
            <input name="name" placeholder="Nombre del negocio" className="w-full p-3 border rounded-xl" required />
            <input name="industry" placeholder="Industria" className="w-full p-3 border rounded-xl" />
            <select name="workerId" className="w-full p-3 border rounded-xl bg-white">{['Ana Developer', 'Carlos Media', 'Elena Seo'].map(w => <option key={w} value={w}>{w}</option>)}</select>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">Registrar y generar tareas</button>
          </div>
        </form>
        <form onSubmit={handleAddTask} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><CheckSquare className="text-emerald-600" /> Asignar Tarea</h3>
          <div className="space-y-4">
            <input name="title" placeholder="Título de la tarea" className="w-full p-3 border rounded-xl" required />
            <select name="businessId" className="w-full p-3 border rounded-xl bg-white" required>
              <option value="">Seleccionar Negocio</option>
              <option value="admin">Tarea Administrativa (Interna)</option>
              {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input name="dueDate" type="date" className="w-full p-3 border rounded-xl" required />
            <textarea name="notes" placeholder="Notas adicionales..." className="w-full p-3 border rounded-xl" rows={3} />
            <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">Crear Tarea</button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!currentUser) return <LoginView onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <CustomModal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.type === 'delete' ? 'Eliminar Tarea' : 'Editar Tarea'}>
        {modal.type === 'delete' ? (
          <div>
            <p className="mb-6">¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.</p>
            <div className="flex gap-4">
              <button onClick={() => setModal({ ...modal, isOpen: false })} className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200">Cancelar</button>
              <button onClick={executeDelete} className="flex-1 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <input value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full p-3 border rounded-xl" />
            <textarea value={editForm.notes} onChange={(e) => setEditForm({...editForm, notes: e.target.value})} className="w-full p-3 border rounded-xl" rows={3} />
            <button onClick={executeEdit} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">Guardar cambios</button>
          </div>
        )}
      </CustomModal>

      {}
      <aside className={`bg-slate-900 w-64 text-slate-300 transition-all ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-6">
          <h1 className="text-white text-xl font-bold mb-8">AgencySergio</h1>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'businesses', label: 'Negocios', icon: BriefcaseBusiness },
              { id: 'tasks', label: 'Calendario', icon: CalendarDays },
              ...(currentUser.role === 'admin' ? [
                { id: 'team', label: 'Equipo', icon: Users },
                { id: 'admin', label: 'Administración', icon: Settings }
              ] : [])
            ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <button onClick={() => setCurrentUser(null)} className="absolute bottom-6 left-6 flex items-center gap-2 hover:text-white"><LogOut size={20} /> Salir</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden"><Menu size={24} /></button>
          <div className="text-sm font-medium text-slate-500">Agencia de Marketing - {currentUser.name}</div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {currentUser.role === 'admin' ? (
                <div className="bg-white p-8 rounded-2xl border shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Tareas Administrativas</h2>
                  {getFilteredTasks().map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-3">
                       <div>
                         <p className="font-bold">{task.title}</p>
                         <p className="text-xs text-slate-500">{task.dueDate}</p>
                       </div>
                       <button onClick={() => toggleTaskStatus(task.id)}>{task.status === 'Realizada' ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-300" />}</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-600 p-6 rounded-2xl text-white">
                    <h3 className="opacity-80 text-sm">Negocios a cargo</h3>
                    <p className="text-3xl font-bold mt-2">{getFilteredBusinesses().length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border">
                    <h3 className="text-sm text-slate-500">Tareas Pendientes</h3>
                    <p className="text-3xl font-bold mt-2">{getFilteredTasks().filter(t => t.status === 'Pendiente').length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border">
                     <h3 className="text-sm text-slate-500">Próxima actividad</h3>
                     <p className="text-lg font-bold mt-2 text-indigo-700 truncate">{getFilteredTasks().filter(t => t.status === 'Pendiente').sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate))[0]?.title || 'No hay tareas'}</p>
                  </div>
                </div>
              )}

              {currentUser.role !== 'admin' && (
                <div className="bg-white p-6 rounded-2xl border">
                  <h3 className="font-bold text-lg mb-4">Tareas recientes</h3>
                  <div className="space-y-6">
                    {getFilteredBusinesses().map(business => {
                      const businessTasks = getFilteredTasks().filter(t => t.businessId === business.id);
                      if (businessTasks.length === 0) return null;
                      const completedTasks = businessTasks.filter(t => t.status === 'Realizada').length;
                      const progress = Math.round((completedTasks / businessTasks.length) * 100);
                      const isExpanded = expandedBusinesses[business.id] !== false;

                      return (
                        <div key={business.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleBusinessExpansion(business.id)}>
                            <div className="flex items-center gap-2">
                               <ChevronDown className={`transition-transform duration-300 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} size={20} />
                               <h4 className="font-bold text-indigo-600">{business.name}</h4>
                            </div>
                            <div className="flex items-center gap-4">
                               <span className="text-xs text-slate-500">{progress}% completado</span>
                               <div className="w-24 bg-slate-200 rounded-full h-2"><div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div></div>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="space-y-2 mt-4">
                              {businessTasks.map(task => (
                                <div key={task.id} className="flex flex-col p-3 bg-white border border-slate-100 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <button onClick={() => toggleTaskStatus(task.id)}>{task.status === 'Realizada' ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-300" />}</button>
                                      <span className={task.status === 'Realizada' ? 'line-through text-slate-400' : 'font-medium'}>{task.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {task.status === 'Pendiente' && task.dueDate === today && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1"><Clock size={10} /> Realizar hoy</span>}
                                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${task.status === 'Realizada' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{task.status}</span>
                                      <button onClick={() => openEditModal(task)} className="text-slate-400 hover:text-indigo-600 p-1"><Edit2 size={14} /></button>
                                      <button onClick={() => openDeleteModal(task)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
                                      <span className="text-xs text-slate-400 ml-2">{task.dueDate}</span>
                                    </div>
                                  </div>
                                  {task.notes && <p className="text-xs text-slate-500 mt-2 pl-9 italic">Notas: {task.notes}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'admin' && <AdminView />}
          {activeTab === 'team' && <TeamView />}
          {activeTab === 'tasks' && <CalendarView />}
          {activeTab === 'businesses' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {getFilteredBusinesses().map(bus => (
                 <div key={bus.id} className="bg-white p-6 rounded-2xl border shadow-sm">
                   <h3 className="font-bold text-lg">{bus.name}</h3>
                   <p className="text-sm text-slate-500">{bus.industry}</p>
                   <div className="mt-4 text-xs bg-slate-100 p-2 rounded text-slate-600">Encargado: {bus.workerId}</div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </main>
    </div>
  );
}