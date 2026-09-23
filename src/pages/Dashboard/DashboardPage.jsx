import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  X,
  Check
} from 'lucide-react';
import StatCard from '../../components/Cards/StatCard';
import GlassCard from '../../components/Cards/GlassCard';
import RadarChart from '../../components/Charts/RadarChart';
import LineChart from '../../components/Charts/LineChart';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import DropzoneUpload from '../../components/Upload/DropzoneUpload';
import { useUser } from '../../hooks/useUser';
import { getCareerRecommendations, getRecentActivities, parseResumeWithAI } from '../../services/api';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const { profile, updateProfileData } = useUser();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Resume Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, actRes] = await Promise.all([
          getCareerRecommendations(),
          getRecentActivities()
        ]);
        setRecommendations(recRes.data);
        setActivities(actRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDashboardResumeSuccess = async (file, base64Data, mimeType, extractedText) => {
    setIsAnalyzing(true);
    const toastId = toast.loading('Evaluating PDF with Gemini ATS engine...', { id: 'dash-parse' });

    try {
      const response = await parseResumeWithAI(extractedText, file.name, profile.targetRole, base64Data, mimeType);
      const data = response.data;
      setUploadResult(data);

      // Auto update profile data with new score & skills
      if (data.detectedSkills && data.detectedSkills.length > 0) {
        updateProfileData({
          skills: Array.from(new Set([...profile.skills, ...data.detectedSkills])),
          atsScore: data.atsScore || profile.atsScore,
          readinessScore: Math.min(96, Math.max(75, data.atsScore - 4)),
          name: data.candidateInfo?.name && data.candidateInfo?.name !== 'Candidate' ? data.candidateInfo.name : profile.name
        });
      }

      toast.success(`Resume parsed! New ATS Score: ${data.atsScore}/100`, { id: 'dash-parse' });
    } catch (err) {
      console.error(err);
      toast.error('Resume analysis failed. Please try again.', { id: 'dash-parse' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return <SpinnerLoader size="lg" text="Loading AI Career Twin Dashboard..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <GlassCard className="border border-brand-500/30 shadow-glow relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> AI Twin Synchronized & Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome back, {profile.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Target Role: <strong className="text-brand-600 dark:text-brand-400">{profile.targetRole}</strong>. Your skills match 88% of market requirements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <PrimaryButton
              icon={Upload}
              onClick={() => {
                setUploadResult(null);
                setShowUploadModal(true);
              }}
              className="py-2.5 text-xs shadow-glow"
            >
              Upload New Resume
            </PrimaryButton>

            <Link
              to="/premium-resume"
              className="relative group flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-400/60 bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-amber-500/15 hover:border-amber-300 hover:shadow-[0_0_22px_rgba(251,191,36,0.5)] hover:scale-105 active:scale-95 transition-all text-xs font-black"
            >
              <span className="text-amber-400">👑</span>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Tailor Resume V2
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30">
                $99/mo
              </span>
            </Link>

            <Link to="/interview-prep">
              <SecondaryButton icon={Video} className="py-2.5 text-xs">
                Mock Interview
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </GlassCard>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Career Readiness"
          value={`${profile.readinessScore}%`}
          badge="High Match"
          icon={Award}
          color="brand"
          trend="+5%"
        />
        <StatCard
          title="ATS Resume Score"
          value={`${profile.atsScore}/100`}
          badge="Passed 98%"
          icon={FileCheck}
          color="emerald"
          trend="+6 pts"
        />
        <StatCard
          title="Target Salary"
          value={profile.targetSalary}
          badge="Bangalore"
          icon={IndianRupee}
          color="amber"
          trend="+12%"
        />
        <StatCard
          title="Roadmap Milestone"
          value="Phase 2/3"
          badge="45% Done"
          icon={Map}
          color="violet"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Skill Radar Breakdown</h3>
              <p className="text-xs text-slate-500">Your profile vs {profile.targetRole} market standard</p>
            </div>
            <Link to="/skill-gap" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View Gap Matrix <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <RadarChart />
        </GlassCard>

        {/* Growth Trend Line Chart */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Readiness Trend</h3>
              <p className="text-xs text-slate-500">6-Month readiness progression curve</p>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              +43% Overall Growth
            </span>
          </div>
          <LineChart />
        </GlassCard>

      </div>

      {/* Bottom Grid: Top Career Matches & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Career Cards (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" /> Top Recommended Careers
            </h3>
            <Link to="/career-recommendation" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View All Roles <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.slice(0, 2).map((item) => (
              <div key={item.id} className="p-5 glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-lg font-extrabold text-emerald-500">{item.matchScore}%</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.avgSalary}</span>
                  <Link to="/career-recommendation" className="text-brand-600 font-bold hover:underline flex items-center gap-1">
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
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

          <div className="glass-card p-4 border border-slate-200/80 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/60">
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
                  <p className="text-slate-500 dark:text-slate-400">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Resume Upload & Instant ATS Evaluation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-7 space-y-5 border border-brand-500/30 shadow-2xl animate-in zoom-in-95 bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Quick Resume Upload & Analysis
                  </h3>
                  <p className="text-xs text-slate-500">
                    Evaluating against target role: <strong>{profile.targetRole}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!uploadResult ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Select or drag any PDF or DOCX file. The Gemini 3.8 ATS engine extracts your skills, evaluates formatting, and computes your live score.
                </p>

                <DropzoneUpload onUploadSuccess={handleDashboardResumeSuccess} />

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Want deeper keyword optimization?</span>
                  <Link
                    to="/resume-upload"
                    onClick={() => setShowUploadModal(false)}
                    className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
                  >
                    Open Full ATS Suite →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in-50 duration-300">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                      Analysis Complete • ATS Pass
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {uploadResult.candidateInfo?.name || profile.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {uploadResult.summary}
                    </p>
                  </div>
                  <div className="text-center pl-4 border-l border-emerald-500/20">
                    <div className="text-3xl font-black text-emerald-500">
                      {uploadResult.atsScore}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">ATS / 100</span>
                  </div>
                </div>

                {/* Score breakdown metrics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold block">Keywords</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">{uploadResult.keywordScore}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold block">Formatting</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">{uploadResult.formattingScore}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold block">Impact</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">{uploadResult.impactScore}%</span>
                  </div>
                </div>

                {/* Extracted skills */}
                {uploadResult.detectedSkills && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Detected Technical Skills ({uploadResult.detectedSkills.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {uploadResult.detectedSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to="/premium-resume"
                    onClick={() => setShowUploadModal(false)}
                    className="w-full sm:flex-1 py-2.5 px-3 rounded-xl text-xs font-black text-amber-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-center flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>👑 Tailor for JD (Resume V2)</span>
                  </Link>
                  <Link
                    to="/resume-upload"
                    onClick={() => setShowUploadModal(false)}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-center"
                  >
                    View Full Audit
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
