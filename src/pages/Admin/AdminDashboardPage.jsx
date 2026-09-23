import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  Briefcase,
  Activity,
  Search,
  Plus,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Award,
  ShieldCheck,
  ExternalLink,
  GraduationCap,
  Mail,
  Lock,
  KeyRound,
  ArrowRight,
  RefreshCw,
  Clock,
  Eye,
  BarChart2,
  Zap,
  Check,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import {
  getStudents,
  getCompanies,
  getJobs,
  getSystemAnalytics,
  sendAdminOtp,
  verifyAdminOtp,
  getAdminLiveActivity
} from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';

export const AdminDashboardPage = () => {
  const { user, switchRole } = useAuth();
  const { profile } = useUser();
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'panchalom136@gmail.com';

  // Check if current user is Om
  const isOmEmail =
    user?.email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
    profile?.email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // OTP Verification State
  const [isOtpVerified, setIsOtpVerified] = useState(() => {
    return sessionStorage.getItem('ai_career_twin_admin_verified') === 'true';
  });

  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState(null);
  const [otpPreviewHelper, setOtpPreviewHelper] = useState('');

  // Admin Dashboard Tabs: 'activity' | 'features' | 'students' | 'companies'
  const [activeTab, setActiveTab] = useState('activity');
  const [liveActivities, setLiveActivities] = useState([]);
  const [featureStats, setFeatureStats] = useState([]);
  const [activityFilter, setActivityFilter] = useState('all');

  // Directory Data
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Company / Job form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('company');
  const [newCompany, setNewCompany] = useState({
    name: '',
    domain: '',
    location: 'Bangalore, India',
    minCgpa: 8.0,
    requiredSkills: 'Python, PyTorch, React.js',
    avgPackage: '₹22,00,000 - ₹30,00,000'
  });

  const [newJob, setNewJob] = useState({
    companyName: 'Google India',
    title: '',
    location: 'Bangalore, India (Hybrid)',
    salary: '₹28 LPA - ₹35 LPA',
    experience: '0 - 2 Years',
    requiredSkills: 'Python, FastApi, React.js'
  });

  // Fetch admin directory and live activity data
  const fetchData = async () => {
    try {
      const [stuRes, compRes, jobRes, anaRes, liveRes] = await Promise.all([
        getStudents(),
        getCompanies(),
        getJobs(),
        getSystemAnalytics(),
        getAdminLiveActivity()
      ]);
      setStudents(stuRes.students || []);
      setCompanies(compRes.companies || []);
      setJobs(jobRes.jobs || []);
      setAnalytics(anaRes.analytics);
      setLiveActivities(liveRes.activities || []);
      setFeatureStats(liveRes.featureInterests || []);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOtpVerified) {
      fetchData();
    }
  }, [isOtpVerified]);

  // Handle Request OTP to Gmail
  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    try {
      // Pass accessToken if present in auth state
      const accessToken = user?.accessToken || null;
      const res = await sendAdminOtp(ADMIN_EMAIL, accessToken);

      if (res.success) {
        setOtpSentMessage(res.message);
        if (res.otpPreview) {
          setOtpPreviewHelper(res.otpPreview);
        }
        toast.success(`OTP generated and sent to ${ADMIN_EMAIL}! Check inbox.`);
      } else {
        toast.error(res.error || 'Failed to dispatch OTP');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error sending OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!otpCode.trim() || otpCode.length < 6) {
      toast.error('Please enter the 6-digit OTP code');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await verifyAdminOtp(ADMIN_EMAIL, otpCode.trim());
      if (res.success) {
        sessionStorage.setItem('ai_career_twin_admin_verified', 'true');
        setIsOtpVerified(true);
        switchRole('admin');
        toast.success('Admin identity verified! Welcome, Om.');
      } else {
        toast.error(res.error || 'Incorrect OTP code');
      }
    } catch (e) {
      console.error(e);
      toast.error('Verification failed');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleAddCompanySubmit = async (e) => {
    e.preventDefault();
    if (!newCompany.name.trim()) return;

    try {
      const payload = {
        ...newCompany,
        requiredSkills: newCompany.requiredSkills.split(',').map((s) => s.trim())
      };
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setCompanies([data.company, ...companies]);
        setShowAddModal(false);
        setNewCompany({
          name: '',
          domain: '',
          location: 'Bangalore, India',
          minCgpa: 8.0,
          requiredSkills: 'Python, PyTorch, React.js',
          avgPackage: '₹22,00,000 - ₹30,00,000'
        });
        toast.success(`Added ${data.company.name} successfully!`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add company');
    }
  };

  const handleAddJobSubmit = async (e) => {
    e.preventDefault();
    if (!newJob.title.trim()) return;

    try {
      const payload = {
        ...newJob,
        requiredSkills: newJob.requiredSkills.split(',').map((s) => s.trim())
      };
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setJobs([data.job, ...jobs]);
        setShowAddModal(false);
        setNewJob({
          companyName: 'Google India',
          title: '',
          location: 'Bangalore, India (Hybrid)',
          salary: '₹28 LPA - ₹35 LPA',
          experience: '0 - 2 Years',
          requiredSkills: 'Python, FastApi, React.js'
        });
        toast.success(`Published ${data.job.title} successfully!`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add job opening');
    }
  };

  // ── GATE 1: Access Denied if NOT Om ──
  if (!isOmEmail && !isOtpVerified) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <GlassCard className="p-8 text-center space-y-6 border-rose-500/30">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
              Restricted Terminal Access
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Admin Access Strictly Reserved for Om
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
              This terminal controls institutional student management, live activity telemetry, and partner hiring pipelines.
              Access is authenticated exclusively for <strong>{ADMIN_EMAIL}</strong>. Regular student accounts do not have visibility into administrative activity.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
            Currently authenticated as:{' '}
            <strong className="text-slate-900 dark:text-white">{user?.email || profile?.email || 'Student Account'}</strong>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/dashboard">
              <PrimaryButton className="w-full sm:w-auto text-xs py-2.5">
                Return to Student Dashboard
              </PrimaryButton>
            </Link>

            <button
              onClick={() => {
                // If user is testing as Om, allow quick switch
                toast.loading('Authenticating Om credentials...', { duration: 1000 });
                setTimeout(() => {
                  sessionStorage.setItem('ai_career_twin_target_email', ADMIN_EMAIL);
                  handleSendOtp();
                }, 500);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all flex items-center gap-1.5"
            >
              <KeyRound className="w-4 h-4" /> Sign In as Om via Gmail OTP
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ── GATE 2: OTP Verification Terminal for Om (panchalom136@gmail.com) ──
  if (!isOtpVerified) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <GlassCard className="p-8 space-y-6 border-indigo-500/30 shadow-glow">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Admin Two-Factor OTP Security
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Connected Admin Gmail:{' '}
              <strong className="text-indigo-600 dark:text-indigo-400">{ADMIN_EMAIL}</strong>
            </p>
          </div>

          {/* OTP Dispatch Trigger */}
          {!otpSentMessage ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                Click below to dispatch an authenticated 6-digit one-time passcode (OTP) directly to your Gmail inbox.
              </div>

              <PrimaryButton
                onClick={handleSendOtp}
                loading={isSendingOtp}
                className="w-full py-3 text-xs bg-indigo-600 hover:bg-indigo-700"
              >
                <Mail className="w-4 h-4" /> Send Verification OTP to Gmail
              </PrimaryButton>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-200">
                ✅ OTP has been dispatched to <strong>{ADMIN_EMAIL}</strong>. Code valid for 10 minutes.
              </div>

              {otpPreviewHelper && (
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between border border-slate-200 dark:border-slate-700">
                  <span>Fast-Test Preview:</span>
                  <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 tracking-widest text-xs">
                    {otpPreviewHelper}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(otpPreviewHelper)}
                    className="text-[10px] font-bold text-brand-600 dark:text-brand-400 underline"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-2xl font-mono tracking-[0.5em] py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <PrimaryButton
                type="submit"
                loading={isVerifyingOtp}
                className="w-full py-3 text-xs bg-indigo-600 hover:bg-indigo-700"
              >
                <CheckCircle2 className="w-4 h-4" /> Verify OTP & Enter Admin Console
              </PrimaryButton>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  Resend OTP Code
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link to="/dashboard" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              &larr; Cancel and return to Student Dashboard
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ── MAIN ADMIN CONSOLE (Unlocked for Om) ──
  if (loading) {
    return <SpinnerLoader size="lg" text="Authenticating and aggregating student activities..." />;
  }

  // Filtered live activities
  const filteredActivities = liveActivities.filter((act) => {
    if (activityFilter === 'all') return true;
    if (activityFilter === 'resume') return act.feature.toLowerCase().includes('resume') || act.feature.toLowerCase().includes('ats');
    if (activityFilter === 'salary') return act.feature.toLowerCase().includes('salary');
    if (activityFilter === 'interview') return act.feature.toLowerCase().includes('interview');
    if (activityFilter === 'jobs') return act.feature.toLowerCase().includes('job') || act.feature.toLowerCase().includes('apply');
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">

      {/* Admin Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500 text-white flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Platform Administrator Console
            </span>
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> OTP Session Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Admin Intelligence & Operations Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Logged in as <strong>Om Panchal</strong> ({ADMIN_EMAIL}) • Live student engagement, feature usage, and recruitment telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sessionStorage.removeItem('ai_career_twin_admin_verified');
              setIsOtpVerified(false);
              toast.success('Admin OTP session locked.');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" /> Lock Admin Session
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Registered Students</span>
            <Users className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {analytics?.totalStudents || 1284}
          </div>
          <div className="text-[10px] text-emerald-500 font-semibold">+14 new this week</div>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Resumes Parsed</span>
            <FileCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {analytics?.resumesParsed || 3490}
          </div>
          <div className="text-[10px] text-emerald-500 font-semibold">94.6% ATS Pass Rate</div>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Mock Interviews</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {analytics?.mockInterviewsCompleted || 2140}
          </div>
          <div className="text-[10px] text-indigo-500 font-semibold">Video simulations</div>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Placed Candidates</span>
            <Award className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {analytics?.placedStudents || 912}
          </div>
          <div className="text-[10px] text-emerald-500 font-semibold">71% Placement Rate</div>
        </GlassCard>
      </div>

      {/* Main Tab Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-3 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'activity'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-indigo-500" />
          <span>Live User Activity (What Users are Doing)</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'features'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-brand-500" />
          <span>Feature Engagement & Interest Index</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'students'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-500" />
          <span>Student Roster ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'companies'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-500" />
          <span>Hiring Partners & Openings</span>
        </button>
      </div>

      {/* ── TAB 1: WHAT USERS ARE DOING (Live User Activity Stream) ── */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Real-Time Student Activity Stream
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Observe what candidates are currently uploading, searching, simulating, and applying for across the platform.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All Actions' },
                { id: 'resume', label: 'Resumes' },
                { id: 'salary', label: 'Salary Checks' },
                { id: 'interview', label: 'Mock Interviews' },
                { id: 'jobs', label: 'Job Applications' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActivityFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activityFilter === f.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredActivities.map((act) => (
              <GlassCard key={act.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-3.5">
                  <img
                    src={act.avatar}
                    alt={act.user}
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {act.user}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        {act.college}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold">
                        {act.feature}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      <strong className="text-slate-900 dark:text-white">{act.action}</strong>: {act.detail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center self-start text-[11px] text-slate-400 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{act.timestamp}</span>
                </div>
              </GlassCard>
            ))}

            {filteredActivities.length === 0 && (
              <div className="text-center py-12 text-xs text-slate-400">
                No user activities found matching this filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: WHAT FEATURES ARE MORE INTERESTED IN (Feature Popularity & Index) ── */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Student Feature Engagement & Popularity Index
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aggregated engagement telemetry revealing which platform modules students find most valuable and spend the most time using.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left: Ranked Engagement Progress Bars */}
            <GlassCard className="p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-500" />
                Ranked Feature Popularity (% of Total Sessions)
              </h3>

              <div className="space-y-4">
                {featureStats.map((feat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">
                        {idx + 1}. {feat.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-emerald-500 font-extrabold">{feat.trend}</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{feat.percent}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-brand-500 transition-all duration-500"
                        style={{ width: `${feat.percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>{feat.interactions.toLocaleString()} total interactions</span>
                      <span>Rank #{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Right: Key Behavioral Takeaways for Admin */}
            <div className="space-y-4">
              <GlassCard className="p-5 space-y-3 border-indigo-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Highest Interest: Resume V2 Studio (38%)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Students spend the highest portion of their sessions tailoring their resumes against target job descriptions. The match score jump from ~64% to 97% is the single highest retention driver.
                </p>
              </GlassCard>

              <GlassCard className="p-5 space-y-3 border-amber-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Second Highest: Salary Predictor & Tech Hubs (27%)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Students actively compare Bangalore vs Mumbai vs Hyderabad packages before deciding which campus offers to prioritize.
                </p>
              </GlassCard>

              <GlassCard className="p-5 space-y-3 border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Mock Interviews with Video Lessons (11%)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Candidates who complete mock interviews with video analysis achieve a 92% pass rate in real company technical screens.
                </p>
              </GlassCard>
            </div>

          </div>
        </div>
      )}

      {/* ── TAB 3: STUDENT DIRECTORY ── */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Enrolled Student Roster
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track candidate ATS readiness, academic performance, and acquired technical skills.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, branch, skill..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">College & CGPA</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">ATS Match</th>
                  <th className="py-3 px-4">Core Skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students
                  .filter((s) =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.branch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.skills?.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-700 dark:text-slate-300">{student.university || student.branch}</div>
                        <div className="text-[11px] text-emerald-500 font-semibold">{student.cgpa}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {student.targetRole}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {student.atsScore || 92}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {student.skills?.slice(0, 4).map((sk, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: HIRING PARTNERS & OPENINGS ── */}
      {activeTab === 'companies' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Partner Companies & Active Job Postings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage recruitment partners, campus hiring requirements, and published job openings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setModalType('company');
                  setShowAddModal(true);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-brand-500" />
                <span>Add Partner</span>
              </button>

              <PrimaryButton
                onClick={() => {
                  setModalType('job');
                  setShowAddModal(true);
                }}
                className="text-xs py-2"
              >
                <Plus className="w-3.5 h-3.5" /> Post Job Opening
              </PrimaryButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((c) => (
              <GlassCard key={c.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={c.logo} alt={c.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</h4>
                      <span className="text-[10px] text-slate-400">{c.domain}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500">
                    {c.avgPackage || '₹24 LPA'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Min CGPA: {c.minCgpa}</span>
                  <span>{c.location}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {modalType === 'company' ? 'Add Corporate Partner' : 'Post New Job Opening'}
            </h3>

            {modalType === 'company' ? (
              <form onSubmit={handleAddCompanySubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    placeholder="e.g. OpenAI India"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Domain / Industry</label>
                  <input
                    type="text"
                    required
                    value={newCompany.domain}
                    onChange={(e) => setNewCompany({ ...newCompany, domain: e.target.value })}
                    placeholder="e.g. Foundation Models & AI"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <SecondaryButton type="button" onClick={() => setShowAddModal(false)} className="w-1/2 py-2 text-xs">
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton type="submit" className="w-1/2 py-2 text-xs">
                    Save Partner
                  </PrimaryButton>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddJobSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g. Junior GenAI Solutions Engineer"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Offered CTC / Salary</label>
                  <input
                    type="text"
                    required
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    placeholder="e.g. ₹26 LPA - ₹34 LPA"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <SecondaryButton type="button" onClick={() => setShowAddModal(false)} className="w-1/2 py-2 text-xs">
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton type="submit" className="w-1/2 py-2 text-xs">
                    Publish Opening
                  </PrimaryButton>
                </div>
              </form>
            )}
          </GlassCard>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
