import React from 'react';
import { X } from 'lucide-react';

const CustomModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0B132B] rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {/* Aquí se renderiza cualquier contenido que le pasemos por dentro */}
        {children} 
      </div>
    </div>
  );
};

export default CustomModal;