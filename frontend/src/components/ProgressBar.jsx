import React from 'react';

const ProgressBar = ({ progress, color = 'bg-contrast' }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-text-muted">Progress</span>
        <span className="text-xs font-bold text-text-main">{progress}%</span>
      </div>
      <div className="w-full bg-primary/40 rounded-full h-3 p-1 border border-border-card shadow-inner">
        <div 
          className={`${color} h-full rounded-full transition-all duration-700 shadow-lg shadow-current/20`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
