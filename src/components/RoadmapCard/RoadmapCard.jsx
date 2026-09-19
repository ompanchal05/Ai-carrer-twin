import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, BookOpen, ChevronRight, Play } from 'lucide-react';

export const RoadmapCard = ({ phase, onToggleMilestone }) => {
  const isCompleted = phase.status === 'Completed';
  const isInProgress = phase.status === 'In Progress';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`p-6 glass-card border relative overflow-hidden ${
        isCompleted
          ? 'border-emerald-500/30 dark:border-emerald-500/20'
          : isInProgress
          ? 'border-brand-500/40 shadow-glow'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className={`w-10 h-10 rounded-xl font-extrabold text-sm flex items-center justify-center ${
            isCompleted
              ? 'bg-emerald-500 text-white'
              : isInProgress
              ? 'bg-brand-600 text-white'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
          }`}>
            {phase.number}
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{phase.title}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-500" /> {phase.duration}
            </span>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          isCompleted
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : isInProgress
            ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 animate-pulse'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
        }`}>
          {phase.status}
        </span>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
        {phase.description}
      </p>

      {/* Milestones checklist */}
      <div className="space-y-2 mb-5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Practical Milestones</h4>
        {phase.milestones.map((m, idx) => (
          <div
            key={idx}
            onClick={() => onToggleMilestone && onToggleMilestone(phase.id, idx)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
          >
            <CheckCircle className={`w-4 h-4 ${m.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
            <span className={`text-xs font-medium ${m.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
              {m.title}
            </span>
          </div>
        ))}
      </div>

      {/* Courses */}
      {phase.courses?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {phase.courses.map((course, idx) => (
            <a
              key={idx}
              href={course.link}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-500/10 hover:bg-brand-500/20 text-brand-700 dark:text-brand-300 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-brand-500" /> {course.name} ({course.provider})
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RoadmapCard;
