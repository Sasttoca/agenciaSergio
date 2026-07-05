import React, { useContext } from 'react';
import { AgencyContext } from '../../context/AgencyContext';
import { LayoutDashboard, Briefcase, Calendar, ShieldAlert, LogOut, User } from 'lucide-react';

const MainLayout = ({ activeTab, setActiveTab, children }) => {
  const { currentUser, logout } = useContext(AgencyContext);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['admin', 'worker'] },
    { id: 'businesses', label: 'Negocios', icon: <Briefcase size={18} />, roles: ['admin', 'worker'] },
    { id: 'tasks', label: 'Calendario', icon: <Calendar size={18} />, roles: ['admin', 'worker'] },
    { id: 'admin', label: 'Administración', icon: <ShieldAlert size={18} />, roles: ['admin'] }
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(currentUser?.role));

  return (
    <div className="flex h-screen bg-[#060814] text-slate-100 overflow-hidden">
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-[#0B132B] border-r border-slate-800/80 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo Agencia */}
          <div className="p-6 border-b border-slate-800/60 flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-sm tracking-wider shadow-lg shadow-indigo-600/20">
              A
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide leading-none">AgencySergio</h1>
              <span className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">Agencia de Marketing</span>
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav className="p-4 space-y-1.5">
            {filteredMenu.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'text-slate-400 hover:bg-[#111A36] hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Botón de Cerrar Sesión */}
        <div className="p-4 border-t border-slate-800/60">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-rose-400 hover:bg-rose-500/5 transition-all"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER SUPERIOR */}
        <header className="h-16 bg-[#0B132B] border-b border-slate-800/80 px-6 flex items-center justify-between">
          {/* Título de la sección actual en Móvil */}
          <div className="md:hidden flex items-center gap-2">
            <span className="text-lg font-bold text-white capitalize">{activeTab}</span>
          </div>
          <div className="hidden md:block"></div>

          {/* Perfil del Usuario */}
          <div className="flex items-center gap-3 bg-[#060814] border border-slate-800/80 px-4 py-1.5 rounded-full shadow-sm">
            <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
              <User size={13} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-none">{currentUser?.name}</p>
              <span className="text-[9px] text-indigo-400 font-semibold uppercase tracking-wider mt-0.5 block">
                {currentUser?.role === 'admin' ? 'Administrador' : 'Gestor Operativo'}
              </span>
            </div>
          </div>
        </header>

        {/* CONTENIDO INTERNO DINÁMICO */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>

        {/* NAV INFERIOR PARA MÓVILES */}
        <div className="md:hidden bg-[#0B132B] border-t border-slate-800/80 h-16 flex items-center justify-around px-2">
          {filteredMenu.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
                activeTab === item.id ? 'text-indigo-400' : 'text-slate-500'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
          <button 
            onClick={logout}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-rose-500/70"
          >
            <LogOut size={18} />
            <span className="text-[10px] font-medium">Salir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;