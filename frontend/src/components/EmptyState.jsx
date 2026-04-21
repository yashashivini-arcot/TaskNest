import React from 'react';
import { Ghost, Inbox } from 'lucide-react';

const EmptyState = ({ 
  title = "No data found", 
  message = "It looks like there's nothing here yet.", 
  icon: Icon = Inbox,
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 rounded-3xl bg-secondary-bg border border-white/5 flex items-center justify-center mb-6 shadow-2xl">
        <Icon size={40} className="text-text-muted opacity-20" />
      </div>
      <h3 className="text-xl font-black text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-text-muted font-medium mb-8 max-w-xs leading-relaxed">
        {message}
      </p>
      {action && (
        <div className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
