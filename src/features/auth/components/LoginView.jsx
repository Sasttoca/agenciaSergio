import React, { useState, useContext } from 'react';
import { AgencyContext } from '../../../context/AgencyContext';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginView = () => {
  const { login } = useContext(AgencyContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Manejador Asíncrono Del Envío Del Formulario De Inicio De Sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Consulta Asíncrona A Firestore A Través Del AgencyContext
    const result = await login(username, password);

    if (result && !result.success) {
      alert(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#060814] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-[#0B132B] p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-800/80">
        <div className="flex justify-center mb-6 text-indigo-500">
          <Lock size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-white">AgencySergio Login</h2>
        
        {/* Input De Usuario */}
        <div className="mb-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="Usuario (admin, ana, carlos, cliente)" 
              className="w-full p-3 pl-10 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
            <User className="absolute left-3 top-3.5 text-slate-500" size={16} />
          </div>
        </div>
        
        {/* Input De Contraseña Con Ojo Toggle */}
        <div className="mb-6">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Contraseña (123)" 
              className="w-full p-3 pl-10 pr-10 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <Lock className="absolute left-3 top-3.5 text-slate-500" size={16} />
            
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Verificando...</span>
            </>
          ) : (
            <span>Entrar</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginView;