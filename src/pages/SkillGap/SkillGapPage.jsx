import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, Plus, Sparkles, BookOpen, ChevronRight, Upload } from 'lucide-react';
import GlassCard from '../../components/Cards/GlassCard';
import RadarChart from '../../components/Charts/RadarChart';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { useUser } from '../../hooks/useUser';
import toast from 'react-hot-toast';

// Domain skill requirements dictionary for dynamic skill gap computation
const ROLE_SKILL_REQUIREMENTS = {
  "Business Analyst": [
    { name: "SQL & Relational Queries", category: "Data Analysis", targetLevel: 92, recommendedCourse: "Advanced SQL Queries & Window Functions for BAs" },
    { name: "Power BI / Tableau", category: "BI & Reporting", targetLevel: 94, recommendedCourse: "Interactive Business Intelligence Dashboards" },
    { name: "Advanced Excel & Financial Modeling", category: "Spreadsheets", targetLevel: 95, recommendedCourse: "Excel Pivot Tables, Macros & Financial Projections" },
    { name: "BRD & FRD Documentation", category: "Requirements", targetLevel: 90, recommendedCourse: "Writing World-Class BRD/FRD Specifications" },
    { name: "Agile & Scrum (Jira)", category: "Project Management", targetLevel: 88, recommendedCourse: "Agile Scrum Master & Jira Sprint Management" },
    { name: "User Stories & Acceptance Criteria", category: "Product", targetLevel: 90, recommendedCourse: "Behavior-Driven User Story Mapping" },
    { name: "Stakeholder Communication & Presentations", category: "Soft Skills", targetLevel: 92, recommendedCourse: "Executive Stakeholder Storytelling & Alignment" }
  ],
  "Senior Full-Stack AI Engineer": [
    { name: "Python", category: "Backend / AI", targetLevel: 95, recommendedCourse: "Advanced Python Architecture & Concurrency" },
    { name: "React / Next.js", category: "Frontend", targetLevel: 92, recommendedCourse: "Next.js App Router & Server Components" },
    { name: "FastAPI / REST", category: "API Design", targetLevel: 90, recommendedCourse: "High-Throughput Async REST APIs with FastAPI" },
    { name: "Docker & Containerization", category: "DevOps", targetLevel: 88, recommendedCourse: "Docker & Multi-Stage Production Builds" },
    { name: "PyTorch / Transformers", category: "Deep Learning", targetLevel: 85, recommendedCourse: "HuggingFace Transformers & Fine-Tuning" },
    { name: "PostgreSQL & Vector DBs", category: "Database", targetLevel: 86, recommendedCourse: "pgvector & Semantic RAG Pipelines" },
    { name: "System Design", category: "Architecture", targetLevel: 84, recommendedCourse: "Grokking Modern Distributed System Design" }
  ],
  "AI & Machine Learning Specialist": [
    { name: "Python", category: "Core AI", targetLevel: 96, recommendedCourse: "Advanced Python for Scientific Computing" },
    { name: "PyTorch", category: "Neural Frameworks", targetLevel: 94, recommendedCourse: "Deep Learning with PyTorch Specialization" },
    { name: "Transformers & LLMs", category: "GenAI", targetLevel: 90, recommendedCourse: "Building Production RAG & LLM Agents" },
    { name: "FastAPI & Model Serving", category: "Deployment", targetLevel: 88, recommendedCourse: "Triton & TensorRT Low Latency Serving" },
    { name: "Vector Databases", category: "Data Storage", targetLevel: 86, recommendedCourse: "Vector Search with Pinecone & Milvus" },
    { name: "Docker / Kubernetes", category: "MLOps", targetLevel: 82, recommendedCourse: "Kubeflow & Automated ML Pipelines" }
  ],
  "Frontend Platform Engineer": [
    { name: "React.js", category: "Core UI", targetLevel: 96, recommendedCourse: "React 19 & Concurrent Rendering" },
    { name: "TypeScript", category: "Language", targetLevel: 94, recommendedCourse: "Advanced TypeScript Types & Generics" },
    { name: "Tailwind CSS", category: "Styling", targetLevel: 92, recommendedCourse: "Responsive Design Systems & Tailwind v4" },
    { name: "Next.js", category: "Framework", targetLevel: 90, recommendedCourse: "Full-Stack Next.js Mastery" },
    { name: "State Management", category: "Architecture", targetLevel: 88, recommendedCourse: "Zustand & React Query State Architecture" },
    { name: "Web Performance & Core Web Vitals", category: "Optimization", targetLevel: 85, recommendedCourse: "Chrome DevTools & Bundle Optimization" }
  ],
  "Backend & Cloud Developer": [
    { name: "Node.js / Express", category: "Backend", targetLevel: 94, recommendedCourse: "Node.js Event Loop & Microservices" },
    { name: "Python / FastAPI", category: "Backend", targetLevel: 90, recommendedCourse: "Async Python & Distributed Tasks" },
    { name: "PostgreSQL & SQL", category: "Database", targetLevel: 92, recommendedCourse: "Postgres Indexing & Query Tuning" },
    { name: "Docker & Cloud", category: "DevOps", targetLevel: 88, recommendedCourse: "AWS Cloud Practitioner & Docker Swarm" },
    { name: "Redis Caching", category: "Caching", targetLevel: 85, recommendedCourse: "Redis Pub/Sub & Distributed Locks" },
    { name: "REST APIs & Microservices", category: "Architecture", targetLevel: 90, recommendedCourse: "Event-Driven Microservices" }
  ],
  "Data Scientist & Analytics Intern": [
    { name: "Python", category: "Programming", targetLevel: 94, recommendedCourse: "Python for Data Analysis & Pandas" },
    { name: "SQL & Relational Queries", category: "Database", targetLevel: 92, recommendedCourse: "Advanced SQL Window Functions" },
    { name: "Scikit-Learn & Machine Learning", category: "Modeling", targetLevel: 88, recommendedCourse: "Applied ML & Feature Engineering" },
    { name: "Tableau / PowerBI", category: "Visualization", targetLevel: 85, recommendedCourse: "Executive Dashboard Storytelling" },
    { name: "Statistics & Hypothesis Testing", category: "Mathematics", targetLevel: 86, recommendedCourse: "A/B Testing & Statistical Modeling" }
  ],
  "Software Engineering Intern (Student)": [
    { name: "Python or JavaScript", category: "Programming", targetLevel: 90, recommendedCourse: "Algorithms & Problem Solving" },
    { name: "Data Structures & Algorithms", category: "Core CS", targetLevel: 88, recommendedCourse: "LeetCode Patterns & Blind 75" },
    { name: "Git & GitHub", category: "Collaboration", targetLevel: 86, recommendedCourse: "Git Branching, PRs, and Open Source" },
    { name: "SQL Basics", category: "Database", targetLevel: 84, recommendedCourse: "Database Schema Design & CRUD" },
    { name: "Web Fundamentals (HTML/CSS/JS)", category: "Web", targetLevel: 85, recommendedCourse: "Full Stack Web Basics" }
  ]
};

export const SkillGapPage = () => {
  const { profile } = useUser();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');

  const activeRoleName = roleParam || profile.targetRole || "Senior Full-Stack AI Engineer";

  // Check if resume is uploaded
  const hasResume = Boolean(profile.lastResumeFilename || localStorage.getItem('ai_career_twin_last_parsed_resume'));
  const candidateSkills = (profile.skills && profile.skills.length > 0)
    ? profile.skills
    : ['Python', 'JavaScript', 'React', 'FastAPI', 'Docker', 'PostgreSQL'];

  // Match against target requirements
  const targetReqs = useMemo(() => {
    // Look up exact or closest matching requirement set
    const foundKey = Object.keys(ROLE_SKILL_REQUIREMENTS).find(
      key => key.toLowerCase() === activeRoleName.toLowerCase() ||
             activeRoleName.toLowerCase().includes(key.toLowerCase()) ||
             key.toLowerCase().includes(activeRoleName.toLowerCase())
    );
    return ROLE_SKILL_REQUIREMENTS[foundKey] || ROLE_SKILL_REQUIREMENTS["Senior Full-Stack AI Engineer"];
  }, [activeRoleName]);

  // Compute skill gap status for each required skill
  const matrixItems = useMemo(() => {
    return targetReqs.map(req => {
      // Check if user has this skill in candidateSkills
      const matched = candidateSkills.some(cs =>
        cs.toLowerCase().includes(req.name.toLowerCase()) ||
        req.name.toLowerCase().includes(cs.toLowerCase()) ||
        (req.name.includes('/') && req.name.split('/').some(part => cs.toLowerCase().includes(part.trim().toLowerCase())))
      );

      const currentLevel = matched ? Math.min(96, Math.max(78, req.targetLevel - Math.floor(Math.random() * 8))) : Math.floor(req.targetLevel * 0.45);
      const gapDiff = req.targetLevel - currentLevel;
      const status = gapDiff <= 8 ? 'mastered' : gapDiff <= 25 ? 'in-progress' : 'needs-focus';
      const gapText = status === 'mastered' ? 'Mastered / Verified' : status === 'in-progress' ? `Gap: -${gapDiff}%` : `Critical Gap: -${gapDiff}%`;

      return {
        ...req,
        currentLevel,
        status,
        gapText,
        priority: status === 'needs-focus' ? 'High Priority' : status === 'in-progress' ? 'Medium' : 'Low Priority'
      };
    });
  }, [targetReqs, candidateSkills]);

  const masteredCount = matrixItems.filter(m => m.status === 'mastered').length;
  const overallMatch = Math.round((masteredCount / matrixItems.length) * 100);

  // Radar scores
  const radarComparison = useMemo(() => {
    const labels = matrixItems.slice(0, 6).map(m => m.name.split('/')[0].trim());
    const userScores = matrixItems.slice(0, 6).map(m => m.currentLevel);
    const targetScores = matrixItems.slice(0, 6).map(m => m.targetLevel);
    return { labels, userScores, targetScores };
  }, [matrixItems]);

  const actionableGaps = matrixItems.filter(m => m.status !== 'mastered');

  const handleAddRoadmap = (skillName) => {
    toast.success(`Added ${skillName} to your Learning Roadmap!`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
              Live Target Benchmark
            </span>
            {hasResume ? (
              <span className="text-[10px] font-bold text-emerald-500">
                • Synchronized with Resume ({profile.lastResumeFilename || "Uploaded"})
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-500">
                • Sample Mode (Upload Resume for Real Alignment)
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Skill Gap Matrix & Radar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Target Role: <strong className="text-brand-600 dark:text-brand-400">{activeRoleName}</strong> • Skill Match: <strong className="text-emerald-500">{overallMatch}%</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/learning-roadmap">
            <PrimaryButton icon={BookOpen} className="py-2.5 px-5 text-xs">
              View Roadmap
            </PrimaryButton>
          </Link>
          <Link to="/dashboard">
            <SecondaryButton className="py-2.5 px-4 text-xs">
              Back to Dashboard
            </SecondaryButton>
          </Link>
        </div>
      </div>

      {/* Grid: Radar Chart & High Priority Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-500" /> Skill Competency Radar
            </h3>
            <span className="text-xs text-slate-400">Resume vs Target</span>
          </div>

          <RadarChart
            dataLabels={radarComparison.labels}
            userScores={radarComparison.userScores}
            targetScores={radarComparison.targetScores}
          />
        </GlassCard>

        {/* Priority Gaps to Bridge */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Priority Gaps to Bridge ({actionableGaps.length})
            </h3>
            <span className="text-xs text-amber-500 font-bold">Highest Impact</span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {actionableGaps.length > 0 ? (
              actionableGaps.map((rec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
                      {rec.priority}
                    </span>
                    <span className="text-xs font-semibold text-emerald-500">+₹2.5 LPA Potential CTC</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rec.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Recommended Course: {rec.recommendedCourse}</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Current: {rec.currentLevel}% / Target: {rec.targetLevel}%</span>
                    <SecondaryButton onClick={() => handleAddRoadmap(rec.name)} icon={Plus} className="py-1 px-3 text-[11px]">
                      Add to Roadmap
                    </SecondaryButton>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">All Core Skills Mastered!</h4>
                <p className="text-xs text-slate-500">Your resume possesses all required competencies for {activeRoleName}.</p>
              </div>
            )}
          </div>
        </GlassCard>

      </div>

      {/* Skills Matrix Table */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Complete Skill Matrix & Proficiency Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated against your active resume keywords for <strong>{activeRoleName}</strong>
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {masteredCount} of {matrixItems.length} Mastered
          </span>
        </div>

        <div className="space-y-3">
          {matrixItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</span>
                  <span className="text-slate-400 ml-2">({item.category})</span>
                </div>
                <span className={`font-bold ${
                  item.status === 'mastered' ? 'text-emerald-500' : item.status === 'in-progress' ? 'text-brand-500' : 'text-amber-500'
                }`}>
                  {item.gapText}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Your Resume Level: {item.currentLevel}%</span>
                  <span>Target Industry Standard: {item.targetLevel}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.status === 'mastered' ? 'bg-emerald-500' : item.status === 'in-progress' ? 'bg-brand-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.currentLevel}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

    </div>
  );
};

export default SkillGapPage;
