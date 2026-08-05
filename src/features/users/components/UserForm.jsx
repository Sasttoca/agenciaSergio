import React, { useState, useContext } from 'react';
import { AgencyContext } from '../../../context/AgencyContext';
import { UserPlus, Lock, User, Shield, Building, Eye, EyeOff } from 'lucide-react';

const UserForm = () => {
  const { addUser, businesses } = useContext(AgencyContext);

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado Para Alternar Visibilidad
  const [role, setRole] = useState('worker');
  const [businessId, setBusinessId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !name.trim() || !password.trim()) return;

    try {
      await addUser({
        username,
        name,
        password,
        role,
        ...(role === 'client' && businessId ? { businessId } : {})
      });

      // Limpieza De Campos Tras Registro Exitoso
      setUsername('');
      setName('');
      setPassword('');
      setShowPassword(false);
      setRole('worker');
      setBusinessId('');
    } catch (error) {
      console.error("Error Al Registrar Usuario: ", error);
    }
  };

  return (
    <div className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800/80 shadow-lg shadow-black/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <UserPlus className="text-indigo-500" size={20} /> Registrar Nuevo Usuario
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1.5">ID / Username (Minúsculas)</label>
          <div className="relative">
            <input 
              type="text"
              placeholder="Ej. carlos, ana, cliente1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 pl-10 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm placeholder:text-slate-600"
              required
            />
            <User className="absolute left-3 top-3.5 text-slate-500" size={16} />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1.5">Nombre Visible</label>
          <input 
            type="text"
            placeholder="Ej. Carlos Pérez (Diseñador)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm placeholder:text-slate-600"
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1.5">Contraseña</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 pr-10 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm placeholder:text-slate-600"
              required
            />
            <Lock className="absolute left-3 top-3.5 text-slate-500" size={16} />
            
            {/* Botón De Ojo Para Mostrar / Ocultar Contraseña */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1.5">Rol / Nivel De Acceso</label>
          <div className="relative">
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 pl-10 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none cursor-pointer text-slate-200"
            >
              <option value="admin">Administrador (Control Total)</option>
              <option value="worker">Trabajador / Operativo</option>
              <option value="client">Cliente / Aliado Comercial</option>
            </select>
            <Shield className="absolute left-3 top-3.5 text-slate-500" size={16} />
          </div>
        </div>

        {/* Campo Condicional: Si Es Cliente, Asociamos Empresa */}
        {role === 'client' && (
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1.5">Empresa / Negocio Asociado</label>
            <div className="relative">
              <select 
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                className="w-full p-3 pl-10 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none cursor-pointer text-slate-200"
                required={role === 'client'}
              >
                <option value="">Seleccionar Empresa...</option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <Building className="absolute left-3 top-3.5 text-slate-500" size={16} />
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm mt-2 shadow-lg shadow-indigo-600/10 active:scale-[0.98]"
        >
          <UserPlus size={16} /> Crear Usuario
        </button>
      </form>
    </div>
  );
};

export default UserForm;