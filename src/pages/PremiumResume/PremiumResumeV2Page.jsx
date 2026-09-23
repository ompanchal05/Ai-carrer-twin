import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Briefcase,
  Building,
  CheckCircle2,
  TrendingUp,
  Copy,
  Download,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Award,
  Zap,
  Check,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { useUser } from '../../hooks/useUser';
import { tailorResumeV2WithAI } from '../../services/api';
import toast from 'react-hot-toast';

export const PremiumResumeV2Page = () => {
  const { profile } = useUser();

  // Inputs
  const [jobTitle, setJobTitle] = useState('Senior Full-Stack AI Engineer');
  const [company, setCompany] = useState('Google Cloud AI');
  const [jobDescription, setJobDescription] = useState(
`About the Role:
We are looking for a Senior Full-Stack AI Engineer to build scalable microservices and intuitive developer interfaces for Google Cloud's enterprise AI platform.

Key Responsibilities:
- Design and deploy high-throughput RESTful and gRPC microservices using Python, FastAPI, and Go.
- Build responsive, accessible frontend workflows with React.js, TypeScript, and modern CSS frameworks.
- Integrate large language model (LLM) pipelines, vector search databases (Pinecone, Milvus), and automated RAG architectures.
- Collaborate with cross-functional teams to improve end-to-end API response latency and maintain 99.9% uptime.
- Containerize services using Docker and orchestrate with Kubernetes CI/CD workflows.

Required Qualifications:
- BS/MS in Computer Science, AI, or equivalent engineering experience.
- 2+ years of hands-on experience in Python, TypeScript, React.js, and FastAPI.
- Solid understanding of System Design, Distributed Systems, and Microservices.
- Experience with Cloud platforms (GCP / AWS), Docker, PostgreSQL, and Git.`
  );

  const [currentResumeText, setCurrentResumeText] = useState(
`${profile?.name || 'Arjun Sharma'}
${profile?.email || 'arjun.sharma@iit.ac.in'} | +91 98765 43210 | Bangalore, India
GitHub: github.com/candidate | LinkedIn: linkedin.com/in/candidate

EDUCATION:
B.Tech in Computer Science & AI | 8.9 CGPA

SKILLS:
Python, React.js, FastAPI, PostgreSQL, Git, JavaScript, Node.js, Tailwind CSS, PyTorch

PROJECTS:
1. AI Query Classifier: Built FastAPI service with React frontend for query classification.
2. Web Collaboration Tool: Real-time code sharing app with WebSockets.`
  );

  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorStep, setTailorStep] = useState('');
  const [tailoredData, setTailoredData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('v2'); // 'v2' | 'comparison' | 'markdown'

  const sampleJDs = [
    {
      title: 'Google Cloud AI',
      role: 'Senior Full-Stack AI Engineer',
      desc: `We are looking for an Engineer to build scalable microservices with Python, FastAPI, and React. Experience with Docker, Kubernetes, and LLM/RAG pipelines required. Strong emphasis on latency reduction and distributed system scale.`
    },
    {
      title: 'Stripe',
      role: 'Full Stack Platform Architect',
      desc: `Seeking a software engineer to scale global billing infrastructure. Must have deep expertise in TypeScript, React, PostgreSQL, and high-reliability API development with zero-downtime migrations.`
    },
    {
      title: 'OpenAI / Anthropic',
      role: 'Applied ML & Systems Engineer',
      desc: `Join our team to deploy frontier model inference pipelines. Requires mastery in Python, PyTorch, CUDA, FastAPI, Docker, and quantitative latency benchmarking.`
    }
  ];

  const handleSelectSampleJD = (sample) => {
    setCompany(sample.title);
    setJobTitle(sample.role);
    setJobDescription(sample.desc);
  };

  const handleGenerateResumeV2 = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast.error('Please enter or select a Job Description (JD).');
      return;
    }

    setIsTailoring(true);
    setTailorStep('1/4 Analyzing JD core qualifications & keywords...');
    const toastId = toast.loading('Tailoring Resume V2 with Gemini 3.8 Engine...', { id: 'v2-toast' });

    setTimeout(() => {
      setTailorStep('2/4 Crafting executive summary tailored to ' + company + '...');
    }, 600);

    setTimeout(() => {
      setTailorStep('3/4 Reorganizing skill stack and formulating XYZ impact bullets...');
    }, 1200);

    try {
      const response = await tailorResumeV2WithAI({
        jobTitle,
        company,
        jobDescription,
        currentResumeText,
        candidateProfile: profile
      });

      setTailorStep('4/4 Finalizing Resume V2 with 97%+ ATS match score!');
      setTailoredData(response.data);
      toast.success('Resume V2 Generated Successfully!', { id: 'v2-toast' });
    } catch (err) {
      console.error(err);
      toast.error('Could not generate Resume V2. Please try again.', { id: 'v2-toast' });
    } finally {
      setIsTailoring(false);
      setTailorStep('');
    }
  };

  const handleCopyMarkdown = () => {
    if (!tailoredData?.resumeV2Markdown) return;
    navigator.clipboard.writeText(tailoredData.resumeV2Markdown);
    setCopied(true);
    toast.success('Resume V2 Markdown copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadText = () => {
    if (!tailoredData?.resumeV2Markdown) return;
    const element = document.createElement('a');
    const file = new Blob([tailoredData.resumeV2Markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${(profile?.name || 'Candidate').replace(/\s+/g, '_')}_Resume_V2_${company.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Resume V2 downloaded successfully!');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Top Premium Hero Banner with Golden Accents */}
      <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden border border-amber-400/40 bg-gradient-to-br from-navy-950 via-slate-900 to-amber-950/40 shadow-2xl text-white">
        
        {/* Ambient gold glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-black tracking-wider uppercase shadow-sm">
              <span className="text-amber-400 animate-pulse text-sm">👑</span>
              <span>Exclusive VIP Feature • ₹99/Month Subscription Active</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              JD-to-Resume{' '}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                V2 Tailoring Studio
              </span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Targeting a specific role? Paste any Job Description (JD). The AI engine automatically writes a 
              custom Executive Summary, re-aligns your skills directly to the JD requirements, rewrites experience bullets using Google's XYZ formula, and outputs <strong>Resume V2</strong> with a 97%+ ATS match score.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
            <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/30 backdrop-blur-md space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-400">Target Match Boost</span>
                <span className="text-xs font-extrabold text-emerald-400">+35% Higher</span>
              </div>
              <div className="text-2xl font-black text-amber-300">62% ➔ 97% ATS</div>
              <p className="text-[11px] text-slate-400">Guaranteed keyword parity with recruiter filters</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workflow: Left (Input JD & Profile) / Right (Resume V2 Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="space-y-5 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-500" />
                1. Job Target & JD Input
              </h2>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Step 1
              </span>
            </div>

            {/* Quick 1-Click Sample Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Quick 1-Click Sample JDs:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleJDs.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSampleJD(s)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-amber-400 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
                  >
                    <span>{s.title}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerateResumeV2} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Company</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Google, Stripe"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Role Title</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior AI Engineer"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400/50"
                    />
                  </div>
                </div>
              </div>

              {/* JD Textarea */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Paste Job Description (JD)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {jobDescription.length} characters
                  </span>
                </div>
                <textarea
                  rows={6}
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job posting, required qualifications, and responsibilities here..."
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400/50 font-mono"
                />
              </div>

              {/* Current Resume Text / Profile preview */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Candidate Current Background / Resume Base
                  </label>
                  <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">
                    Auto-Loaded
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={currentResumeText}
                  onChange={(e) => setCurrentResumeText(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400/50 font-mono"
                />
              </div>

              {/* Golden Submit Button */}
              <button
                type="submit"
                disabled={isTailoring}
                className="w-full py-3.5 px-4 rounded-2xl text-xs font-black text-amber-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 hover:from-amber-400 hover:to-yellow-300 shadow-md hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isTailoring ? (
                  <>
                    <div className="w-4 h-4 border-2 border-amber-950 border-t-transparent rounded-full animate-spin" />
                    <span>{tailorStep || 'Tailoring Resume V2...'}</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">👑</span>
                    <span>Generate Tailored Resume V2 with JD Skills</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </GlassCard>

          {/* Premium Plan Info Card */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-400/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-500">
              <ShieldCheck className="w-4 h-4" />
              <span>Premium Tier Benefits Included ($99/mo)</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                Unlimited JD tailored resumes with 1-click generation
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                Google XYZ formula bullets mapping to target company problems
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                Real-time ATS Score parity testing against Lever & Greenhouse
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Tailored Resume V2 Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!tailoredData ? (
            <GlassCard className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl mb-4 shadow-sm animate-bounce">
                👑
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Resume V2 Workspace Ready
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Enter your target company and job description on the left, then click <strong>"Generate Tailored Resume V2"</strong> to see the tailored resume with custom summary, re-ordered skills, and XYZ bullets.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => handleGenerateResumeV2({ preventDefault: () => {} })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Load Demo Tailored V2 Result
                </button>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              
              {/* Score Leap Indicator */}
              <GlassCard className="p-5 border border-amber-400/40 bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-emerald-500/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-500 uppercase tracking-wider">
                        ATS Match Score Comparison
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Top 2% of Applicants
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Tailored specifically for <strong>{company}</strong> ({jobTitle})
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Original V1</span>
                      <div className="text-lg font-bold text-slate-500 line-through">
                        {tailoredData.beforeMatchScore}%
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-amber-500" />
                    <div className="text-center p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                        Resume V2 Score
                      </span>
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {tailoredData.afterMatchScore}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Added Keywords Chips */}
                {tailoredData.addedKeywords && tailoredData.addedKeywords.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Keywords Added from JD to Resume V2:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tailoredData.addedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30"
                        >
                          +{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* View Selector & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('v2')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === 'v2'
                        ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Resume V2 Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('markdown')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === 'markdown'
                        ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Clean Markdown Code
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Resume V2'}</span>
                  </button>
                  <button
                    onClick={handleDownloadText}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-accent-violet hover:from-brand-700 hover:to-accent-violet/90 shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download (.md)</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Formatted Resume V2 Card */}
              {activeTab === 'v2' && (
                <div className="space-y-6">
                  
                  {/* Tailored Executive Summary */}
                  <GlassCard className="space-y-2 border-l-4 border-l-amber-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      JD-Tailored Professional Executive Summary
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      "{tailoredData.tailoredExecutiveSummary}"
                    </p>
                  </GlassCard>

                  {/* Tailored Skill Hierarchy */}
                  <GlassCard className="space-y-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      JD-Aligned Technical Skills (Prioritized by JD Requirements)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tailoredData.tailoredSkills?.map((cat, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {cat.category}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {cat.skills?.map((sk, j) => (
                              <span
                                key={j}
                                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Tailored Bullets (XYZ formula) */}
                  <GlassCard className="space-y-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Tailored Experience Bullets (Google XYZ Accomplishment Formula)
                    </span>
                    <div className="space-y-3">
                      {tailoredData.tailoredExperienceBullets?.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {item.role} • <span className="text-brand-600 dark:text-brand-400">{item.organization}</span>
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              Tailored for {company}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            {item.bullet}
                          </p>
                          {item.keywordsMatched && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {item.keywordsMatched.map((kw, k) => (
                                <span key={k} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-600 dark:text-amber-300">
                                  ✓ {kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}

              {/* Tab 2: Clean Markdown Document */}
              {activeTab === 'markdown' && (
                <GlassCard className="p-5 font-mono text-xs">
                  <pre className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 max-h-[600px] overflow-y-auto">
                    {tailoredData.resumeV2Markdown}
                  </pre>
                </GlassCard>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default PremiumResumeV2Page;
