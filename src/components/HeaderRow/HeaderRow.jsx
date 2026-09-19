import React from 'react';
import { Link } from 'react-router-dom';

export const HeaderRow = ({ title, subtitle, actionLabel, actionLink }) => (
  <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-700">
    <div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {subtitle}
        </p>
      )}
    </div>
    {actionLabel && actionLink && (
      <Link
        to={actionLink}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-300 border border-primary-500/20 hover:bg-primary-500/20 transition-colors"
      >
        {actionLabel}
      </Link>
    )}
  </div>
);

export default HeaderRow;
