import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, CheckCircle2, RefreshCw, Zap, ArrowRight, Lock } from 'lucide-react';

export const AuthenticationTransition = ({
  title = "Getting you in in a few moments...",
  subtitle = "Your authentication is under process. Synchronizing with your AI Career Twin.",
  userName = "",
  onComplete = null,
  durationMs = 1800
}) => {
  const [progress, setProgress] = useState(15);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { title: "Verifying credentials & security token", detail: "OAuth 2.0 & Firebase Cloud handshake" },
    { title: "Synchronizing AI Career Twin neural profile", detail: "Loading active resume & verified skills" },
    { title: "Preparing personalized dashboard & career radar", detail: "Calibrating real-time ATS and salary benchmarks" }
  ];

  useEffect(() => {
    const intervalTime = durationMs / 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 200);
          }
          return 100;
        }
        const next = prev + 2;
        if (next > 40 && next < 75) setStepIndex(1);
        if (next >= 75) setStepIndex(2);
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [durationMs, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent-violet/20 blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-brand-500/30 shadow-2xl relative z-10 space-y-6 text-center"
      >
        {/* Animated Central Glowing Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-500/60 animate-spin" style={{ animationDuration: '6s' }} />
          {/* Inner pulsating glow */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-violet flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles className="w-8 h-8 text-white animate-bounce" />
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-bold">
            <Lock className="w-3 h-3" />
            <span>Secure Authentication</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {title}
          </h2>

          {userName && (
            <p className="text-sm font-bold text-brand-300">
              Welcome back, {userName}!
            </p>
          )}

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
            <span>Authentication Progress</span>
            <span className="text-brand-400">{progress}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Real-Time Step Badges */}
        <div className="space-y-2.5 text-left pt-2">
          {steps.map((st, idx) => {
            const isDone = progress > (idx + 1) * 32;
            const isCurrent = !isDone && progress >= idx * 30;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : isCurrent
                    ? 'bg-brand-500/15 border-brand-500/40 text-brand-200'
                    : 'bg-slate-800/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-3.5 h-3.5 text-brand-400 animate-spin" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-600" />
                    )}
                  </div>
                  <div>
                    <p className={`font-bold ${isCurrent ? 'text-white' : ''}`}>{st.title}</p>
                    <p className="text-[10px] text-slate-400">{st.detail}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  {isDone ? 'Verified' : isCurrent ? 'Active' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dashboard Capabilities Preview Animation */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2">
          <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span>Dashboard Initializing 4 Core Pillars:</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 font-semibold truncate flex items-center gap-1">
              ✓ 1. Resume ATS Score (0-100)
            </span>
            <span className="p-1.5 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/20 font-semibold truncate flex items-center gap-1">
              ✓ 2. Skill Gap Radar
            </span>
            <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/20 font-semibold truncate flex items-center gap-1">
              ✓ 3. Stipend & Salary Index
            </span>
            <span className="p-1.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/20 font-semibold truncate flex items-center gap-1">
              ✓ 4. AI Mock Interviews
            </span>
          </div>
        </div>

        {/* Quick Direct Bypass Button in case user wants instant entry */}
        {onComplete && (
          <div className="pt-2">
            <button
              onClick={onComplete}
              className="text-xs text-slate-400 hover:text-white transition-colors underline font-medium cursor-pointer"
            >
              Skip animation & enter dashboard directly &rarr;
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthenticationTransition;
