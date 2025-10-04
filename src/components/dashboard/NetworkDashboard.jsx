import { motion } from 'framer-motion';
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
} from 'chart.js';
import { ModelDemand } from "..";
import { MdCircle } from "react-icons/md";
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

const NetworkDashboard = ({
  loading,
  fetchNetworkData,
  networkStats,
  networkHistory,
  modelDemandData,
  error
}) => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getCapacityChartData = () => {
    if (!networkHistory) return null;
    const { labels, datasets } = networkHistory.daily;

    return {
      labels: labels.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Total Capacity',
          data: datasets.total_capacity,
          borderColor: 'rgba(105, 57, 234)',
          backgroundColor: 'rgba(105, 57, 234, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Used Capacity',
          data: datasets.used_capacity,
          borderColor: 'rgba(225, 50, 80)',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const getUserChartData = () => {
    if (!networkHistory) return null;
    const { labels, datasets } = networkHistory.daily;

    return {
      labels: labels.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Workers',
          data: datasets.workers,
          borderColor: 'rgba(105, 57, 234)',
          backgroundColor: 'rgba(105, 57, 234, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Validators',
          data: datasets.validators,
          borderColor: 'rgba(0, 221, 50)',
          backgroundColor: 'rgba(3, 201, 115, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Users',
          data: datasets.users,
          borderColor: '#85deca',
          backgroundColor: 'rgba(139, 195, 74, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const getJobsChartData = () => {
    if (!networkHistory) return null;
    const { labels, datasets } = networkHistory.daily;

    return {
      labels: labels.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Jobs',
          data: datasets.jobs,
          borderColor: 'rgba(225, 50, 80)',
          backgroundColor: 'rgba(255, 0, 100, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const userChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 4,
          boxWidth: 6,
          boxHeight: 6,
          font: { size: 12 },
          color: isDarkMode ? "white" : "black"
        },
      },
      title: {
        display: true,
        text: 'Network Participants',
        padding: { top: 5, bottom: 5 },
        font: {
          size: 16,
          weight: 'bold',
        },
        color: isDarkMode ? "white" : "black"
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: { size: 11 },
          callback: function(value) {
            return formatNumber(value);
          }
        },
      }
    },
    elements: {
      point: {
        radius: 2,
        hoverRadius: 5,
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutInQuart',
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const jobsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 4,
          boxWidth: 6,
          boxHeight: 6,
          font: { size: 12 },
          color: isDarkMode ? "white" : "black"
        },
      },
      title: {
        display: true,
        text: 'Job Activity',
        padding: { top: 5, bottom: 5 },
        font: {
          size: 16,
          weight: 'bold',
        },
        color: isDarkMode ? "white" : "black"
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: { size: 11 },
          callback: function(value) {
            return formatNumber(value);
          }
        },
      }
    },
    elements: {
      point: {
        radius: 2,
        hoverRadius: 5,
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutInQuart',
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const capacityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 4,
          boxWidth: 6,
          boxHeight: 6,
          font: { size: 12 },
          color: isDarkMode ? "white" : "black"
        },
      },
      title: {
        display: true,
        text: 'Capacity (Gb)',
        padding: { top: 5, bottom: 5 },
        font: {
          size: 16,
          weight: 'bold',
        },
        color: isDarkMode ? "white" : "black"
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: { size: 11 },
          callback: function(value) {
            return formatBytes(value);
          }
        },
      },
    },
    elements: {
      point: {
        radius: 2,
        hoverRadius: 5,
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutInQuart',
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1380px] flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1380px] flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading network data</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchNetworkData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userChartData = getUserChartData();
  const capacityChartData = getCapacityChartData();
  const jobsChartData = getJobsChartData();

  return (
    <div className="w-full mt-2 max-w-[1380px] space-y-2">
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0 }}
        className="mb-6 xs:-mx-0 -mx-1"
      >
        <div className="border border-gray-400 rounded-xl p-4 bg-gray-200 dark:bg-neutral-800 shadow-sm min-h-[500px]">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-1 px-1">
            <h1 className="font-extrabold text-xl sm:text-2xl text-neutral-800 dark:text-white">
              Tensorlink Network Analytics
            </h1>
          </div>

          {/* Charts Container - Three charts in grid */}
          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mt-4 rounded-lg md:-mx-0 -mx-2">
            {/* User Activity Chart */}
            {userChartData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-4 shadow-lg border-2 border-neutral-400 dark:border-neutral-700 h-[370px]"
              >
                <Line data={userChartData} options={userChartOptions} />
              </motion.div>
            )}

            {/* Jobs Chart */}
            {jobsChartData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-4 shadow-lg border-2 border-neutral-400 dark:border-neutral-700 h-[370px]"
              >
                <Line data={jobsChartData} options={jobsChartOptions} />
              </motion.div>
            )}

            {/* Capacity Chart - Spans full width at bottom */}
            {capacityChartData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-4 shadow-lg border-2 border-neutral-400 dark:border-neutral-700 h-[370px] lg:col-span-2"
              >
                <Line data={capacityChartData} options={capacityChartOptions} />
              </motion.div>
            )}
          </motion.div>

          <ModelDemand
            modelDemandData={modelDemandData}
            loading={loading}
            error={error}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default NetworkDashboard;