import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  UploadCloud,
  FileCheck,
  TrendingUp,
  Target,
  Video,
  Award,
  ArrowRight,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import OutlineButton from '../../components/Buttons/OutlineButton';
import FeatureCard from '../../components/Cards/FeatureCard';
import FullWidthButton from '../../components/Buttons/FullWidthButton';
import BubbleBackground from '../../components/Animations/BubbleBackground';
import BubbleReelScroller from '../../components/Animations/BubbleReelScroller';

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' }
  })
};

export const LandingPage = () => {
  const features = [
    {
      icon: UploadCloud,
      title: "AI Resume Parsing",
      description: "Extract skills, work history, education, and achievements automatically with deep structural neural parsing."
    },
    {
      icon: Sparkles,
      title: "Career Twin Matcher",
      description: "Match your unique profile against 50,000+ real enterprise job descriptions to find high-probability career paths."
    },
    {
      icon: FileCheck,
      title: "ATS Compatibility Scan",
      description: "Detect missing hard keywords, formatting issues, and impact metrics to guarantee your resume passes ATS filters."
    },
    {
      icon: TrendingUp,
      title: "Salary Valuation Engine",
      description: "Predict your exact market salary range across FAANG India, unicorn startups, and top tech hubs using live ML models."
    },
    {
      icon: Target,
      title: "Skill Gap Matrix",
      description: "Visualize missing technical competencies against target roles with interactive radar analytics and learning priorities."
    },
    {
      icon: Video,
      title: "AI Mock Interviewer",
      description: "Practice technical and behavioral interview questions with real-time feedback on your responses and key talking points."
    }
  ];

  const stats = [
    { label: "Careers Analyzed", value: "50,000+" },
    { label: "ATS Pass Rate", value: "98.4%" },
    { label: "Avg Salary Increase", value: "+₹4.8 LPA" },
    { label: "User Rating", value: "4.9 / 5.0" }
  ];

  const testimonials = [
    {
      name: "Rohan Mehta",
      role: "AI Engineer at Google India",
      quote: "AI Career Twin pinpointed my missing vector database skills. Following the roadmap got me hired in 8 weeks!",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Priya Sharma",
      role: "Full Stack Lead at Swiggy",
      quote: "The ATS scanner identified formatting issues that were killing my application response rate. Immediately scored 4 interviews!",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Aarav Patel",
      role: "CS Final Year at IIT Delhi",
      quote: "The mock interview practice gave me the exact technical talking points needed to clear my system design round at Flipkart.",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200"
    }
  ];

  return (
    <div className="space-y-24 py-6 relative">
      {/* ── Floating bubble background ── */}
      <BubbleBackground />

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative pt-12 pb-8 text-center space-y-8 overflow-hidden">
        {/* Central glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-brand-500/12 dark:bg-brand-500/18 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />

        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold tracking-wide"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          Next-Gen AI Career Mentor & ATS Optimizer for India 🇮🇳
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight"
        >
          Build Your Personal <br />
          <span className="text-gradient">AI Career Twin</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Upload your resume to get instant AI skill analysis, ATS optimization, career path matching, salary predictions in <strong className="text-brand-500">₹ (INR)</strong>, and custom learning roadmaps.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link to="/register">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <PrimaryButton className="py-3 px-8 text-base shadow-glow">
                Build Your Twin Free <ArrowRight className="w-5 h-5" />
              </PrimaryButton>
            </motion.div>
          </Link>
          <Link to="/dashboard">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <OutlineButton className="py-3 px-8 text-base">
                Explore Live Demo
              </OutlineButton>
            </motion.div>
          </Link>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
          className="pt-12 max-w-4xl mx-auto"
        >
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl relative">
            {/* Window dots */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
              <span className="text-xs font-mono text-slate-400">ai-career-twin-dashboard.v2 · India</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {[
                { label: 'Career Readiness', value: '88% Match', sub: 'Senior AI Engineer', color: 'text-brand-600 dark:text-brand-400' },
                { label: 'ATS Resume Score',  value: '92 / 100',  sub: 'Passed standard parsers', color: 'text-emerald-500' },
                { label: 'Target Salary',     value: '₹18 LPA',  sub: 'Bangalore Benchmark', color: 'text-slate-900 dark:text-white' },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.04, y: -4 }}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-left space-y-1 cursor-default"
                >
                  <span className="text-[10px] uppercase font-bold text-slate-400">{card.label}</span>
                  <p className={`text-2xl font-extrabold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-slate-500">{card.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          BUBBLE REEL STRIP (social-style)
      ══════════════════════════════════════ */}
      <section className="space-y-3">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-xs font-bold uppercase tracking-widest text-slate-400"
        >
          🎉 Real wins from our community
        </motion.p>
        <BubbleReelScroller />
      </section>

      {/* ══════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════ */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="glass-panel rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.06 }}
              className="pt-4 md:pt-0 cursor-default"
            >
              <div className="text-3xl lg:text-4xl font-extrabold text-gradient">
                {stat.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════ */}
      <section className="space-y-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Powered by Modern Generative AI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Everything You Need to Accelerate Your Career
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            From resume upload to interview simulation, your AI Twin navigates every step of your job hunt.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="space-y-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">
            Student Success Stories — India 🇮🇳
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Loved by Students & Engineers Across India
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -6, boxShadow: '0 12px 40px rgba(139,92,246,0.15)' }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              className="p-6 glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4 rounded-2xl cursor-default"
            >
              {/* Stars */}
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, si) => (
                  <span key={si} className="text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/30" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <span className="text-xs text-brand-500 font-medium">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA BANNER
      ══════════════════════════════════════ */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="glass-panel rounded-3xl p-10 text-center space-y-6 border border-brand-500/30 shadow-glow relative overflow-hidden"
      >
        {/* Decorative blobs inside CTA */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-accent-violet/15 rounded-full blur-3xl pointer-events-none" />

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white relative z-10"
        >
          Ready to Build Your AI Career Twin?
        </motion.h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-sm sm:text-base relative z-10">
          Join thousands of Indian students landing dream tech roles with personalized AI career mentorship — completely free.
        </p>
        <Link to="/register" className="inline-block relative z-10">
          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
            <PrimaryButton className="py-3.5 px-8 text-base shadow-glow">
              Get Started Free Today <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </motion.div>
        </Link>
      </motion.section>
    </div>
  );
};

export default LandingPage;
