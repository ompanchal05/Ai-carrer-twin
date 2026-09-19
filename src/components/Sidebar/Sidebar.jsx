import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Upload,
  Sparkles,
  FileCheck,
  TrendingUp,
  Target,
  Map,
  Video,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Twin Profile", path: "/profile", icon: User },
    { label: "Resume Upload", path: "/resume-upload", icon: Upload, badge: "New" },
    { label: "Career Match", path: "/career-recommendation", icon: Sparkles, badge: "95%" },
    { label: "ATS Analysis", path: "/ats-analysis", icon: FileCheck, badge: "92" },
    { label: "Salary Prediction", path: "/salary-prediction", icon: TrendingUp, badge: "$135k" },
    { label: "Skill Gap Matrix", path: "/skill-gap", icon: Target },
    { label: "Learning Roadmap", path: "/learning-roadmap", icon: Map },
    { label: "Interview Prep", path: "/interview-prep", icon: Video },
    { label: "Career Audit Report", path: "/reports", icon: FileText },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 z-30 w-64 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 transition-transform duration-300 ease-in-out flex flex-col justify-between p-4 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-1 overflow-y-auto pr-1">
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-l-4 border-brand-500 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer Logout */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
