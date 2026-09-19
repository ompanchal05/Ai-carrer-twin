import React from 'react';
import { Sparkles, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-violet flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                AI Career <span className="text-gradient">Twin</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              The enterprise-grade AI mentor designed to empower students and professionals to parse resumes, master ATS scoring, predict market salaries, and follow personalized learning roadmaps.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Features */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li><Link to="/resume-upload" className="hover:text-brand-500 transition-colors">Resume Parser</Link></li>
              <li><Link to="/career-recommendation" className="hover:text-brand-500 transition-colors">Career Matcher</Link></li>
              <li><Link to="/ats-analysis" className="hover:text-brand-500 transition-colors">ATS Analyzer</Link></li>
              <li><Link to="/salary-prediction" className="hover:text-brand-500 transition-colors">Salary Forecast</Link></li>
              <li><Link to="/learning-roadmap" className="hover:text-brand-500 transition-colors">Learning Roadmap</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li><Link to="/interview-prep" className="hover:text-brand-500 transition-colors">Interview Prep</Link></li>
              <li><Link to="/skill-gap" className="hover:text-brand-500 transition-colors">Skill Gap Matrix</Link></li>
              <li><Link to="/reports" className="hover:text-brand-500 transition-colors">Career Audit Report</Link></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">API Reference</a></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">Stay Updated</h4>
            <p className="text-slate-500 dark:text-slate-400">Get the latest AI career insights and market salary reports.</p>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <button className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-sm transition-all">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AI Career Twin Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
