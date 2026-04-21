import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Countdown from '../components/Countdown';
import CalendarModal from '../components/CalendarModal';
import ExamSchedule from '../components/ExamSchedule';
import AcademicPerformance from '../components/AcademicPerformance';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ArrowRight, Calendar as CalendarIcon, Loader2, ShieldCheck, Circle, Users, School } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [data, setData] = useState({
    assignments: [],
    exams: [],
    submissions: [],
    groups: [],
    classrooms: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Use allSettled so one failure doesn't crash the whole dashboard
      const [assignmentsR, examsR, submissionsR, groupsR, classroomsR] = await Promise.allSettled([
        api.assignments.getAll(),
        api.exams.getAll(),
        api.submissions.getAll(),
        api.groups.getAll(),
        api.classrooms.getAll(),
      ]);

      setData({
        assignments: assignmentsR.status === 'fulfilled' ? assignmentsR.value : [],
        exams:       examsR.status === 'fulfilled'       ? examsR.value       : [],
        submissions: submissionsR.status === 'fulfilled' ? submissionsR.value : [],
        groups:      groupsR.status === 'fulfilled'      ? groupsR.value      : [],
        classrooms:  classroomsR.status === 'fulfilled'  ? classroomsR.value  : [],
      });
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <Layout role="student">
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-accent animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Loading your workspace...</p>
      </div>
    </Layout>
  );

  const activeAssignments = data.assignments.filter(a => {
    const sub = data.submissions.find(s => s.assignment_id === a.id);
    return !sub || sub.status === 'Pending';
  });

  const group = data.groups[0] || null;

  const calendarEvents = [
    ...data.assignments.map(a => ({ title: a.title, date: a.due_date, type: 'deadline' })),
    ...data.exams.map(e => ({ title: e.subject, date: e.exam_date, type: 'exam' })),
  ];

  return (
    <Layout role="student">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <header>
          <p className="text-accent font-black tracking-widest text-[10px] uppercase mb-2">Workspace Overview</p>
          <h1 className="text-4xl font-black text-text-main tracking-tight">Welcome back, {user?.name}</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Group & Classroom Card */}
          <Card className="md:col-span-2 bg-gradient-to-br from-secondary-bg to-card-bg group overflow-hidden relative">
            <div className="flex flex-col md:flex-row justify-between gap-10 h-full relative z-10">
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent"><Users size={18} /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Your Group</p>
                </div>
                {group ? (
                  <>
                    <h3 className="text-3xl font-black text-text-main group-hover:text-accent transition-colors">{group.name}</h3>
                    <ProgressBar progress={0} color="bg-accent" />
                  </>
                ) : (
                  <p className="text-sm text-text-muted font-bold">Not assigned to a group yet.</p>
                )}
              </div>

              <div className="w-px bg-border-card hidden md:block"></div>

              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-contrast/10 rounded-lg text-contrast"><School size={18} /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Classroom</p>
                </div>
                <div>
                  <h3 className="text-xl font-black text-text-main">
                    {data.classrooms[0]?.name || 'Not enrolled in a classroom'}
                  </h3>
                  <p className="text-[10px] font-black tracking-widest text-text-muted uppercase mt-1">
                    {data.classrooms[0] ? 'Enrolled' : 'Ask your professor to add you'}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          </Card>

          {/* Critical Deadlines */}
          <Card title="Critical Deadlines">
            <div className="space-y-4 mt-2">
              {activeAssignments.length > 0 ? activeAssignments.slice(0, 2).map((asgn) => (
                <div
                  key={asgn.id}
                  onClick={() => navigate('/student/assignments', { state: { assignmentId: asgn.id } })}
                  className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-border-card cursor-pointer hover:border-accent/30 hover:bg-card-bg/50 transition-all group"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-text-main group-hover:text-accent transition-colors">{asgn.title}</p>
                    <Countdown targetDate={asgn.due_date} />
                  </div>
                  <ArrowRight size={20} className="text-accent group-hover:translate-x-1 transition-transform" />
                </div>
              )) : (
                <div className="text-center py-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">
                    {data.assignments.length === 0 ? 'No assignments yet' : 'All caught up!'}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Exam Schedule */}
          <div className="order-1 lg:order-none">
            <ExamSchedule exams={data.exams.slice(0, 2)} />
          </div>

          {/* Academic Performance */}
          <div className="lg:col-span-1">
            <AcademicPerformance
              completed={data.submissions.filter(s => s.status === 'Graded').length}
              pending={data.submissions.filter(s => s.status === 'Submitted').length}
              overdue={activeAssignments.filter(a => new Date(a.due_date) < new Date()).length}
            />
          </div>

          {/* Feedback / Submissions */}
          <Card title="Recent Feedback">
            {data.submissions.length > 0 ? data.submissions.slice(0, 3).map((sub, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 bg-primary/10 rounded-2xl border border-border-card hover:border-accent/30 transition-all mb-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className={`p-1.5 rounded-full ${sub.status === 'Graded' ? 'text-contrast bg-contrast/10' : 'text-text-muted bg-card-bg/50'}`}>
                    {sub.status === 'Graded' ? <ShieldCheck size={16} /> : <Circle size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-text-main leading-none mb-1">{sub.assignment_title}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">{sub.status}</p>
                  </div>
                  {sub.grade && (
                    <span className="px-3 py-1 bg-contrast/10 text-contrast border border-contrast/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {sub.grade}
                    </span>
                  )}
                </div>
                {sub.feedback && (
                  <p className="text-[10px] text-text-muted italic bg-card-bg/50 p-3 rounded-xl border border-border-card mt-1">
                    "{sub.feedback}"
                  </p>
                )}
              </div>
            )) : (
              <div className="text-center py-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50">No submissions yet</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Calendar FAB */}
      <button
        onClick={() => setIsCalendarOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-accent text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 shadow-accent/20 border-4 border-card-bg"
      >
        <CalendarIcon size={28} />
      </button>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        events={calendarEvents}
      />
    </Layout>
  );
};

export default StudentDashboard;
