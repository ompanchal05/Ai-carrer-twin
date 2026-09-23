import React, { useState, useEffect } from 'react';
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
  GraduationCap
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
  const [activeTab, setActiveTab] = useState('careers'); // 'careers' | 'companies' | 'jobs'
  const [careers, setCareers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCareerModal, setSelectedCareerModal] = useState(null);
  const [loading, setLoading] = useState(true);

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
      toast.success(res.message || 'Application submitted successfully!');
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, applied: true, applicants: j.applicants + 1 } : j))
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

  const categories = ['All', 'Artificial Intelligence', 'Software Engineering', 'Data & Analytics', 'Cloud & DevOps'];

  const filteredCareers = careers.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <SpinnerLoader size="lg" text="Matching your twin profile with 50k+ career pathways & companies..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            AI Career & Enterprise Company Matching
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Target pathways, hiring enterprises (FR10), and active job positions (FR11) matched to your skills & CGPA.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('careers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'careers'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Career Paths
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'companies'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Top Companies
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'jobs'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Recommended Jobs
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Filter by role, company, or skill (e.g. PyTorch, React, Google)..."
          className="max-w-md"
        />

        {activeTab === 'careers' && (
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View 1: Career Pathways */}
      {activeTab === 'careers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCareers.map((career) => (
            <CareerCard
              key={career.id}
              career={career}
              onSelect={(item) => setSelectedCareerModal(item)}
            />
          ))}
        </div>
      )}

      {/* View 2: Company Matching (FR10) */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((comp) => {
            const hasCgpaEligible = parseFloat(profile.cgpa || '9.0') >= comp.minCgpa;
            return (
              <GlassCard key={comp.id} className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{comp.name}</h3>
                        <p className="text-xs text-slate-400">{comp.domain}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {comp.matchScore}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Min. CGPA</span>
                      <strong className={hasCgpaEligible ? 'text-emerald-500' : 'text-amber-500'}>
                        {comp.minCgpa} (You: {profile.cgpa?.split('/')[0].trim()})
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Package CTC</span>
                      <strong className="text-brand-500">{comp.avgPackage}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.requiredSkills.map((sk, i) => {
                        const userHas = profile.skills?.some((s) => s.toLowerCase() === sk.toLowerCase());
                        return (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              userHas
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {userHas ? '✓ ' : ''}
                            {sk}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{comp.openRolesCount} Openings</span>
                  <button
                    onClick={() => {
                      setActiveTab('jobs');
                      setSearchQuery(comp.name);
                    }}
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    View Jobs &rarr;
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* View 3: Job Recommendations (FR11) */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => (
              <GlassCard
                key={job.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      {job.companyName}
                    </span>
                    <span className="text-xs text-slate-400">• {job.location}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                      {job.matchScore}% Match
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-extrabold text-emerald-500">{job.salary}</span>
                    <span>• {job.experience}</span>
                    <span>• {job.applicants} Applicants</span>
                    <span>• Posted {job.postedDate}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleToggleSave(job.id)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      job.saved
                        ? 'border-brand-500 text-brand-500 bg-brand-500/10'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white'
                    }`}
                    title={job.saved ? 'Saved' : 'Save Job'}
                  >
                    {job.saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
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
        </div>
      )}

      {/* Career Details Modal */}
      {selectedCareerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 bg-white dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded">
                  {selectedCareerModal.category}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedCareerModal.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCareerModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedCareerModal.description}
            </p>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <div>
                <span className="text-xs text-slate-400 font-medium">Expected Salary Range</span>
                <p className="text-lg font-extrabold text-emerald-500 mt-0.5">
                  {selectedCareerModal.avgSalary}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Market Demand Growth</span>
                <p className="text-lg font-extrabold text-brand-500 mt-0.5">
                  {selectedCareerModal.demandGrowth}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Responsibilities
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {selectedCareerModal.keyResponsibilities?.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Link to="/skill-gap" className="flex-1">
                <PrimaryButton className="w-full py-2.5 text-xs">
                  Analyze Skill Gap <ChevronRight className="w-4 h-4" />
                </PrimaryButton>
              </Link>
              <Link to="/learning-roadmap" className="flex-1">
                <SecondaryButton className="w-full py-2.5 text-xs">
                  View Learning Roadmap
                </SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerRecommendationPage;
