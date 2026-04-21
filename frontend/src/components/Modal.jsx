import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-md transition-all duration-300">
      <div className="bg-card-bg rounded-[2rem] shadow-[0_32px_128px_-16px_rgba(30,58,95,0.15)] w-full max-w-md overflow-hidden border border-border-card animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border-card">
          <h3 className="text-lg font-bold text-text-main tracking-tight uppercase tracking-wider text-xs opacity-50">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-card-bg/50 rounded-xl text-text-muted hover:text-text-main transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end gap-3 p-8 bg-secondary-bg/30 border-t border-border-card">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
