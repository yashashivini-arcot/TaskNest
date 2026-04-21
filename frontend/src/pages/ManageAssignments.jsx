import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Plus, Edit2, Trash2, Calendar, Users, ExternalLink, Award, FileText, PlusCircle, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ManageAssignments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    oneDriveLink: '',
    assignment_type: 'group',
    targetType: 'classroom',
    targetId: ''
  });

  const fetchData = async () => {
    try {
      const [asgns, cls, grps, stds] = await Promise.all([
        api.assignments.getAll(),
        api.classrooms.getAll(),
        api.groups.getAll(),
        api.users.getAllStudents()
      ]);
      setAssignments(asgns);
      setClassrooms(cls);
      setGroups(grps);
      setStudents(stds);
    } catch (err) {
      console.error('Failed to fetch institutional data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (asgn) => {
    setEditingAssignment(asgn);
    const primaryTarget = asgn.targets?.[0];
    setFormData({
      title: asgn.title,
      description: asgn.description,
      dueDate: asgn.due_date.split('T')[0],
      oneDriveLink: asgn.link || '',
      assignment_type: asgn.assignment_type || 'group',
      targetType: primaryTarget?.type || 'classroom',
      targetId: primaryTarget?.id || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this academic objective?')) {
      try {
        await api.assignments.delete(id);
        setAssignments(assignments.filter(a => a.id !== id));
      } catch (err) {
        alert('Failed to delete assignment');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await api.assignments.update(editingAssignment.id, {
          title: formData.title,
          description: formData.description,
          due_date: formData.dueDate,
          link: formData.oneDriveLink,
          assignment_type: formData.assignment_type,
          targets: formData.targetId ? [{ type: formData.targetType, id: parseInt(formData.targetId) }] : []
        });
      } else {
        await api.assignments.create({
          title: formData.title,
          description: formData.description,
          due_date: formData.dueDate,
          link: formData.oneDriveLink,
          assignment_type: formData.assignment_type,
          targets: formData.targetId ? [{ type: formData.targetType, id: parseInt(formData.targetId) }] : []
        });
      }
      fetchData();
      closeModal();
    } catch (err) {
      alert('Failed to broadcast academic objective.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      oneDriveLink: '',
      assignment_type: 'group',
      targetType: 'classroom',
      targetId: ''
    });
  };

  if (loading) return (
    <Layout role="faculty">
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-contrast animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Synchronizing Curricula...</p>
      </div>
    </Layout>
  );

  return (
    <Layout role="faculty">
      <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <p className="text-accent font-black tracking-widest text-[10px] uppercase mb-4">Course Curricula</p>
            <h1 className="text-5xl font-black text-text-main tracking-tight">Academic Objectives</h1>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 px-8 py-4 rounded-2xl shadow-accent/20">
             <PlusCircle size={20} />
             Create New Task
          </Button>
        </header>

        {assignments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {assignments.map((asgn) => (
              <Card key={asgn.id} title={asgn.title} actions={
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(asgn)} 
                    className="p-2.5 text-text-muted hover:text-contrast transition-all bg-primary/20 rounded-xl border border-border-card hover:border-contrast/30 hover:scale-110"
                    title="Edit Task"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(asgn.id)}
                    className="p-2.5 text-text-muted hover:text-accent transition-all bg-primary/20 rounded-xl border border-border-card hover:border-accent/30 hover:scale-110"
                    title="Remove Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              }>
                <div className="space-y-6 mt-4">
                  <p className="text-sm text-text-muted leading-relaxed font-medium min-h-[3rem]">
                    {asgn.description}
                  </p>
                  
                  <div className="h-px bg-border-card w-full opacity-30"></div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">Due Date</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                        <Calendar size={14} className="text-accent" />
                        <span>{new Date(asgn.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">Audience</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                        <Users size={14} className="text-contrast" />
                        <span>{asgn.assigned_to || 'All Students'}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 col-span-2 md:col-span-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50 text-right md:text-left">Vault</p>
                      <div className="flex justify-end md:justify-start">
                        <a href={asgn.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-black text-accent hover:underline transition-colors group">
                           <ExternalLink size={14} className="group-hover:scale-110 transition-transform" />
                           Repository
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <button
  onClick={() => navigate(`/faculty/submissions/${asgn.id}`)}
  className="w-full flex items-center justify-center gap-2 py-4 bg-primary/20 hover:bg-card-bg text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent rounded-2xl border border-border-card transition-all group mt-2"
>
  Review Current Submissions
  <ArrowRight
    size={14}
    className="group-hover:translate-x-1 transition-transform"
  />
</button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="Syllabus is Empty" 
            message="No assignments have been published to the student network yet."
            icon={FileText}
            action={
               <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                 <Plus size={18} /> Add First Task
               </Button>
            }
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingAssignment ? 'Refine Objective' : 'New Assignment'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Type</label>
                <div className="flex gap-2 p-1 bg-primary/20 rounded-2xl border border-border-card">
                  {['group', 'individual'].map(type => (
                    <button 
                      key={type} type="button" 
                      onClick={() => setFormData({...formData, assignment_type: type})}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.assignment_type === type ? 'bg-card-bg text-accent shadow-lg' : 'text-text-muted hover:text-text-main hover:bg-white/5'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Target Node</label>
                <div className="flex gap-2 p-1 bg-primary/20 rounded-2xl border border-border-card">
                   {['classroom', 'group', 'student'].map(type => (
                     <button 
                       key={type} type="button" 
                       onClick={() => setFormData({...formData, targetType: type, targetId: ''})}
                       className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.targetType === type ? 'bg-card-bg text-contrast shadow-lg' : 'text-text-muted hover:text-text-main hover:bg-white/5'}`}
                     >
                       {type[0]}
                     </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Target Selection</label>
             <select 
               className="w-full bg-primary/20 border border-border-card rounded-2xl py-3.5 px-5 text-sm text-text-main focus:border-accent outline-none appearance-none"
               value={formData.targetId}
               onChange={(e) => setFormData({...formData, targetId: e.target.value})}
               required
             >
               <option value="" disabled className="bg-primary text-text-muted">Select {formData.targetType}...</option>
               {formData.targetType === 'classroom' && classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               {formData.targetType === 'group' && groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
               {formData.targetType === 'student' && students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
             </select>
          </div>

          <div className="space-y-1.5">
             <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Task Title</label>
             <input 
               className="w-full bg-primary/20 border border-border-card rounded-2xl py-3.5 px-5 text-sm text-text-main focus:border-accent outline-none transition-all shadow-inner placeholder:text-text-muted/40" 
               placeholder="e.g. Signal Processing Lab" 
               value={formData.title}
               onChange={(e) => setFormData({...formData, title: e.target.value})}
               required 
             />
          </div>

          <div className="space-y-1.5">
             <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Detailed Description</label>
             <textarea 
               rows="3" 
               className="w-full bg-primary/20 border border-border-card rounded-2xl py-3.5 px-5 text-sm text-text-main focus:border-accent outline-none transition-all resize-none shadow-inner placeholder:text-text-muted/40" 
               placeholder="Outline the technical requirements..."
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
               required
             ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Deadline</label>
               <input 
                 type="date" 
                 className="w-full bg-primary/20 border border-border-card rounded-2xl py-3.5 px-5 text-sm text-text-main outline-none focus:border-accent transition-all" 
                 value={formData.dueDate}
                 onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                 required
               />
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Repository Link</label>
               <input 
                 className="w-full bg-primary/20 border border-border-card rounded-2xl py-3.5 px-5 text-sm text-text-main focus:border-accent outline-none transition-all shadow-inner placeholder:text-text-muted/40" 
                 placeholder="OneDrive / GitHub Link" 
                 value={formData.oneDriveLink}
                 onChange={(e) => setFormData({...formData, oneDriveLink: e.target.value})}
                 required 
               />
            </div>
          </div>

          <Button className="w-full py-5 text-sm rounded-[24px] shadow-accent/20" type="submit">
            {editingAssignment ? 'Publish Refined Objective' : 'Broadcast Task to Node'}
          </Button>
        </form>
      </Modal>
    </Layout>
  );
};

export default ManageAssignments;
