import React, { useState, useContext } from 'react';
import { AgencyContext } from '../../../context/AgencyContext';
import { Lock } from 'lucide-react';

const LoginView = () => {

  const { login } = useContext(AgencyContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const result = login(username, password);
    
    if (result && !result.success) {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#060814] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-[#0B132B] p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-800/80">
        <div className="flex justify-center mb-6 text-indigo-500">
          <Lock size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-white">AgencySergio Login</h2>
        <input 
          placeholder="Usuario (admin, ana, carlos)" 
          className="w-full p-3 mb-4 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Contraseña (123)" 
          className="w-full p-3 mb-6 border border-slate-800 bg-[#060814] text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginView;