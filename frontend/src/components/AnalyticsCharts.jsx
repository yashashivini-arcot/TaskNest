import React from 'react';

export const SubmissionDonutChart = ({ submitted = 18, pending = 6 }) => {
  const total = submitted + pending;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const submittedPct = total === 0 ? 0 : (submitted / total) * 100;
  const offset = circumference - (submittedPct / 100) * circumference;

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative w-40 h-40 mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" className="text-card-bg/50" />
          <circle 
            cx="80" cy="80" r={radius} stroke="var(--color-accent)" strokeWidth="12" fill="transparent" 
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-text-main">{Math.round(submittedPct)}%</span>
          <span className="text-[8px] font-black text-text-muted uppercase tracking-widest mt-1">Submitted</span>
        </div>
      </div>
      <div className="flex gap-6">
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-accent"></div>
           <span className="text-[10px] font-black uppercase text-text-muted">Done ({submitted})</span>
         </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-card-bg/80 border border-border-card"></div>
            <span className="text-[10px] font-black uppercase text-text-muted">Pending ({pending})</span>
          </div>
      </div>
    </div>
  );
};

export const AssignmentBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="space-y-4 py-2">
      {data.map((item, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted px-1">
            <span>{item.label}</span>
            <span className="text-text-main">{item.value} Subs</span>
          </div>
          <div className="h-2 w-full bg-card-bg/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};
