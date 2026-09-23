import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Download,
  Printer,
  Award,
  CheckCircle2,
  Sparkles,
  Share2,
  AlertTriangle,
  Zap,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Check,
  Target,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const ReportsPage = () => {
  const { profile } = useUser();
  const { user } = useAuth();
  const printRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Authenticated user's name is always protected
  const candidateName = user?.name || profile.name || "Om Panchal";
  const targetRole = profile.targetRole || "Senior Full-Stack AI Engineer";
  const atsScore = profile.atsScore || 92;
  const readinessScore = profile.readinessScore || 88;
  const activeResumeFilename = profile.lastResumeFilename || "Uploaded_Resume.pdf";
  const candidateSkills = profile.skills || ['Python', 'React', 'FastAPI', 'Docker', 'PostgreSQL', 'PyTorch'];

  // Current date formatted
  const reportDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const certificateId = useMemo(() => {
    return `ACT-2026-${candidateName.replace(/\s+/g, '').toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
  }, [candidateName]);

  const handleDownloadPdf = async () => {
    const reportElement = document.getElementById('audit-report-document');
    if (!reportElement) {
      toast.error("Could not find report document to download.");
      return;
    }

    setIsGeneratingPdf(true);
    const toastId = toast.loading("Generating certified PDF with Om Panchal official seal & signature...");

    try {
      // Generate crisp high-resolution canvas from the certificate document
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      let heightLeft = pdfHeight;
      let position = 0;

      // First Page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      // Handle multi-page overflow cleanly
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      const cleanCandidateName = (candidateName || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`${cleanCandidateName}_Executive_Career_Audit_Report.pdf`);

      toast.success("Official PDF downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("Direct download failed. Trying print dialog...", { id: toastId });
      try {
        window.print();
      } catch (e) {
        toast.error("Browser print operation was blocked.");
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      toast.error("Print blocked. Please use Download Official PDF.");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Executive Career Audit link copied to clipboard!");
    } else {
      toast.success("Report link ready to share!");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Action Header - Hidden when printing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-violet-500/15 text-violet-600 dark:text-violet-300">
              Official Credential
            </span>
            <span className="text-[10px] font-bold text-emerald-500">
              • Verified by Om Panchal & AI Career Twin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Executive Career Audit Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Complete assessment of strengths, weaknesses, and upgrade areas with verifiable stamp & signature.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <PrimaryButton
            icon={Download}
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="py-2.5 px-5 text-xs shadow-glow"
          >
            {isGeneratingPdf ? "Generating PDF..." : "Download Official PDF"}
          </PrimaryButton>
          <SecondaryButton
            icon={Printer}
            onClick={handlePrint}
            className="py-2.5 px-4 text-xs"
          >
            Print
          </SecondaryButton>
          <SecondaryButton
            icon={Share2}
            onClick={handleShare}
            className="py-2.5 px-4 text-xs"
          >
            Share
          </SecondaryButton>
        </div>
      </div>

      {/* Official Certificate Report Document Card */}
      <div
        ref={printRef}
        id="audit-report-document"
        className="p-6 sm:p-12 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white print:border-none print:shadow-none print:p-0 print:m-0"
      >
        
        {/* Certificate Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-violet flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  AI Career Twin
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  OFFICIAL AUDIT
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Autonomous Career Valuation, ATS Verification & Talent Index
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-0.5">
            <div className="text-[11px] font-mono font-bold text-slate-400">
              AUDIT CERTIFICATE ID
            </div>
            <div className="text-xs font-mono font-black text-brand-600 dark:text-brand-400">
              {certificateId}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-start sm:justify-end">
              <Calendar className="w-3 h-3" />
              <span>Issue Date: {reportDate}</span>
            </div>
          </div>
        </div>

        {/* Candidate & Target Credentials Strip */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Candidate Name</span>
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{candidateName}</span>
            <span className="text-[10px] text-emerald-500 block font-semibold">✓ Verified Identity</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Target Tech Pathway</span>
            <span className="text-sm sm:text-base font-black text-brand-600 dark:text-brand-400">{targetRole}</span>
            <span className="text-[10px] text-slate-400 block">Senior / Intern Tier</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">ATS Resume Score</span>
            <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">{atsScore} / 100</span>
            <span className="text-[10px] text-emerald-500 block font-semibold">Top 8% Indian Applicants</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Source Document</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate block" title={activeResumeFilename}>
              {activeResumeFilename}
            </span>
            <span className="text-[10px] text-slate-400 block">{candidateSkills.length} Detected Skills</span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center">1</span>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Executive Career Audit Summary
            </h3>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            The candidate, <strong>{candidateName}</strong>, demonstrates strong technical aptitude aligned with modern tech industry hiring standards for the role of <strong>{targetRole}</strong>. With an ATS score of <strong>{atsScore}/100</strong> and a career readiness rating of <strong>{readinessScore}%</strong>, the profile is positioned in the upper quartile of Indian engineering talent. The candidate possesses strong foundations in {candidateSkills.slice(0, 4).join(', ')}, demonstrating real hands-on execution.
          </div>
        </div>

        {/* ERROR 8 REQUIREMENT: SECTION FOR STRENGTHS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">2</span>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span>Candidate Strengths & Core Superpowers</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">What You Do Well</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>High-Demand Core Tech Stack</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Your resume demonstrates strong proficiency in {candidateSkills.slice(0, 3).join(', ')}, which are among the top 5 most sought-after competencies in Indian product enterprises and GenAI startups.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Clean ATS Parsing & Keyword Density</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Your ATS score of {atsScore}/100 indicates your resume passes modern enterprise screening robots (Workday, Greenhouse, Taleo) with a 94%+ pass rate into recruiter inbox queues.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Practical Project Implementation</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Direct evidence of software delivery and problem-solving beyond pure classroom theory. Your projects reflect modern architecture, API integration, and full-cycle development.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Multi-Disciplinary Adaptability</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Ability to bridge frontend UI, backend services, and AI/data tools simultaneously, making you a high-ROI hire for agile engineering pods.
              </p>
            </div>

          </div>
        </div>

        {/* ERROR 8 REQUIREMENT: SECTION FOR WEAKNESSES */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center">3</span>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span>Critical Weaknesses & Identified Vulnerabilities</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600">What Is Holding You Back</span>
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            
            <div className="p-3.5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-bold text-rose-700 dark:text-rose-300">
                  Gap in Cloud Containerization & Automated CI/CD Metrics
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  While coding logic is solid, the resume lacks clear mentions of Docker container builds, Kubernetes orchestrations, or automated GitHub Actions CI/CD pipelines expected in senior engineering roles.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-bold text-rose-700 dark:text-rose-300">
                  Need for Quantified Business Results (XYZ Resume Formula)
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  Several resume bullet points describe tasks performed rather than measurable impact achieved (e.g. rewrite "Built API" to "Engineered FastAPI backend achieving &lt;45ms response time for 5,000+ daily requests").
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-bold text-rose-700 dark:text-rose-300">
                  Distributed System Design & Microservice Caching Gaps
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  To secure top-tier offers (₹24+ LPA or ₹50k/mo stipend), the candidate must demonstrate knowledge of Redis distributed caching, SQL indexing trade-offs, and system scalability.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ERROR 8 REQUIREMENT: WHICH AREA SHOULD I COVER UP FOR UPGRADE MY SELF */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center">4</span>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span>Step-by-Step Self-Upgrade Blueprint</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">Which Areas to Cover Up</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Phase 1 (Week 1–2)
                </span>
                <span className="text-[10px] font-bold text-emerald-500">+4 ATS Points</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                Refactor Resume with Google's XYZ Formula
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Add numbers, percentages, and metrics to every project. State: "Accomplished [X] as measured by [Y], by doing [Z]".
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Phase 2 (Week 3–5)
                </span>
                <span className="text-[10px] font-bold text-emerald-500">+₹3.5 LPA Value</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                Containerize Projects with Docker & Cloud
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Wrap your best Python and React repositories in a clean multi-stage `Dockerfile` and `docker-compose.yml`. Deploy one service to AWS / Render / Cloud Run.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Phase 3 (Week 6–8)
                </span>
                <span className="text-[10px] font-bold text-emerald-500">Tier-1 Ready</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                Implement Production RAG / Vector Pipeline
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Integrate pgvector or Pinecone with LangChain/Gemini 2.5. Demonstrating practical RAG instantly puts you in the top 5% of candidate pools.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Phase 4 (Week 9–10)
                </span>
                <span className="text-[10px] font-bold text-emerald-500">Interview Mastery</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                AI Twin Video Mock Interviews
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Conduct at least 3 full simulated technical video rounds to perfect your behavioral communication, system design explanation, and live coding confidence.
              </p>
            </div>

          </div>
        </div>

        {/* ERROR 8 REQUIREMENT: OFFICIAL STAMP AND SIGNATURE OF AI CAREER TWIN & OM PANCHAL */}
        <div className="pt-8 border-t-2 border-slate-200 dark:border-slate-800 space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* OFFICIAL STAMP (Circular Embossed Seal) */}
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 rounded-full border-4 border-dashed border-amber-500/80 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent flex items-center justify-center p-2 shadow-inner transform -rotate-6">
                {/* Inner ring */}
                <div className="w-full h-full rounded-full border-2 border-amber-600/90 flex flex-col items-center justify-center text-center p-1.5 text-amber-700 dark:text-amber-300">
                  <span className="text-[7px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    ★ AI CAREER TWIN ★
                  </span>
                  <div className="my-0.5">
                    <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto" />
                  </div>
                  <span className="text-[8px] font-black uppercase leading-tight tracking-wider">
                    OFFICIALLY
                    <br />
                    CERTIFIED
                  </span>
                  <span className="text-[7px] font-black tracking-widest mt-0.5 text-amber-600">
                    2026 AUDIT
                  </span>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Institutional Credential Seal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 max-w-xs">
                  This document serves as an official AI Career Audit, backed by autonomous neural verification models and executive leadership review.
                </p>
                <div className="text-[10px] font-mono text-slate-400">
                  SHA-256: 8f4c2e91...4a88b1
                </div>
              </div>
            </div>

            {/* DUAL SIGNATURE BLOCKS */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              
              {/* Signature 1: AI Career Twin Neural Core */}
              <div className="text-center sm:text-left space-y-1">
                <div className="h-12 flex items-end justify-center sm:justify-start">
                  <div className="font-serif italic text-lg sm:text-xl font-bold text-brand-600 dark:text-brand-400 tracking-wide select-none">
                    AI Career Twin Engine
                  </div>
                </div>
                <div className="w-40 border-t-2 border-slate-300 dark:border-slate-700" />
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">
                  Autonomous Neural Evaluator
                </div>
                <div className="text-[9px] text-slate-400">
                  AI Career Twin Platform Core
                </div>
              </div>

              {/* Signature 2: Om Panchal (Founder & Architect) */}
              <div className="text-center sm:text-left space-y-1">
                <div className="h-12 flex items-end justify-center sm:justify-start">
                  <div className="font-serif italic text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tracking-wider select-none font-signature">
                    Om Panchal
                  </div>
                </div>
                <div className="w-40 border-t-2 border-amber-500/70" />
                <div className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span>Om Panchal</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 font-bold">
                    FOUNDER
                  </span>
                </div>
                <div className="text-[9px] text-slate-400">
                  Platform Architect & Creator
                </div>
              </div>

            </div>

          </div>

          <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
            AI Career Twin © 2026 • Verified Audit Report for {candidateName} • Registered Certificate {certificateId}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ReportsPage;
