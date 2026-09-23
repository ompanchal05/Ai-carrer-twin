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
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const { profile } = useUser();
  const navigate = useNavigate();

  const isAdmin = (user?.email?.toLowerCase() === 'panchalom136@gmail.com') || (profile?.email?.toLowerCase() === 'panchalom136@gmail.com');

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Twin Profile", path: "/profile", icon: User },
    { label: "Resume Upload", path: "/resume-upload", icon: Upload, badge: "AI" },
    { label: "Career & Jobs", path: "/career-recommendation", icon: Sparkles, badge: "Match" },
    { label: "ATS Analysis", path: "/ats-analysis", icon: FileCheck, badge: `${profile?.atsScore || 92}` },
    { label: "Salary Prediction", path: "/salary-prediction", icon: TrendingUp },
    { label: "Skill Gap Matrix", path: "/skill-gap", icon: Target },
    { label: "Learning Roadmap", path: "/learning-roadmap", icon: Map },
    { label: "Interview Prep", path: "/interview-prep", icon: Video },
    { label: "Resume V2 Studio", path: "/premium-resume", icon: Sparkles, badge: "👑 ₹99/mo", isPremium: true },
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
                      : item.isSpecial
                      ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      item.isPremium
                        ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300 border-amber-400/40'
                        : item.isSpecial
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                        : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {isAdmin && (
            <div className="pt-2">
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                Super Admin Terminal
              </div>
              <NavLink
                to="/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-l-4 border-indigo-500 shadow-sm'
                      : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Admin Terminal (Om)</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                  OTP
                </span>
              </NavLink>
            </div>
          )}
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
