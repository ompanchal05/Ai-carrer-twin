import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Award,
  TrendingUp,
  FileCheck,
  IndianRupee,
  Upload,
  Video,
  Map,
  ArrowRight,
  Clock,
  ChevronRight,
  FileText,
  CheckCircle2
} from 'lucide-react';
import StatCard from '../../components/Cards/StatCard';
import GlassCard from '../../components/Cards/GlassCard';
import RadarChart from '../../components/Charts/RadarChart';
import LineChart from '../../components/Charts/LineChart';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { useUser } from '../../hooks/useUser';
import { getCareerRecommendations, getRecentActivities } from '../../services/api';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';

export const DashboardPage = () => {
  const { profile } = useUser();
  const [recommendations, setRecommendations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, actRes] = await Promise.all([
          getCareerRecommendations(),
          getRecentActivities()
        ]);
        setRecommendations(recRes.data);
        setActivities(actRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <SpinnerLoader size="lg" text="Loading AI Career Twin Dashboard..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <GlassCard className="border border-brand-500/30 shadow-glow relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> AI Twin Synchronized & Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome back, {profile.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Target Role: <strong className="text-brand-600 dark:text-brand-400">{profile.targetRole}</strong>. Your skills match 88% of market requirements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/resume-upload">
              <PrimaryButton icon={Upload} className="py-2.5 text-xs">
                Upload New Resume
              </PrimaryButton>
            </Link>
            <Link to="/interview-prep">
              <SecondaryButton icon={Video} className="py-2.5 text-xs">
                Practice Mock Interview
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </GlassCard>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Career Readiness"
          value={`${profile.readinessScore}%`}
          badge="High Match"
          icon={Award}
          color="brand"
          trend="+5%"
        />
        <StatCard
          title="ATS Resume Score"
          value={`${profile.atsScore}/100`}
          badge="Passed 98%"
          icon={FileCheck}
          color="emerald"
          trend="+6 pts"
        />
        <StatCard
          title="Target Salary"
          value={profile.targetSalary}
          badge="Bangalore"
          icon={IndianRupee}
          color="amber"
          trend="+12%"
        />
        <StatCard
          title="Roadmap Milestone"
          value="Phase 2/3"
          badge="45% Done"
          icon={Map}
          color="violet"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Skill Radar Breakdown</h3>
              <p className="text-xs text-slate-500">Your profile vs {profile.targetRole} market standard</p>
            </div>
            <Link to="/skill-gap" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View Gap Matrix <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <RadarChart />
        </GlassCard>

        {/* Growth Trend Line Chart */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Readiness Trend</h3>
              <p className="text-xs text-slate-500">6-Month readiness progression curve</p>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              +43% Overall Growth
            </span>
          </div>
          <LineChart />
        </GlassCard>

      </div>

      {/* Bottom Grid: Top Career Matches & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Career Cards (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" /> Top Recommended Careers
            </h3>
            <Link to="/career-recommendation" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View All Roles <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.slice(0, 2).map((item) => (
              <div key={item.id} className="p-5 glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-lg font-extrabold text-emerald-500">{item.matchScore}%</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.avgSalary}</span>
                  <Link to="/career-recommendation" className="text-brand-600 font-bold hover:underline flex items-center gap-1">
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed (1 column) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" /> Twin Activity Log
          </h3>

          <div className="glass-card p-4 border border-slate-200/80 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/60">
            {activities.map((act) => (
              <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-800 dark:text-slate-200">{act.title}</h5>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
