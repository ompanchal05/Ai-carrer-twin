import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, CheckCircle, AlertTriangle, ChevronRight, Clock, Sliders } from 'lucide-react';
import { PrimaryButton } from '../Buttons/PrimaryButton';

export const CareerCard = ({ career, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-md">
                {career.category}
              </span>
              {career.scaleLevel && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-brand-500" /> {career.scaleLevel}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {career.title}
            </h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {career.matchScore}%
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Match Score</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {career.description}
        </p>

        {/* Salary & Hours/Scale Breakdown */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual Salary & Hourly Scale</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1 mt-0.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              {career.avgSalary}
            </span>
            {career.hourlyRateRange && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                Scale: {career.hourlyRateRange}
              </span>
            )}
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Industry & Work Hours</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-brand-500" />
              {career.demandGrowth}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-amber-500" /> {career.workHoursPerWeek || 40} Hours / Week
            </span>
          </div>
        </div>

        {/* Matched & Missing Skills */}
        <div className="space-y-2 mb-6">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Matched Skills ({career.matchedSkills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {career.matchedSkills.map((sk, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {career.missingSkills?.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Skill Gaps ({career.missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {career.missingSkills.map((sk, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <PrimaryButton onClick={() => onSelect && onSelect(career)} className="w-full">
        Explore Career Details <ChevronRight className="w-4 h-4" />
      </PrimaryButton>
    </motion.div>
  );
};

export default CareerCard;
