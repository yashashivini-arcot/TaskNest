import React from 'react';
import Layout from '../layout/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { Search, Filter, Download, ExternalLink, MessageCircle } from 'lucide-react';
import { dummyData } from '../data/dummyData';

const AdminSubmissions = () => {
  const submissions = dummyData.submissions;

  return (
    <Layout role="admin">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-accent font-black tracking-widest text-[10px] uppercase mb-2">Protocol Monitoring</p>
            <h1 className="text-4xl font-black text-white tracking-tight">Student Submission Audit</h1>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input 
                type="text" 
                placeholder="Audit group ID..." 
                className="bg-secondary-bg border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium focus:border-accent outline-none transition-all w-full md:w-64"
              />
            </div>
            <Button variant="ghost" className="rounded-2xl flex items-center gap-2">
              <Download size={16} />
              Export Log
            </Button>
          </div>
        </header>

        <div className="bg-secondary-bg rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5 bg-primary/30">
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Student Team</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Assignment Objective</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-center">Protocol</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {submissions.map((sub, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-all group">
                    <td className="p-8">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-xs text-accent">
                            {sub.groupName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg leading-none mb-1">{sub.groupName}</p>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Network Node {sub.id}</p>
                          </div>
                       </div>
                    </td>
                    <td className="p-8">
                      <p className="text-sm text-text-muted font-bold">{sub.assignment}</p>
                    </td>
                    <td className="p-8 text-center">
                      <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border ${
                        sub.status === 'Submitted' ? 'bg-contrast/5 text-contrast border-contrast/10' : 'bg-accent/5 text-accent border-accent/10'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-8">
                       <div className="flex items-center justify-end gap-3 text-text-muted opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                          <button className="p-3 bg-white/5 rounded-2xl hover:text-contrast hover:bg-contrast/10 transition-colors" title="Audit Files">
                            <ExternalLink size={20} />
                          </button>
                          <button className="p-3 bg-white/5 rounded-2xl hover:text-accent hover:bg-accent/10 transition-colors" title="Network Broadcast">
                            <MessageCircle size={20} />
                          </button>
                       </div>
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

export default AdminSubmissions;
