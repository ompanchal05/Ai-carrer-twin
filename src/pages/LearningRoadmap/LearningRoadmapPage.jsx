import React, { useState, useEffect } from 'react';
import { Map, CheckCircle2, Clock, BookOpen, Award, Sparkles, Play } from 'lucide-react';
import GlassCard from '../../components/Cards/GlassCard';
import RoadmapCard from '../../components/RoadmapCard/RoadmapCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { getLearningRoadmap } from '../../services/api';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';

export const LearningRoadmapPage = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getLearningRoadmap();
        setRoadmap(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleToggleMilestone = (phaseId, milestoneIdx) => {
    setRoadmap((prev) => {
      const updatedPhases = prev.phases.map((phase) => {
        if (phase.id === phaseId) {
          const newMilestones = [...phase.milestones];
          newMilestones[milestoneIdx].completed = !newMilestones[milestoneIdx].completed;
          return { ...phase, milestones: newMilestones };
        }
        return phase;
      });
      toast.success("Milestone status updated!");
      return { ...prev, phases: updatedPhases };
    });
  };

  if (loading) {
    return <SpinnerLoader size="lg" text="Generating personalized 12-week roadmap..." />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <GlassCard className="border border-brand-500/30 shadow-glow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold mb-2">
              <Map className="w-3.5 h-3.5" /> Personalized AI Learning Track
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              12-Week Master Roadmap
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Target Goal: <strong className="text-slate-900 dark:text-white">{roadmap.targetRole}</strong>
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">{roadmap.completedPercentage}%</span>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Overall Completion</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-accent-violet h-full transition-all duration-500 rounded-full"
            style={{ width: `${roadmap.completedPercentage}%` }}
          />
        </div>
      </GlassCard>

      {/* Phase Cards Timeline */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-500" /> Milestone Execution Phases
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {roadmap.phases.map((phase) => (
            <RoadmapCard
              key={phase.id}
              phase={phase}
              onToggleMilestone={handleToggleMilestone}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default LearningRoadmapPage;
