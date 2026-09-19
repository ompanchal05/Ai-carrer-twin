import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export const ATSCard = ({ score, summary, breakdown }) => {
  const getScoreColor = (val) => {
    if (val >= 90) return 'text-emerald-500 stroke-emerald-500';
    if (val >= 75) return 'text-brand-500 stroke-brand-500';
    return 'text-amber-500 stroke-amber-500';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-card p-6 border border-slate-200/80 dark:border-slate-800/80">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Animated Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-200 dark:text-slate-800 fill-none"
            />
            <motion.circle
              cx="72"
              cy="72"
              r="45"
              strokeWidth="10"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`fill-none ${getScoreColor(score)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{score}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">/ 100 ATS</span>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-500" /> Resume ATS Compatibility
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {summary}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block">Keyword Alignment</span>
              <span className="text-base font-extrabold text-emerald-500">{breakdown?.keywordScore || 94}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block">Formatting Check</span>
              <span className="text-base font-extrabold text-brand-500">{breakdown?.formattingScore || 88}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSCard;
