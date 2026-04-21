import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { api } from '../services/api';
import { Plus, Users, UserPlus, Mail, Loader2, ArrowRight, BookOpen } from 'lucide-react';

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [activeClassroom, setActiveClassroom] = useState(null);
  const [members, setMembers] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  const fetchClassrooms = async () => {
    try {
      const data = await api.classrooms.getAll();
      setClassrooms(data);
    } catch (err) {
      console.error('Failed to fetch classrooms', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (classId) => {
    try {
      const data = await api.classrooms.getMembers(classId);
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch members', err);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await api.classrooms.create({ name: newClassName });
      setNewClassName('');
      setIsCreateModalOpen(false);
      fetchClassrooms();
    } catch (err) {
      alert('Failed to initialize classroom.');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!activeClassroom) return;
    try {
      await api.classrooms.addStudent(activeClassroom.id, { studentEmail });
      setStudentEmail('');
      fetchMembers(activeClassroom.id);
      fetchClassrooms();
      alert('Student synced to classroom node.');
    } catch (err) {
      alert('Student not found or already enrolled.');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to remove this student?')) return;
    try {
      await api.classrooms.removeStudent(activeClassroom.id, studentId);
      fetchMembers(activeClassroom.id);
      fetchClassrooms();
    } catch (err) {
      alert('Failed to remove student from node.');
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm('Are you sure you want to delete this classroom? This will purge all enrollments and associated data permanently.')) return;
    try {
      await api.classrooms.delete(id);
      fetchClassrooms();
    } catch (err) {
      alert('Failed to delete classroom.');
    }
  };

  const openMembers = (cls) => {
    setActiveClassroom(cls);
    fetchMembers(cls.id);
    setIsMemberModalOpen(true);
  };

  if (loading) return (
    <Layout role="faculty">
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-contrast animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Synchronizing Institutional Nodes...</p>
      </div>
    </Layout>
  );

  return (
    <Layout role="faculty">
      <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <p className="text-accent font-black tracking-widest text-[10px] uppercase mb-4">Educational Infrastructure</p>
            <h1 className="text-5xl font-black text-text-main tracking-tight">Classroom Nodes</h1>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-3 px-8 py-4 rounded-2xl shadow-accent/20">
             <Plus size={20} />
             Initialize Classroom
          </Button>
        </header>

        {classrooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classrooms.map((cls) => (
              <Card key={cls.id} title={cls.name} subtitle={`Node ID: #${cls.id.toString().padStart(4, '0')}`}>
                <div className="space-y-6 mt-6">
                  <div className="flex items-center justify-between p-4 bg-primary/20 rounded-2xl border border-border-card">
                     <div className="flex items-center gap-3">
                       <Users size={18} className="text-contrast" />
                       <span className="text-xs font-bold text-text-main tracking-tight">Active Capacity</span>
                     </div>
                     <span className="text-sm font-black text-accent">{cls.active_capacity || 0}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openMembers(cls)}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-card-bg hover:bg-accent text-[10px] font-black uppercase tracking-widest text-text-main hover:text-white rounded-2xl border border-border-card hover:border-accent transition-all group"
                    >
                      Manage Student Roster
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClass(cls.id)}
                      className="px-4 py-4 bg-red-500/10 hover:bg-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 rounded-2xl border border-red-500/20 hover:border-red-500/50 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-secondary-bg p-20 rounded-[48px] border border-border-card text-center space-y-8 shadow-2xl max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
              <BookOpen size={48} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-text-main">Infrastructure Offline</h2>
              <p className="text-text-muted font-medium">No classrooms have been provisioned under your authorization. Initialize your first node to begin cohort management.</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="px-10">Provision First Classroom</Button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Provision New Classroom">
         <form onSubmit={handleCreateClass} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Node Identifier (Name)</label>
               <input 
                 className="w-full bg-primary/20 border border-border-card rounded-2xl py-4 px-6 text-sm text-text-main focus:border-accent outline-none shadow-inner" 
                 placeholder="e.g. Advanced AI - Section B" 
                 value={newClassName}
                 onChange={(e) => setNewClassName(e.target.value)}
                 required
               />
            </div>
            <Button className="w-full py-5 rounded-[24px]" type="submit">Execute Provisioning</Button>
         </form>
      </Modal>

      {/* Roster Modal */}
      <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} title={`Roster Management: ${activeClassroom?.name}`}>
         <div className="space-y-8">
            <form onSubmit={handleAddMember} className="flex gap-4">
               <input 
                 className="flex-1 bg-primary/20 border border-border-card rounded-2xl py-3 px-5 text-sm text-text-main focus:border-contrast outline-none shadow-inner" 
                 placeholder="Search student email..." 
                 value={studentEmail}
                 onChange={(e) => setStudentEmail(e.target.value)}
                 required
               />
               <Button type="submit" className="rounded-2xl px-6 bg-contrast/20 text-contrast hover:bg-contrast hover:text-white">
                  <UserPlus size={20} />
               </Button>
            </form>

            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
               {members.length > 0 ? members.map(m => (
                 <div key={m.id} className="flex items-center justify-between p-4 bg-primary/10 rounded-2xl border border-border-card group hover:border-accent/30 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-card-bg flex items-center justify-center font-black text-accent shadow-sm">
                          {m.name[0]}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-text-main leading-tight">{m.name}</p>
                          <p className="text-[10px] font-medium text-text-muted">{m.email}</p>
                       </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a href={`mailto:${m.email}`} className="p-2 text-text-muted hover:text-contrast transition-colors"><Mail size={16} /></a>
                      <button onClick={() => handleRemoveStudent(m.id)} className="p-2 text-text-muted hover:text-red-500 transition-colors uppercase text-[10px] font-black">Drop</button>
                    </div>
                 </div>
               )) : (
                 <p className="text-center py-10 text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">Node Currently Empty</p>
               )}
            </div>
         </div>
      </Modal>
    </Layout>
  );
};

export default Classrooms;
