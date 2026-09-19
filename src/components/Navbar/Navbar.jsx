import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles, Bell, User, LogOut, Settings, Menu, X,
  ChevronDown, LayoutDashboard, FileText, Briefcase,
  TrendingUp, BookOpen,
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';

/* ─────────────────────────────── constants ───────────────────────────────── */
const PUBLIC_NAV = [
  { label: 'Features', href: '/#features' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
];

const APP_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Resume', href: '/resume', icon: FileText },
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Skills', href: '/skills', icon: TrendingUp },
  { label: 'Learning', href: '/learning', icon: BookOpen },
];

/* ─────────────────────────────── component ───────────────────────────────── */
export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { profile } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifications = [
    { id: 1, text: 'Your ATS score improved to 92/100!', time: '10m ago', unread: true },
    { id: 2, text: 'New course recommended for RAG architecture.', time: '1h ago', unread: true },
    { id: 3, text: 'Weekly salary benchmark updated.', time: '1d ago', unread: false },
  ];
  const unreadCount = notifications.filter((n) => n.unread).length;

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  /* ──────────────────────────────── render ─────────────────────────────── */
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-navy-950/90 backdrop-blur-2xl shadow-glass dark:shadow-glass-dark border-b border-slate-200/80 dark:border-slate-800/80'
          : 'bg-white/70 dark:bg-navy-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-6">

          {/* ── Left: Sidebar toggle (auth only) + Brand ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {isAuthenticated && (
              <button
                id="sidebar-toggle"
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200"
                aria-label="Toggle Navigation Sidebar"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-500 to-accent-violet flex items-center justify-center text-white shadow-md group-hover:shadow-glow group-hover:scale-105 transition-all duration-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-[15px] tracking-tight text-slate-900 dark:text-white">
                  AI Career{' '}
                  <span className="bg-gradient-to-r from-brand-600 to-accent-violet bg-clip-text text-transparent">
                    Twin
                  </span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.18em] text-slate-400 uppercase mt-0.5">
                  Enterprise AI
                </span>
              </div>
            </Link>
          </div>

          {/* ── Center: Nav links ── */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {isAuthenticated
              ? APP_NAV.map(({ label, href, icon: Icon }) => {
                  const active = location.pathname === href;
                  return (
                    <Link
                      key={href}
                      to={href}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  );
                })
              : PUBLIC_NAV.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
                  >
                    {label}
                  </a>
                ))}
          </nav>

          {/* ── Right: Actions ── */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    id="notifications-btn"
                    onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                    className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
                        {notifications.map((item) => (
                          <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors">
                            <div className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.unread ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                            <div>
                              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">{item.text}</p>
                              <span className="text-[10px] text-slate-400 mt-0.5 block">{item.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userRef}>
                  <button
                    id="user-menu-btn"
                    onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-brand-500/30 transition-all duration-200"
                  >
                    <img
                      src={profile?.avatar || user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.name || 'User'}`}
                      alt={profile?.name || user?.name || 'User'}
                      className="w-7 h-7 rounded-lg object-cover ring-2 ring-brand-500/20"
                    />
                    <span className="hidden sm:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                      {profile?.name || user?.name || 'Account'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{profile?.name || 'User'}</p>
                        <p className="text-[10px] text-slate-500 truncate">{profile?.email || user?.email}</p>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-500/8 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4" /> My Career Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-500/8 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl transition-colors"
                        >
                          <Settings className="w-4 h-4" /> Settings
                        </Link>
                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                        <button
                          onClick={() => { setShowUserMenu(false); logout(); navigate('/login'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/8 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:block px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 shadow-md hover:shadow-glow transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
