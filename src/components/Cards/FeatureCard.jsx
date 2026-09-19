import React from 'react';
import { motion } from 'framer-motion';

export const FeatureCard = ({ icon: Icon, title, description, badge, color = "brand" }) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="p-6 glass-card border border-slate-200/80 dark:border-slate-800/80 relative group overflow-hidden"
    >
      {/* Top subtle ambient glow on hover */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all duration-300" />
      
      <div className="w-12 h-12 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform">
        {Icon && <Icon className="w-6 h-6" />}
      </div>

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {title}
        </h3>
        {badge && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300">
            {badge}
          </span>
        )}
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
