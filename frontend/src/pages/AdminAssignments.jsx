import React, { useState } from 'react';
import Layout from '../layout/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Calendar, Link as LinkIcon, Users, ExternalLink, Award, FileText, PlusCircle } from 'lucide-react';
import { dummyData } from '../data/dummyData';

const AdminAssignments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const assignments = dummyData.assignments;

  const handleEdit = (asgn) => {
    setEditingAssignment(asgn);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  return (
    <Layout role="admin">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-accent font-black tracking-widest text-[10px] uppercase mb-4">Course Curricula</p>
            <h1 className="text-4xl font-black text-white tracking-tight">Management Suite</h1>
          </div>
          <div className="flex gap-3">
             <Button variant="ghost" onClick={() => setIsExamModalOpen(true)} className="flex items-center gap-2 border border-white/10">
                <Calendar size={18} />
                Schedule Exam
             </Button>
             <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                <Plus size={18} />
                New Task
             </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {assignments.map((asgn) => (
            <Card key={asgn.id} title={asgn.title} actions={
              <div className="flex gap-2">
                <button onClick={() => handleEdit(asgn)} className="p-2 text-text-muted hover:text-contrast transition-colors bg-white/5 rounded-lg border border-white/5"><Edit2 size={16} /></button>
                <button className="p-2 text-text-muted hover:text-accent transition-colors bg-white/5 rounded-lg border border-white/5"><Trash2 size={16} /></button>
              </div>
            }>
              <div className="space-y-6 mt-2">
                <p className="text-sm text-text-muted leading-relaxed font-medium">{asgn.description}</p>
                
                <div className="h-px bg-white/5 w-full"></div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">Deadline</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                      <Calendar size={14} className="text-accent" />
                      <span>{new Date(asgn.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">Student Groups</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-text-main">
                      <Users size={14} className="text-contrast" />
                      <span>{asgn.assignedTo}</span>
                    </div>
                  </div>
                  <div className="space-y-1 ml-auto">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">Evaluation</p>
                    <div className="flex items-center gap-2 text-xs font-black text-contrast">
                      <Award size={14} />
                      <span>{asgn.grade || 'Ungraded'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingAssignment ? 'Update Task' : 'New Task'}>
        <form className="space-y-6">
          <div className="space-y-1">
             <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Task Title</label>
             <input className="w-full bg-primary/30 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:border-accent" placeholder="e.g. Logic Circuit Design" defaultValue={editingAssignment?.title} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Date</label>
               <input type="date" className="w-full bg-primary/30 border border-white/10 rounded-2xl py-3 px-4 text-sm" />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Grade Policy</label>
               <select className="w-full bg-primary/30 border border-white/10 rounded-2xl py-3 px-4 text-sm appearance-none">
                  <option>Letter Grades (A, B...)</option>
                  <option>Percentage (100%)</option>
               </select>
            </div>
          </div>
          <Button className="w-full py-4 text-sm" onClick={closeModal}>Publish to Students</Button>
        </form>
      </Modal>

      <Modal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} title="Schedule Exam">
         <form className="space-y-6">
            <div className="space-y-1">
               <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Subject Name</label>
               <input className="w-full bg-primary/30 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:border-accent" placeholder="e.g. Advanced Calculus" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Exam Date</label>
                 <input type="date" className="w-full bg-primary/30 border border-white/10 rounded-2xl py-3 px-4 text-sm" />
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Time</label>
                 <input type="time" className="w-full bg-primary/30 border border-white/10 rounded-2xl py-3 px-4 text-sm" />
              </div>
            </div>
            <Button className="w-full py-4 text-sm" onClick={() => setIsExamModalOpen(false)}>Add Exam to Schedule</Button>
         </form>
      </Modal>
    </Layout>
  );
};

export default AdminAssignments;
