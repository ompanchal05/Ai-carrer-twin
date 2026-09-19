import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, badge, icon: Icon, color = "brand", trend }) => {
  const colorMap = {
    brand:  "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20",
    emerald:"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber:  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20"
  };

  const glowMap = {
    brand:  "hover:shadow-[0_8px_30px_rgba(139,92,246,0.18)] hover:border-brand-500/40",
    emerald:"hover:shadow-[0_8px_30px_rgba(16,185,129,0.18)] hover:border-emerald-500/40",
    amber:  "hover:shadow-[0_8px_30px_rgba(245,158,11,0.18)] hover:border-amber-500/40",
    violet: "hover:shadow-[0_8px_30px_rgba(139,92,246,0.18)] hover:border-violet-500/40"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className={`p-5 glass-card relative overflow-hidden border border-slate-200/60 dark:border-slate-700/60 transition-all duration-300 ${glowMap[color] || glowMap.brand}`}
    >
      {/* Subtle top-right glow accent */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-30 pointer-events-none ${
        color === 'emerald' ? 'bg-emerald-400' :
        color === 'amber'   ? 'bg-amber-400'   :
        color === 'violet'  ? 'bg-violet-400'  : 'bg-brand-400'
      }`} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.brand}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
          {value}
        </div>
        {badge && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {badge}
          </span>
        )}
      </div>

      {trend && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <span className="text-emerald-500 font-semibold">{trend}</span> vs previous upload
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;
