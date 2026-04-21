import React from 'react';
import Card from '../components/Card';
import { Book, Download, FileText, Calendar } from 'lucide-react';

const NotesSection = ({ notes }) => {
  return (
    <Card title="Notes & Resources">
      <div className="space-y-2 mt-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="flex items-center justify-between p-4 bg-primary/20 rounded-xl border border-white/5 group hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-contrast/10 text-contrast">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{note.title}</p>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted">
                    <Calendar size={10} />
                    {note.date}
                  </div>
                </div>
              </div>
              <button className="p-2 text-text-muted hover:text-white transition-all transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                <Download size={18} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-muted text-center py-4">No resources available.</p>
        )}
      </div>
    </Card>
  );
};

export default NotesSection;
