import React, { useState, useContext, useMemo } from 'react';
import { AgencyContext } from '../../../context/AgencyContext';
import { 
  Users, Shield, Edit2, Ban, CheckCircle, Trash2, Key, Eye, EyeOff, 
  Building2, Download, Search, AlertTriangle
} from 'lucide-react';
import * as XLSX from 'xlsx';

const UserGrid = () => {
  const { users, businesses, toggleSuspendUser, deleteUser, updateUser } = useContext(AgencyContext);

  // Estados Para Modal De Edición
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('worker');
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Estado Para Modal De Confirmación De Suspensión
  const [userToToggle, setUserToToggle] = useState(null);

  // Estados Para Los Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [businessFilter, setBusinessFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Lógica De Filtrado Reactiva
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesBusiness = businessFilter === 'all' || user.businessId === businessFilter;

      const isSuspended = user.isSuspended === true || user.isSuspended === 'true';
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && !isSuspended) ||
        (statusFilter === 'suspended' && isSuspended);

      return matchesSearch && matchesRole && matchesBusiness && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, businessFilter, statusFilter]);

  // Exportar Tabla Filtrada a Excel con Anchos de Columna
  const handleExportExcel = () => {
    const dataToExport = filteredUsers.map(user => {
      const userBusiness = user.role === 'client' && user.businessId 
        ? businesses.find(b => b.id === user.businessId)?.name || 'Sin asignar' 
        : '—';
      const isSuspended = user.isSuspended === true || user.isSuspended === 'true';

      return {
        'ID / Username': user.id,
        'Nombre Visible': user.name || '—',
        'Rol': user.role === 'admin' ? 'Administrador' : user.role === 'worker' ? 'Trabajador' : 'Cliente',
        'Empresa Vinculada': userBusiness,
        'Estado': isSuspended ? 'Suspendido' : 'Activo'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 18 },
      { wch: 28 },
      { wch: 15 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

    XLSX.writeFile(workbook, `Directorio_Usuarios_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditPassword(user.password || '');
    setEditRole(user.role);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    await updateUser(editingUser.id, {
      name: editName,
      password: editPassword,
      role: editRole
    });

    setEditingUser(null);
  };

  // Confirmar cambio de estado de suspensión
  const handleConfirmToggleSuspend = async () => {
    if (!userToToggle) return;
    const isSuspended = userToToggle.isSuspended === true || userToToggle.isSuspended === 'true';
    await toggleSuspendUser(userToToggle.id, isSuspended);
    setUserToToggle(null);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Administrador</span>;
      case 'worker':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Trabajador</span>;
      case 'client':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Cliente</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-black/20 space-y-4">
      {/* HEADER Y BOTÓN EXCEL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="text-indigo-500" size={20} /> Directorio De Usuarios
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-semibold">
            {filteredUsers.length}
          </span>
        </h3>

        <button
          onClick={handleExportExcel}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
        >
          <Download size={15} />
          <span>Exportar Excel</span>
        </button>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar usuario o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#060814] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[#060814] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="all">Todos los Roles</option>
          <option value="admin">Administrador</option>
          <option value="worker">Trabajador</option>
          <option value="client">Cliente</option>
        </select>

        <select
          value={businessFilter}
          onChange={(e) => setBusinessFilter(e.target.value)}
          className="bg-[#060814] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="all">Todas las Empresas</option>
          {businesses.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#060814] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="all">Todos los Estados</option>
          <option value="active">Activo</option>
          <option value="suspended">Suspendido</option>
        </select>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#060814] text-xs text-slate-400 uppercase border-b border-slate-800">
            <tr>
              <th className="p-3">ID / Username</th>
              <th className="p-3">Nombre Visible</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Empresa</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-slate-500 text-xs">
                  No se encontraron usuarios con los criterios de búsqueda elegidos.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const userBusiness = u.role === 'client' && u.businessId 
                  ? businesses.find(b => b.id === u.businessId) 
                  : null;

                const isSuspended = u.isSuspended === true || u.isSuspended === 'true';

                return (
                  <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-3 font-mono font-medium text-white">{u.id}</td>
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{getRoleBadge(u.role)}</td>
                    
                    <td className="p-3">
                      {u.role === 'client' ? (
                        userBusiness ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-800/40 font-medium">
                            <Building2 size={13} className="text-indigo-400 shrink-0" />
                            {userBusiness.name}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Sin asignar</span>
                        )
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </td>

                    <td className="p-3">
                      {isSuspended ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1 w-max">
                          <Ban size={12} /> Suspendido
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-max">
                          <CheckCircle size={12} /> Activo
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(u)}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                        title="Editar Credenciales"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* Botón Abre el Modal de Confirmación */}
                      <button 
                        onClick={() => setUserToToggle(u)}
                        className={`p-2 rounded-lg transition-colors ${isSuspended ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-amber-400 hover:bg-amber-500/10'}`}
                        title={isSuspended ? "Reactivar Acceso" : "Suspender Acceso"}
                      >
                        <Ban size={16} />
                      </button>

                      <button 
                        onClick={() => deleteUser(u.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Eliminar Usuario"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL EDICIÓN DE CREDENCIALES */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Key className="text-indigo-500" size={18} /> Editar Usuario ({editingUser.id})
            </h4>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">Nombre Visible</label>
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">Nueva Contraseña</label>
                <div className="relative">
                  <input 
                    type={showEditPassword ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full p-3 pr-10 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showEditPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">Rol</label>
                <select 
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none cursor-pointer text-slate-200"
                >
                  <option value="admin">Administrador</option>
                  <option value="worker">Trabajador</option>
                  <option value="client">Cliente</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold transition-colors text-sm shadow-lg shadow-indigo-600/10"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓN DE SUSPENSIÓN / REACTIVACIÓN */}
      {userToToggle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              userToToggle.isSuspended ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
              <AlertTriangle size={24} />
            </div>

            <h4 className="text-lg font-bold text-white mb-2">
              {userToToggle.isSuspended ? '¿Reactivar usuario?' : '¿Suspender usuario?'}
            </h4>

            <p className="text-xs text-slate-400 mb-6">
              {userToToggle.isSuspended 
                ? `El usuario "${userToToggle.name || userToToggle.id}" recuperará acceso a la plataforma.`
                : `El usuario "${userToToggle.name || userToToggle.id}" perderá el acceso temporalmente.`
              }
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setUserToToggle(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmToggleSuspend}
                className={`w-1/2 py-2.5 rounded-xl font-bold transition-colors text-sm text-white ${
                  userToToggle.isSuspended 
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20' 
                    : 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/20'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGrid;