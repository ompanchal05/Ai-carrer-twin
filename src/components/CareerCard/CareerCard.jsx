import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, AlertTriangle, ChevronRight, Clock, Sliders, IndianRupee, ExternalLink } from 'lucide-react';
import { PrimaryButton } from '../Buttons/PrimaryButton';

export const CareerCard = ({ career, onSelect }) => {
  const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(career.title)}&location=India`;
  const indeedUrl = `https://in.indeed.com/jobs?q=${encodeURIComponent(career.title)}&l=India`;

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
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual Salary Range</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1 mt-0.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
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
        <div className="space-y-2 mb-4">
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

        {/* Direct Job Reference Links (LinkedIn, Indeed & Predict Salary) */}
        <div className="flex flex-wrap items-center gap-2 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all flex items-center gap-1.5"
            title={`View live ${career.title} vacancies on LinkedIn`}
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span>LinkedIn</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <a
            href={indeedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all flex items-center gap-1.5"
            title={`View live ${career.title} vacancies on Indeed India`}
          >
            <span className="font-black text-[10px] bg-indigo-600 text-white px-1 rounded-sm">in</span>
            <span>Indeed</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <Link
            to={`/salary-prediction?role=${encodeURIComponent(career.title)}&salary=${encodeURIComponent(career.avgSalary)}`}
            className="px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Pre-fill Salary Prediction Form for this role"
          >
            <IndianRupee className="w-3 h-3" />
            <span>Predict Salary</span>
          </Link>
        </div>
      </div>

      <PrimaryButton onClick={() => onSelect && onSelect(career)} className="w-full">
        Explore Career Details <ChevronRight className="w-4 h-4" />
      </PrimaryButton>
    </motion.div>
  );
};

export default CareerCard;
