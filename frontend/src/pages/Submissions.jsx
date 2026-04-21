import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Search, ExternalLink, MessageCircle, Award, CheckCircle2, ShieldCheck, ClipboardCheck, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

const Submissions = () => {
  const { assignmentId } = useParams(); // present when coming from a specific assignment
  const navigate = useNavigate();
  const [selectedSub, setSelectedSub] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeData, setGradeData] = useState({ grade: 'A (Excellent)', feedback: '' });
  const [assignmentTitle, setAssignmentTitle] = useState('');

  const fetchSubmissions = async () => {
    try {
      let data;
      if (assignmentId) {
        data = await api.submissions.getByAssignment(assignmentId);
        if (data.length > 0) setAssignmentTitle(data[0].assignment_title);
      } else {
        data = await api.submissions.getAll();
      }
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch submissions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const handleEvaluateClick = (sub) => {
    setSelectedSub(sub);
    setGradeData({ grade: sub.grade || 'A (Excellent)', feedback: sub.feedback || '' });
    setIsGradeModalOpen(true);
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.submissions.evaluate(selectedSub.id, gradeData);
      await fetchSubmissions();
      setIsGradeModalOpen(false);
    } catch (err) {
      alert('Failed to save grade. Please try again.');
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'bg-white/5 text-text-muted border-white/5';
    if (grade.startsWith('A')) return 'bg-contrast/10 text-contrast border-contrast/20';
    if (grade.startsWith('B')) return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
    return 'bg-accent/10 text-accent border-accent/20';
  };

  const filteredSubmissions = submissions.filter(s =>
    s.group_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.assignment_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <Layout role="faculty">
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-contrast animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Loading Submissions...</p>
      </div>
    </Layout>
  );

  return (
    <Layout role="faculty">
      <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            {assignmentId && (
              <button
                onClick={() => navigate('/faculty/assignments')}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors mb-4"
              >
                <ArrowLeft size={12} />
                Back to Assignments
              </button>
            )}
            <p className="text-accent font-black tracking-widest text-[10px] uppercase mb-4">Academic Validation</p>
            <h1 className="text-5xl font-black text-text-main tracking-tight">
              {assignmentId && assignmentTitle ? assignmentTitle : 'All Submissions'}
            </h1>
            {assignmentId && (
              <p className="text-text-muted text-xs mt-2 font-bold uppercase tracking-widest">
                {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
            <input
              type="text"
              placeholder="Filter by group, student, or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-secondary-bg border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-xs font-bold focus:border-accent outline-none transition-all w-full md:w-80 shadow-2xl"
            />
          </div>
        </header>

        {submissions.length > 0 ? (
          <div className="bg-secondary-bg rounded-[40px] border border-white/5 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/5 bg-primary/40 backdrop-blur-xl">
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Student / Group</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Assignment</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted text-center">Status</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted text-center">Grade</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-primary/20 transition-all group">
                      <td className="p-8">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-card-bg border border-border-card flex items-center justify-center font-black text-sm text-accent shadow-inner group-hover:scale-105 transition-transform">
                            {(sub.group_name || sub.student_name || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-text-main text-base leading-tight mb-1 group-hover:text-accent transition-colors">
                              {sub.group_name || sub.student_name || 'Unknown'}
                            </p>
                            {sub.student_email && (
                              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{sub.student_email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="space-y-1">
                          <p className="text-sm text-text-main font-black truncate max-w-[200px]">{sub.assignment_title}</p>
                          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                            {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : '—'}
                          </p>
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border inline-flex items-center gap-2 ${
                          sub.status === 'Graded'
                            ? 'bg-blue-400/5 text-blue-400 border-blue-400/10'
                            : sub.status === 'Submitted'
                            ? 'bg-contrast/5 text-contrast border-contrast/10'
                            : 'bg-accent/5 text-accent border-accent/10'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            sub.status === 'Graded' ? 'bg-blue-400' : sub.status === 'Submitted' ? 'bg-contrast' : 'bg-accent'
                          }`}></div>
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-8 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-xs font-black border transition-all ${getGradeColor(sub.grade)}`}>
                          {sub.grade || '—'}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEvaluateClick(sub)}
                            className="px-5 py-2.5 bg-accent text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-accent/10 hover:scale-105 active:scale-95 transition-all"
                          >
                            {sub.grade ? 'Re-grade' : 'Grade'}
                          </button>
                          <button
                            onClick={() => sub.file_url ? window.open(sub.file_url, '_blank') : alert('No file attached to this submission.')}
                            className={`p-3 rounded-2xl transition-all border ${sub.file_url ? 'bg-contrast/10 text-contrast border-contrast/20 hover:scale-110' : 'bg-primary/20 text-text-muted border-border-card opacity-40 cursor-not-allowed'}`}
                            title={sub.file_url ? 'Open submitted file' : 'No file attached'}
                          >
                            <ExternalLink size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title={assignmentId ? 'No Submissions Yet' : 'No Submissions Found'}
            message={assignmentId ? 'Students have not submitted this assignment yet.' : 'No submissions have been made yet.'}
            icon={ClipboardCheck}
          />
        )}
      </div>

      {/* Grade Modal */}
      <Modal isOpen={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)} title="Grade Submission">
        <form onSubmit={handleGradeSubmit} className="space-y-8">
          <div className="p-6 bg-accent/5 rounded-3xl border border-accent/10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-accent/10 rounded-2xl text-accent">
                <Award size={28} />
              </div>
              <div>
                <p className="text-lg font-black text-text-main leading-tight mb-1">
                  {selectedSub?.group_name || selectedSub?.student_name}
                </p>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                  {selectedSub?.assignment_title}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 opacity-50">Status</p>
              <p className="text-sm font-black text-accent">{selectedSub?.status}</p>
            </div>
          </div>

          {selectedSub?.file_url && (
            <a
              href={selectedSub.file_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-4 bg-primary/20 rounded-2xl border border-border-card text-xs font-black text-text-muted hover:text-accent hover:border-accent/30 transition-all"
            >
              <ExternalLink size={16} />
              View Submitted File
            </a>
          )}

          {selectedSub?.comment && (
            <div className="p-4 bg-primary/20 rounded-2xl border border-border-card">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Student Comment</p>
              <p className="text-sm text-text-main">{selectedSub.comment}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2">Grade</label>
              <select
                value={gradeData.grade}
                onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                className="w-full bg-primary/30 border border-border-card rounded-2xl py-4 px-6 text-sm text-text-main font-bold appearance-none hover:border-accent transition-colors cursor-pointer"
              >
                <option>A+ (Distinction)</option>
                <option>A (Excellent)</option>
                <option>B (Good)</option>
                <option>C (Average)</option>
                <option>F (Failed)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2">Feedback</label>
              <input
                type="text"
                value={gradeData.feedback}
                onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                className="w-full bg-primary/30 border border-border-card rounded-2xl py-4 px-6 text-sm text-text-main font-bold outline-none focus:border-accent transition-all placeholder:text-text-muted/40"
                placeholder="Optional feedback..."
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="ghost" className="flex-1 py-5 rounded-3xl" type="button" onClick={() => setIsGradeModalOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-[2] py-5 rounded-3xl flex items-center justify-center gap-3 shadow-accent/20" type="submit">
              <CheckCircle2 size={20} />
              Save Grade
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Submissions;
