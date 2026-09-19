import React from 'react';
import { motion } from 'framer-motion';

/**
 * BubbleReelScroller — infinite horizontal reel of floating "bubble" cards.
 * Like an Instagram/TikTok reel but horizontal, for landing page "Trust" sections.
 */

const REEL_ITEMS = [
  { emoji: '🚀', label: 'Hired at Google',      sub: '8 weeks roadmap' },
  { emoji: '🎯', label: 'ATS Score: 98/100',    sub: 'After AI optimization' },
  { emoji: '💰', label: '₹28 LPA Package',       sub: 'At Swiggy AI Lab' },
  { emoji: '🏆', label: 'System Design Cleared', sub: 'After mock sessions' },
  { emoji: '📄', label: 'Resume Parsed in 2s',   sub: 'Full skill extraction' },
  { emoji: '⚡', label: 'Skill Gap Fixed',        sub: 'LangChain mastered' },
  { emoji: '🤖', label: 'AI Roadmap Done',        sub: '12-week plan' },
  { emoji: '🎓', label: 'Got Offer @ Zepto',      sub: 'ML Engineer L4' },
  { emoji: '🔥', label: 'Interview Cleared',      sub: '4.9/5.0 rating' },
  { emoji: '💎', label: '₹35 LPA — Remote',       sub: 'US client project' },
];

// Duplicate for seamless infinite loop
const DOUBLED = [...REEL_ITEMS, ...REEL_ITEMS];

export const BubbleReelScroller = () => {
  return (
    <div className="relative overflow-hidden w-full py-2 select-none">
      {/* Left fade */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-slate-50 dark:from-navy-950 to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-slate-50 dark:from-navy-950 to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: [0, -50 * REEL_ITEMS.length * 4] }}
        transition={{
          duration: 40,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {DOUBLED.map((item, i) => (
          <BubbleCard key={i} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

const BubbleCard = ({ item }) => (
  <motion.div
    whileHover={{ scale: 1.08, y: -6 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    className="
      flex-shrink-0 flex flex-col items-center justify-center gap-1
      w-36 h-36 rounded-3xl cursor-default
      bg-white/70 dark:bg-slate-900/70
      backdrop-blur-md
      border border-slate-200/60 dark:border-slate-700/60
      shadow-lg hover:shadow-brand-500/20 hover:border-brand-500/40
      transition-shadow duration-300
    "
  >
    <span className="text-3xl" role="img" aria-label={item.label}>{item.emoji}</span>
    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 text-center px-2 leading-tight">{item.label}</span>
    <span className="text-[10px] text-slate-400 text-center px-2 leading-tight">{item.sub}</span>
  </motion.div>
);

export default BubbleReelScroller;
