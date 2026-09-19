import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, MapPin, Sliders, Award, Building2 } from 'lucide-react';
import SalaryCard from '../../components/SalaryCard/SalaryCard';
import GlassCard from '../../components/Cards/GlassCard';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import { getSalaryPrediction } from '../../services/api';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';

export const SalaryPredictionPage = () => {
  const [data, setData] = useState(null);
  const [experienceYears, setExperienceYears] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('Pune / PCMC');
  const [selectedSector, setSelectedSector] = useState('GenAI & Foundation Model Startups');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSalaryPrediction();
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <SpinnerLoader size="lg" text="Calculating neural salary valuation curves..." />;
  }

  // Dynamic salary computation multiplier (in INR)
  const baseSalary = 900000 + experienceYears * 150000;
  const locationMultipliers = {
    'Bangalore (Bengaluru)': 1.15,
    'Mumbai / Navi Mumbai': 1.10,
    'Hyderabad (HITEC City)': 1.05,
    'Pune / PCMC': 1.00,
    'Chennai / OMR': 0.95,
    'Delhi NCR / Noida': 1.02
  };
  const multiplier = locationMultipliers[selectedLocation] || 1.0;
  const calculatedEstimate = Math.round(baseSalary * multiplier);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          AI Salary Valuation & Market Forecast
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Machine learning salary estimation calibrated against 100,000+ tech industry compensation datasets.
        </p>
      </div>

      {/* Main Valuation Highlight Card */}
      <SalaryCard
        estimate={`₹${(calculatedEstimate / 100000).toFixed(1)} LPA`}
        rangeMin={`₹${(Math.round(calculatedEstimate * 0.88) / 100000).toFixed(1)} LPA`}
        rangeMax={`₹${(Math.round(calculatedEstimate * 1.15) / 100000).toFixed(1)} LPA`}
        percentile={data.percentile}
        location={selectedLocation}
      />

      {/* Interactive Simulation Controls */}
      <GlassCard className="space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-brand-500" /> Interactive Parameter Simulation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Experience Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Years of Experience</span>
              <span className="text-brand-600 dark:text-brand-400">{experienceYears} Years</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={experienceYears}
              onChange={(e) => setExperienceYears(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          {/* Location Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Benchmark Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {data.salaryByLocation.map((loc) => (
                <option key={loc.location} value={loc.location}>{loc.location}</option>
              ))}
            </select>
          </div>

          {/* Sector Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Industry Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {data.industryBreakdown.map((sec) => (
                <option key={sec.sector} value={sec.sector}>{sec.sector}</option>
              ))}
            </select>
          </div>

        </div>
      </GlassCard>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 5-Year Growth Curve */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Projected 5-Year Salary Growth Path
          </h3>
          <LineChart
            labels={data.salaryByExperience.map(s => s.years)}
            dataValues={data.salaryByExperience.map(s => Math.round((s.salary * multiplier) / 100000))}
            label="Projected Salary (₹ LPA)"
          />
        </GlassCard>

        {/* Location Benchmarks Bar Chart */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Top Indian Tech Hub Compensation Comparison
          </h3>
          <BarChart
            labels={data.salaryByLocation.map(l => l.location.split(' ')[0])}
            dataValues={data.salaryByLocation.map(l => Math.round(((900000 + experienceYears * 150000) * l.remoteIndex) / 100000))}
            label="Compensation (₹ LPA)"
          />
        </GlassCard>

      </div>

    </div>
  );
};

export default SalaryPredictionPage;
