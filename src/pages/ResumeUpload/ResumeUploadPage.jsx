import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Award,
  ArrowRight,
  UploadCloud,
  RefreshCw,
  FileCheck,
  AlertTriangle,
  Copy,
  Zap
} from 'lucide-react';
import DropzoneUpload from '../../components/Upload/DropzoneUpload';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { useUser } from '../../hooks/useUser';
import { parseResumeWithAI } from '../../services/api';
import toast from 'react-hot-toast';

export const ResumeUploadPage = () => {
  const { profile, updateProfileData } = useUser();
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste' | 'sample'
  const [pasteText, setPasteText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sampleResumes = [
    {
      title: 'Arjun Sharma — CS & AI Final Year',
      subtitle: 'IIT Bombay • 9.1 CGPA • PyTorch, React, FastAPI',
      content: `ARJUN SHARMA
arjun.sharma@iit.ac.in | +91 98765 43210 | Bangalore, India (Open to Remote)
GitHub: github.com/arjun-ai | LinkedIn: linkedin.com/in/arjun-sharma

EDUCATION
B.Tech in Computer Science & Artificial Intelligence | IIT Bombay | CGPA: 9.1 / 10.0 (2021 - 2025)
Key Coursework: Deep Learning, Data Structures & Algorithms, Distributed Systems, NLP

TECHNICAL SKILLS
Languages: Python, TypeScript, JavaScript, SQL, C++
Frameworks & Tools: PyTorch, FastAPI, React.js, Node.js, Docker, Tailwind CSS, PostgreSQL, Git
AI & ML Concepts: Transformers, RAG Pipelines, Vector Search (Pinecone), LLM Prompt Engineering

EXPERIENCE & PROJECTS
Software Engineering Intern | Infosys AI Labs (Jun 2024 - Sep 2024)
- Engineered scalable microservices with FastAPI & React, servicing 40k+ weekly requests.
- Integrated Gemini LLM embeddings for customer support query classification, cutting latency by 35%.

Neural Vision Classifier (Open-Source PyTorch Project)
- Built an image classification API serving inference via Docker; achieved 94.2% mAP accuracy.`
    },
    {
      title: 'Priya Mehta — Full Stack Fresher',
      subtitle: 'BITS Pilani • 8.8 CGPA • MERN Stack & Cloud',
      content: `PRIYA MEHTA
priya.mehta@bits-pilani.ac.in | +91 98123 45678 | Hyderabad, India
Portfolio: priyamehta.dev | GitHub: github.com/priyamehta

EDUCATION
B.E. in Information Technology | BITS Pilani | CGPA: 8.8 / 10.0 (2021 - 2025)

TECHNICAL SKILLS
Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, Python, SQL
Frontend & Backend: React.js, Next.js, Node.js, Express, MongoDB, PostgreSQL, Tailwind CSS
DevOps & Cloud: AWS EC2/S3, Docker, Git, RESTful APIs, Jest

PROJECTS
DevCollab - Realtime Collaborative Code Workspace
- Built live paired programming app using React, WebSockets, and Node.js.
- Implemented JWT authentication and role-based access control.`
    },
    {
      title: 'Rohit Gupta — Data Science & Analytics',
      subtitle: 'NITK Surathkal • 8.4 CGPA • Python, SQL, ML',
      content: `ROHIT GUPTA
rohit.gupta@nitk.ac.in | +91 97234 56789 | Bangalore, India

EDUCATION
B.Tech in Data Science & Engineering | NIT Karnataka | CGPA: 8.4 / 10.0 (2022 - 2026)

TECHNICAL SKILLS
Languages & Libs: Python, R, SQL, Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn
BI Tools & Databases: Tableau, PowerBI, PostgreSQL, BigQuery, Excel (VBA)

PROJECTS
E-Commerce Customer Churn Prediction Engine
- Analyzed 200,000 transaction records to engineer predictive churn features.
- Trained Random Forest and XGBoost classifiers yielding 89.4% ROC-AUC score.`
    }
  ];

  const handleRunAnalysis = async (content, filename, fileBase64 = null, fileMimeType = null) => {
    setIsAnalyzing(true);
    toast.loading('Analyzing resume with Gemini AI ATS engine...', { id: 'ats-parse' });

    try {
      const response = await parseResumeWithAI(content, filename, profile.targetRole, fileBase64, fileMimeType);
      const result = response.data;
      setParsedData(result);

      // Auto-sync extracted skills and ATS score to the global profile
      if (result.detectedSkills && result.detectedSkills.length > 0) {
        updateProfileData({
          skills: Array.from(new Set([...profile.skills, ...result.detectedSkills])),
          atsScore: result.atsScore || profile.atsScore,
          readinessScore: Math.min(96, Math.max(75, result.atsScore - 4)),
          name: result.candidateInfo?.name && result.candidateInfo?.name !== 'Candidate' ? result.candidateInfo.name : profile.name
        });
      }

      toast.success(`Analysis complete! ATS Score: ${result.atsScore}/100`, { id: 'ats-parse' });
    } catch (err) {
      console.error(err);
      toast.error('Could not complete resume parse', { id: 'ats-parse' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUploadSuccess = (file, base64Data = null, mimeType = null, extractedText = '') => {
    handleRunAnalysis(extractedText, file.name, base64Data, mimeType);
  };

  const handleLoadSample = (sample) => {
    setPasteText(sample.content);
    handleRunAnalysis(sample.content, `${sample.title.split('—')[0].trim()}_Resume.pdf`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          AI Resume Parser & ATS Evaluation
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Evaluate your resume with Gemini 3.8 Flash against real tech hiring benchmarks (Greenhouse, Workday, Lever).
        </p>
      </div>

      {/* Premium Feature Callout Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-400/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center text-lg shadow-sm flex-shrink-0">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider">
                Premium Feature • $99/mo
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-600 dark:text-amber-300">
                JD to Resume V2
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 mt-0.5">
              Have a specific Job Description? Paste the JD to automatically re-align your skills, get a custom executive summary, and generate Resume V2!
            </p>
          </div>
        </div>
        <Link
          to="/premium-resume"
          className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 hover:from-amber-400 hover:to-yellow-300 shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-1.5"
        >
          <span>Open Resume V2 Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Input Mode Selector */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'upload'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <UploadCloud className="w-4 h-4" /> Upload Document (.pdf, .docx)
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'paste'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Copy className="w-4 h-4" /> Paste Raw Resume Text
        </button>
        <button
          onClick={() => setActiveTab('sample')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'sample'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" /> 1-Click Sample Resumes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          {activeTab === 'upload' && (
            <GlassCard className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-brand-500" /> Upload File
              </h3>
              <DropzoneUpload onUploadSuccess={handleFileUploadSuccess} />
            </GlassCard>
          )}

          {activeTab === 'paste' && (
            <GlassCard className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Paste Resume Content</h3>
              <p className="text-xs text-slate-400">Copy text directly from Word, LinkedIn, or PDF:</p>
              <textarea
                rows="9"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste work experience, education, skills, and projects here..."
                className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
              <PrimaryButton
                disabled={!pasteText.trim() || isAnalyzing}
                loading={isAnalyzing}
                onClick={() => handleRunAnalysis(pasteText, 'Pasted_Resume.txt')}
                className="w-full py-2.5 text-xs"
              >
                Parse with Gemini AI
              </PrimaryButton>
            </GlassCard>
          )}

          {activeTab === 'sample' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Select Pre-built Profile
              </span>
              {sampleResumes.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => handleLoadSample(s)}
                  className="p-4 glass-card border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500 cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                      {s.title}
                    </h4>
                    <span className="text-[10px] text-brand-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Load &rarr;
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{s.subtitle}</p>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-700 dark:text-brand-300 space-y-2">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Real-Time Twin Synchronization
            </span>
            <p>
              Parsing automatically extracts your skills and updates your ATS score throughout the dashboard, interview room, and salary predictor.
            </p>
          </div>
        </div>

        {/* Right Column: Parsed Output */}
        <div className="lg:col-span-2 space-y-6">
          {parsedData ? (
            <GlassCard space-y-6 className="border border-emerald-500/30 shadow-glow">
              {/* Header result */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Parsing Completed</h3>
                    <p className="text-xs text-slate-400">Target Role: {profile.targetRole}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-extrabold text-emerald-500">{parsedData.atsScore}/100</span>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Overall ATS Score</span>
                </div>
              </div>

              {/* Sub-score grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Keywords</span>
                  <strong className="text-sm font-extrabold text-brand-500">{parsedData.keywordScore || 92}%</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Format</span>
                  <strong className="text-sm font-extrabold text-emerald-500">{parsedData.formattingScore || 90}%</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Impact</span>
                  <strong className="text-sm font-extrabold text-amber-500">{parsedData.impactScore || 85}%</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Structure</span>
                  <strong className="text-sm font-extrabold text-violet-500">{parsedData.structureScore || 94}%</strong>
                </div>
              </div>

              {/* Summary note */}
              {parsedData.summary && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200/60 dark:border-slate-700/60">
                  <strong className="text-slate-900 dark:text-white block mb-1">Executive AI Evaluation:</strong>
                  {parsedData.summary}
                </div>
              )}

              {/* Extracted Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Extracted Technical Competencies ({parsedData.detectedSkills?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {parsedData.detectedSkills?.map((sk, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing keywords */}
              {parsedData.missingKeywords && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    Recommended Keywords for {profile.targetRole}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {parsedData.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Link to="/ats-analysis" className="w-full sm:w-auto">
                  <PrimaryButton className="w-full py-2.5 text-xs">
                    View Full ATS Breakdown <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                </Link>
                <Link to="/career-recommendation" className="w-full sm:w-auto">
                  <SecondaryButton className="w-full py-2.5 text-xs">
                    Explore Matching Careers & Jobs
                  </SecondaryButton>
                </Link>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="text-center py-20 space-y-4 border-dashed border-2 border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ready for Neural Parsing</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Drop your file, paste text, or load a sample student profile in the left panel to test real-time ATS scoring powered by Gemini 3.8 Flash.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
