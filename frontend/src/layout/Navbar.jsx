import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Bell, LayoutDashboard, Users, BookOpen, Menu, X, StickyNote, Calendar, Sun, Moon, School, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ role = 'student' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Team', path: '/student/group', icon: Users },
    { name: 'Tasks', path: '/student/assignments', icon: BookOpen },
    { name: 'Notes', path: '/student/notes', icon: StickyNote },
  ];

  const facultyLinks = [
    { name: 'Board', path: '/faculty/dashboard', icon: LayoutDashboard },
    { name: 'Nodes', path: '/faculty/classrooms', icon: School },
    { name: 'Design', path: '/faculty/assignments', icon: BookOpen },
    { name: 'Audit', path: '/faculty/submissions', icon: Users },
    { name: 'Notes', path: '/faculty/notes', icon: StickyNote },
  ];

  const links = role === 'faculty' ? facultyLinks : studentLinks;

  return (
    <nav className="bg-primary/40 backdrop-blur-xl border-b border-border-card sticky top-0 z-50 px-6 py-3 flex justify-between items-center w-full">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-white">
              Task<span className="bg-gradient-to-r from-accent to-contrast bg-clip-text text-transparent">Nest</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  location.pathname === link.path ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-muted hover:text-text-main hover:bg-card-bg/50'
                }`}
              >
                <link.icon size={14} />
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-text-muted hover:text-text-main hover:bg-card-bg/50 rounded-xl transition-all"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="p-2 text-text-muted hover:text-text-main hover:bg-card-bg/50 rounded-xl transition-all relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full"></span>
          </button>
          
          <div className="h-6 w-px bg-border-card mx-2"></div>

          <div className="flex items-center gap-3">
             <div 
               className="w-8 h-8 rounded-full bg-card-bg border border-white/10 flex items-center justify-center text-[10px] font-black text-accent uppercase tracking-tighter cursor-pointer hover:border-accent transition-all shadow-inner" 
               onClick={handleLogout}
               title="Click to Terminate Session"
             >
               {user?.name?.[0] || 'U'}
             </div>
             <button className="md:hidden p-2 text-text-muted" onClick={() => setIsOpen(!isOpen)}>
               {isOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-secondary-bg border-b border-white/10 p-4 animate-in slide-in-from-top duration-200 shadow-2xl z-50">
           {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === link.path ? 'bg-accent text-white' : 'text-text-muted'
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            ))}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 text-accent font-bold mt-2 hover:bg-white/5 rounded-xl transition-all"
            >
              <LogOut size={18} /> Log Out
            </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
