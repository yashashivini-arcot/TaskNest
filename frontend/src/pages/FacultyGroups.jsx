import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import { api } from '../services/api';
import { Mail, ArrowUpRight, Search, Loader2, Users as UsersIcon } from 'lucide-react';

const FacultyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await api.groups.getAll();
        setGroups(data);
      } catch (error) {
        console.error('Failed to fetch groups', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return (
    <Layout role="faculty">
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-contrast animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Synchronizing Formations...</p>
      </div>
    </Layout>
  );

  return (
    <Layout role="faculty">
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-accent font-black tracking-widest text-[10px] uppercase mb-4">Class Management</p>
            <h1 className="text-4xl font-black text-text-main tracking-tight">Active Student Teams</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Filter by team identity..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-secondary-bg border border-border-card text-text-main rounded-2xl py-3 pl-10 pr-4 text-xs font-medium focus:border-accent outline-none transition-all w-full md:w-64"
            />
          </div>
        </header>

        {filteredGroups.length === 0 ? (
          <div className="bg-secondary-bg p-20 rounded-[48px] border border-border-card text-center space-y-8 shadow-2xl">
            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
              <UsersIcon size={48} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-text-main">No Groups Found</h2>
              <p className="text-text-muted max-w-md mx-auto font-medium">Students have not formed any groups yet.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredGroups.map((group) => (
              <div key={group.id} className="bg-secondary-bg border border-border-card rounded-3xl overflow-hidden shadow-2xl group hover:border-accent/30 transition-all">
                <div className="p-8 border-b border-border-card bg-primary/10 flex justify-between items-start">
                   <div>
                      <h3 className="text-xl font-black text-text-main mb-2">{group.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{group.members?.length || 0} Members</span>
                      </div>
                   </div>
                   <button className="p-3 bg-card-bg text-text-main rounded-2xl hover:bg-accent hover:text-white transition-all border border-border-card">
                      <ArrowUpRight size={18} />
                   </button>
                </div>
                <div className="p-4 space-y-2">
                   {group.members?.map((member, idx) => (
                     <div key={idx} className="flex items-center justify-between p-4 hover:bg-card-bg rounded-2xl transition-all border border-transparent hover:border-border-card">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-accent text-xs">
                             {member.name[0]}
                           </div>
                           <div>
                              <p className="font-bold text-text-main text-sm">{member.name}</p>
                              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{member.id === group.created_by ? 'Team Architect' : 'Collaborator'}</p>
                           </div>
                        </div>
                        <a href={`mailto:${member.email}`} className="p-2 text-text-muted hover:text-accent"><Mail size={16} /></a>
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FacultyGroups;
