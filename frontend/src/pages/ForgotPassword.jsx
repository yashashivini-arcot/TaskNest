import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Mail, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);
    try {
      const data = await api.auth.forgotPassword(email);
      setMsg(data.msg || 'If your email is registered, a reset link has been sent.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-primary text-text-main">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
        <header className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={12} />
            Back to Login
          </Link>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-accent to-contrast">
            Forgot Password
          </h1>
          <p className="text-text-muted text-xs mt-2">Enter your email to receive a reset link.</p>
        </header>

        <div className="bg-secondary-bg p-8 rounded-3xl border border-border-card shadow-2xl">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-500/10 text-green-400 rounded-xl text-xs font-bold uppercase tracking-wide">
                {msg}
              </div>
              <p className="text-text-muted text-[10px] uppercase tracking-widest">
                Check your server logs if running in dev mode.
              </p>
              <Link to="/login" className="block mt-4 text-accent text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-center text-xs font-bold uppercase">
                  {error}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-primary/10 border border-border-card rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-accent/50 outline-none transition-all text-text-main"
                    placeholder="name@university.edu"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <Button className="w-full mt-4 rounded-2xl py-4" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
