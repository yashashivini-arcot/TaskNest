import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Countdown from '../components/Countdown';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FileText, ChevronRight, Search, FileCheck, ExternalLink, Award, Loader2, Info, User, Users } from 'lucide-react';

const StudentAssignments = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [highlightedId, setHighlightedId] = useState(location.state?.assignmentId || null);
  const [selectedAsgn, setSelectedAsgn] = useState(null);
  const [previewAsgn, setPreviewAsgn] = useState(null);
  const [data, setData] = useState({
    assignments: [],
    submissions: [],
    groups: []
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    const [asgnsR, subsR, grpsR] = await Promise.allSettled([
      api.assignments.getAll(),
      api.submissions.getAll(),
      api.groups.getAll()
    ]);
    setData({
      assignments: asgnsR.status === 'fulfilled' ? asgnsR.value : [],
      submissions: subsR.status === 'fulfilled'  ? subsR.value  : [],
      groups:      grpsR.status === 'fulfilled'   ? grpsR.value  : [],
    });
    setLoading(false);
  };

  // Re-fetch whenever we navigate back to this page
  useEffect(() => {
    fetchData();
  }, [location.key]);

  useEffect(() => {
    if (highlightedId && !loading) {
      const element = document.getElementById(`asgn-${highlightedId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const timer = setTimeout(() => setHighlightedId(null), 3500);
        return () => clearTimeout(timer);
      }
    }
  }, [highlightedId, loading]);

  if (loading) return (
    <Layout role="student">
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-accent animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Fetching Academic Deliverables...</p>
      </div>
    </Layout>
  );

  return (
    <Layout role="student">
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-contrast font-black tracking-widest text-[10px] uppercase mb-2">Academic Deliverables</p>
            <h1 className="text-4xl font-black text-text-main tracking-tight">Tasks & Objectives</h1>
          </div>
        </header>

        <div className="space-y-4">
          {data.assignments.map((asgn) => {
            const sub = data.submissions.find(s => s.assignment_id === asgn.id);
            const isSubmitted = sub && (sub.status === 'Submitted' || sub.status === 'Graded');
            const grade = sub?.grade;
            const isGroup = asgn.assignment_type === 'group';

            return (
              <div 
                key={asgn.id} 
                id={`asgn-${asgn.id}`}
                className={`group bg-secondary-bg hover:bg-card-bg border ${highlightedId === asgn.id ? 'border-accent shadow-lg shadow-accent/10 scale-[1.01] animate-highlight' : 'border-white/5'} p-4 md:p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-500`}
              >
                 <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl bg-primary/10 border border-border-card ${isSubmitted ? 'text-contrast' : 'text-accent'}`}>
                      {isGroup ? <Users size={24} /> : <User size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-black text-text-main group-hover:text-accent transition-colors">{asgn.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${isGroup ? 'bg-accent/10 text-accent' : 'bg-contrast/10 text-contrast'}`}>
                          {asgn.assignment_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted">
                        <span>Due {new Date(asgn.due_date).toLocaleDateString()}</span>
                        <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${isSubmitted ? 'bg-contrast/10 text-contrast' : 'bg-accent/10 text-accent'}`}>
                          {isSubmitted && <FileCheck size={10} />}
                          {isSubmitted ? sub.status : 'Pending'}
                        </span>
                        {grade && (
                          <span className="flex items-center gap-1 text-contrast font-black">
                             <Award size={10} />
                             Protocol Rank: {grade}
                          </span>
                        )}
                      </div>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row items-start md:items-center gap-6 text-right">
                    {!isSubmitted && (
                      <div className="text-left md:text-right">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 opacity-50">Closing in</p>
                        <Countdown targetDate={asgn.due_date} />
                      </div>
                    )}
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button variant="ghost" size="sm" onClick={() => setPreviewAsgn(asgn)} className="rounded-xl border-border-card hover:border-contrast/30 transition-all text-text-muted hover:text-contrast">
                        <Info size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => (window.location.href = asgn.link)} className="rounded-xl border-border-card hover:border-accent/30 transition-all">
                        <ExternalLink size={16} className="mr-2" />
                        Files
                      </Button>
                      {!isSubmitted && (
                        <Button size="sm" onClick={() => navigate(`/student/submit/${asgn.id}`)} className="rounded-xl px-8 shadow-accent/20">
                          Submit
                          <ChevronRight size={16} className="ml-1" />
                        </Button>
                      )}
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={!!previewAsgn}
        onClose={() => setPreviewAsgn(null)}
        title="Objective Intelligence"
        footer={<Button onClick={() => setPreviewAsgn(null)}>Acknowledged</Button>}
      >
        <div className="space-y-6">
           <div className="flex items-center gap-4 p-5 bg-accent/5 rounded-2xl border border-accent/10">
              <FileText size={28} className="text-accent" />
              <div>
                <p className="font-black text-white text-lg">{previewAsgn?.title}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Deadline: {previewAsgn && new Date(previewAsgn.due_date).toLocaleDateString()}</p>
              </div>
           </div>
           <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-accent">Strategic Overview</p>
              <div className="bg-card-bg/50 p-6 rounded-2xl border border-border-card">
                 <p className="text-sm text-text-main leading-relaxed font-medium">
                   {previewAsgn?.description || 'No detailed intelligence available for this objective. Follow standard operational procedures for completion.'}
                 </p>
              </div>
           </div>
        </div>
      </Modal>

    </Layout>
  );
};

export default StudentAssignments;
