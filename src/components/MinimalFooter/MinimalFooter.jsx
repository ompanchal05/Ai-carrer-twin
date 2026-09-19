import React from 'react';

export const MinimalFooter = () => (
  <footer className="w-full bg-white/70 dark:bg-slate-900/70 py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80">
    © {new Date().getFullYear()} AI Career Twin – All rights reserved.
  </footer>
);

export default MinimalFooter;
