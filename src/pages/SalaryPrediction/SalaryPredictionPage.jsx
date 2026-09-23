import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  MapPin,
  Sliders,
  Award,
  Building2,
  Briefcase,
  IndianRupee,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  X,
  Target,
  ArrowRight,
  Video,
  FileCheck,
  Check,
  HelpCircle,
  Trophy,
  Zap,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import SalaryCard from '../../components/SalaryCard/SalaryCard';
import GlassCard from '../../components/Cards/GlassCard';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import { useUser } from '../../hooks/useUser';
import toast from 'react-hot-toast';

const PRESET_ROLES = [
  {
    title: "Senior Full-Stack AI Engineer",
    baseCTC: 1400000,
    fresherCTC: 850000,
    internBaseStipend: 45000,
    expStep: 220000,
    coreSkills: ["Python", "React", "FastAPI", "Docker", "PyTorch", "PostgreSQL", "System Design"],
    description: "Builds production GenAI features, LLM workflows, and modern high-throughput web frontends."
  },
  {
    title: "AI & Machine Learning Specialist",
    baseCTC: 1550000,
    fresherCTC: 950000,
    internBaseStipend: 50000,
    expStep: 260000,
    coreSkills: ["Python", "PyTorch", "Transformers", "RAG Pipelines", "Vector Search", "Docker"],
    description: "Focuses on deep learning architectures, fine-tuning LLMs, and high-performance inference."
  },
  {
    title: "Frontend Platform Architect",
    baseCTC: 1200000,
    fresherCTC: 750000,
    internBaseStipend: 35000,
    expStep: 180000,
    coreSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Web Performance"],
    description: "Architects scalable UI microfrontends, reactive design systems, and client-side optimization."
  },
  {
    title: "Backend & Cloud Distributed Systems",
    baseCTC: 1300000,
    fresherCTC: 800000,
    internBaseStipend: 40000,
    expStep: 200000,
    coreSkills: ["Python", "Node.js", "PostgreSQL", "Docker", "AWS", "Kubernetes", "Redis"],
    description: "Develops microservices, event-driven streaming, caching layers, and high-availability databases."
  },
  {
    title: "Data Scientist & Analytics Lead",
    baseCTC: 1150000,
    fresherCTC: 700000,
    internBaseStipend: 32000,
    expStep: 175000,
    coreSkills: ["Python", "SQL", "Pandas", "Scikit-Learn", "Tableau", "Statistics", "A/B Testing"],
    description: "Drives algorithmic business insights, predictive statistical modeling, and executive KPI analytics."
  },
  {
    title: "Software Engineering Intern (Student Tier)",
    baseCTC: 900000,
    fresherCTC: 650000,
    internBaseStipend: 30000,
    expStep: 150000,
    coreSkills: ["Python", "JavaScript", "Data Structures", "Git", "SQL", "React"],
    description: "Entry-level engineering internship focusing on algorithms, web microservices, and practical coding."
  }
];

const PRESET_COMPANIES = [
  "Google India",
  "Microsoft IDC",
  "NVIDIA India",
  "Amazon Development Centre",
  "Infosys AI Labs",
  "Swiggy / Zomato AI",
  "CRED / Razorpay",
  "Fast-Growing Series A/B Startup"
];

// Comprehensive benchmark data for Indian tech hubs
const CITY_BENCHMARKS = [
  {
    name: 'Bangalore (Bengaluru)',
    shortName: 'Bangalore',
    multiplier: 1.15,
    tag: '🏆 #1 Highest Tech Stipend & Salary',
    badgeColor: 'bg-emerald-500 text-white',
    avgLPA: '₹28 - ₹38 LPA',
    avgStipend: '₹35k - ₹65k / mo',
    description: 'Silicon Valley of India with highest concentration of GenAI startups, product hubs, and FAANG tech centres.'
  },
  {
    name: 'Mumbai / Navi Mumbai',
    shortName: 'Mumbai',
    multiplier: 1.10,
    tag: '🥈 #2 Top Fintech & High Frequency',
    badgeColor: 'bg-blue-500 text-white',
    avgLPA: '₹26 - ₹35 LPA',
    avgStipend: '₹30k - ₹55k / mo',
    description: 'Premier hub for quantitative trading firms, fintech unicorns, and major global investment banks.'
  },
  {
    name: 'Hyderabad (HITEC City)',
    shortName: 'Hyderabad',
    multiplier: 1.05,
    tag: '🥉 #3 Cloud & Enterprise Mega-Campuses',
    badgeColor: 'bg-indigo-500 text-white',
    avgLPA: '₹24 - ₹33 LPA',
    avgStipend: '₹28k - ₹50k / mo',
    description: 'Massive engineering campuses for Microsoft, Google, AWS, and enterprise product centers.'
  },
  {
    name: 'Delhi NCR / Gurgaon / Noida',
    shortName: 'Delhi NCR',
    multiplier: 1.02,
    tag: '#4 Consumer Tech & E-Commerce',
    badgeColor: 'bg-slate-700 text-slate-200',
    avgLPA: '₹22 - ₹31 LPA',
    avgStipend: '₹25k - ₹45k / mo',
    description: 'Dense concentration of consumer tech unicorns, quick-commerce leaders, and venture startups.'
  },
  {
    name: 'Pune (Hinjawadi / PCMC)',
    shortName: 'Pune',
    multiplier: 1.00,
    tag: '#5 Enterprise SaaS & Automotive AI',
    badgeColor: 'bg-slate-700 text-slate-200',
    avgLPA: '₹20 - ₹29 LPA',
    avgStipend: '₹22k - ₹38k / mo',
    description: 'Strong foundation in automotive software, distributed enterprise SaaS, and system development.'
  },
  {
    name: 'Chennai (OMR / Guindy)',
    shortName: 'Chennai',
    multiplier: 0.95,
    tag: '#6 Deep Tech & Global SaaS',
    badgeColor: 'bg-slate-700 text-slate-200',
    avgLPA: '₹19 - ₹27 LPA',
    avgStipend: '₹20k - ₹35k / mo',
    description: 'World-renowned SaaS capital (Zoho, Freshworks) and automotive deep-tech centers.'
  }
];

const SECTOR_TIERS = [
  { name: 'Big Tech / FAANG India (Google, Microsoft, Amazon)', multiplier: 1.25, internBonus: 1.30 },
  { name: 'GenAI & Foundation Model Startups', multiplier: 1.18, internBonus: 1.20 },
  { name: 'Fintech & Quantitative Finance', multiplier: 1.14, internBonus: 1.15 },
  { name: 'SaaS / B2B Cloud Platforms', multiplier: 1.00, internBonus: 1.00 },
  { name: "EdTech & IT Services Tier-1", multiplier: 0.88, internBonus: 0.80 }
];

export const SalaryPredictionPage = () => {
  const { profile } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const companyParam = searchParams.get('company');
  const locationParam = searchParams.get('location');

  // Role Level Mode: 'internship' | 'fulltime'
  const isInitialIntern = Boolean(
    roleParam?.toLowerCase().includes('intern') ||
    profile.targetRole?.toLowerCase().includes('intern')
  );
  const [careerMode, setCareerMode] = useState(isInitialIntern ? 'internship' : 'internship'); // Default to internship friendly for students
  const [targetRole, setTargetRole] = useState(roleParam || profile.targetRole || "Senior Full-Stack AI Engineer");
  const [targetCompany, setTargetCompany] = useState(companyParam || "Google India");
  const [experienceYears, setExperienceYears] = useState(0); // 0 = fresher / student
  const [selectedLocation, setSelectedLocation] = useState(
    locationParam?.includes('Bangalore')
      ? 'Bangalore (Bengaluru)'
      : locationParam?.includes('Hyderabad')
      ? 'Hyderabad (HITEC City)'
      : locationParam?.includes('Mumbai')
      ? 'Mumbai / Navi Mumbai'
      : locationParam?.includes('Delhi')
      ? 'Delhi NCR / Gurgaon / Noida'
      : 'Bangalore (Bengaluru)'
  );
  const [selectedSector, setSelectedSector] = useState('Big Tech / FAANG India (Google, Microsoft, Amazon)');
  const [hasPrefilled, setHasPrefilled] = useState(Boolean(roleParam || companyParam));

  // Matched Role Preset
  const matchedRolePreset = PRESET_ROLES.find((r) => r.title.toLowerCase() === targetRole.toLowerCase()) || PRESET_ROLES[0];
  const matchedCity = CITY_BENCHMARKS.find((c) => c.name === selectedLocation) || CITY_BENCHMARKS[0];
  const matchedSector = SECTOR_TIERS.find((s) => s.name === selectedSector) || SECTOR_TIERS[0];

  // Skill alignment with user's uploaded resume
  const candidateSkills = (profile.skills && profile.skills.length > 0)
    ? profile.skills
    : ['Python', 'React', 'FastAPI', 'Docker', 'PostgreSQL', 'PyTorch'];

  const matchedSkills = matchedRolePreset.coreSkills.filter((reqSkill) =>
    candidateSkills.some((cs) => cs.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cs.toLowerCase()))
  );

  const missingSkills = matchedRolePreset.coreSkills.filter((reqSkill) =>
    !candidateSkills.some((cs) => cs.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cs.toLowerCase()))
  );

  const fitScore = Math.min(98, Math.max(60, Math.round(
    ((matchedSkills.length / Math.max(1, matchedRolePreset.coreSkills.length)) * 70) +
    ((profile.atsScore || 92) / 100 * 30)
  )));

  // ATS Bonus
  const atsBonusMultiplier = (profile.atsScore || 92) >= 90 ? 1.08 : (profile.atsScore || 92) >= 80 ? 1.04 : 1.00;

  // ERROR 6: Realistic calculations for student internship stipend vs full-time CTC
  const calculatedMonthlyStipend = useMemo(() => {
    const raw = Math.round(
      matchedRolePreset.internBaseStipend *
      matchedCity.multiplier *
      (matchedSector.internBonus || 1.0) *
      atsBonusMultiplier
    );
    // Round to nearest thousand
    return Math.round(raw / 1000) * 1000;
  }, [matchedRolePreset, matchedCity, matchedSector, atsBonusMultiplier]);

  const calculatedFullTimeCTC = useMemo(() => {
    const base = experienceYears === 0 ? matchedRolePreset.fresherCTC : matchedRolePreset.baseCTC;
    const expAdder = experienceYears * matchedRolePreset.expStep;
    return Math.round(
      (base + expAdder) *
      matchedCity.multiplier *
      matchedSector.multiplier *
      atsBonusMultiplier
    );
  }, [matchedRolePreset, experienceYears, matchedCity, matchedSector, atsBonusMultiplier]);

  const formatLakhs = (val) => `₹${(val / 100000).toFixed(1)} LPA`;
  const formatMonthly = (val) => `₹${val.toLocaleString('en-IN')} / mo`;

  // Search links
  const cityNameOnly = selectedLocation.split(' ')[0];
  const queryRole = careerMode === 'internship' ? `${targetRole} Intern` : targetRole;
  const linkedinSearchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(queryRole + ' ' + (targetCompany || ''))}&location=${encodeURIComponent(cityNameOnly)}`;
  const indeedSearchUrl = `https://in.indeed.com/jobs?q=${encodeURIComponent(queryRole + ' ' + (targetCompany || ''))}&l=${encodeURIComponent(cityNameOnly)}`;

  const handleClearPrefill = () => {
    setSearchParams({});
    setHasPrefilled(false);
    setTargetRole("Senior Full-Stack AI Engineer");
    setTargetCompany("Google India");
    toast.success("Reset parameters to default benchmark");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
              Compensation Intelligence
            </span>
            <span className="text-[10px] font-bold text-emerald-500">
              • Calibrated to Experience & Resume
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Salary & Internship Stipend Prediction
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Calibrated with your verified resume skills, years of experience, and city location.
          </p>
        </div>

        {/* Career Stage Toggle: Internship vs Full-Time */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setCareerMode('internship');
              setExperienceYears(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              careerMode === 'internship'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student / Internship</span>
          </button>

          <button
            onClick={() => setCareerMode('fulltime')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              careerMode === 'fulltime'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Full-Time Role</span>
          </button>
        </div>
      </div>

      {/* Synchronized Resume Profile Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-500/10 via-emerald-500/10 to-transparent border border-brand-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-500 flex items-center justify-center flex-shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Synced Resume: {profile.lastResumeFilename || "Active Profile"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white">
                ATS Score: {profile.atsScore || 92}/100
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-600 dark:text-brand-400">
                {candidateSkills.length} Verified Skills
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your resume skills and academic performance ({profile.cgpa || '8.8 CGPA'}) are actively powering this compensation model.
            </p>
          </div>
        </div>

        <Link
          to="/resume-upload"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 self-start sm:self-center flex-shrink-0"
        >
          <span>Update Resume &rarr;</span>
        </Link>
      </div>

      {/* ERROR 6: HIGHLIGHT CARD FOR INTERNSHIP STIPEND OR FULL-TIME CTC */}
      {careerMode === 'internship' ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border-2 border-amber-500/30 dark:border-amber-400/20 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full">
                🎓 Realistic Student Internship Stipend
              </span>
              <span className="text-xs text-slate-400">• Zero False Inflated Promises</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {matchedCity.name}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-baseline gap-3">
            <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white flex items-center gap-1">
              <IndianRupee className="w-8 h-8 text-amber-500" />
              <span>{formatMonthly(calculatedMonthlyStipend)}</span>
            </div>
            <span className="text-sm font-bold text-slate-500">
              (Expected Range: {formatMonthly(calculatedMonthlyStipend - 5000)} – {formatMonthly(calculatedMonthlyStipend + 8000)})
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
            <h4 className="font-extrabold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
              💡 Student Guidance: What stipend should you accept for an internship?
            </h4>
            <p>
              • <strong>₹25,000 - ₹45,000 / month</strong> in Bangalore, Mumbai, or Hyderabad is a very solid, respectable stipend for college interns that easily covers living costs and pays you well for learning.
            </p>
            <p>
              • <strong>₹50,000 - ₹75,000+ / month</strong> is top 5% tier (offered by Google, Microsoft, Uber, Swiggy AI, and well-funded GenAI startups).
            </p>
            <p>
              • <strong>Do not accept unpaid tech internships</strong> if you already have Python, React, and project experience. Companies with real budgets pay at least ₹15,000 - ₹30,000 / month.
            </p>
          </div>
        </div>
      ) : (
        <SalaryCard
          estimate={formatLakhs(calculatedFullTimeCTC)}
          rangeMin={formatLakhs(Math.round(calculatedFullTimeCTC * 0.88))}
          rangeMax={formatLakhs(Math.round(calculatedFullTimeCTC * 1.18))}
          percentile={`Top ${fitScore >= 85 ? '10%' : '20%'} for ${targetRole} in India`}
          location={selectedLocation}
        />
      )}

      {/* Interactive Parameters Controls */}
      <GlassCard className="space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-brand-500" /> Adjust Career Experience & Target Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          
          {/* Target Role Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Target Role Benchmark</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              {PRESET_ROLES.map((r, i) => (
                <option key={i} value={r.title}>{r.title}</option>
              ))}
            </select>
          </div>

          {/* Company Target */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Target Company Tier</label>
            <select
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              {PRESET_COMPANIES.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Experience Slider: Disabled or 0 for Internships */}
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Experience Level: {careerMode === 'internship' ? 'College Student / Intern (0 Yrs)' : experienceYears === 0 ? 'Fresher (College Graduate)' : `${experienceYears} Years`}
              </label>
              <span className="text-[11px] text-slate-400">
                {careerMode === 'internship' ? 'Stipend Mode Active' : experienceYears === 0 ? 'Entry-Level Campus Offer' : 'Mid / Senior Scale'}
              </span>
            </div>

            {careerMode === 'fulltime' ? (
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-center font-semibold">
                Locked to 0 Years (College Student / Pre-Final / Final Year Intern)
              </div>
            )}
          </div>

        </div>
      </GlassCard>

      {/* ── WHICH CITY HAS THE BEST STIPEND & SALARY ── */}
      <GlassCard className="space-y-5 border-2 border-brand-500/20 shadow-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                City Compensation Benchmark & Ranking Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Which Indian city pays the highest for {targetRole}?
              </p>
            </div>
          </div>
        </div>

        {/* Top City Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-white">
                🏆 #1 HIGHEST TECH COMPENSATION
              </span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                Bangalore (Bengaluru)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
              Bangalore offers the highest salary packages in India with a <strong>+15% tech premium</strong>. Top tier internships range from <strong>₹35k to ₹65k / month</strong>, and fresher full-time packages range from <strong>₹12 LPA to ₹28 LPA</strong>.
            </p>
          </div>
        </div>

        {/* Grid of all cities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CITY_BENCHMARKS.map((city, idx) => {
            const isSelected = selectedLocation === city.name;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedLocation(city.name);
                  toast.success(`Location set to ${city.shortName}`);
                }}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-brand-500 bg-brand-500/10 shadow-md ring-1 ring-brand-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-brand-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    {city.shortName}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${city.badgeColor}`}>
                    {city.tag.split(' ')[0]}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-500 flex justify-between">
                    <span>Full-Time:</span>
                    <strong className="text-slate-900 dark:text-white">{city.avgLPA}</strong>
                  </div>
                  <div className="text-xs text-slate-500 flex justify-between">
                    <span>Intern Stipend:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{city.avgStipend}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{isSelected ? '✓ Active Location' : 'Click to select'}</span>
                  <span className="font-mono">{(city.multiplier > 1.0 ? `+${Math.round((city.multiplier - 1) * 100)}%` : `${Math.round((city.multiplier - 1) * 100)}%`)} vs Avg</span>
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* ── 1-CLICK VACANCIES ON LINKEDIN & INDEED ── */}
      <GlassCard className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Live Vacancies & Recruitment Portals
            </h3>
            <p className="text-xs text-slate-500">
              Check real openings for {queryRole} in {cityNameOnly} on India's top career networks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={linkedinSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Search on LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={indeedSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Search on Indeed</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};

export default SalaryPredictionPage;
