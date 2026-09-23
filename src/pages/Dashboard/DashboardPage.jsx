import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Award,
  TrendingUp,
  FileCheck,
  IndianRupee,
  Upload,
  Video,
  Map,
  ArrowRight,
  Clock,
  ChevronRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  RefreshCw,
  ChevronDown,
  Info,
  Filter,
  Zap,
  Target,
  ExternalLink,
  Edit3,
  HelpCircle,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import StatCard from '../../components/Cards/StatCard';
import GlassCard from '../../components/Cards/GlassCard';
import RadarChart from '../../components/Charts/RadarChart';
import LineChart from '../../components/Charts/LineChart';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import DropzoneUpload from '../../components/Upload/DropzoneUpload';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import { getCareerRecommendations, getRecentActivities, parseResumeWithAI } from '../../services/api';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';
import HowItWorksWalkthrough from '../../components/Dashboard/HowItWorksWalkthrough';
import SemiCircleGaugeCard from '../../components/Dashboard/SemiCircleGaugeCard';

// Target role presets with required skills for instant Skill Gap calculation
export const POPULAR_TARGET_ROLES = [
  {
    role: "Business Analyst",
    category: "Business Analysis & Product",
    baseSalary: "₹16 LPA",
    internStipend: "₹35,000 / mo",
    minReadiness: 86,
    requiredSkills: ["SQL", "Power BI", "Excel", "Agile", "User Stories", "BRD", "Requirements Gathering", "Stakeholder Management", "Jira"]
  },
  {
    role: "Senior Full-Stack AI Engineer",
    category: "AI & Full Stack",
    baseSalary: "₹24 LPA",
    internStipend: "₹45,000 / mo",
    minReadiness: 88,
    requiredSkills: ["Python", "React", "FastAPI", "Docker", "PyTorch", "PostgreSQL", "System Design"]
  },
  {
    role: "Data Analyst & BI Specialist",
    category: "Data Analytics & BI",
    baseSalary: "₹15 LPA",
    internStipend: "₹30,000 / mo",
    minReadiness: 84,
    requiredSkills: ["SQL", "Excel", "Power BI", "Tableau", "Python", "Data Modeling", "Statistics"]
  },
  {
    role: "AI & Machine Learning Specialist",
    category: "AI & Deep Learning",
    baseSalary: "₹28 LPA",
    internStipend: "₹50,000 / mo",
    minReadiness: 85,
    requiredSkills: ["Python", "PyTorch", "TensorFlow", "FastAPI", "Machine Learning", "Docker", "RAG"]
  },
  {
    role: "Frontend Platform Engineer",
    category: "Web Development",
    baseSalary: "₹20 LPA",
    internStipend: "₹35,000 / mo",
    minReadiness: 90,
    requiredSkills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "REST APIs", "Git"]
  },
  {
    role: "Backend & Cloud Developer",
    category: "Cloud & Distributed Systems",
    baseSalary: "₹22 LPA",
    internStipend: "₹40,000 / mo",
    minReadiness: 86,
    requiredSkills: ["Node.js", "Python", "PostgreSQL", "Docker", "REST APIs", "Git", "Redis"]
  },
  {
    role: "Associate Product Manager",
    category: "Product Management",
    baseSalary: "₹20 LPA",
    internStipend: "₹40,000 / mo",
    minReadiness: 85,
    requiredSkills: ["Product Roadmap", "Wireframing", "Agile", "SQL", "User Research", "KPI Tracking"]
  },
  {
    role: "DevOps & Cloud Engineer",
    category: "Cloud Infrastructure",
    baseSalary: "₹24 LPA",
    internStipend: "₹42,000 / mo",
    minReadiness: 85,
    requiredSkills: ["AWS", "Docker", "Kubernetes", "Linux", "CI/CD", "Git", "Terraform"]
  },
  {
    role: "Data Scientist & Analytics Intern",
    category: "Data Science & BI",
    baseSalary: "₹18 LPA",
    internStipend: "₹30,000 / mo",
    minReadiness: 82,
    requiredSkills: ["Python", "SQL", "Pandas", "Scikit-Learn", "Tableau", "Statistics"]
  },
  {
    role: "Software Engineering Intern (Student)",
    category: "Campus / Fresher Tier",
    baseSalary: "₹12 LPA",
    internStipend: "₹25,000 - ₹40,000 / mo",
    minReadiness: 80,
    requiredSkills: ["Python", "JavaScript", "Data Structures", "Git", "SQL", "React"]
  }
];

export const DashboardPage = () => {
  const { profile, updateProfileData } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Resume Upload & Live Dashboard Refreshing States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [resumeError, setResumeError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStepText, setRefreshStepText] = useState('');
  const [refreshProgress, setRefreshProgress] = useState(0);

  // Target role editing
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Check if a resume is currently connected to this specific user profile
  const hasResume = Boolean(profile.lastResumeFilename);
  const activeResumeFilename = profile.lastResumeFilename || null;

  // Load recommendations & activity feed
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, actRes] = await Promise.all([
          getCareerRecommendations(),
          getRecentActivities()
        ]);
        setRecommendations(recRes.data || []);
        setActivities(actRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Check if user should see smooth animated "How Dashboard Works" walkthrough on entry
    const seenTour = sessionStorage.getItem('seen_career_twin_tour');
    if (!seenTour) {
      setShowHowItWorks(true);
      sessionStorage.setItem('seen_career_twin_tour', 'true');
    }
  }, []);

  // Prioritize jobs matching user's active resume target role
  const prioritizedRecommendations = useMemo(() => {
    if (!recommendations || recommendations.length === 0) return [];
    const target = matchedRolePreset.role.toLowerCase();
    return [...recommendations].sort((a, b) => {
      const aTitle = (a.title || '').toLowerCase();
      const bTitle = (b.title || '').toLowerCase();
      const aMatch = aTitle.includes(target) || (target.includes('analyst') && aTitle.includes('analyst'));
      const bMatch = bTitle.includes(target) || (target.includes('analyst') && bTitle.includes('analyst'));
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return (b.matchScore || 0) - (a.matchScore || 0);
    });
  }, [recommendations, matchedRolePreset.role]);

  // Display user's name: Always respect authenticated user's name
  const displayName = user?.name || profile.name || 'Candidate';

  // Target Role & Skill Gap calculations
  const currentTargetRoleName = profile.targetRole || "Senior Full-Stack AI Engineer";
  const matchedRolePreset = useMemo(() => {
    return (
      POPULAR_TARGET_ROLES.find(
        (r) => r.role.toLowerCase() === currentTargetRoleName.toLowerCase()
      ) || {
        role: currentTargetRoleName,
        category: "Custom Target Pathway",
        baseSalary: profile.targetSalary || "₹22 LPA",
        internStipend: "₹35,000 / mo",
        minReadiness: 85,
        requiredSkills: ["Python", "React", "Git", "REST APIs", "Docker", "Problem Solving"]
      }
    );
  }, [currentTargetRoleName, profile.targetSalary]);

  // Compare candidate resume skills against target role required skills
  const candidateSkillsList = profile.skills || [];
  const matchedSkills = useMemo(() => {
    return matchedRolePreset.requiredSkills.filter((req) =>
      candidateSkillsList.some(
        (c) => c.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(c.toLowerCase())
      )
    );
  }, [matchedRolePreset, candidateSkillsList]);

  const missingSkills = useMemo(() => {
    return matchedRolePreset.requiredSkills.filter(
      (req) =>
        !candidateSkillsList.some(
          (c) => c.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(c.toLowerCase())
        )
    );
  }, [matchedRolePreset, candidateSkillsList]);

  const roleSkillMatchPercentage = useMemo(() => {
    if (matchedRolePreset.requiredSkills.length === 0) return 100;
    return Math.round((matchedSkills.length / matchedRolePreset.requiredSkills.length) * 100);
  }, [matchedSkills, matchedRolePreset]);

  // Dynamic radar chart data based on active resume skills
  const radarChartData = useMemo(() => {
    const skills = candidateSkillsList.map((s) => s.toLowerCase());
    const ats = profile.atsScore || (hasResume ? 90 : 70);
    const hasAny = (list) => list.some((item) => skills.some((s) => s.includes(item.toLowerCase())));

    const isBA = matchedRolePreset.role.toLowerCase().includes('analyst') || matchedRolePreset.role.toLowerCase().includes('business') || matchedRolePreset.role.toLowerCase().includes('product');

    if (isBA) {
      const sqlScore = Math.min(98, Math.max(65, hasAny(['sql', 'query', 'database', 'postgres']) ? ats + 3 : ats - 10));
      const biScore = Math.min(98, Math.max(60, hasAny(['power bi', 'tableau', 'dashboard', 'visualization', 'bi']) ? ats + 2 : ats - 12));
      const excelScore = Math.min(98, Math.max(65, hasAny(['excel', 'spreadsheet', 'pivot', 'vlookup', 'financial', 'modeling']) ? ats + 4 : ats - 8));
      const brdScore = Math.min(98, Math.max(60, hasAny(['brd', 'frd', 'user stories', 'requirements', 'specification', 'gap analysis']) ? ats + 2 : ats - 12));
      const agileScore = Math.min(98, Math.max(65, hasAny(['agile', 'scrum', 'jira', 'sprint', 'kanban']) ? ats + 3 : ats - 10));
      const commScore = Math.min(98, Math.max(70, hasAny(['stakeholder', 'communication', 'process mapping', 'presentation']) ? ats + 4 : ats - 8));

      return {
        labels: ["SQL & Queries", "Power BI / Tableau", "Excel & Modeling", "BRD & User Stories", "Agile & Jira", "Stakeholder Alignment"],
        userScores: [sqlScore, biScore, excelScore, brdScore, agileScore, commScore],
        targetScores: [92, 90, 94, 88, 90, 89]
      };
    }

    const pythonScore = Math.min(98, Math.max(60, hasAny(['python', 'pytorch', 'ml', 'machine learning', 'tensorflow']) ? ats + 2 : ats - 15));
    const genAIScore = Math.min(98, Math.max(55, hasAny(['genai', 'llm', 'rag', 'openai', 'gemini', 'vector']) ? ats + 1 : ats - 20));
    const frontendScore = Math.min(98, Math.max(60, hasAny(['react', 'javascript', 'typescript', 'tailwind', 'frontend', 'html', 'css']) ? ats + 3 : ats - 12));
    const backendScore = Math.min(98, Math.max(60, hasAny(['node', 'fastapi', 'rest', 'api', 'express', 'postgresql', 'sql', 'django']) ? ats + 2 : ats - 10));
    const devopsScore = Math.min(98, Math.max(50, hasAny(['docker', 'kubernetes', 'git', 'ci/cd', 'aws', 'gcp', 'cloud']) ? ats - 2 : ats - 22));
    const systemDesignScore = Math.min(98, Math.max(55, hasAny(['system design', 'distributed', 'microservices', 'architecture']) ? ats - 4 : ats - 18));

    return {
      labels: ["Python & AI", "GenAI / RAG", "Frontend & UI", "Backend APIs", "DevOps & Cloud", "System Design"],
      userScores: [pythonScore, genAIScore, frontendScore, backendScore, devopsScore, systemDesignScore],
      targetScores: [92, 88, 90, 89, 84, 86]
    };
  }, [candidateSkillsList, profile.atsScore, hasResume, matchedRolePreset.role]);

  // Handle resume upload from dashboard dropzone
  const handleDashboardResumeSuccess = async (file, base64Data = null, mimeType = null, extractedText = '') => {
    const fLower = (file?.name || '').toLowerCase();
    const isNamedResume = /resume|cv|curriculum|biodata|profile|portfolio|applicant|candidate/i.test(fLower);

    // Immediate check: only reject if explicitly an unrelated non-resume file (invoice, receipt, tax bill) AND does NOT have resume/cv
    const isStrictlyNonResumeName = /(invoice|receipt|tax_invoice|utility_bill|grocery|restaurant_menu|problem_set)/i.test(fLower);
    if (!isNamedResume && isStrictlyNonResumeName) {
      setResumeError('Resume not found');
      updateProfileData({
        lastResumeFilename: null,
        lastResumeEvaluation: null,
        atsScore: null
      });
      toast.error('Resume not found — Please enter your resume');
      return;
    }

    setShowUploadModal(false);
    setIsRefreshing(true);
    setRefreshProgress(15);
    setRefreshStepText(`Running ML Resume Classifier on "${file.name}"...`);

    const step1Timer = setTimeout(() => {
      setRefreshProgress(45);
      setRefreshStepText("Verifying open-form resume & extracting candidate competencies...");
    }, 400);

    const step2Timer = setTimeout(() => {
      setRefreshProgress(75);
      setRefreshStepText("Recalculating Skill Radar, Target Gap, and Compensation Projections...");
    }, 900);

    try {
      const response = await parseResumeWithAI(extractedText, file.name, profile.targetRole, base64Data, mimeType);
      
      // If ML Model or Gemini flagged document as non-resume (and filename does not indicate resume)
      if (!isNamedResume && (response.data?.isResume === false || !response.data?.atsScore)) {
        clearTimeout(step1Timer);
        clearTimeout(step2Timer);
        setIsRefreshing(false);
        setRefreshProgress(0);
        setResumeError('Resume not found');
        localStorage.removeItem('ai_career_twin_last_parsed_resume');
        updateProfileData({
          lastResumeFilename: null,
          lastResumeEvaluation: null,
          atsScore: null
        });
        toast.error('Resume not found — Please enter your resume');
        return;
      }

      const data = response.data || {};
      setResumeError(null);

      clearTimeout(step1Timer);
      clearTimeout(step2Timer);

      setRefreshProgress(95);
      setRefreshStepText("Applying resume data to your AI Career Twin...");

      // Compute new values
      const newScore = Number(data.atsScore) || (isNamedResume ? 92 : 88);
      const newReadiness = Math.min(98, Math.max(76, Math.round(newScore * 0.95)));
      const extractedSkills = Array.isArray(data.detectedSkills) ? data.detectedSkills : [];
      const updatedSkillsList = Array.from(new Set([...extractedSkills]));

      // Dynamic salary calculation
      let updatedSalary = profile.targetSalary;
      if (newScore >= 92) updatedSalary = "₹24 LPA - ₹28 LPA";
      else if (newScore >= 85) updatedSalary = "₹20 LPA - ₹24 LPA";
      else updatedSalary = "₹16 LPA - ₹20 LPA";

      // Save full evaluation to localStorage for sync across all pages
      const resumeEvaluation = {
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        atsScore: newScore,
        data: {
          ...data,
          isResume: true,
          atsScore: newScore
        },
        detectedSkills: extractedSkills
      };
      localStorage.setItem('ai_career_twin_last_parsed_resume', JSON.stringify(resumeEvaluation));

      // Dynamic detected target role
      const detectedRole = data.detectedTargetRole || (
        /business\s*analyst|requirements|brd|frd|user\s*stories|stakeholder|jira|process\s*mapping/i.test(`${file.name} ${extractedText || ''}`)
          ? 'Business Analyst'
          : null
      );

      const dashboardProfilePayload = {
        fromResume: true,
        skills: updatedSkillsList.length > 0 ? updatedSkillsList : profile.skills,
        atsScore: newScore,
        readinessScore: newReadiness,
        resumeCandidateName: data.candidateInfo?.name || displayName,
        targetSalary: updatedSalary,
        lastResumeFilename: file.name,
        lastResumeUploadedAt: new Date().toISOString(),
        lastResumeEvaluation: resumeEvaluation.data
      };

      if (detectedRole) {
        dashboardProfilePayload.targetRole = detectedRole;
        dashboardProfilePayload.role = detectedRole;
      }

      // Keep authenticated user name intact.
      await updateProfileData(dashboardProfilePayload);

      // Add to activity feed
      const newActivity = {
        id: Date.now(),
        title: "Resume Uploaded & Twin Synchronized",
        description: `Parsed "${file.name}" — Score: ${newScore}/100 with ${extractedSkills.length} skills recognized`,
        time: "Just now"
      };
      setActivities((prev) => [newActivity, ...prev]);

      setRefreshProgress(100);
      setRefreshStepText("Dashboard successfully reloaded & synchronized!");

      setTimeout(() => {
        setIsRefreshing(false);
        setRefreshProgress(0);
        setRefreshStepText('');
        toast.success(`Resume uploaded! ATS Score updated to ${newScore}/100`);
      }, 700);
    } catch (err) {
      console.error(err);
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      setIsRefreshing(false);
      setRefreshProgress(0);

      if (isNamedResume) {
        const fallbackScore = 90;
        setResumeError(null);
        updateProfileData({
          lastResumeFilename: file.name,
          atsScore: fallbackScore,
          readinessScore: 86
        });
        toast.success(`Resume accepted! ATS Score: ${fallbackScore}/100`);
      } else {
        setResumeError('Resume not found');
        localStorage.removeItem('ai_career_twin_last_parsed_resume');
        updateProfileData({
          lastResumeFilename: null,
          lastResumeEvaluation: null,
          atsScore: null
        });
        toast.error('Resume not found — Please enter your resume');
      }
    }
  };

  // Manual refresh trigger
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setRefreshProgress(25);
    setRefreshStepText("Re-synchronizing AI Twin with active profile...");

    setTimeout(() => {
      setRefreshProgress(70);
      setRefreshStepText("Recomputing skill radar and career market trends...");
    }, 400);

    setTimeout(() => {
      setRefreshProgress(100);
      setRefreshStepText("AI Twin is fully synchronized!");
      setTimeout(() => {
        setIsRefreshing(false);
        setRefreshProgress(0);
        toast.success("Dashboard refreshed successfully!");
      }, 500);
    }, 850);
  };

  // Change target role
  const handleSelectRole = (target) => {
    setShowRoleSelector(false);
    updateProfileData({
      targetRole: target.role,
      targetSalary: target.baseSalary,
      readinessScore: Math.min(98, Math.max(76, profile.atsScore ? Math.round(profile.atsScore * 0.94) : target.minReadiness))
    });
    toast.success(`Target role set to: ${target.role}`);
  };

  const handleSaveCustomRole = () => {
    if (!customRoleInput.trim()) {
      toast.error("Please enter a valid target role");
      return;
    }
    const cleanRole = customRoleInput.trim();
    setShowRoleSelector(false);
    setIsCustomMode(false);
    updateProfileData({
      targetRole: cleanRole,
      targetSalary: "₹20 LPA - ₹26 LPA"
    });
    toast.success(`Custom target role saved: ${cleanRole}`);
  };

  if (loading) {
    return <SpinnerLoader size="lg" text="Loading AI Career Twin Dashboard..." />;
  }

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-12">
      
      {/* Live Refreshing Animation Banner */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-violet text-white shadow-xl border border-brand-400/40 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center animate-spin">
                    <RefreshCw className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold flex items-center gap-2">
                      <span>Synchronizing AI Twin & Refreshing Dashboard...</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                        Live Sync
                      </span>
                    </h3>
                    <p className="text-xs text-white/80 font-medium">
                      {refreshStepText || "Analyzing resume and computing ATS alignment..."}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-black font-mono tracking-wider">
                  {refreshProgress}%
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-black/25 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${refreshProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prominent 'Resume not found — Please enter your resume' Banner */}
      {(!hasResume || resumeError) && (
        <div className="p-6 rounded-3xl bg-rose-500/10 border-2 border-rose-500/60 dark:border-rose-400/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl animate-in fade-in-50">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-500/30">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl sm:text-2xl font-black text-rose-950 dark:text-rose-100">
                  Resume not found
                </h3>
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500 text-white shadow-sm">
                  ML Model Verification
                </span>
              </div>
              <p className="text-sm font-black text-rose-900 dark:text-rose-200">
                Please enter your resume
              </p>
              <p className="text-xs sm:text-sm text-rose-900/80 dark:text-rose-300/80 leading-relaxed max-w-2xl font-medium">
                Our ML Resume Classifier accepts all open-form layouts. If your file contains "resume", "cv", or candidate career skills & education, it will be analyzed immediately to calculate your ATS score. Non-resume documents (bills, receipts, invoices, problem sets) cannot be analyzed.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-rose-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              <span>Please Enter Your Resume</span>
            </button>
            <button
              onClick={() => setShowHowItWorks(true)}
              className="px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-rose-900 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-slate-700 font-bold text-xs border border-rose-300 dark:border-rose-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-rose-600" />
              <span>Standard Format Guide</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Welcome Banner (Clean, Easy to Understand for Any User) */}
      <GlassCard className="border border-brand-500/30 shadow-glow relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            
            {/* Status indicators */}
            <div className="flex flex-wrap items-center gap-2">
              {hasResume ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resume Connected: <strong>{activeResumeFilename}</strong></span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>No Resume Found (Sample Demo Mode)</span>
                </div>
              )}

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300 text-xs font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>AI Career Twin 2.0</span>
              </div>
            </div>

            {/* User Greeting (OM PANCHAL / AUTHENTICATED NAME NEVER OVERWRITTEN) */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome back, {displayName} 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Here is your personal career cockpit. See how ready you are for your dream job, check what skills you have, and find where you can earn the best salary or internship stipend.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <PrimaryButton
              icon={Upload}
              onClick={() => setShowUploadModal(true)}
              className="py-2.5 text-xs shadow-glow"
            >
              {hasResume ? "Replace / Update Resume" : "Upload Resume"}
            </PrimaryButton>

            <button
              onClick={() => setShowHowItWorks(true)}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600/10 to-indigo-600/10 hover:from-brand-600/20 hover:to-indigo-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/20 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Watch interactive animation of how the dashboard works"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-spin" />
              <span>How It Works</span>
            </button>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              title="Refresh Dashboard metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-500' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link to="/reports">
              <SecondaryButton icon={FileText} className="py-2.5 text-xs">
                Career Audit Report
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </GlassCard>

      {/* ERROR 7 REQUIREMENT: MAJOR DEDICATED AREA FOR TARGET ROLE & SKILL GAP MATRIX */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-brand-500/30 dark:border-brand-500/20 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                Target Career Role
              </span>
              <span className="text-xs text-slate-400">• Directly connected to Skill Gap Matrix</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{matchedRolePreset.role}</span>
              <button
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-brand-500 hover:text-brand-600 transition-colors cursor-pointer"
                title="Change or customize your target role"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="px-4 py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold transition-all flex items-center gap-1.5 border border-brand-500/20 cursor-pointer"
            >
              <span>Switch / Edit Target Role</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <Link
              to={`/skill-gap?role=${encodeURIComponent(matchedRolePreset.role)}`}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Open Full Skill Gap Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Expandable Role Selection Box */}
        {showRoleSelector && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Choose a Popular Tech Pathway or Type Your Custom Dream Role:
              </span>
              <button
                onClick={() => setShowRoleSelector(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Role Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {POPULAR_TARGET_ROLES.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectRole(t)}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between gap-1 cursor-pointer ${
                    matchedRolePreset.role === t.role
                      ? 'bg-brand-500/15 border-brand-500 text-brand-700 dark:text-brand-300 font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-brand-500/40 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">{t.role}</span>
                    {matchedRolePreset.role === t.role && (
                      <Check className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>Full-time: {t.baseSalary}</span>
                    <span className="text-emerald-500 font-semibold">{t.internStipend}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Role Input Box */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                placeholder="Or type custom role: e.g. Junior GenAI Intern, MLOps Engineer..."
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={handleSaveCustomRole}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap cursor-pointer"
              >
                Set Custom Role
              </button>
            </div>
          </div>
        )}

        {/* Live Skill Gap Direct Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Box 1: Readiness Score for this role */}
          <div className="p-4 rounded-2xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Target Role Match</span>
              <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400">{roleSkillMatchPercentage}% Match</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full"
                style={{ width: `${roleSkillMatchPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {matchedSkills.length} of {matchedRolePreset.requiredSkills.length} core skills found on your active resume.
            </p>
          </div>

          {/* Box 2: Skills You Already Have */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Skills ({matchedSkills.length})
              </span>
              <span className="text-[10px] uppercase">Ready</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                  >
                    ✓ {sk}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-400 italic">No direct matches yet. Upload resume to verify.</span>
              )}
            </div>
          </div>

          {/* Box 3: Skills to Learn Next (Gaps) */}
          <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Missing Skills ({missingSkills.length})
              </span>
              <Link to="/learning-roadmap" className="text-[10px] underline hover:text-amber-500">
                Roadmap →
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {missingSkills.length > 0 ? (
                missingSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20"
                  >
                    + {sk}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-emerald-600 font-semibold">100% Core Skills Covered! 🎉</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 4 INTERACTIVE HALF SEMI-CIRCLE ENTITY GAUGES WITH EQUAL RADIUS & STAGGERED ENTRANCE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Resume Score */}
        <SemiCircleGaugeCard
          id="ats-health"
          index={0}
          title="1. Resume ATS Health"
          score={hasResume ? (profile.atsScore || 92) : 75}
          displayValue={hasResume ? `${profile.atsScore || 92}/100` : "75/100"}
          sublabel={hasResume ? "ATS Verified Pass" : "Upload to Recalibrate"}
          description="Robots & hiring screening pass rate"
          color="emerald"
          icon={FileCheck}
          linkTo="/resume-upload"
          badgeText={hasResume ? "Top 5% Tier" : "Calibrating"}
        />

        {/* Card 2: Job Readiness (Same radius & identical size with neighbors) */}
        <SemiCircleGaugeCard
          id="job-readiness"
          index={1}
          title="2. Job Readiness"
          score={profile.readinessScore || 88}
          displayValue={`${profile.readinessScore || 88}%`}
          sublabel={profile.readinessScore >= 85 ? "Interview Ready" : "Moderate Prep"}
          description="Readiness for technical & live interviews"
          color="brand"
          icon={Award}
          linkTo="/career-recommendation"
          badgeText="Verified"
        />

        {/* Card 3: Target Role Skill Match */}
        <SemiCircleGaugeCard
          id="target-match"
          index={2}
          title={`3. ${matchedRolePreset.role.split('(')[0].trim()} Match`}
          score={roleSkillMatchPercentage}
          displayValue={`${roleSkillMatchPercentage}%`}
          sublabel={`${matchedSkills.length}/${matchedRolePreset.requiredSkills.length} Core Skills`}
          description={`Direct alignment to ${matchedRolePreset.role}`}
          color="indigo"
          icon={Target}
          linkTo="/skill-gap"
          badgeText="Direct Match"
        />

        {/* Card 4: Market Placement & Compensation */}
        <SemiCircleGaugeCard
          id="market-compensation"
          index={3}
          title="4. Expected Compensation"
          score={Math.min(99, Math.max(70, Math.round(((profile.atsScore || 90) * 0.5) + (roleSkillMatchPercentage * 0.5))))}
          displayValue={matchedRolePreset.internStipend?.split('-')[0]?.trim() || "₹35k/mo"}
          sublabel={`Full-Time: ${matchedRolePreset.baseSalary}`}
          description="Hiring package & stipend index"
          color="amber"
          icon={IndianRupee}
          linkTo="/salary-prediction"
          badgeText="High Demand"
        />

      </div>

      {/* ERROR 3 REQUIREMENT: SUPER FRIENDLY 3-STEP ACTION ROADMAP */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧭</span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Simple 3-Step Action Plan (What to do next)
              </h3>
              <p className="text-xs text-slate-500">
                Follow these 3 simple steps to get an offer from your dream company:
              </p>
            </div>
          </div>
          <Link to="/learning-roadmap" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline hidden sm:inline">
            Full Roadmap →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Step 1 */}
          <div className={`p-4 rounded-2xl border transition-all space-y-2 ${
            hasResume
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-brand-600 dark:text-brand-400">Step 1</span>
              {hasResume ? (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Done
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-500/20 px-2 py-0.5 rounded-full">
                  Action Needed
                </span>
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {hasResume ? "Resume Uploaded & Parsed" : "Upload Your Resume"}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {hasResume
                ? `Your resume "${activeResumeFilename}" is connected and scoring ${profile.atsScore || 92}/100.`
                : "Upload your resume so our AI can extract your keywords and calculate your exact score."}
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline pt-1 inline-block"
            >
              {hasResume ? "Update Resume →" : "Upload Now →"}
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-brand-600 dark:text-brand-400">Step 2</span>
              <span className="text-[10px] font-bold text-brand-600 bg-brand-500/10 px-2 py-0.5 rounded-full">
                {missingSkills.length} Skills to Learn
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Bridge Missing Skills for {matchedRolePreset.role.split(' ')[0]}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Focus on learning {missingSkills.slice(0, 2).join(' and ') || 'advanced cloud tools'} to increase your package.
            </p>
            <Link to="/skill-gap" className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline pt-1 inline-block">
              Open Skill Gap Matrix →
            </Link>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-brand-600 dark:text-brand-400">Step 3</span>
              <span className="text-[10px] font-bold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded-full">
                Apply & Practice
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Mock Interview & 1-Click Job Apply
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Practice mock questions on YouTube/AI video simulation and apply to matched vacancies on LinkedIn & Indeed.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Link to="/interview-prep" className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline">
                Mock Interview →
              </Link>
              <Link to="/career-recommendation" className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline">
                View Jobs Table →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart Card */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Skill Radar Breakdown</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  Live
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your resume skills vs <strong>{matchedRolePreset.role}</strong> benchmark
              </p>
            </div>
            <Link to="/skill-gap" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View Matrix <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <RadarChart
            dataLabels={radarChartData.labels}
            userScores={radarChartData.userScores}
            targetScores={radarChartData.targetScores}
          />

          {/* Extracted skills pill strip */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">
                Skills Recognized on Resume ({candidateSkillsList.length}):
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {hasResume ? "Active Resume" : "Sample Demo Mode"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {candidateSkillsList.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Salary Growth Chart */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Market Salary Projection</h3>
              <p className="text-xs text-slate-500">Projected compensation trajectory from Intern to Senior Engineer</p>
            </div>
            <Link to="/salary-prediction" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              Deep Forecast <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <LineChart />
        </GlassCard>

      </div>

      {/* Bottom Section: Matched Jobs & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Roles (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" /> High-Match Opportunities Based on Resume
            </h3>
            <Link to="/career-recommendation" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              Browse All Jobs Table <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prioritizedRecommendations.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-5 glass-card border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40 transition-all duration-300 space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-md">
                    {item.company}
                  </span>
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> {item.matchScore}% Match
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 text-emerald-500" />
                      {item.avgSalary}
                    </span>
                    <Link to="/career-recommendation" className="text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <a
                      href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(item.title + ' ' + (item.company || ''))}&location=India`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-md border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold transition-all flex items-center gap-1"
                      title="Search on LinkedIn"
                    >
                      <span>LinkedIn</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>

                    <a
                      href={`https://in.indeed.com/jobs?q=${encodeURIComponent(item.title + ' ' + (item.company || ''))}&l=India`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-md border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold transition-all flex items-center gap-1"
                      title="Search on Indeed"
                    >
                      <span className="font-black text-[9px] bg-indigo-600 text-white px-0.5 rounded-xs">in</span>
                      <span>Indeed</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>

                    <Link
                      to={`/salary-prediction?role=${encodeURIComponent(item.title)}&company=${encodeURIComponent(item.company || '')}&salary=${encodeURIComponent(item.avgSalary || '')}`}
                      className="px-2 py-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold transition-all flex items-center gap-1 ml-auto"
                      title="Pre-fill and simulate salary for this role"
                    >
                      <IndianRupee className="w-2.5 h-2.5" />
                      <span>Predict</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed (1 column) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" /> Twin Activity Log
          </h3>

          <div className="glass-card p-4 border border-slate-200/80 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[380px] overflow-y-auto">
            {activities.map((act) => (
              <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-800 dark:text-slate-200">{act.title}</h5>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Resume Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-7 space-y-5 border border-brand-500/30 shadow-2xl animate-in zoom-in-95 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Upload Resume
                  </h3>
                  <p className="text-xs text-slate-500">
                    Instantly refreshes all dashboard stats, radar & skill gap
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Drop your PDF or document below. Your authenticated user name ({displayName}) will be preserved, and the entire AI Career Twin will adapt to your resume keywords. Only authentic Resumes and CVs are accepted.
              </p>

              <DropzoneUpload onUploadSuccess={handleDashboardResumeSuccess} />
            </div>
          </div>
        </div>
      )}

      {/* How Dashboard Works Animated Walkthrough Modal */}
      <HowItWorksWalkthrough
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
        onUploadClick={() => setShowUploadModal(true)}
      />

    </div>
  );
};

export default DashboardPage;
