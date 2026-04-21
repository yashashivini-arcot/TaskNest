import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, ShieldCheck, Layers } from 'lucide-react';
import Button from '../components/Button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-primary text-text-main font-sans selection:bg-accent/30 flex flex-col">
      {/* Navigation Bar */}
      <nav className="border-b border-border-card bg-secondary-bg/80 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-white">
              Task<span className="bg-gradient-to-r from-accent to-contrast bg-clip-text text-transparent">Nest</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors cursor-pointer mr-4">
                Login
              </span>
            </Link>
            <Link to="/register">
              <Button className="rounded-xl px-6 text-[10px] font-black uppercase tracking-widest shadow-accent/20">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 overflow-hidden relative">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-[10px] font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            Institutional Grade Academic Management
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter max-w-4xl leading-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Synchronize your <br />
            <span className="bg-gradient-to-r from-accent via-blue-400 to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">academic workflow.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-muted max-w-2xl font-medium mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            TaskNest is the centralized hub for managing coursework, coordinating group formations, and providing transparent, real-time feedback on academic deliverables.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-[1200ms]">
            <Link to="/login">
              <Button className="w-full sm:w-auto px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-accent/20">
                Enter TaskNest
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="max-w-7xl mx-auto px-6 py-20 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-secondary-bg/50 backdrop-blur-xl border border-border-card p-8 rounded-3xl hover:border-accent/30 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-black text-white mb-3">Structured Assignments</h3>
              <p className="text-sm text-text-muted leading-relaxed font-medium">Broadcast academic objectives, manage strict deadlines, and organize class deliverables in one continuous pipeline.</p>
            </div>
            
            <div className="bg-secondary-bg/50 backdrop-blur-xl border border-border-card p-8 rounded-3xl hover:border-contrast/30 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-contrast/10 flex items-center justify-center text-contrast mb-6 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-black text-white mb-3">Group Formations</h3>
              <p className="text-sm text-text-muted leading-relaxed font-medium">Seamlessly construct student groups, link deliverables to entire formations, and evaluate collective performance effortlessly.</p>
            </div>
            
            <div className="bg-secondary-bg/50 backdrop-blur-xl border border-border-card p-8 rounded-3xl hover:border-blue-500/30 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-black text-white mb-3">Transparent Evaluations</h3>
              <p className="text-sm text-text-muted leading-relaxed font-medium">Deliver instantaneous, robust grading feedback directly to students on individual or group assignments.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-card py-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-50">
          © {new Date().getFullYear()} TaskNest Platform. Designed for institutional excellence.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
