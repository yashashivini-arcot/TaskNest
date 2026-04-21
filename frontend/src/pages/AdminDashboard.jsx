import React from 'react';
import Layout from '../layout/Layout';
import Card from '../components/Card';
import { dummyData } from '../data/dummyData';
import { FileText, Users, Award, TrendingUp, Filter, BookOpen } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Active Teams', value: dummyData.groups.length, icon: Users, color: 'text-accent' },
    { label: 'Deliverables', value: dummyData.assignments.length, icon: FileText, color: 'text-contrast' },
    { label: 'Submissions', value: '24', icon: Award, color: 'text-blue-400' },
    { label: 'Curricula', value: '12', icon: BookOpen, color: 'text-teal-400' },
  ];

  return (
    <Layout role="admin">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-contrast font-black tracking-widest text-[10px] uppercase mb-2">Faculty Oversight</p>
            <h1 className="text-4xl font-black text-white tracking-tight">Academic Analytics</h1>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-secondary-bg border border-white/5 rounded-2xl text-xs font-bold hover:bg-card-bg transition-colors">
            <Filter size={16} />
            Performance Filter
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <div className="flex justify-between items-start">
                 <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
                   <stat.icon size={24} />
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                   <p className="text-3xl font-black text-white">{stat.value}</p>
                 </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-black text-white uppercase tracking-widest opacity-50">Student Operation Status</h3>
            <p className="text-xs font-bold text-contrast">Real-time Feed</p>
          </div>
          
          <div className="bg-secondary-bg rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-primary/30">
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Group Identity</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Objective</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-center">Protocol Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dummyData.submissions.map((sub, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-card-bg flex items-center justify-center font-black text-xs text-accent border border-white/5">
                          {sub.groupName[0]}
                        </div>
                        <span className="font-bold text-white group-hover:text-accent transition-colors">{sub.groupName}</span>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-text-muted font-medium">{sub.assignment}</td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        sub.status === 'Submitted' ? 'bg-contrast/5 text-contrast border-contrast/10' : 'bg-accent/5 text-accent border-accent/10'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-6 text-right text-[10px] font-black text-text-muted opacity-50">
                      {sub.date || '---'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
