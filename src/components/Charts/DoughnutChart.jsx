import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from '../../hooks/useTheme';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export const DoughnutChart = ({ labels, dataValues, colors }) => {
  const { isDark } = useTheme();

  const textColor = isDark ? '#94a3b8' : '#475569';

  const chartData = {
    labels: labels || ["Keyword Match", "Formatting", "Impact Metrics", "Structure"],
    datasets: [
      {
        data: dataValues || [94, 88, 86, 96],
        backgroundColor: colors || ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: textColor, font: { family: 'Inter', size: 11, weight: 600 }, padding: 15 }
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
      }
    }
  };

  return (
    <div className="w-full h-56 flex items-center justify-center">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
