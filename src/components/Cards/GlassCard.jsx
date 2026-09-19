import React from 'react';

export const GlassCard = ({ children, className = "", hover = true, ...props }) => {
  return (
    <div
      {...props}
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${
        hover ? 'hover:shadow-lg dark:hover:shadow-glass-dark hover:border-slate-300 dark:hover:border-slate-700' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
