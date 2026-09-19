import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';

export const RegisterPage = () => {
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@university.edu');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    await register(name, email, password);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-2xl">
        
        {/* Left Art Panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-brand-700 via-brand-600 to-accent-violet text-white relative overflow-hidden">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold leading-tight">
              Start Your AI Career Journey Today.
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Create your account in under 60 seconds to unlock complete resume parsing, ATS scoring, and personal roadmap tracking.
            </p>
          </div>

          <div className="space-y-2 text-xs text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Free 1-Click Resume ATS Audit
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Personalized 12-Week Learning Plan
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Real-time Market Salary Predictions
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 sm:p-12 space-y-6">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Account</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Build your AI Career Twin profile in seconds
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  placeholder="Alex Rivera"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  placeholder="alex.rivera@university.edu"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="terms" required defaultChecked className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400">
                I agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
              </label>
            </div>

            <PrimaryButton type="submit" loading={loading} className="w-full py-3">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </PrimaryButton>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
