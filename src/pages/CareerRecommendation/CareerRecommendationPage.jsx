import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Filter,
  X,
  ChevronRight,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Building2,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  Send,
  GraduationCap,
  IndianRupee,
  ExternalLink,
  Table as TableIcon,
  LayoutGrid,
  Check,
  Search,
  Upload,
  UserCheck,
  FileText
} from 'lucide-react';
import CareerCard from '../../components/CareerCard/CareerCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { getCareerRecommendations, getCompanies, getJobs, applyToJob, toggleSaveJob } from '../../services/api';
import { useUser } from '../../hooks/useUser';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';

export const CareerRecommendationPage = () => {
  const { profile } = useUser();
  const [activeTab, setActiveTab] = useState('jobs'); // default to 'jobs' table per user request
  const [jobViewMode, setJobViewMode] = useState('table'); // 'table' | 'cards'
  const [jobTypeFilter, setJobTypeFilter] = useState('all'); // 'all' | 'internship' | 'fulltime' | 'highmatch'
  const [careers, setCareers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCareerModal, setSelectedCareerModal] = useState(null);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [candidateCoverNote, setCandidateCoverNote] = useState('');
  const [loading, setLoading] = useState(true);

  // Resume state & user target role
  const hasResume = Boolean(profile.lastResumeFilename || localStorage.getItem('ai_career_twin_last_parsed_resume'));
  const userTargetRole = profile.targetRole || "Business Analyst";
  const candidateSkills = (profile.skills && profile.skills.length > 0)
    ? profile.skills
    : ['Python', 'JavaScript', 'React', 'FastAPI', 'Docker', 'PostgreSQL', 'PyTorch'];

  useEffect(() => {
    const load = async () => {
      try {
        const [carRes, compRes, jobRes] = await Promise.all([
          getCareerRecommendations(),
          getCompanies(),
          getJobs()
        ]);
        setCareers(carRes.data || []);
        setCompanies(compRes.companies || []);
        setJobs(jobRes.jobs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleApply = async (jobId) => {
    const res = await applyToJob(jobId);
    if (res.success) {
      toast.success(res.message || 'Application submitted successfully with your AI Career Twin profile!');
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, applied: true, applicants: (j.applicants || 12) + 1 } : j))
      );
    }
  };

  const handleToggleSave = async (jobId) => {
    const res = await toggleSaveJob(jobId);
    if (res.success) {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, saved: res.saved } : j))
      );
      toast.success(res.saved ? 'Job bookmarked!' : 'Job removed from bookmarks');
    }
  };

  // Dynamically calculate resume match and skills for every job
  const enrichedJobs = useMemo(() => {
    return jobs.map((job) => {
      const required = job.requiredSkills || [];
      const matched = required.filter((reqSkill) =>
        candidateSkills.some(
          (cs) => cs.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cs.toLowerCase())
        )
      );
      const missing = required.filter(
        (reqSkill) =>
          !candidateSkills.some(
            (cs) => cs.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cs.toLowerCase())
          )
      );

      // Dynamically compute match score using candidate's real resume skills
      const dynamicMatch = required.length > 0
        ? Math.min(99, Math.max(55, Math.round((matched.length / required.length) * 100)))
        : 85;

      const isIntern = job.title?.toLowerCase().includes('intern') || job.experience?.toLowerCase().includes('intern') || job.experience?.includes('0-1');

      return {
        ...job,
        dynamicMatch,
        matchedSkills: matched,
        missingSkills: missing,
        isIntern
      };
    });
  }, [jobs, candidateSkills]);

  // Filter jobs by search & type
  const filteredJobs = useMemo(() => {
    return enrichedJobs.filter((j) => {
      const matchesSearch =
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.location && j.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (j.requiredSkills && j.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

      let matchesType = true;
      if (jobTypeFilter === 'internship') matchesType = j.isIntern;
      if (jobTypeFilter === 'fulltime') matchesType = !j.isIntern;
      if (jobTypeFilter === 'highmatch') matchesType = j.dynamicMatch >= 80;
      if (jobTypeFilter === 'targetRole') {
        const target = userTargetRole.toLowerCase();
        const jTitle = j.title.toLowerCase();
        matchesType = jTitle.includes(target) || (target.includes('analyst') && jTitle.includes('analyst'));
      }

      return matchesSearch && matchesType;
    });
  }, [enrichedJobs, searchQuery, jobTypeFilter, userTargetRole]);

  // Sort jobs: Prioritize roles matching candidate's active resume target role
  const sortedJobs = useMemo(() => {
    const target = userTargetRole.toLowerCase();
    return [...filteredJobs].sort((a, b) => {
      const aTitle = (a.title || '').toLowerCase();
      const bTitle = (b.title || '').toLowerCase();
      const aRoleMatch = target && (aTitle.includes(target) || (target.includes('analyst') && aTitle.includes('analyst')));
      const bRoleMatch = target && (bTitle.includes(target) || (target.includes('analyst') && bTitle.includes('analyst')));

      if (aRoleMatch && !bRoleMatch) return -1;
      if (!aRoleMatch && bRoleMatch) return 1;
      return (b.dynamicMatch || 0) - (a.dynamicMatch || 0);
    });
  }, [filteredJobs, userTargetRole]);

  const categories = ['All', 'Artificial Intelligence', 'Software Engineering', 'Data & Analytics', 'Cloud & DevOps'];

  const filteredCareers = careers.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <SpinnerLoader size="lg" text="Calibrating jobs with your active resume skills..." />;
  }

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
              Live Job Board
            </span>
            {hasResume ? (
              <span className="text-[10px] font-bold text-emerald-500">
                • 100% Calibrated with Resume ({profile.lastResumeFilename || "Active"})
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-500">
                • Showing Sample Benchmark (Upload Resume for Real Alignment)
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Career Pathways & Jobs Matched to Resume
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Every match score and skill gap below is calculated in real-time from your resume keywords.
          </p>
        </div>

        {/* Tab switcher: Jobs, Companies, Pathways */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'jobs'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Jobs Table ({filteredJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('careers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'careers'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Pathways
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'companies'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Hiring Companies ({companies.length})
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles, companies (Google, Swiggy), or skills (Python, React)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-500"
          />
        </div>

        {activeTab === 'jobs' && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setJobTypeFilter(jobTypeFilter === 'targetRole' ? 'all' : 'targetRole')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  jobTypeFilter === 'targetRole'
                    ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-500/30'
                    : 'text-brand-600 dark:text-brand-400 hover:bg-brand-500/10'
                }`}
                title={`Filter specifically to ${userTargetRole} roles`}
              >
                <span>🎯 {userTargetRole}</span>
              </button>
              <button
                onClick={() => setJobTypeFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  jobTypeFilter === 'all' ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setJobTypeFilter('internship')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  jobTypeFilter === 'internship' ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Internships
              </button>
              <button
                onClick={() => setJobTypeFilter('fulltime')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  jobTypeFilter === 'fulltime' ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Full-Time
              </button>
              <button
                onClick={() => setJobTypeFilter('highmatch')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  jobTypeFilter === 'highmatch' ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Match 80%+
              </button>
            </div>

            {/* View toggle (Table vs Cards) */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setJobViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  jobViewMode === 'table' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Smooth Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setJobViewMode('cards')}
                className={`p-1.5 rounded-lg transition-colors ${
                  jobViewMode === 'cards' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ERROR 5 REQUIREMENT: SMOOTH, ACCESSIBLE TABLE VIEW FOR JOBS */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          
          {jobViewMode === 'table' ? (
            <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xl bg-white dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-black">
                      <th className="py-3.5 px-4">Role & Enterprise</th>
                      <th className="py-3.5 px-3">Type & Level</th>
                      <th className="py-3.5 px-3">Location</th>
                      <th className="py-3.5 px-3">Compensation</th>
                      <th className="py-3.5 px-3">Resume Match</th>
                      <th className="py-3.5 px-4">Skills (Matched vs Missing)</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {sortedJobs.length > 0 ? (
                      sortedJobs.map((job) => {
                        const isTargetRole = userTargetRole && (
                          job.title.toLowerCase().includes(userTargetRole.toLowerCase()) ||
                          (userTargetRole.toLowerCase().includes('analyst') && job.title.toLowerCase().includes('analyst'))
                        );

                        return (
                          <tr
                            key={job.id}
                            className={`hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors ${
                              isTargetRole ? 'bg-brand-500/[0.02]' : ''
                            }`}
                          >
                            {/* Role & Company */}
                            <td className="py-4 px-4 min-w-[200px]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                  {job.title}
                                </span>
                                {isTargetRole && (
                                  <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-black bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                                    Resume Match
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-bold text-brand-600 dark:text-brand-400">
                                  {job.companyName}
                                </span>
                                <span className="text-[10px] text-slate-400">• {job.applicants || 18} applied</span>
                              </div>
                            </td>

                            {/* Type & Experience */}
                            <td className="py-4 px-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                job.isIntern
                                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                                  : 'bg-brand-500/10 text-brand-600 dark:text-brand-300'
                              }`}>
                                {job.isIntern ? 'Internship' : 'Full-Time'}
                              </span>
                              <div className="text-[10px] text-slate-400 mt-1">{job.experience}</div>
                            </td>

                            {/* Location */}
                            <td className="py-4 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              {job.location}
                            </td>

                            {/* Compensation / Stipend */}
                            <td className="py-4 px-3 whitespace-nowrap">
                              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 text-xs">
                                <IndianRupee className="w-3.5 h-3.5" />
                                {job.salary}
                              </span>
                            </td>

                            {/* Resume Match Score */}
                            <td className="py-4 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-1 rounded-lg text-xs font-black ${
                                  job.dynamicMatch >= 85
                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                    : job.dynamicMatch >= 70
                                    ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                }`}>
                                  {job.dynamicMatch}%
                                </span>
                              </div>
                            </td>

                            {/* Skills Breakdown */}
                            <td className="py-4 px-4 min-w-[240px]">
                              <div className="flex flex-wrap gap-1">
                                {job.matchedSkills?.map((s, idx) => (
                                  <span
                                    key={`m-${idx}`}
                                    className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                    title="Skill matched on your resume"
                                  >
                                    ✓ {s}
                                  </span>
                                ))}
                                {job.missingSkills?.map((s, idx) => (
                                  <span
                                    key={`ms-${idx}`}
                                    className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500"
                                    title="Missing on your resume"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Action Buttons: LinkedIn, Indeed, Fill Form Modal, 1-Click Apply */}
                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Fill Form Modal Trigger */}
                                <button
                                  onClick={() => setSelectedJobForModal(job)}
                                  className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-brand-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  title="Fill candidate details and choose application pathway"
                                >
                                  <FileText className="w-3 h-3 text-brand-500" />
                                  <span>Fill Form</span>
                                </button>

                                {/* LinkedIn Direct Search */}
                                <a
                                  href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title + " " + job.companyName)}&location=${encodeURIComponent(job.location?.split(',')[0] || 'India')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold transition-all flex items-center gap-1"
                                  title="Direct Apply on LinkedIn"
                                >
                                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                  </svg>
                                  <span>LinkedIn</span>
                                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                                </a>

                                {/* Indeed Direct Search */}
                                <a
                                  href={`https://in.indeed.com/jobs?q=${encodeURIComponent(job.title + " " + job.companyName)}&l=${encodeURIComponent(job.location?.split(',')[0] || 'India')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold transition-all flex items-center gap-1"
                                  title="Direct Apply on Indeed"
                                >
                                  <span className="font-black text-[9px] bg-indigo-600 text-white px-1 rounded-xs">in</span>
                                  <span>Indeed</span>
                                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                                </a>

                                {/* 1-Click Apply */}
                                <button
                                  disabled={job.applied}
                                  onClick={() => handleApply(job.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                    job.applied
                                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                      : 'bg-brand-600 hover:bg-brand-700 active:scale-95 text-white shadow-xs'
                                  }`}
                                >
                                  {job.applied ? (
                                    <>
                                      <CheckCircle className="w-3 h-3" />
                                      <span>Applied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-3 h-3" />
                                      <span>Apply</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-10 text-center text-slate-400">
                          No jobs found matching your current filter. Try searching for "Python" or "Engineer".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Card View Alternative */
            <div className="grid grid-cols-1 gap-4">
              {sortedJobs.map((job) => (
                <GlassCard
                  key={job.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40 transition-all duration-300"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
                        {job.companyName}
                      </span>
                      <span className="text-xs text-slate-400">• {job.location}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                        {job.dynamicMatch}% Resume Match
                      </span>
                      {job.isIntern && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                          Internship
                        </span>
                      )}
                      {userTargetRole && (
                        job.title.toLowerCase().includes(userTargetRole.toLowerCase()) ||
                        (userTargetRole.toLowerCase().includes('analyst') && job.title.toLowerCase().includes('analyst'))
                      ) && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-300 border border-brand-500/20">
                          🎯 Active Target Role
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-extrabold text-emerald-500 flex items-center gap-0.5">
                        <IndianRupee className="w-3 h-3" /> {job.salary}
                      </span>
                      <span>• {job.experience}</span>
                      <span>• {job.applicants || 14} Applicants</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.matchedSkills?.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                      {job.missingSkills?.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500"
                        >
                          + {sk}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <a
                        href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title + " " + job.companyName)}&location=${encodeURIComponent(job.location?.split(',')[0] || 'India')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>

                      <a
                        href={`https://in.indeed.com/jobs?q=${encodeURIComponent(job.title + " " + job.companyName)}&l=${encodeURIComponent(job.location?.split(',')[0] || 'India')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <span className="font-black text-[10px] bg-indigo-600 text-white px-1 rounded-xs">in</span>
                        <span>Indeed</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>

                      <Link
                        to={`/salary-prediction?role=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.companyName)}&location=${encodeURIComponent(job.location)}&salary=${encodeURIComponent(job.salary)}`}
                        className="px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <IndianRupee className="w-3 h-3" />
                        <span>Predict Salary</span>
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full md:w-auto self-end md:self-center">
                    <button
                      onClick={() => handleToggleSave(job.id)}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        job.saved
                          ? 'border-brand-500 text-brand-500 bg-brand-500/10'
                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {job.saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    {/* Fill Form Button */}
                    <button
                      onClick={() => setSelectedJobForModal(job)}
                      className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-brand-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-500" />
                      <span>Fill Form</span>
                    </button>

                    <PrimaryButton
                      disabled={job.applied}
                      onClick={() => handleApply(job.id)}
                      className="py-2.5 px-5 text-xs whitespace-nowrap flex-1 md:flex-initial"
                    >
                      {job.applied ? (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400" /> Applied
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5" /> 1-Click Apply
                        </span>
                      )}
                    </PrimaryButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Pathways Tab */}
      {activeTab === 'careers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((c) => (
            <CareerCard key={c.id} career={c} onViewDetails={() => setSelectedCareerModal(c)} />
          ))}
        </div>
      )}

      {/* Companies Tab */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((comp) => (
            <GlassCard key={comp.id} className="space-y-4 border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{comp.name}</h3>
                  <span className="text-xs text-slate-400">{comp.industry} • {comp.location}</span>
                </div>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                  {comp.avgPackage}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{comp.hiringFocus}</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(comp.name)}&location=India`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                >
                  <span>LinkedIn Vacancies</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => {
                    setActiveTab('jobs');
                    setSearchQuery(comp.name);
                  }}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {comp.openRolesCount} Openings &rarr;
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

    </div>
  );
};

export default CareerRecommendationPage;
