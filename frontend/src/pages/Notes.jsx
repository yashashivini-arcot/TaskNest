import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { api } from '../services/api';
import { FileText, Download, Calendar, Search, Plus, PlusCircle, StickyNote, Loader2, Edit2, Trash2 } from 'lucide-react';

const Notes = ({ role = 'student' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', link: '', classroomId: '' });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const cls = await api.classrooms.getAll();
        setClassrooms(cls);
        if (cls.length > 0) {
          setSelectedClassroom(cls[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch classrooms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      fetchNotes(selectedClassroom);
    } else {
      setNotes([]);
    }
  }, [selectedClassroom]);

  const fetchNotes = async (classroomId) => {
    setLoading(true);
    try {
      const data = await api.notes.getByClassroom(classroomId);
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;  
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidUrl(formData.link)) {
      alert('Must be a valid URL (e.g., https://onedrive.com/...)');
      return;
    }
    try {
      if (editingNote) {
        await api.notes.update(editingNote.id, {
          title: formData.title,
          description: formData.description,
          link: formData.link,
          classroomId: formData.classroomId
        });
      } else {
        await api.notes.upload({
          title: formData.title,
          description: formData.description,
          link: formData.link,
          classroomId: formData.classroomId
        });
      }
      alert(editingNote ? 'Node Updated!' : 'Note Uploaded!');
      if (selectedClassroom === formData.classroomId || selectedClassroom == formData.classroomId) {
         fetchNotes(selectedClassroom);
      }
      closeModal();
    } catch (err) {
      alert('Failed to authorize resource operation.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently remove this resource?')) {
      try {
        await api.notes.delete(id);
        setNotes(notes.filter(n => n.id !== id));
      } catch (err) {
        alert('Failed to delete resource.');
      }
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      description: note.description,
      link: note.file_link,
      classroomId: note.classroom_id || ''
    });
    setIsModalOpen(true);
  };

  const openUploadModal = () => {
    setEditingNote(null);
    setFormData({ title: '', description: '', link: '', classroomId: selectedClassroom || '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setFormData({ title: '', description: '', link: '', classroomId: '' });
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && classrooms.length === 0) return (
    <Layout role={role}>
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className={`animate-spin ${role === 'faculty' ? 'text-contrast' : 'text-accent'}`} size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Accessing Library Node...</p>
      </div>
    </Layout>
  );

  return (
    <Layout role={role}>
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <p className="text-contrast font-black tracking-widest text-[10px] uppercase mb-3">Institutional Repository</p>
            <h1 className="text-5xl font-black text-text-main tracking-tight">Study Notes</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <select 
               className="bg-primary/20 border border-border-card rounded-2xl py-3 px-4 text-xs font-bold focus:border-contrast outline-none text-text-main"
               value={selectedClassroom}
               onChange={(e) => setSelectedClassroom(e.target.value)}
            >
               <option value="" disabled>Select Classroom...</option>
               {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-contrast transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-secondary-bg border border-border-card rounded-2xl py-3 pl-12 pr-6 text-xs font-bold focus:border-contrast outline-none transition-all w-full md:w-48 shadow-2xl text-text-main"
              />
            </div>
            {role === 'faculty' && (
              <Button onClick={openUploadModal} className="flex items-center gap-3 px-6 rounded-2xl whitespace-nowrap">
                <PlusCircle size={18} />
                Upload Network Link
              </Button>
            )}
          </div>
        </header>

        {!selectedClassroom ? (
           <EmptyState 
             title="No Target Node" 
             message="Select a classroom to view associated study resources."
             icon={StickyNote}
           />
        ) : filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredNotes.map((note) => (
              <div key={note.id} className="group bg-secondary-bg hover:bg-card-bg border border-border-card p-8 rounded-[36px] transition-all duration-500 flex flex-col justify-between space-y-8 hover:border-contrast/30">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-4 rounded-3xl bg-contrast/10 text-contrast group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-contrast/5">
                      <FileText size={28} />
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted border border-border-card px-4 py-1.5 rounded-full bg-card-bg/20">
                        <Calendar size={12} className="text-contrast" />
                        {new Date(note.created_at).toLocaleDateString()}
                      </div>
                      {role === 'faculty' && (
                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(note)} className="p-2 text-text-muted hover:text-contrast transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(note.id)} className="p-2 text-text-muted hover:text-accent transition-colors"><Trash2 size={14} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-text-main mb-3 group-hover:text-contrast transition-colors tracking-tight">{note.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed font-medium">
                      {note.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-card-bg border-4 border-primary flex items-center justify-center text-[10px] font-black text-text-muted">{note.uploaded_by_name?.[0] || 'U'}</div>
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">By {note.uploaded_by_name || 'Faculty'}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => note.file_link && window.open(note.file_link, '_blank')}
                    className="rounded-2xl group-hover:bg-contrast/10 group-hover:text-contrast group-hover:border-contrast/30 border border-border-card px-6 py-4 flex items-center gap-2"
                  >
                      Open Note
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="Archival Library Empty" 
            message="No study materials or links have been uploaded to this classroom yet."
            icon={StickyNote}
            action={role === 'faculty' && (
              <Button onClick={openUploadModal} className="flex items-center gap-2">
                <Plus size={18} /> Add Resource
              </Button>
            )}
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingNote ? 'Refine External Link' : 'Upload External Note'}>
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Target Classroom</label>
               <select 
                 className="w-full bg-primary/10 border border-border-card rounded-2xl py-4 px-6 text-sm text-text-main focus:border-contrast outline-none appearance-none"
                 value={formData.classroomId}
                 onChange={(e) => setFormData({...formData, classroomId: e.target.value})}
                 required
               >
                  <option value="" disabled>Deploy payload to...</option>
                  {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Title</label>
               <input 
                 className="w-full bg-primary/10 border border-border-card rounded-2xl py-4 px-6 text-sm focus:border-contrast outline-none shadow-inner text-text-main" 
                 placeholder="e.g. Chapter 4 Reference" 
                 value={formData.title}
                 onChange={(e) => setFormData({...formData, title: e.target.value})}
                 required
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">OneDrive / Google Drive Link</label>
               <input 
                 type="url"
                 className="w-full bg-primary/10 border border-border-card rounded-2xl py-4 px-6 text-sm focus:border-contrast outline-none shadow-inner text-text-main" 
                 placeholder="https://..." 
                 value={formData.link}
                 onChange={(e) => setFormData({...formData, link: e.target.value})}
                 required
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Description (Optional)</label>
               <textarea 
                 rows="3" 
                 className="w-full bg-primary/10 border border-border-card rounded-2xl py-4 px-6 text-sm focus:border-contrast outline-none resize-none shadow-inner text-text-main" 
                 placeholder="Optional technical overview..."
                 value={formData.description}
                 onChange={(e) => setFormData({...formData, description: e.target.value})}
               ></textarea>
            </div>
            <Button className="w-full py-5 text-sm rounded-[24px]" type="submit">
              {editingNote ? 'Protocol Update' : 'Publish to Target Node'}
            </Button>
         </form>
      </Modal>
    </Layout>
  );
};

export default Notes;
