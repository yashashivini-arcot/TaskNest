import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      login(data.user, data.token);
      if (data.user.role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-primary text-text-main">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-white inline-block">
              Task<span className="bg-gradient-to-r from-accent to-contrast bg-clip-text text-transparent">Nest</span>
            </h1>
          </div>
          <p className="text-text-muted text-sm font-medium">Collaborative Academic Management</p>
        </div>

        <div className="bg-secondary-bg p-8 rounded-3xl border border-border-card shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 text-center uppercase tracking-wider">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-primary/10 border border-border-card rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-accent/50 focus:ring-4 focus:ring-accent/10 outline-none transition-all text-text-main placeholder:text-text-muted/40"
                  placeholder="name@university.edu"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-primary/10 border border-border-card rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-accent/50 focus:ring-4 focus:ring-accent/10 outline-none transition-all text-text-main placeholder:text-text-muted/40"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button className="w-full mt-4 rounded-2xl py-4" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </Button>

            <div className="flex justify-between items-center mt-4">
              <Link
                to="/forgot-password"
                className="text-[10px] font-black text-accent/80 hover:text-accent uppercase tracking-widest transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-text-muted mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-accent font-bold hover:text-white transition-colors border-b border-accent/10 pb-0.5 ml-2"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
