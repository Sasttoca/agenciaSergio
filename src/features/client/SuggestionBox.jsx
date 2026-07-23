import React, { useState, useContext } from 'react';
import { AgencyContext } from '../../context/AgencyContext';
import { MessageSquarePlus, Send, CheckCircle2 } from 'lucide-react';

const SuggestionBox = () => {
  const { addSuggestion } = useContext(AgencyContext);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    await addSuggestion(text.trim());
    setText('');
    setLoading(false);
    setSent(true);

    setTimeout(() => setSent(false), 3500);
  };

  return (
    <div className="bg-[#0B132B] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquarePlus className="text-indigo-400" size={20} />
        <h3 className="text-base font-bold text-white">Caja de Sugerencias</h3>
      </div>
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Escribe tus comentarios u observaciones. Serán revisados directamente por tu equipo de soporte.
      </p>

      {sent && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span>¡Sugerencia enviada correctamente a tu equipo!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu mensaje o sugerencia aquí..."
          className="w-full h-32 bg-[#060814] border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-slate-600"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20"
        >
          <Send size={15} />
          <span>{loading ? 'Enviando...' : 'Enviar Comentario'}</span>
        </button>
      </form>
    </div>
  );
};

export default SuggestionBox;