import React from 'react';

/**
 * FullWidthButton – reusable button that spans the full width of its container.
 *
 * Props are forwarded to the underlying button element, allowing custom
 * onClick, type, disabled, etc. The default styling matches the snippet the
 * user provided (p-2, rounded-xl, color scheme, hover effects).
 */
export const FullWidthButton = ({ children, onClick, type = 'button', className = '', ...rest }) => {
  const base = 'w-full p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors';
  const combined = `${base} ${className}`.trim();
  return (
    <button type={type} className={combined} onClick={onClick} aria-label="Full width button" {...rest}>
      {children}
    </button>
  );
};

export default FullWidthButton;
