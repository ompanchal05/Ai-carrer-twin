import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const SemiCircleGaugeCard = ({
  id,
  index = 0,
  title,
  score = 0,
  displayValue,
  sublabel,
  description,
  color = 'brand', // 'emerald' | 'brand' | 'indigo' | 'amber'
  icon: Icon,
  linkTo = '#',
  badgeText = 'Live'
}) => {
  // Clamped score between 0 and 100 for gauge rendering
  const clampedScore = Math.max(0, Math.min(100, Number(score) || 0));

  // Arc calculations:
  // Radius R = 80, Center = (100, 95)
  // Arc starts at 180° (left, 20, 95) and ends at 0° (right, 180, 95)
  const radius = 80;
  const arcLength = Math.PI * radius; // ~251.32
  const progressOffset = arcLength * (1 - clampedScore / 100);

  // Angle in radians for indicator dot (0 = left (180 deg), 100 = right (0 deg))
  const angleRad = Math.PI - (clampedScore / 100) * Math.PI;
  const dotX = 100 + radius * Math.cos(angleRad);
  const dotY = 95 - radius * Math.sin(angleRad);

  const themeConfig = {
    emerald: {
      gradientId: `gauge-emerald-${id || index}`,
      startColor: '#10b981',
      endColor: '#34d399',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      borderHover: 'hover:border-emerald-500/40 hover:shadow-[0_12px_32px_rgba(16,185,129,0.18)]'
    },
    brand: {
      gradientId: `gauge-brand-${id || index}`,
      startColor: '#3b82f6',
      endColor: '#60a5fa',
      glowColor: 'rgba(59, 130, 246, 0.25)',
      badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      borderHover: 'hover:border-blue-500/40 hover:shadow-[0_12px_32px_rgba(59,130,246,0.18)]'
    },
    indigo: {
      gradientId: `gauge-indigo-${id || index}`,
      startColor: '#8b5cf6',
      endColor: '#a78bfa',
      glowColor: 'rgba(139, 92, 246, 0.25)',
      badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      borderHover: 'hover:border-purple-500/40 hover:shadow-[0_12px_32px_rgba(139,92,246,0.18)]'
    },
    amber: {
      gradientId: `gauge-amber-${id || index}`,
      startColor: '#f59e0b',
      endColor: '#fbbf24',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      borderHover: 'hover:border-amber-500/40 hover:shadow-[0_12px_32px_rgba(245,158,11,0.18)]'
    }
  };

  const currentTheme = themeConfig[color] || themeConfig.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.015 }}
      className={`group relative rounded-3xl p-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer ${currentTheme.borderHover}`}
    >
      <Link to={linkTo} className="block w-full">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className={`w-8 h-8 rounded-xl ${currentTheme.iconBg} flex items-center justify-center transition-transform group-hover:scale-110 duration-200`}>
                <Icon className="w-4 h-4" />
              </div>
            )}
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${currentTheme.badgeBg}`}>
              {badgeText}
            </span>
            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-3 h-3 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Semi-Circle Speedometer / Arc Gauge */}
        <div className="relative flex flex-col items-center justify-center pt-1 pb-1">
          <svg
            viewBox="0 0 200 115"
            className="w-full max-w-[190px] h-[100px] overflow-visible"
          >
            <defs>
              <linearGradient id={currentTheme.gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={currentTheme.startColor} />
                <stop offset="100%" stopColor={currentTheme.endColor} />
              </linearGradient>
              <filter id={`glow-${currentTheme.gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={currentTheme.glowColor} />
              </filter>
            </defs>

            {/* Background Track (Exact same radius R=80 for all cards) */}
            <path
              d="M 20 95 A 80 80 0 0 1 180 95"
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800/90"
              strokeWidth="13"
              strokeLinecap="round"
            />

            {/* Animated Active Progress Arc */}
            <motion.path
              d="M 20 95 A 80 80 0 0 1 180 95"
              fill="none"
              stroke={`url(#${currentTheme.gradientId})`}
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              initial={{ strokeDashoffset: arcLength }}
              animate={{ strokeDashoffset: progressOffset }}
              transition={{ duration: 1.2, delay: 0.15 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              filter={`url(#glow-${currentTheme.gradientId})`}
            />

            {/* Pulsing Target Indicator Dot at progress tip */}
            <motion.circle
              cx={dotX}
              cy={dotY}
              r="4.5"
              fill="#ffffff"
              stroke={currentTheme.startColor}
              strokeWidth="2.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="drop-shadow"
            />
          </svg>

          {/* Center Readout inside Semi-Circle */}
          <div className="absolute top-[48px] inset-x-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:scale-105 transition-transform duration-200">
              {displayValue || `${clampedScore}%`}
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
              {sublabel}
            </span>
          </div>
        </div>

        {/* Bottom Description / Quick Insights */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="truncate pr-1">{description}</span>
          <span className="text-brand-600 dark:text-brand-400 font-bold group-hover:underline flex-shrink-0">
            View →
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default SemiCircleGaugeCard;
