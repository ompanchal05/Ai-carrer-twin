import React from 'react';

export const Stepper = ({ steps, activeIndex }) => (
  <div className="flex items-center justify-center gap-4 mb-8">
    {steps.map((step, idx) => (
      <div key={step} className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            idx <= activeIndex
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600'
          }`}
        >
          {idx + 1}
        </div>
        <span className={`ml-2 text-sm ${idx <= activeIndex ? 'text-primary-600 dark:text-primary-300' : 'text-gray-500'}`}>{step}</span>
        {idx < steps.length - 1 && (
          <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2" />
        )}
      </div>
    ))}
  </div>
);

export default Stepper;
