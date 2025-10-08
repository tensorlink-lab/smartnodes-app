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

const formatCapacity = (bytes) => {
  if (bytes >= 1099511627776) { // 1 TB in bytes
    return (bytes / 1099511627776).toFixed(1) + ' TB';
  } else if (bytes >= 1073741824) { // 1 GB in bytes
    return (bytes / 1073741824).toFixed(1) + ' GB';
  } else if (bytes >= 1048576) { // 1 MB in bytes
    return (bytes / 1048576).toFixed(1) + ' MB';
  } else {
    return bytes.toFixed(0) + ' B';
  }
};

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
          size: 17,
          weight: 'bold',
        },
        color: isDarkMode ? "white" : "black"
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
          font: { size: 11 }
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
          font: { size: 11 }
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
          size: 17,
          weight: 'bold',
        },
        color: isDarkMode ? "white" : "black"
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
          font: { size: 11 }
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
          font: { size: 11 }
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
          size: 17,
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
        display: true,
        grid: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
          font: { size: 11 }
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
          font: { size: 11 },
          callback: function(value) {
            return formatCapacity(value);
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
        className="mb-6 -mx-1 sm:-mx-3"
      >
        {/* Active Networks Section */}
        <motion.div 
          className="my-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Active Networks</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent ml-4" />
          </div>
          
          <div className="flex flex-wrap gap-2 pb-2">
            {/* Tensorlink - Active Network */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative group flex-1 min-w-[200px] max-w-[325px]"
            >
              <div className="relative flex items-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/30 dark:via-green-950/30 dark:to-teal-950/30 rounded-xl px-4 py-0 border border-green-200 dark:border-green-800/50 shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden">
                {/* Animated gradient background */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 dark:from-green-500/0 dark:via-green-500/10 dark:to-green-500/0"
                  animate={{ 
                    x: ['-100%', '100%']
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Pulse effect */}
                <motion.div 
                  className="absolute inset-0 bg-green-400/5 dark:bg-green-500/5"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="relative flex items-center gap-3 w-full">
                  {/* Animated status indicator */}
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      className="absolute w-5 h-5 bg-green-500 dark:bg-green-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.8, 1],
                        opacity: [0.6, 0, 0.6]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                    <div className="relative w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full shadow-lg shadow-green-500/50" />
                  </div>
                  
                  <div className="flex items-center justify-between flex-1 gap-3">
                    <div className="flex flex-col py-1">
                      <span className="text-green-900 dark:text-green-100 font-bold text-base">Tensorlink</span>
                      <span className="text-xs text-slate-500 dark:text-slate-500">On-demand AI Compute</span>
                    </div>
                    
                    <motion.span 
                      className="text-xs font-bold text-green-700 dark:text-green-300 bg-green-200 dark:bg-green-900/60 px-3 py-1 rounded-full border border-green-300 dark:border-green-700 shadow-sm"
                      animate={{ 
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      Online
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Coming Soon */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/30 rounded-xl px-4 py-1 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-slate-600 dark:text-slate-300 font-semibold text-sm">More networks</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500 italic">Coming soon...</span>
                </div>
              </div>
            </motion.div>
          </div>

        </motion.div>

        <div className="border border-gray-400 rounded-xl p-4 md:px-2 px-3 bg-neutral-50 dark:bg-zinc-900 shadow-sm min-h-[500px]">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-1 px-3">
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
                className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-3 shadow-lg border-2 border-neutral-400 dark:border-neutral-700 h-[370px]"
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
                className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-3 shadow-lg border-2 border-neutral-400 dark:border-neutral-700 h-[370px]"
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
                className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-3 shadow-lg border-2 border-neutral-400 dark:border-neutral-700 h-[370px]"
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