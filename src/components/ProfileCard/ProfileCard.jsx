import React from 'react';
import { MapPin, Mail, Phone, ExternalLink, Award, BookOpen, Briefcase } from 'lucide-react';
import { PrimaryButton } from '../Buttons/PrimaryButton';

export const ProfileCard = ({ profile, onEdit }) => {
  return (
    <div className="glass-card p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
        />
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h2>
            {onEdit && (
              <PrimaryButton onClick={onEdit} className="py-1.5 px-4 text-xs">
                Edit Profile
              </PrimaryButton>
            )}
          </div>
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">{profile.title}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.location}</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{profile.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{profile.phone}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl leading-relaxed">
        {profile.bio}
      </p>

      {/* Skills tags */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Technical Core Skills</h4>
        <div className="flex flex-wrap gap-2">
          {profile.skills?.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="flex items-center gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
        {Object.entries(profile.socialLinks || {}).map(([key, url]) => (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold capitalize flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400"
          >
            {key} <ExternalLink className="w-3 h-3" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
