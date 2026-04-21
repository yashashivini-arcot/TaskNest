import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      const data = await api.auth.register({ ...submitData, role });
      login(data.user, data.token);
      if (data.user.role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-primary text-text-main font-sans text-xs">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-700">
        <header className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={12} />
            Return to Login
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2 mt-4">
            <h1 className="text-4xl font-bold tracking-tight text-white inline-block">
              Task<span className="bg-gradient-to-r from-accent to-contrast bg-clip-text text-transparent">Nest</span>
            </h1>
          </div>
          <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
            Create your account
          </p>
        </header>

        <div className="bg-secondary-bg p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Role selector */}
          <div className="flex p-1 bg-primary/50 rounded-2xl mb-6 border border-white/5 relative z-10">
            {['student', 'faculty'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  role === r
                    ? r === 'student'
                      ? 'bg-card-bg text-accent shadow-lg'
                      : 'bg-card-bg text-contrast shadow-lg'
                    : 'text-text-muted'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-4 relative z-10">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 text-center uppercase tracking-wider flex flex-col items-center">
                <span>{error}</span>
                {error.includes('already exists') && (
                  <Link to="/login" className="mt-2 text-accent underline hover:text-white transition-colors">
                    Go to Login
                  </Link>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50 group-focus-within:text-accent transition-colors" size={16} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-primary/30 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-accent outline-none transition-all shadow-inner"
                  placeholder="Alice Johnson"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">
                Institutional Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50 group-focus-within:text-accent transition-colors" size={16} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-primary/30 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-accent outline-none transition-all shadow-inner"
                  placeholder="id@institution.edu"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">
                Password <span className="normal-case font-normal">(min. 6 characters)</span>
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50 group-focus-within:text-accent transition-colors" size={16} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-primary/30 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-accent outline-none transition-all shadow-inner"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50 group-focus-within:text-accent transition-colors" size={16} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-primary/30 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-accent outline-none transition-all shadow-inner"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button
              className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-white transition-colors ml-2 border-b border-accent/10 pb-0.5">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
