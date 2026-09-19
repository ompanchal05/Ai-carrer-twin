import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Filter, X, ChevronRight, DollarSign, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import CareerCard from '../../components/CareerCard/CareerCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import GlassCard from '../../components/Cards/GlassCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../components/Buttons/SecondaryButton';
import { getCareerRecommendations } from '../../services/api';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';

export const CareerRecommendationPage = () => {
  const [careers, setCareers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCareerModal, setSelectedCareerModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCareerRecommendations();
        setCareers(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = ['All', 'Artificial Intelligence', 'Software Engineering', 'Data & Analytics', 'Cloud & DevOps'];

  const filteredCareers = careers.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <SpinnerLoader size="lg" text="Analyzing 50k+ career pathways..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          AI Career Path Recommendations
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Target role suggestions prioritized by neural skill match percentage and enterprise market demand.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Filter by job title, skill (e.g., PyTorch, React)..."
          className="max-w-md"
        />

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCareers.map((career) => (
          <CareerCard
            key={career.id}
            career={career}
            onSelect={(item) => setSelectedCareerModal(item)}
          />
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCareerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded">
                  {selectedCareerModal.category}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedCareerModal.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCareerModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedCareerModal.description}
            </p>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <div>
                <span className="text-xs text-slate-400 font-medium">Expected Salary Range</span>
                <p className="text-lg font-extrabold text-emerald-500 mt-0.5">{selectedCareerModal.avgSalary}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Market Demand Growth</span>
                <p className="text-lg font-extrabold text-brand-500 mt-0.5">{selectedCareerModal.demandGrowth}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Responsibilities</h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {selectedCareerModal.keyResponsibilities?.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Link to="/skill-gap" className="flex-1">
                <PrimaryButton className="w-full py-2.5 text-xs">
                  Analyze Skill Gap <ChevronRight className="w-4 h-4" />
                </PrimaryButton>
              </Link>
              <Link to="/learning-roadmap" className="flex-1">
                <SecondaryButton className="w-full py-2.5 text-xs">
                  View Learning Roadmap
                </SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CareerRecommendationPage;
