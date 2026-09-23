import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = ({ className = "" }) => {
  let isDark = true;
  let toggleTheme = () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (root.classList.contains('dark')) {
        root.classList.remove('dark');
        localStorage.setItem('ai_career_twin_theme', 'light');
      } else {
        root.classList.add('dark');
        localStorage.setItem('ai_career_twin_theme', 'dark');
      }
    }
  };

  try {
    const themeContext = useTheme();
    if (themeContext) {
      isDark = themeContext.isDark;
      toggleTheme = themeContext.toggleTheme;
    }
  } catch (err) {
    console.warn('ThemeToggle safe theme hook fallback:', err);
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle Theme"
      className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 flex items-center justify-center shadow-sm ${className}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
      ) : (
        <Moon className="w-5 h-5 text-brand-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
