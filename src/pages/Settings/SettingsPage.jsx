import React, { useState } from 'react';
import { Settings, Moon, Sun, Bell, Lock, Shield, UserCheck, Save } from 'lucide-react';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import { useTheme } from '../../hooks/useTheme';
import toast from 'react-hot-toast';

export const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success("Preferences updated successfully!");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Account Settings & Preferences
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your AI Career Twin theme, notifications, and security options.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Appearance Settings */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Sun className="w-5 h-5 text-brand-500" /> Interface Appearance & Theme
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Dark / Light Mode</h4>
              <p className="text-xs text-slate-500">Toggle theme preference across all views</p>
            </div>
            <ThemeToggle />
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-500" /> Notification Preferences
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">ATS & Salary Alerts</h4>
                <p className="text-xs text-slate-500">Receive notifications when your ATS score or market salary updates</p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Weekly Learning Digest</h4>
                <p className="text-xs text-slate-500">Receive weekly email summaries of your learning roadmap milestones</p>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </div>
          </div>
        </GlassCard>

        {/* Password & Security */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-500" /> Security & Password
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </GlassCard>

        <div className="flex justify-end pt-2">
          <PrimaryButton icon={Save} type="submit" className="py-2.5 px-6">
            Save Preferences
          </PrimaryButton>
        </div>
      </form>

    </div>
  );
};

export default SettingsPage;
