import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Button from '../components/Button';
import { Lock } from 'lucide-react';
import { api } from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-primary text-text-main">
        <div className="w-full max-w-sm text-center space-y-4">
          <h1 className="text-2xl font-black text-red-400 uppercase tracking-widest">Invalid Link</h1>
          <p className="text-text-muted text-xs">This reset link is missing a token. Please request a new one.</p>
          <Link to="/forgot-password" className="block text-accent text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors mt-4">
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const data = await api.auth.resetPassword(token, password);
      setSuccess(data.msg || 'Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Error resetting password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-primary text-text-main">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
        <header className="text-center">
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-accent to-contrast">
            Reset Password
          </h1>
          <p className="text-text-muted text-xs mt-2">Enter your new password below.</p>
        </header>

        <div className="bg-secondary-bg p-8 rounded-3xl border border-border-card shadow-2xl">
          {success ? (
            <div className="text-center space-y-3">
              <div className="p-4 bg-green-500/10 text-green-400 rounded-xl text-xs font-bold uppercase tracking-wide">
                {success}
              </div>
              <p className="text-text-muted text-[10px]">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-center text-xs font-bold uppercase">
                  {error}
                  {error.includes('expired') && (
                    <Link to="/forgot-password" className="block mt-2 text-accent underline hover:text-white transition-colors">
                      Request a new link
                    </Link>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">
                  New Password <span className="normal-case font-normal">(min. 6 characters)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50" size={16} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-primary/10 border border-border-card rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-accent/50 outline-none transition-all text-text-main"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50" size={16} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-primary/10 border border-border-card rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-accent/50 outline-none transition-all text-text-main"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <Button className="w-full mt-4 rounded-2xl py-4 uppercase font-black tracking-widest" type="submit" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
