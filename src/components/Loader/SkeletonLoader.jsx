import React from 'react';

export const SkeletonLoader = ({ className = "h-4 w-full" }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`} />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="p-6 glass-card space-y-4">
      <SkeletonLoader className="h-6 w-1/3" />
      <SkeletonLoader className="h-4 w-full" />
      <SkeletonLoader className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <SkeletonLoader className="h-8 w-20 rounded-xl" />
        <SkeletonLoader className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
