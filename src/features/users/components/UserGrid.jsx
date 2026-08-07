import React, { useState, useContext } from 'react';
import { AgencyContext } from '../../../context/AgencyContext';
import { Users, Shield, Edit2, Ban, CheckCircle, Trash2, Key, Eye, EyeOff, Building2 } from 'lucide-react';

const UserGrid = () => {
  const { users, businesses, toggleSuspendUser, deleteUser, updateUser } = useContext(AgencyContext);

  // Estados Para Modal De Edición
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('worker');
  const [showEditPassword, setShowEditPassword] = useState(false);

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
    <div className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-black/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Users className="text-indigo-500" size={20} /> Directorio De Usuarios
      </h3>

      <div className="overflow-x-auto">
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
            {users.map((u) => {
              // Búsqueda de la empresa asociada si el usuario es cliente
              const userBusiness = u.role === 'client' && u.businessId 
                ? businesses.find(b => b.id === u.businessId) 
                : null;

              return (
                <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-3 font-mono font-medium text-white">{u.id}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{getRoleBadge(u.role)}</td>
                  
                  {/* Columna de Empresa */}
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
                    {u.isSuspended ? (
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
                    {/* Botón Editar */}
                    <button 
                      onClick={() => handleOpenEdit(u)}
                      className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      title="Editar Credenciales"
                    >
                      <Edit2 size={16} />
                    </button>

                    {/* Botón Suspender / Activar */}
                    <button 
                      onClick={() => toggleSuspendUser(u.id, !!u.isSuspended)}
                      className={`p-2 rounded-lg transition-colors ${u.isSuspended ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-amber-400 hover:bg-amber-500/10'}`}
                      title={u.isSuspended ? "Reactivar Acceso" : "Suspender Acceso"}
                    >
                      <Ban size={16} />
                    </button>

                    {/* Botón Eliminar */}
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
            })}
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
    </div>
  );
};

export default UserGrid;