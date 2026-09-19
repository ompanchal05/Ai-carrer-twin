import React from 'react';
import GlassCard from '../../components/Cards/GlassCard';
import { recentResumes } from '../../utils/mockData';
import { Link } from 'react-router-dom';

export const RecentResumes = () => (
  <GlassCard className="space-y-4">
    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
      Recent Resumes
    </h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            <th className="px-4 py-2">File</th>
            <th className="px-4 py-2">Uploaded</th>
            <th className="px-4 py-2">ATS Score</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {recentResumes.map((r) => (
            <tr key={r.id} className="border-b border-slate-200 dark:border-slate-700">
              <td className="px-4 py-2">{r.filename}</td>
              <td className="px-4 py-2">{r.date}</td>
              <td className="px-4 py-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary-500/10 text-primary-600 dark:text-primary-300 text-xs">
                  {r.atsScore}%
                </span>
              </td>
              <td className="px-4 py-2">
                <Link
                  to="/resume-upload" /* placeholder for view analysis */
                  className="text-primary-600 dark:text-primary-300 hover:underline text-xs"
                >
                  View Analysis
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </GlassCard>
);

export default RecentResumes;
