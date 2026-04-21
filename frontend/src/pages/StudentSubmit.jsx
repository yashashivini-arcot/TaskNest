import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileCheck, ArrowLeft, Loader2, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

const StudentSubmit = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [asgn, setAsgn] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    fileUrl: '',
    description: '' // Optional description for the submission
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [asgns, grps] = await Promise.all([
          api.assignments.getAll(),
          api.groups.getAll()
        ]);
        const found = asgns.find(a => a.id === parseInt(taskId));
        if (!found) {
          setError('Objective intelligence not found in this sector.');
        } else {
          setAsgn(found);
          setGroups(grps);
        }
      } catch (err) {
        setError('Failed to synchronize with the academic node.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fileUrl) return;
    setSubmitError('');

    const isGroup = asgn.assignment_type === 'group';

    setSubmitting(true);
    try {
      await api.submissions.submit({
        assignmentId: asgn.id,
        groupId: isGroup && groups.length > 0 ? groups[0].id : null,
        fileUrl: formData.fileUrl,
        comment: formData.description
      });
      setSuccess(true);
      setTimeout(() => navigate('/student/assignments', { replace: false }), 2000);
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <Layout role="student">
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-accent animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted text-center tracking-tighter">Deciphering Terminal Protocol...</p>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout role="student">
      <div className="max-w-xl mx-auto mt-20 p-10 bg-secondary-bg border border-accent/20 rounded-[40px] text-center space-y-6">
        <AlertCircle size={60} className="text-accent mx-auto" />
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{error}</h2>
        <Button onClick={() => navigate('/student/assignments')} variant="ghost">Return to Objectives</Button>
      </div>
    </Layout>
  );

  return (
    <Layout role="student">
      <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Abort Protocol
        </button>

        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${asgn.assignment_type === 'group' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-contrast/10 text-contrast border border-contrast/20'}`}>
              {asgn.assignment_type} Protocol
            </span>
            <div className="h-px flex-1 bg-border-card opacity-20"></div>
          </div>
          <h1 className="text-5xl font-black text-text-main tracking-tight leading-none uppercase italic">{asgn.title}</h1>
          <p className="text-sm text-text-muted font-medium max-w-2xl leading-relaxed">{asgn.description}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-8 bg-secondary-bg border border-border-card p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
            {success && (
              <div className="absolute inset-0 bg-secondary-bg/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
                <CheckCircle2 size={64} className="text-contrast animate-bounce" />
                <p className="text-xl font-black text-white uppercase tracking-widest">Artifact Recorded</p>
                <p className="text-[10px] text-text-muted font-black uppercase">Redirecting to Intelligence Hub...</p>
              </div>
            )}

            {submitError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-bold text-red-400 text-center">
                {submitError}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1 flex items-center gap-2">
                  <LinkIcon size={12} className="text-accent" />
                  Terminal Data Link (Artifact URL)
                </label>
                <input 
                  type="url"
                  className="w-full bg-primary/10 border border-border-card rounded-3xl py-5 px-8 text-sm focus:border-accent outline-none transition-all shadow-inner text-text-main placeholder:text-text-muted/30" 
                  placeholder="https://github.com/academic-payload" 
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                  required
                />
                <p className="text-[9px] font-bold text-text-muted/40 px-2 italic uppercase">Ensure appropriate access permissions for the instructional node.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Submission Commentary (Optional)</label>
                <textarea 
                  rows="4"
                  className="w-full bg-primary/10 border border-border-card rounded-3xl py-5 px-8 text-sm focus:border-accent outline-none transition-all resize-none shadow-inner text-text-main placeholder:text-text-muted/30" 
                  placeholder="Provide technical context for this deliverable..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>

            <Button className="w-full py-6 text-sm font-black uppercase tracking-widest rounded-[32px] shadow-accent/20" type="submit" disabled={submitting}>
              {submitting ? 'Transmitting Data...' : 'Broadcast Deliverable'}
            </Button>
          </form>

          <aside className="space-y-6">
            <div className="bg-primary/20 border border-border-card p-8 rounded-[40px] space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                <AlertCircle size={14} />
                Protocol Check
              </h3>
              <ul className="space-y-4">
                {[
                  { label: 'Integrity', status: formData.fileUrl ? 'Verified' : 'Pending' },
                  { label: 'Role Sync', status: 'Active' },
                  { label: 'Deadline', status: new Date(asgn.due_date) > new Date() ? 'Secure' : 'Critical' }
                ].map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-text-muted">{item.label}</span>
                    <span className={item.status === 'Secure' || item.status === 'Active' || item.status === 'Verified' ? 'text-contrast' : 'text-accent'}>{item.status}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-8 bg-card-bg/30 border border-border-card rounded-[40px] text-center space-y-4">
              <p className="text-[9px] font-medium text-text-muted italic leading-relaxed">"Curiosity is the engine of academic advancement. Protocol confirms the recording of your intellectual contribution."</p>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default StudentSubmit;
