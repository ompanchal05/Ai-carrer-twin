import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Target,
  IndianRupee,
  Video,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Play,
  Pause,
  Award,
  UploadCloud,
  ChevronRight,
  Zap,
  HelpCircle
} from 'lucide-react';
import PrimaryButton from '../Buttons/PrimaryButton';
import SecondaryButton from '../Buttons/SecondaryButton';

const STEPS = [
  {
    id: 1,
    title: 'Upload Real Resume',
    subtitle: 'Step 1: The foundation of your entire AI Career Twin',
    tag: 'Resume-Centric AI',
    icon: FileText,
    color: 'emerald',
    description:
      'Upload your authentic Resume or CV (PDF or Word). The AI scans your real experience, verified skills, and projects, calculating an exact ATS Score (0 - 100). Reports, assignments, or non-resume materials are automatically filtered out.',
    visual: {
      type: 'ats',
      score: 94,
      filename: 'Arjun_Sharma_AI_Resume.pdf',
      skills: ['Python', 'PyTorch', 'React', 'FastAPI', 'Docker'],
      status: 'Verified ATS Match: 94%'
    }
  },
  {
    id: 2,
    title: '1-Click Skill Gap Radar',
    subtitle: 'Step 2: Know what top companies demand before applying',
    tag: 'FAANG / Top Tier Benchmarks',
    icon: Target,
    color: 'blue',
    description:
      'Compare your detected skills against live hiring requirements for Google India, Microsoft, NVIDIA, and Amazon. Discover your exact missing keywords and close the gap with customized 12-week roadmaps.',
    visual: {
      type: 'skills',
      target: 'Google India — Cloud AI & SDE',
      matched: ['Python (98%)', 'PyTorch (92%)', 'System Design (88%)'],
      missing: ['Kubernetes Cluster Ops', 'Vector Embeddings (Pinecone)'],
      readiness: '88% Ready'
    }
  },
  {
    id: 3,
    title: 'Salary & Internship Stipend',
    subtitle: 'Step 3: Realistic compensation index based on your profile',
    tag: 'Campus & Student Friendly',
    icon: IndianRupee,
    color: 'amber',
    description:
      'Whether you are a student seeking your first summer internship (₹25,000 – ₹55,000/month stipend) or a 2025 graduate targeting a full-time role (₹16 LPA – ₹32 LPA CTC), get real salary projections tuned to your CGPA, branch, and location.',
    visual: {
      type: 'salary',
      internship: '₹45,000 / month (Top 8% Tier)',
      fullTime: '₹24.0 LPA - ₹28.5 LPA',
      location: 'Bangalore & Hyderabad Tech Corridors'
    }
  },
  {
    id: 4,
    title: 'AI Mock Interviews & Certified Audit',
    subtitle: 'Step 4: Practice real interview questions & download official PDF',
    tag: 'Placement Ready',
    icon: Video,
    color: 'purple',
    description:
      'Practice technical & behavioral questions with real-time feedback using Google STAR methodology. Generate and download your official Executive Career Audit signed by Om Panchal (Founder & Platform Architect).',
    visual: {
      type: 'interview',
      verdict: 'Strong Hire Recommendation',
      score: '4.8 / 5.0 Rating',
      certifiedBy: 'Om Panchal (Founder & Platform Architect)'
    }
  }
];

export const HowItWorksWalkthrough = ({ isOpen, onClose, onUploadClick }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const activeStep = STEPS[activeStepIndex];

  // Auto-advance through steps smoothly if playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  How AI Career Twin Works
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  Interactive Tour
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simple, smooth, and designed so anyone can unlock their full career potential
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title={isPlaying ? "Pause tour" : "Play tour"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Auto-Play'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/40">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setActiveStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`py-3 px-2 sm:px-4 text-left transition-all relative flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-white dark:bg-slate-800/80 text-brand-600 dark:text-brand-400 font-extrabold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {s.id}
                </div>
                <div className="hidden md:block truncate">
                  <div className="text-xs truncate font-bold">{s.title}</div>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-brand-600 dark:bg-brand-400"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-7 overflow-y-auto space-y-6 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              {/* Left Column: Explanation */}
              <div className="md:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-extrabold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{activeStep.tag}</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {activeStep.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 font-semibold mt-1">
                    {activeStep.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {activeStep.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {activeStep.id === 1 ? (
                    <button
                      onClick={() => {
                        onClose();
                        onUploadClick?.();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Resume Now</span>
                    </button>
                  ) : null}

                  <button
                    onClick={() => {
                      if (activeStepIndex < STEPS.length - 1) {
                        setActiveStepIndex(activeStepIndex + 1);
                      } else {
                        onClose();
                      }
                      setIsPlaying(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{activeStepIndex === STEPS.length - 1 ? 'Finish & Explore' : 'Next Step'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Showcase Card */}
              <div className="md:col-span-6">
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Top pill inside card */}
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
                    <span className="font-mono text-[11px] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Live AI Engine Simulation
                    </span>
                    <span className="font-bold text-white/90">Step {activeStep.id} of 4</span>
                  </div>

                  {/* Step 1 Visual: ATS Meter */}
                  {activeStep.visual.type === 'ats' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-emerald-400" />
                          <div>
                            <div className="text-xs font-bold text-white">{activeStep.visual.filename}</div>
                            <div className="text-[10px] text-emerald-400 font-semibold">{activeStep.visual.status}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-emerald-400">{activeStep.visual.score}/100</div>
                          <div className="text-[10px] text-slate-400">ATS Match</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-slate-300 mb-2">Detected Core Competencies:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeStep.visual.skills.map((s, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
                        ⚠️ <strong>Protected Validation:</strong> Reports, invoices, and assignments are rejected. Only authentic resumes are analyzed!
                      </div>
                    </div>
                  )}

                  {/* Step 2 Visual: Skills Radar */}
                  {activeStep.visual.type === 'skills' && (
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{activeStep.visual.target}</span>
                          <span className="text-xs font-black text-blue-400">{activeStep.visual.readiness}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="w-[88%] h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-emerald-400">Ready Strengths:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeStep.visual.matched.map((m, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                              {m}
                            </span>
                          ))}
                        </div>

                        <div className="text-[11px] font-bold text-amber-400 pt-1">Recommended Gap Upgrades:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeStep.visual.missing.map((m, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                              + {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 Visual: Salary */}
                  {activeStep.visual.type === 'salary' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          🎓 Student / Internship Stipend
                        </span>
                        <div className="text-2xl font-black text-amber-300">
                          {activeStep.visual.internship}
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Based on CGPA, verified projects & core DSA proficiency
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Full-Time Campus Package</div>
                          <div className="text-lg font-black text-emerald-400">{activeStep.visual.fullTime}</div>
                        </div>
                        <div className="text-right text-[10px] text-slate-400">
                          {activeStep.visual.location}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4 Visual: Mock Interview */}
                  {activeStep.visual.type === 'interview' && (
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-purple-300">AI Placement Verdict</span>
                          <div className="text-sm font-extrabold text-white">{activeStep.visual.verdict}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-purple-300">{activeStep.visual.score}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div className="text-xs">
                          <div className="font-bold text-white">Official PDF Career Audit</div>
                          <div className="text-[10px] text-slate-400">Digitally Certified by {activeStep.visual.certifiedBy}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modal Bottom Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === activeStepIndex
                    ? 'w-7 bg-brand-600 dark:bg-brand-400'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeStepIndex > 0) {
                  setActiveStepIndex(activeStepIndex - 1);
                  setIsPlaying(false);
                }
              }}
              disabled={activeStepIndex === 0}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (activeStepIndex < STEPS.length - 1) {
                  setActiveStepIndex(activeStepIndex + 1);
                  setIsPlaying(false);
                } else {
                  onClose();
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{activeStepIndex === STEPS.length - 1 ? 'Enter Dashboard' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HowItWorksWalkthrough;
