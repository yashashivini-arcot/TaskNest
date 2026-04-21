import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import Card from '../components/Card';
import { SubmissionDonutChart, AssignmentBarChart } from '../components/AnalyticsCharts';
import { api } from '../services/api';
import { FileText, Filter, Loader2, School, Users } from 'lucide-react';

const FacultyDashboard = () => {
  const [data, setData] = useState({
    assignments: [],
    groups: [],
    submissions: [],
    classrooms: []
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch each independently — one failure won't crash the whole dashboard
      const [assignmentsResult, groupsResult, submissionsResult, classroomsResult] = await Promise.allSettled([
        api.assignments.getAll(),
        api.groups.getAll(),
        api.submissions.getAll(),
        api.classrooms.getAll(),
      ]);

      const newErrors = {};

      const assignments = assignmentsResult.status === 'fulfilled'
        ? assignmentsResult.value
        : (newErrors.assignments = assignmentsResult.reason?.message, []);

      const groups = groupsResult.status === 'fulfilled'
        ? groupsResult.value
        : (newErrors.groups = groupsResult.reason?.message, []);

      const submissions = submissionsResult.status === 'fulfilled'
        ? submissionsResult.value
        : (newErrors.submissions = submissionsResult.reason?.message, []);

      const classrooms = classroomsResult.status === 'fulfilled'
        ? classroomsResult.value
        : (newErrors.classrooms = classroomsResult.reason?.message, []);

      setData({ assignments, groups, submissions, classrooms });
      setErrors(newErrors);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return (
    <Layout role="faculty">
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-contrast animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Loading Dashboard...</p>
      </div>
    </Layout>
  );

  const stats = [
    { label: 'Assignments', value: data.assignments.length, icon: FileText, color: 'text-accent' },
    { label: 'Classrooms', value: data.classrooms.length, icon: School, color: 'text-contrast' },
    { label: 'Groups', value: data.groups.length, icon: Users, color: 'text-blue-400' },
  ];

  const barData = data.assignments.length > 0
    ? data.assignments.slice(0, 4).map(asgn => ({
        label: asgn.title,
        value: data.submissions.filter(sub => sub.assignment_id === asgn.id).length,
      }))
    : [{ label: 'No Data', value: 0 }];

  const submittedCount = data.submissions.filter(s => s.status !== 'Pending').length;
  const pendingCount = Math.max(0, data.assignments.length * data.groups.length - submittedCount);

  const sortedSubmissions = [...data.submissions].sort((a, b) => {
    const dateA = new Date(a.submitted_at || 0);
    const dateB = new Date(b.submitted_at || 0);
    return sortDesc ? dateB - dateA : dateA - dateB;
  });

  return (
    <Layout role="faculty">
      <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-accent font-black tracking-widest text-[10px] uppercase mb-3">Institutional Oversight</p>
            <h1 className="text-5xl font-black text-text-main tracking-tight">Academic Analytics</h1>
          </div>
          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="flex items-center gap-3 px-8 py-3 bg-secondary-bg border border-border-card rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-card-bg hover:border-accent/30 transition-all shadow-2xl text-text-main"
          >
            <Filter size={16} className="text-accent" />
            Sort: {sortDesc ? 'Newest First' : 'Oldest First'}
          </button>
        </header>

        {/* Show non-fatal errors as warnings */}
        {Object.keys(errors).length > 0 && (
          <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl text-xs font-bold text-accent/80 uppercase tracking-widest">
            ⚠ Some data failed to load: {Object.keys(errors).join(', ')}. Other sections are still available.
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="group hover:scale-[1.02] transition-transform duration-500">
              <div className="flex justify-between items-center px-2">
                <div className="text-left">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-50">{stat.label}</p>
                  <p className="text-4xl font-black text-text-main group-hover:text-accent transition-colors">{stat.value}</p>
                </div>
                <div className={`p-5 rounded-2xl bg-primary/10 border border-border-card ${stat.color} group-hover:bg-accent/10 transition-colors`}>
                  <stat.icon size={28} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Card title="Global Completion" subtitle="Submitted vs Pending">
            <SubmissionDonutChart submitted={submittedCount} pending={Math.max(0, pendingCount)} />
          </Card>
          <Card title="Submissions per Assignment" subtitle="Engagement Pipeline" className="lg:col-span-2">
            <AssignmentBarChart data={barData} />
          </Card>
        </div>

        {/* Recent Submissions Feed */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-contrast animate-pulse"></div>
              <h3 className="text-sm font-black text-text-main uppercase tracking-widest opacity-60">Recent Submissions</h3>
            </div>
            <p className="text-[10px] font-black text-contrast uppercase tracking-widest">{data.submissions.length} total</p>
          </div>

          <div className="bg-secondary-bg rounded-[32px] border border-border-card overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border-card bg-primary/10">
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Student / Group</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Assignment</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-center">Status</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-card">
                  {sortedSubmissions.length > 0 ? sortedSubmissions.slice(0, 10).map((sub, i) => (
                    <tr key={i} className="hover:bg-card-bg/30 transition-colors group">
                      <td className="p-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-card-bg flex items-center justify-center font-black text-xs text-accent border border-border-card shadow-inner">
                            {(sub.group_name || sub.student_name || '?')[0].toUpperCase()}
                          </div>
                          <span className="font-bold text-text-main group-hover:text-accent transition-colors">
                            {sub.group_name || sub.student_name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="p-8 text-sm text-text-muted font-bold">{sub.assignment_title}</td>
                      <td className="p-8 text-center">
                        <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                          sub.status === 'Graded'
                            ? 'bg-blue-400/5 text-blue-400 border-blue-400/10'
                            : sub.status === 'Submitted'
                            ? 'bg-contrast/5 text-contrast border-contrast/10'
                            : 'bg-accent/5 text-accent border-accent/10'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-8 text-right text-[10px] font-black text-text-muted opacity-40">
                        {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-20 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50 italic">
                          No submissions yet.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FacultyDashboard;
