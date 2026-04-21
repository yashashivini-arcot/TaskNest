import React from 'react';
import { cn } from './Button';

const Card = ({ children, className, title, subtitle, actions }) => {
  return (
    <div className={cn('bg-card-bg rounded-3xl p-6 border border-border-card shadow-soft transition-all duration-300 hover:border-accent/30', className)}>
      {(title || actions) && (
        <div className="flex justify-between items-start mb-6">
          <div>
            {title && <h3 className="text-lg font-bold text-text-main tracking-tight uppercase tracking-wider text-xs opacity-50 mb-1">{title}</h3>}
            {subtitle && <p className="text-2xl font-black text-text-main">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
