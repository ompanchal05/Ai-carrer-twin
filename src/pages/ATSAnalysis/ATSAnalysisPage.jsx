import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Download, Wand2 } from 'lucide-react';
import ATSCard from '../../components/ATSCard/ATSCard';
import GlassCard from '../../components/Cards/GlassCard';
import DoughnutChart from '../../components/Charts/DoughnutChart';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { getAtsAnalysis } from '../../services/api';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';

export const ATSAnalysisPage = () => {
  const [atsData, setAtsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAtsAnalysis();
        setAtsData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleApplyFix = (title) => {
    toast.success(`Applied AI fix: ${title}`);
  };

  if (loading) {
    return <SpinnerLoader size="lg" text="Performing full ATS parser scanning..." />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            ATS Score & Optimization Audit
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Structural analysis against top enterprise ATS parsers (Greenhouse, Workday, Lever).
          </p>
        </div>
        <PrimaryButton icon={Wand2} onClick={() => toast.success("AI Resume Optimizer executed!")} className="py-2.5 px-6">
          Auto-Optimize Resume
        </PrimaryButton>
      </div>

      {/* Main Score Card */}
      <ATSCard
        score={atsData.overallScore}
        summary={atsData.summary}
        breakdown={{
          keywordScore: atsData.keywordMatchScore,
          formattingScore: atsData.formattingScore
        }}
      />

      {/* Grid: Doughnut Breakdown & Formatting Checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Metric Doughnut Chart */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ATS Scoring Categories
          </h3>
          <DoughnutChart
            labels={["Keyword Density", "Format Readability", "Quantitative Impact", "Structural Logic"]}
            dataValues={[atsData.keywordMatchScore, atsData.formattingScore, atsData.impactMetricsScore, atsData.sectionStructureScore]}
          />
        </GlassCard>

        {/* Formatting Checks */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Structural & Formatting Audit
          </h3>
          <div className="space-y-3">
            {atsData.formattingChecks.map((check, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white">{check.title}</h4>
                  <p className="text-slate-500 mt-0.5">{check.details}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Missing Keywords Analysis */}
      <GlassCard className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Keyword Match Matrix for Senior AI Roles
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <th className="pb-3">Keyword</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Density</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {atsData.keywordAnalysis.map((kw, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{kw.keyword}</td>
                  <td className="py-3 text-slate-500">{kw.type} ({kw.category})</td>
                  <td className="py-3 font-mono">{kw.density} mentions</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      kw.status === 'Optimal'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : kw.status === 'Good'
                        ? 'bg-brand-500/10 text-brand-600'
                        : 'bg-rose-500/10 text-rose-600'
                    }`}>
                      {kw.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* AI Suggestions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-500" /> Actionable Recommendations
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {atsData.suggestions.map((sug) => (
            <div key={sug.id} className="p-5 glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                  {sug.type}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{sug.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">{sug.description}</p>
              </div>

              <SecondaryButton onClick={() => handleApplyFix(sug.title)} className="py-2 text-xs whitespace-nowrap">
                {sug.actionText}
              </SecondaryButton>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ATSAnalysisPage;
