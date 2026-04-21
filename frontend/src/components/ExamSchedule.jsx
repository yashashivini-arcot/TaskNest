import React from 'react';
import Card from '../components/Card';
import { Calendar, Clock, BookOpen } from 'lucide-react';

const ExamSchedule = ({ exams }) => {
  return (
    <Card title="Exam Schedule">
      <div className="space-y-4 mt-4">
        {exams.length > 0 ? (
          exams.map((exam) => (
            <div key={exam.id} className="p-4 bg-primary/20 border border-white/5 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-accent/10 text-accent">
                   <BookOpen size={18} />
                 </div>
                 <h4 className="font-bold text-white">{exam.subject}</h4>
              </div>
              <div className="flex items-center gap-6">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">Date</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-text-main text-accent">
                      <Calendar size={14} />
                      {exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : 'TBD'}
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">Reporting Time</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                      <Clock size={14} className="text-contrast" />
                      {exam.exam_time || exam.time || '10:00 AM'}
                    </div>
                 </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-muted text-center py-4">No exams scheduled.</p>
        )}
      </div>
    </Card>
  );
};

export default ExamSchedule;
