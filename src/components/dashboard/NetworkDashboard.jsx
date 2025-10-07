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
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Used Capacity',
          data: datasets.used_capacity,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Validators',
          data: datasets.validators,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Users',
          data: datasets.users,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
        align: 'start',
        padding: { top: 5, bottom: 15 },
        font: {
          size: 16,
          weight: 'bold',
        },
        color: isDarkMode ? "white" : "black"
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
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
      easing: 'easeInOutQuart',
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
        align: 'start',
        padding: { top: 5, bottom: 15 },
        font: {
          size: 16,
          weight: 'bold',
        },
        color: isDarkMode ? "white" : "black"
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
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
      easing: 'easeInOutQuart',
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
          padding: 10,
          boxWidth: 6,
          boxHeight: 6,
          font: { size: 12 },
          color: isDarkMode ? "white" : "black"
        },
      },
      title: {
        display: true,
        text: 'GPU Capacity',
        align: 'start',
        padding: { top: 5, bottom: 15 },
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
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            const bytes = context.parsed.y;
            
            // Convert bytes to GB or TB
            if (bytes >= 1099511627776) { // 1 TB in bytes
              label += (bytes / 1099511627776).toFixed(2) + ' TB';
            } else if (bytes >= 1073741824) { // 1 GB in bytes
              label += (bytes / 1073741824).toFixed(2) + ' GB';
            } else {
              label += bytes.toFixed(2) + ' Bytes';
            }
            
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
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
      easing: 'easeInOutQuart',
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
          <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 mt-4 rounded-lg md:-mx-0 -mx-2">
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
                className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-4 shadow-lg border-2 border-neutral-400 dark:border-neutral-700 h-[370px]"
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