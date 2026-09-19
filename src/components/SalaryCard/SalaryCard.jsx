import React from 'react';
import { DollarSign, TrendingUp, Award, MapPin } from 'lucide-react';
import GlassCard from '../Cards/GlassCard';

export const SalaryCard = ({ estimate, rangeMin, rangeMax, percentile, location = "San Francisco, CA" }) => {
  return (
    <GlassCard className="border border-brand-500/20 shadow-glow relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full">
            Estimated Market Valuation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
            {estimate} <span className="text-sm font-normal text-slate-400">/ year</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Benchmark Location: <span className="font-semibold text-slate-700 dark:text-slate-300">{location}</span>
          </p>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl text-right space-y-1 w-full sm:w-auto">
          <div className="text-xs text-slate-400 font-medium">Expected Salary Range</div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {rangeMin} — {rangeMax}
          </div>
          <div className="text-[11px] font-medium text-emerald-500 flex items-center justify-end gap-1">
            <Award className="w-3.5 h-3.5" /> {percentile}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default SalaryCard;
