import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  let context = null;
  try {
    context = useContext(ThemeContext);
  } catch (err) {
    console.warn('useTheme safe hook fallback:', err);
  }

  if (!context) {
    const isDarkClass = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true;
    return {
      theme: isDarkClass ? 'dark' : 'light',
      setTheme: () => {},
      toggleTheme: () => {
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
      },
      isDark: isDarkClass
    };
  }

  return context;
};
