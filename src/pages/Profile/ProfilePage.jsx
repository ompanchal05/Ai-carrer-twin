import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Plus, Trash2, Save, ExternalLink } from 'lucide-react';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { useUser } from '../../hooks/useUser';

export const ProfilePage = () => {
  const { profile, updateProfileData, addSkill, removeSkill } = useUser();
  const [formData, setFormData] = useState({ ...profile });
  const [newSkill, setNewSkill] = useState('');

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfileData(formData);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            AI Career Twin Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal data, technical skills, work history, and target career goals.
          </p>
        </div>
        <PrimaryButton icon={Save} onClick={handleSave} className="py-2.5 px-6">
          Save All Changes
        </PrimaryButton>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Basic Information */}
        <GlassCard className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-500" /> General Candidate Info
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
            />
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Avatar Image URL</label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => handleChange('avatar', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Role Title</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => handleChange('targetRole', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Professional Bio</label>
            <textarea
              rows="3"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
        </GlassCard>

        {/* Skills Tag Management */}
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            Core Technical Skills Matrix
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add new skill (e.g. LangChain, Docker, Rust)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
            <SecondaryButton onClick={handleAddSkill} icon={Plus} className="py-2 text-xs">
              Add Skill
            </SecondaryButton>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {profile.skills?.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-slate-400 hover:text-rose-500 ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Social Links */}
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            Portfolio & Social Presence
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">GitHub Profile</label>
              <input
                type="text"
                value={formData.socialLinks?.github || ''}
                onChange={(e) => handleChange('socialLinks', { ...formData.socialLinks, github: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">LinkedIn URL</label>
              <input
                type="text"
                value={formData.socialLinks?.linkedin || ''}
                onChange={(e) => handleChange('socialLinks', { ...formData.socialLinks, linkedin: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Personal Website</label>
              <input
                type="text"
                value={formData.socialLinks?.portfolio || ''}
                onChange={(e) => handleChange('socialLinks', { ...formData.socialLinks, portfolio: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </GlassCard>

        <div className="flex justify-end pt-4">
          <PrimaryButton icon={Save} type="submit" className="py-3 px-8 text-sm">
            Save Profile Changes
          </PrimaryButton>
        </div>
      </form>

    </div>
  );
};

export default ProfilePage;
