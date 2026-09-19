import React from 'react';

export const SecondaryButton = ({ children, onClick, type = "button", disabled = false, className = "", icon: Icon }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
      {children}
    </button>
  );
};

export default SecondaryButton;
