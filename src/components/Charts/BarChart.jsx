import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../hooks/useTheme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({ labels, dataValues, label = "Salary by Location ($)", color = "brand" }) => {
  const { isDark } = useTheme();

  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  const chartData = {
    labels: labels || ["SF Bay Area", "NYC", "Seattle", "Remote US", "Austin", "Toronto"],
    datasets: [
      {
        label,
        data: dataValues || [155000, 148000, 142000, 135000, 128000, 115000],
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.7)' : 'rgba(37, 99, 235, 0.8)',
        borderRadius: 8,
        hoverBackgroundColor: '#2563eb'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: textColor, font: { family: 'Inter', size: 12, weight: 600 } }
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        callbacks: {
          label: (context) => `$${context.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: 'Inter', size: 11 },
          callback: (value) => `$${value / 1000}k`
        }
      }
    }
  };

  return (
    <div className="w-full h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
