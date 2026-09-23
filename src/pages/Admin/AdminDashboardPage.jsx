import React, { useState, useEffect } from 'react';
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
  GraduationCap
} from 'lucide-react';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { getStudents, getCompanies, getJobs, getSystemAnalytics } from '../../services/api';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('students');
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

  const fetchData = async () => {
    try {
      const [stuRes, compRes, jobRes, anaRes] = await Promise.all([
        getStudents(),
        getCompanies(),
        getJobs(),
        getSystemAnalytics()
      ]);
      setStudents(stuRes.students || []);
      setCompanies(compRes.companies || []);
      setJobs(jobRes.jobs || []);
      setAnalytics(anaRes.analytics);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        setCompanies((prev) => [data.company, ...prev]);
        toast.success(`Added partner company: ${newCompany.name}`);
        setShowAddModal(false);
        setNewCompany({
          name: '',
          domain: '',
          location: 'Bangalore, India',
          minCgpa: 8.0,
          requiredSkills: 'Python, PyTorch, React.js',
          avgPackage: '₹22,00,000 - ₹30,00,000'
        });
      }
    } catch (err) {
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
        setJobs((prev) => [data.job, ...prev]);
        toast.success(`Published job listing: ${newJob.title}`);
        setShowAddModal(false);
        setNewJob({
          companyName: 'Google India',
          title: '',
          location: 'Bangalore, India (Hybrid)',
          salary: '₹28 LPA - ₹35 LPA',
          experience: '0 - 2 Years',
          requiredSkills: 'Python, FastApi, React.js'
        });
      }
    } catch (err) {
      toast.error('Failed to post job');
    }
  };

  if (loading) {
    return <SpinnerLoader size="lg" text="Loading AI Career Twin Admin Management Control..." />;
  }

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> University & Placement Admin Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Enterprise Admin Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor student career progression, manage partner enterprise recruitment, and oversee AI Twin analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PrimaryButton
            icon={Plus}
            onClick={() => {
              setModalType(activeTab === 'jobs' ? 'job' : 'company');
              setShowAddModal(true);
            }}
            className="py-2.5 text-xs shadow-glow"
          >
            {activeTab === 'jobs' ? 'Post New Job' : 'Add Partner Company'}
          </PrimaryButton>
        </div>
      </div>

      {/* Top Metric Cards */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Candidates</span>
            <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{analytics.totalStudents}</p>
            <span className="text-[10px] text-emerald-500 font-semibold">+48 this week</span>
          </GlassCard>
          <GlassCard className="p-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resumes Parsed</span>
            <p className="text-2xl font-extrabold text-emerald-500">{analytics.resumesParsed}</p>
            <span className="text-[10px] text-slate-400 font-semibold">Pass Rate: {analytics.atsPassRate}</span>
          </GlassCard>
          <GlassCard className="p-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placed Candidates</span>
            <p className="text-2xl font-extrabold text-violet-500">{analytics.placedStudents}</p>
            <span className="text-[10px] text-emerald-500 font-semibold">71% Placement Ratio</span>
          </GlassCard>
          <GlassCard className="p-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Avg Latency</span>
            <p className="text-2xl font-extrabold text-amber-500">{analytics.avgResponseTime}</p>
            <span className="text-[10px] text-slate-400 font-semibold">Gemini 3.8 Flash</span>
          </GlassCard>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'students'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Student Roster ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('companies')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'companies'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" /> Partner Companies ({companies.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'jobs'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Job Postings ({jobs.length})
        </button>
      </div>

      {/* Tab 1: Student Directory */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, college, role..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredStudents.length} candidate profiles
            </span>
          </div>

          <GlassCard className="overflow-x-auto p-0 border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Institute & Branch</th>
                  <th className="p-4">CGPA</th>
                  <th className="p-4">Target Role</th>
                  <th className="p-4">ATS Resume</th>
                  <th className="p-4">Readiness</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{stu.name}</div>
                      <span className="text-[10px] text-slate-400">{stu.email}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{stu.university}</div>
                      <span className="text-[10px] text-slate-400">{stu.branch}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {stu.cgpa}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                        {stu.targetRole}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-emerald-500 font-extrabold">{stu.atsScore}/100</span>
                    </td>
                    <td className="p-4">
                      <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-500 h-full rounded-full"
                          style={{ width: `${stu.readinessScore}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">{stu.readinessScore}% Match</span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toast.success(`Viewing full dossier for ${stu.name}`)}
                        className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}

      {/* Tab 2: Partner Companies */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.map((comp) => (
            <GlassCard key={comp.id} className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={comp.logo}
                    alt={comp.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{comp.name}</h3>
                    <p className="text-xs text-slate-500">{comp.domain} • {comp.location}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {comp.matchScore}% Match
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <span className="text-slate-400 block text-[10px]">Min. CGPA Filter</span>
                  <strong className="text-slate-800 dark:text-slate-200">{comp.minCgpa} / 10.0</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Avg Package (CTC)</span>
                  <strong className="text-emerald-500">{comp.avgPackage}</strong>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                  Target Tech Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {comp.requiredSkills?.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-slate-400">{comp.openRolesCount} Open Positions</span>
                <button
                  onClick={() => toast.success(`Viewing candidate pipeline for ${comp.name}`)}
                  className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
                >
                  Manage Pipeline &rarr;
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Tab 3: Job Postings */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <GlassCard key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      {job.companyName}
                    </span>
                    <span className="text-xs text-slate-400">• {job.location}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                    <span className="font-semibold text-emerald-500">{job.salary}</span>
                    <span>• {job.experience}</span>
                    <span>• {job.applicants} Candidate Applicants</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => toast.success(`Viewing applicants for ${job.title}`)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  >
                    View Applicants ({job.applicants})
                  </button>
                  <button
                    onClick={() => toast.success(`Listing status updated for ${job.title}`)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white transition-colors"
                  >
                    Active
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Add Company or Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {modalType === 'job' ? 'Post New Tech Job Opening' : 'Register New Partner Company'}
            </h3>

            {modalType === 'company' ? (
              <form onSubmit={handleAddCompanySubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    placeholder="e.g. Uber India, Atlassian, Adobe"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Tech Domain / Category</label>
                  <input
                    type="text"
                    value={newCompany.domain}
                    onChange={(e) => setNewCompany({ ...newCompany, domain: e.target.value })}
                    placeholder="e.g. Cloud AI, Fintech, Autonomous Systems"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Min CGPA Threshold</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newCompany.minCgpa}
                      onChange={(e) => setNewCompany({ ...newCompany, minCgpa: parseFloat(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Package Range</label>
                    <input
                      type="text"
                      value={newCompany.avgPackage}
                      onChange={(e) => setNewCompany({ ...newCompany, avgPackage: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Target Required Skills (comma separated)</label>
                  <input
                    type="text"
                    value={newCompany.requiredSkills}
                    onChange={(e) => setNewCompany({ ...newCompany, requiredSkills: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <SecondaryButton type="button" onClick={() => setShowAddModal(false)} className="py-2 text-xs">
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton type="submit" className="py-2 text-xs">
                    Add Partner
                  </PrimaryButton>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddJobSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g. AI Research Intern, Backend SDE"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Company</label>
                    <input
                      type="text"
                      value={newJob.companyName}
                      onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Salary</label>
                    <input
                      type="text"
                      value={newJob.salary}
                      onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Required Skills (comma separated)</label>
                  <input
                    type="text"
                    value={newJob.requiredSkills}
                    onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <SecondaryButton type="button" onClick={() => setShowAddModal(false)} className="py-2 text-xs">
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton type="submit" className="py-2 text-xs">
                    Publish Opening
                  </PrimaryButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
