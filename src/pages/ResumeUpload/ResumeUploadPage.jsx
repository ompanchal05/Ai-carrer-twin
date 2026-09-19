import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, CheckCircle2, Award, ArrowRight, UploadCloud, RefreshCw } from 'lucide-react';
import DropzoneUpload from '../../components/Upload/DropzoneUpload';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';

export const ResumeUploadPage = () => {
  const [parsedData, setParsedData] = useState(null);

  const handleUploadSuccess = (file) => {
    setParsedData({
      filename: file.name,
      parsedDate: new Date().toLocaleDateString(),
      contact: {
        name: "Alex Rivera",
        email: "alex.rivera@university.edu",
        phone: "+1 (555) 234-5678",
        location: "San Francisco, CA"
      },
      skillsExtracted: ["Python", "PyTorch", "React.js", "Node.js", "FastAPI", "Docker", "Tailwind CSS", "PostgreSQL"],
      atsScore: 92,
      detectedRoles: ["Senior AI Engineer", "Full Stack AI Developer", "ML Research Assistant"],
      rawTextSnippet: "COMPUTER SCIENCE & AI SENIOR | STANFORD UNIVERSITY ... Fine-tuned LLM prompts, trained PyTorch models, built React microservices..."
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          AI Resume Parser & Analyzer
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload your latest resume in PDF or DOCX format for real-time neural parsing and ATS evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload Component */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-brand-500" /> Upload Document
            </h3>
            <DropzoneUpload onUploadSuccess={handleUploadSuccess} />
          </GlassCard>

          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-700 dark:text-brand-300 space-y-2">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> AI Twin Privacy Guarantee
            </span>
            <p>Your resume data is processed locally in mock mode for Phase 1. Zero data leaves your browser.</p>
          </div>
        </div>

        {/* Right Column: Parsed Output Results */}
        <div className="lg:col-span-2 space-y-6">
          {parsedData ? (
            <GlassCard space-y-6 className="border border-emerald-500/30 shadow-glow">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Parsing Completed</h3>
                    <p className="text-xs text-slate-400">Source file: {parsedData.filename}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-extrabold text-emerald-500">{parsedData.atsScore}/100</span>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">ATS Score</span>
                </div>
              </div>

              {/* Extracted Contact */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Candidate Info</h4>
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <div><strong className="text-slate-500">Name:</strong> {parsedData.contact.name}</div>
                  <div><strong className="text-slate-500">Email:</strong> {parsedData.contact.email}</div>
                  <div><strong className="text-slate-500">Location:</strong> {parsedData.contact.location}</div>
                  <div><strong className="text-slate-500">Parsed Date:</strong> {parsedData.parsedDate}</div>
                </div>
              </div>

              {/* Extracted Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detected Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skillsExtracted.map((sk, i) => (
                    <span key={i} className="px-3 py-1 text-xs font-medium rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Raw Text Snippet */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Parsed Content Preview</h4>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs leading-relaxed max-h-32 overflow-y-auto">
                  {parsedData.rawTextSnippet}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Link to="/ats-analysis" className="w-full sm:w-auto">
                  <PrimaryButton className="w-full py-2.5 text-xs">
                    View Full ATS Breakdown <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                </Link>
                <Link to="/career-recommendation" className="w-full sm:w-auto">
                  <SecondaryButton className="w-full py-2.5 text-xs">
                    Explore Career Matches
                  </SecondaryButton>
                </Link>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="text-center py-16 space-y-4 border-dashed border-2 border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Resume Parsed Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Drag and drop your file in the left panel to begin instant neural parsing and skill extraction.
              </p>
            </GlassCard>
          )}
        </div>

      </div>

    </div>
  );
};

export default ResumeUploadPage;
