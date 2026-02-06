import React, { useState } from 'react';
import { supabase } from '@/api/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      navigate('/Dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName } }
      });
      if (signUpError) throw signUpError;

      if (authData.user) {
        await supabase.from('profiles').insert([{
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName,
          role: 'user'
        }]).then(() => {});
      }

      setSuccess('Account created! Check your email to verify.');
      setFormData({ email: '', password: '', fullName: '', confirmPassword: '' });
      setTimeout(() => { setMode('login'); setSuccess(null); }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">VibeDeveloper AI</h1>
          </div>
          <p className="text-muted-foreground">
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </p>
        </motion.div>

        <div className="bg-card border border-border rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-center text-foreground mb-1">
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-6">
            {mode === 'login'
              ? 'Enter your credentials to access your account'
              : 'Start planning your apps with AI assistance'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <User className="h-4 w-4" /> Full Name *
                </label>
                <input id="fullName" name="fullName" type="text" placeholder="John Doe"
                  value={formData.fullName} onChange={handleChange} required className={inputClass} />
              </div>
            )}

            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Mail className="h-4 w-4" /> Email *
              </label>
              <input id="email" name="email" type="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Lock className="h-4 w-4" /> Password *
              </label>
              <input id="password" name="password" type="password" placeholder="••••••••"
                value={formData.password} onChange={handleChange} required minLength={6} className={inputClass} />
              {mode === 'signup' && (
                <p className="text-xs text-muted-foreground mt-1">Must be at least 6 characters</p>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Lock className="h-4 w-4" /> Confirm Password *
                </label>
                <input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••"
                  value={formData.confirmPassword} onChange={handleChange} required minLength={6} className={inputClass} />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setSuccess(null); }}
              className="text-sm text-primary hover:underline"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
