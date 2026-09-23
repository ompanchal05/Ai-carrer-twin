import React, { useState, useEffect } from 'react';
import {
  Map,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  Play,
  RefreshCw,
  Sliders,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import GlassCard from '../../components/Cards/GlassCard';
import RoadmapCard from '../../components/RoadmapCard/RoadmapCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { getLearningRoadmap, generateDynamicRoadmap } from '../../services/api';
import { useUser } from '../../hooks/useUser';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';

export const LearningRoadmapPage = () => {
  const { profile } = useUser();
  const [roadmap, setRoadmap] = useState(null);
  const [targetRoleInput, setTargetRoleInput] = useState(profile.targetRole || 'Senior AI Engineer');
  const [timelineInput, setTimelineInput] = useState('12 Weeks');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
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

  const handleRegenerateRoadmap = async (e) => {
    e?.preventDefault();
    setIsGenerating(true);
    toast.loading('Synthesizing bespoke curriculum with Gemini 3.8 Flash...', { id: 'roadmap-gen' });

    try {
      const res = await generateDynamicRoadmap(
        targetRoleInput,
        profile.skills,
        timelineInput
      );

      if (res.success && res.roadmap) {
        setRoadmap(res.roadmap);
        toast.success(`Generated personalized roadmap for ${targetRoleInput}!`, { id: 'roadmap-gen' });
        setShowConfig(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not generate roadmap', { id: 'roadmap-gen' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleMilestone = (phaseId, milestoneIdx) => {
    setRoadmap((prev) => {
      let totalMilestones = 0;
      let completedMilestones = 0;

      const updatedPhases = prev.phases.map((phase) => {
        if (phase.id === phaseId) {
          const newMilestones = [...phase.milestones];
          newMilestones[milestoneIdx].completed = !newMilestones[milestoneIdx].completed;
          return { ...phase, milestones: newMilestones };
        }
        return phase;
      });

      updatedPhases.forEach((p) => {
        p.milestones.forEach((m) => {
          totalMilestones++;
          if (m.completed) completedMilestones++;
        });
      });

      const newPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

      toast.success("Milestone status updated!");
      return {
        ...prev,
        completedPercentage: newPercentage,
        phases: updatedPhases
      };
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
              {roadmap.timeline || '12-Week'} Master Roadmap
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Target Goal: <strong className="text-slate-900 dark:text-white">{roadmap.targetRole}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right space-y-0.5">
              <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                {roadmap.completedPercentage}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Overall Progress</span>
            </div>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              title="Customize Target Role & Timeline"
            >
              <Sliders className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-accent-violet h-full transition-all duration-500 rounded-full"
            style={{ width: `${roadmap.completedPercentage}%` }}
          />
        </div>

        {/* Customization Drawer */}
        {showConfig && (
          <form
            onSubmit={handleRegenerateRoadmap}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-4 text-xs animate-in fade-in"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Target Role Title</label>
                <input
                  type="text"
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  placeholder="e.g. Senior AI Engineer, Full Stack MERN"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Timeline Intensity</label>
                <select
                  value={timelineInput}
                  onChange={(e) => setTimelineInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                >
                  <option value="4 Weeks (Sprint Track)">4 Weeks (Sprint Track)</option>
                  <option value="8 Weeks (Accelerated)">8 Weeks (Accelerated)</option>
                  <option value="12 Weeks (Recommended)">12 Weeks (Recommended)</option>
                  <option value="24 Weeks (Mastery)">24 Weeks (Mastery)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <SecondaryButton
                type="button"
                onClick={() => setShowConfig(false)}
                className="py-2 text-xs"
              >
                Close
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                loading={isGenerating}
                icon={Sparkles}
                className="py-2 text-xs"
              >
                Generate with Gemini AI
              </PrimaryButton>
            </div>
          </form>
        )}
      </GlassCard>

      {/* Phase Cards Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" /> Milestone Execution Phases ({roadmap.phases?.length || 0})
          </h3>
          <span className="text-xs text-slate-400">Click any milestone checkmark to track progress</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {roadmap.phases?.map((phase) => (
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
