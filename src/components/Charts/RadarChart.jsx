import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useTheme } from '../../hooks/useTheme';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const RadarChart = ({ dataLabels, userScores, targetScores, title = "Skill Proficiency Comparison" }) => {
  const { isDark } = useTheme();

  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';

  const chartData = {
    labels: dataLabels || ["Python & AI", "GenAI / RAG", "Frontend", "Backend APIs", "DevOps", "System Design"],
    datasets: [
      {
        label: 'Your Current Skills',
        data: userScores || [95, 60, 90, 85, 70, 65],
        backgroundColor: 'rgba(59, 130, 246, 0.25)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        pointBackgroundColor: '#3b82f6',
      },
      {
        label: 'Target Role Benchmark',
        data: targetScores || [90, 90, 75, 90, 85, 85],
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10b981',
        borderWidth: 2,
        borderDash: [4, 4],
        pointBackgroundColor: '#10b981',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: { family: 'Inter', size: 12, weight: 600 }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
      }
    },
    scales: {
      r: {
        angleLines: { color: gridColor },
        grid: { color: gridColor },
        pointLabels: {
          color: textColor,
          font: { family: 'Inter', size: 11, weight: 600 }
        },
        ticks: {
          color: textColor,
          backdropColor: 'transparent',
          suggestedMin: 0,
          suggestedMax: 100
        }
      }
    }
  };

  return (
    <div className="w-full h-72">
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RadarChart;
