import React from 'react';

export const OutlineButton = ({ children, onClick, type = "button", disabled = false, className = "", icon: Icon }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 text-brand-500" />}
      {children}
    </button>
  );
};

export default OutlineButton;
