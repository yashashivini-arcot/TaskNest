import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { api } from '../services/api';
import { Mail, Shield, UserPlus, ArrowUpRight, Loader2, Users as UsersIcon, Plus, X } from 'lucide-react';

const StudentGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const fetchGroups = async () => {
    try {
      const data = await api.groups.getAll();
      setGroups(data);
      if (data.length > 0 && !activeGroup) {
        setActiveGroup(data[0]);
      } else if (data.length > 0 && activeGroup) {
        const updatedActive = data.find(g => g.id === activeGroup.id);
        setActiveGroup(updatedActive || data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch group data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await api.groups.create({ name: newGroupName });
      setNewGroupName('');
      setIsCreateModalOpen(false);
      fetchGroups();
    } catch (err) {
      alert('Failed to initialize new team node.');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!activeGroup) return;
    try {
      await api.groups.addMember(activeGroup.id, { email: inviteEmail });
      setInviteEmail('');
      setIsInviteModalOpen(false);
      fetchGroups();
    } catch (err) {
      alert('Student not found or authorization failed.');
    }
  };

  if (loading) return (
    <Layout role="student">
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-accent animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Synchronizing Team Node...</p>
      </div>
    </Layout>
  );

  return (
    <Layout role="student">
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-accent font-black tracking-widest text-[10px] uppercase mb-4">Collaborative Network</p>
            <h1 className="text-5xl font-black text-text-main tracking-tight">Student Teams</h1>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-3 px-8 rounded-2xl">
            <Plus size={20} />
            Initialize Team
          </Button>
        </header>

        {groups.length === 0 ? (
          <div className="bg-secondary-bg p-20 rounded-[48px] border border-border-card text-center space-y-8 shadow-2xl">
            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
              <UsersIcon size={48} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-text-main">No Active Formations</h2>
              <p className="text-text-muted max-w-md mx-auto font-medium">You are not currently synced with any student groups. Create a new team to begin collaborative objectives.</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="px-10">Create Your First Group</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Sidebar: Group List */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted px-4 mb-4">My Formations</p>
              {groups.map(g => (
                <button 
                  key={g.id}
                  onClick={() => setActiveGroup(g)}
                  className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${
                    activeGroup?.id === g.id 
                    ? 'bg-card-bg border-accent shadow-xl shadow-accent/5 translate-x-1' 
                    : 'bg-secondary-bg border-border-card hover:border-accent/30 text-text-muted'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${activeGroup?.id === g.id ? 'bg-accent/10 text-accent' : 'bg-primary/20'}`}>
                      {g.name[0]}
                    </div>
                    <span className="font-bold text-sm tracking-tight">{g.name}</span>
                  </div>
                  {activeGroup?.id === g.id && <ArrowUpRight size={16} className="text-accent" />}
                </button>
              ))}
            </div>

            {/* Main Content: Group Details */}
            <div className="lg:col-span-2 space-y-10">
              {activeGroup && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
                  <div className="bg-secondary-bg rounded-[40px] border border-border-card shadow-2xl overflow-hidden">
                    <div className="p-10 border-b border-border-card flex items-center justify-between bg-card-bg/30">
                       <div>
                         <h2 className="text-3xl font-black text-text-main mb-1">{activeGroup.name}</h2>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Active Protocol</p>
                       </div>
                       <Button variant="ghost" className="rounded-xl p-3 border border-border-card hover:border-accent/30" onClick={() => setIsInviteModalOpen(true)}>
                         <UserPlus size={20} className="text-accent" />
                       </Button>
                    </div>

                    <div className="divide-y divide-border-card">
                       {activeGroup.members?.map((member, idx) => (
                         <div key={idx} className="flex items-center justify-between p-8 hover:bg-card-bg/40 transition-colors group">
                           <div className="flex items-center gap-6">
                             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-border-card flex items-center justify-center text-accent font-black text-xl shadow-inner">
                               {member.name[0]}
                             </div>
                             <div>
                               <h4 className="font-bold text-text-main text-lg leading-tight">{member.name}</h4>
                               <div className="flex items-center gap-2 mt-1">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                   {member.id === activeGroup.created_by ? 'Team Architect' : 'Collaborator'}
                                 </p>
                                 {member.id === activeGroup.created_by && <Shield size={10} className="text-contrast" />}
                               </div>
                             </div>
                           </div>
                           <a href={`mailto:${member.email}`} className="p-3 rounded-xl bg-primary/20 text-text-muted hover:text-accent hover:bg-card-bg transition-all opacity-0 group-hover:opacity-100">
                             <Mail size={18} />
                           </a>
                         </div>
                       ))}
                    </div>

                    <button 
                      onClick={() => setIsInviteModalOpen(true)}
                      className="w-full p-8 flex items-center justify-center gap-3 bg-primary/10 hover:bg-accent/5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-all group"
                    >
                      <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                      Add Field Student
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Modal */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Initialize New Formation">
           <form onSubmit={handleCreateGroup} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Organization Name</label>
                 <input 
                   className="w-full bg-primary/10 border border-border-card rounded-2xl py-4 px-6 text-sm text-text-main focus:border-accent outline-none shadow-inner" 
                   placeholder="e.g. Project X Team" 
                   value={newGroupName}
                   onChange={(e) => setNewGroupName(e.target.value)}
                   required
                 />
              </div>
              <Button className="w-full py-5 rounded-[24px]" type="submit">Deploy Team Node</Button>
           </form>
        </Modal>

        {/* Invite Modal */}
        <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Broadcast Team Invite">
           <form onSubmit={handleInvite} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Institutional Email</label>
                 <input 
                   className="w-full bg-primary/10 border border-border-card rounded-2xl py-4 px-6 text-sm text-text-main focus:border-contrast outline-none shadow-inner" 
                   placeholder="student@university.edu" 
                   value={inviteEmail}
                   onChange={(e) => setInviteEmail(e.target.value)}
                   required
                 />
              </div>
              <Button className="w-full py-5 rounded-[24px] shadow-contrast/20" type="submit">Invite Collaborator</Button>
           </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default StudentGroups;
