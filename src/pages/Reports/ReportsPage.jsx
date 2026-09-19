import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Award, CheckCircle2, Sparkles, Share2 } from 'lucide-react';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { getReports } from '../../services/api';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';

export const ReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getReports();
        setReport(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDownloadPdf = () => {
    toast.success("Downloading AI Career Audit PDF Report...");
  };

  if (loading) {
    return <SpinnerLoader size="lg" text="Compiling Executive Career Audit Report..." />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Executive Career Audit Report
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generated for {report.candidateName} • Target: {report.targetRole} • {report.generatedDate}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryButton icon={Download} onClick={handleDownloadPdf} className="py-2.5 px-6 shadow-glow">
            Download PDF
          </PrimaryButton>
          <SecondaryButton icon={Share2} onClick={() => toast.success("Report link copied!")} className="py-2.5 px-4">
            Share
          </SecondaryButton>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl space-y-8 bg-white dark:bg-slate-900">
        
        {/* Report Header Logo */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-violet flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Career Twin</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Candidate Audit</span>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400">REPORT ID: AUDIT-2026-X89</span>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {report.keyMetrics.map((km, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{km.label}</span>
              <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{km.value}</p>
              <span className="text-[10px] font-semibold text-emerald-500 block">{km.badge}</span>
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">1. Executive Summary</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl">
            {report.summary}
          </p>
        </div>

        {/* Action Plan */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">2. Strategic Action Plan</h3>
          <div className="space-y-2">
            {report.actionPlan.map((ap, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{ap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Disclaimer */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Digitally Certified by AI Twin Neural Engine</span>
          <span>Confidential • Student Copy</span>
        </div>

      </div>

    </div>
  );
};

export default ReportsPage;
