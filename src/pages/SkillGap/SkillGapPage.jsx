import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, Plus, Sparkles, BookOpen } from 'lucide-react';
import GlassCard from '../../components/Cards/GlassCard';
import RadarChart from '../../components/Charts/RadarChart';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { getSkillGap } from '../../services/api';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import toast from 'react-hot-toast';

export const SkillGapPage = () => {
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSkillGap();
        setSkillGap(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddRoadmap = (skillName) => {
    toast.success(`Added ${skillName} to your Learning Roadmap!`);
  };

  if (loading) {
    return <SpinnerLoader size="lg" text="Computing neural skill gap matrix..." />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Skill Gap Matrix & Radar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Target Role: <strong className="text-brand-600 dark:text-brand-400">{skillGap.targetRole}</strong> • Overall Match: <strong className="text-emerald-500">{skillGap.overallMatch}%</strong>
          </p>
        </div>
        <Link to="/learning-roadmap">
          <PrimaryButton icon={BookOpen} className="py-2.5 px-6">
            View Personalized Roadmap
          </PrimaryButton>
        </Link>
      </div>

      {/* Grid: Radar Chart & High Priority Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-500" /> Skill Competency Radar
          </h3>
          <RadarChart
            dataLabels={skillGap.radarComparison.labels}
            userScores={skillGap.radarComparison.userScores}
            targetScores={skillGap.radarComparison.targetScores}
          />
        </GlassCard>

        {/* Priority Recommendations */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Priority Gaps to Bridge
          </h3>

          <div className="space-y-3">
            {skillGap.actionableRecommendations.map((rec, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
                    {rec.priority}
                  </span>
                  <span className="text-xs font-semibold text-emerald-500">{rec.impact}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rec.skill}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Recommended Course: {rec.recommendedCourse}</p>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Est. Time: {rec.estimatedTime}</span>
                  <SecondaryButton onClick={() => handleAddRoadmap(rec.skill)} icon={Plus} className="py-1 px-3 text-[11px]">
                    Add to Roadmap
                  </SecondaryButton>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Skills Matrix Table */}
      <GlassCard className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Complete Skill Matrix & Proficiency Levels
        </h3>

        <div className="space-y-4">
          {skillGap.skillsMatrix.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</span>
                  <span className="text-slate-400 ml-2">({item.category})</span>
                </div>
                <span className={`font-bold ${
                  item.status === 'mastered' ? 'text-emerald-500' : item.status === 'in-progress' ? 'text-brand-500' : 'text-amber-500'
                }`}>
                  {item.gap}
                </span>
              </div>

              {/* Dual progress bar comparison */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Your Level: {item.currentLevel}%</span>
                  <span>Target Standard: {item.targetLevel}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                  <div
                    className="bg-brand-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.currentLevel}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

    </div>
  );
};

export default SkillGapPage;
