import React from 'react';
import Card from './Card';

const AcademicPerformance = ({ completed = 8, pending = 4, overdue = 1 }) => {
  const total = completed + pending + overdue || 1; // Prevent zero division
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  
  const completedPct = (completed / total) * 100;
  const pendingPct = (pending / total) * 100;
  const overduePct = (overdue / total) * 100;

  const completedOffset = isNaN(completedPct) ? circumference : circumference - (completedPct / 100) * circumference;
  const pendingOffset = isNaN(pendingPct) ? circumference : circumference - ((completedPct + pendingPct) / 100) * circumference;
  const overdueOffset = isNaN(overduePct) ? circumference : circumference - ((completedPct + pendingPct + overduePct) / 100) * circumference;

  return (
    <Card className="flex flex-col items-center justify-center text-center py-8">
      <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.2em] mb-6">Academic Performance</h3>
      
      <div className="relative w-48 h-48 mb-8 group">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-white/5"
          />
          {/* Completed Segment - Dynamic Accent */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="var(--color-accent)"
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={completedOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out hover:stroke-[18px]"
          />
          {/* Pending Segment - Grey */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#4B5563"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={pendingOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out delay-200"
          />
          {/* Overdue Segment - Dynamic Contrast */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="var(--color-contrast)"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={overdueOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out delay-400"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-black text-white">{Math.round((completed/total)*100)}%</span>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Consistency</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 w-full px-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-accent">Completed</p>
          <p className="text-xl font-black text-white">{completed}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Pending</p>
          <p className="text-xl font-black text-white">{pending}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-contrast">Overdue</p>
          <p className="text-xl font-black text-white">{overdue}</p>
        </div>
      </div>
    </Card>
  );
};

export default AcademicPerformance;
