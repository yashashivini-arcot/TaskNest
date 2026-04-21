import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Edit2, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const ManageSchedule = () => {
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ subject: '', date: '', time: '' });
  const [editingExam, setEditingExam] = useState(null);

  const fetchData = async () => {
    try {
      const [examsData, asgnsData] = await Promise.all([
        api.exams.getAll(),
        api.assignments.getAll()
      ]);
      setExams(examsData);
      setAssignments(asgnsData);
    } catch (err) {
      console.error('Failed to fetch schedule data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExam = async (e) => {
    e.preventDefault();
    try {
      if (editingExam) {
        await api.exams.update(editingExam.id, {
          subject: formData.subject,
          date: formData.date,
          time: formData.time
        });
      } else {
        await api.exams.create({
          subject: formData.subject,
          date: formData.date,
          time: formData.time
        });
      }
      await fetchData();
      closeModal();
    } catch (err) {
      alert('Failed to publish exam to timeline.');
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      subject: exam.subject,
      date: exam.exam_date.split('T')[0],
      time: exam.exam_time
    });
    setIsExamModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this exam?')) {
      try {
        await api.exams.delete(id);
        await fetchData();
      } catch (err) {
        alert('Failed to delete exam');
      }
    }
  };

  const closeModal = () => {
    setIsExamModalOpen(false);
    setEditingExam(null);
    setFormData({ subject: '', date: '', time: '' });
  };

  if (loading) return (
    <Layout role="faculty">
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-contrast animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Synchronizing Timeline Node...</p>
      </div>
    </Layout>
  );

  return (
    <Layout role="faculty">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-accent font-black tracking-widest text-[10px] uppercase mb-4">Timeline Management</p>
            <h1 className="text-4xl font-black text-white tracking-tight">Academic Schedule</h1>
          </div>
          <Button onClick={() => setIsExamModalOpen(true)} className="flex items-center gap-2">
             <Plus size={18} />
             Add New Exam
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           <section className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <div className="p-2 rounded-xl bg-accent/10 text-accent">
                    <CalendarIcon size={20} />
                 </div>
                 <h2 className="text-lg font-black text-white uppercase tracking-widest">Exam Schedules</h2>
              </div>
              <div className="space-y-4">
                 {exams.length > 0 ? exams.map((exam) => (
                   <div key={exam.id} className="p-6 bg-secondary-bg border border-white/5 rounded-3xl flex items-center justify-between hover:border-accent/30 transition-all group">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-primary/30 flex flex-col items-center justify-center border border-white/5 text-accent">
                            <span className="text-xl font-black leading-none">{new Date(exam.exam_date).getDate()}</span>
                            <span className="text-[8px] font-black uppercase tracking-tighter">{new Date(exam.exam_date).toLocaleString('default', { month: 'short' })}</span>
                         </div>
                         <div>
                            <h4 className="font-bold text-white text-lg leading-tight mb-1">{exam.subject}</h4>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted">
                               <div className="flex items-center gap-1"><Clock size={10} className="text-contrast" /> {exam.exam_time}</div>
                               <div className="flex items-center gap-1"><BookOpen size={10} className="text-accent" /> Paper Node: {exam.id + 100}</div>
                            </div>
                         </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                         <button onClick={() => handleEdit(exam)} className="p-3 bg-white/5 rounded-2xl hover:text-contrast transition-colors"><Edit2 size={16} /></button>
                         <button onClick={() => handleDelete(exam.id)} className="p-3 bg-white/5 rounded-2xl hover:text-accent transition-colors"><Trash2 size={16} /></button>
                      </div>
                   </div>
                 )) : (
                   <div className="p-10 border border-dashed border-white/5 rounded-3xl text-center">
                     <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50 italic">No exams scheduled in this sector.</p>
                   </div>
                 )}
              </div>
           </section>

           <section className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <div className="p-2 rounded-xl bg-contrast/10 text-contrast">
                    <AlertCircle size={20} />
                 </div>
                 <h2 className="text-lg font-black text-white uppercase tracking-widest">Global Deadlines</h2>
              </div>
              <div className="space-y-4">
                 {assignments.length > 0 ? assignments.map((asgn) => (
                   <div key={asgn.id} className="p-6 bg-secondary-bg border border-white/5 rounded-3xl group">
                      <div className="flex justify-between items-start mb-4">
                         <h4 className="font-bold text-white text-lg leading-tight">{asgn.title}</h4>
                         <span className="text-[10px] font-black text-accent uppercase tracking-widest px-3 py-1 bg-accent/5 rounded-full border border-accent/10">Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">Closing Date</p>
                               <p className="text-xs font-bold text-text-main">{new Date(asgn.due_date).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1 text-right">
                               <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">Network Status</p>
                               <p className="text-xs font-bold text-contrast">Synchronized</p>
                            </div>
                         </div>
                      </div>
                   </div>
                 )) : (
                   <div className="p-10 border border-dashed border-white/5 rounded-3xl text-center">
                     <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50 italic">No active deadlines detected.</p>
                   </div>
                 )}
              </div>
           </section>
        </div>
      </div>

      <Modal isOpen={isExamModalOpen} onClose={closeModal} title={editingExam ? "Edit Schedule Entry" : "Add Schedule Entry"}>
         <form onSubmit={handleAddExam} className="space-y-6">
            <div className="space-y-1">
               <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Evaluation Subject</label>
               <input 
                 className="w-full bg-primary/30 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:border-accent outline-none" 
                 placeholder="e.g. Data Structures" 
                 value={formData.subject}
                 onChange={(e) => setFormData({...formData, subject: e.target.value})}
                 required
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Date</label>
                 <input 
                   type="date" 
                   className="w-full bg-primary/30 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white" 
                   value={formData.date}
                   onChange={(e) => setFormData({...formData, date: e.target.value})}
                   required
                 />
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Reporting Time</label>
                 <input 
                   type="time" 
                   className="w-full bg-primary/30 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white" 
                   value={formData.time}
                   onChange={(e) => setFormData({...formData, time: e.target.value})}
                   required
                 />
              </div>
            </div>
            <Button className="w-full py-4 text-sm rounded-2xl" type="submit">{editingExam ? "Update Timeline" : "Publish to Timeline"}</Button>
         </form>
      </Modal>
    </Layout>
  );
};

export default ManageSchedule;
