import React from 'react';
import Modal from './Modal';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarModal = ({ isOpen, onClose, events }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const now = new Date();
  const currentMonth = months[now.getMonth()];
  const currentYear = now.getFullYear();

  // Simple mock calendar grid generation
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter(e => {
      const eDate = new Date(e.date);
      return eDate.getDate() === day && eDate.getMonth() === now.getMonth() && eDate.getFullYear() === now.getFullYear();
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Academic Calendar" className="max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-text-main">{currentMonth} {currentYear}</h3>
          <div className="flex gap-2">
            <button className="p-2 bg-card-bg/50 border border-border-card rounded-lg text-text-muted hover:text-text-main transition-all"><ChevronLeft size={16} /></button>
            <button className="p-2 bg-card-bg/50 border border-border-card rounded-lg text-text-muted hover:text-text-main transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border-card border border-border-card rounded-2xl overflow-hidden shadow-soft">
          {days.map(d => (
            <div key={d} className="p-3 text-[10px] font-black uppercase tracking-widest text-text-muted text-center bg-secondary-bg">
              {d}
            </div>
          ))}
          {calendarDays.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div key={i} className={`min-h-[80px] p-2 bg-primary/10 transition-colors ${day ? 'hover:bg-card-bg/50' : ''}`}>
                <span className={`text-xs font-bold ${day === now.getDate() ? 'text-accent' : 'text-text-muted'}`}>
                  {day}
                </span>
                <div className="space-y-1 mt-1">
                  {dayEvents.map((e, idx) => (
                    <div key={idx} className={`text-[8px] px-1.5 py-0.5 rounded-md truncate font-black uppercase tracking-tighter ${
                      e.type === 'exam' ? 'bg-accent/20 text-accent' : 'bg-contrast/20 text-contrast'
                    }`}>
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 px-2">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-contrast"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Deadlines</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-accent"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Exams</span>
           </div>
        </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;
