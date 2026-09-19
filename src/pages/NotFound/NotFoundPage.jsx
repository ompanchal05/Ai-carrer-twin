import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';
import PrimaryButton from '../../components/Buttons/PrimaryButton';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="relative">
        <div className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-violet">
          404
        </div>
        <div className="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-500 flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-glow">
          <Sparkles className="w-8 h-8" />
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The requested career twin path could not be located. It might have been moved or doesn't exist.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <PrimaryButton icon={Home} className="py-2.5 px-6">
            Back to Dashboard
          </PrimaryButton>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
