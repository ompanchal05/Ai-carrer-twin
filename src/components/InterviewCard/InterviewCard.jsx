import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb, CheckCircle } from 'lucide-react';
import PrimaryButton from '../Buttons/PrimaryButton';

export const InterviewCard = ({ questionItem, onStartPractice }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const difficultyColors = {
    Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
  };

  return (
    <div className="glass-card p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${difficultyColors[questionItem.difficulty] || difficultyColors.Medium}`}>
          {questionItem.difficulty}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Category: {questionItem.category.toUpperCase()}
        </span>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-start gap-2">
        <HelpCircle className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
        {questionItem.question}
      </h3>

      {/* Key Talking Points */}
      <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Key Talking Points & Concepts
        </span>
        {questionItem.keyPoints.map((point, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" />
            <span>{point}</span>
          </div>
        ))}
      </div>

      {/* AI Answering Tip */}
      {questionItem.aiTip && (
        <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 p-3 rounded-xl">
          <Lightbulb className="w-4 h-4 flex-shrink-0" />
          <span><strong>AI Twin Advice:</strong> {questionItem.aiTip}</span>
        </div>
      )}

      {/* Accordion Answer view */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="w-full flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline py-1"
        >
          <span>{showAnswer ? "Hide Sample Model Answer" : "View Sample Model Answer"}</span>
          {showAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono"
            >
              {questionItem.sampleAnswer}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PrimaryButton onClick={() => onStartPractice && onStartPractice(questionItem)} className="w-full py-2 text-xs">
        Practice This Question with AI Mentor
      </PrimaryButton>
    </div>
  );
};

export default InterviewCard;
