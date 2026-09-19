import React from 'react';

export const SpinnerLoader = ({ size = "md", text = "Analyzing data..." }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className={`${sizeClasses[size] || sizeClasses.md} border-brand-500 border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default SpinnerLoader;
