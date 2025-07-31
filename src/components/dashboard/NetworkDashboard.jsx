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
import { MdOutlineSupervisorAccount, MdCircle, MdStorage, MdAssessment, MdOutlineSettings, MdVerifiedUser, MdDescription, MdBusinessCenter, MdNetworkCheck } from "react-icons/md";
import { Line } from 'react-chartjs-2';
import { NetworkSummary } from "../../components";

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

// Mock styles object for demonstration
const styles = {
  subheading: "text-2xl font-bold",
  subheading2: "text-2xl font-bold"
};

const NetworkDashboard = ({
  loading,
  fetchNetworkData,
  networkStats,
  networkHistory,
  error
}) => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark); // trigger re-render
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

  const getCapacityAndJobsChartData = () => {
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
          borderColor: '#85deca',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Used Capacity',
          data: datasets.used_capacity,
          borderColor: '#f7a6a0',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
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
          borderColor: '#d6b3f7',
          backgroundColor: 'rgba(255, 87, 34, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Validators',
          data: datasets.validators,
          borderColor: '#aaf7b6',
          backgroundColor: 'rgba(3, 201, 215, 0.1)',
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
        {
          label: 'Jobs',
          data: datasets.jobs,
          borderColor: '#f7a6a0',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.4
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
          padding: 10,
          color: isDarkMode ? "white" : "black"
        },
      },
      title: {
        display: true,
        text: 'Network Activity (30 days)',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: isDarkMode ? "white" : "black"
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: {
            size: 12
          },
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: {
            size: 12
          },
          callback: function(value) {
            return formatNumber(value);
          }
        },
      }
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 6,
      },
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
          color: isDarkMode ? "white" : "black"
        },
      },
      title: {
        display: true,
        text: 'Network Capacity (30 days)',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: isDarkMode ? "white" : "black"
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: {
            size: 12
          },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: {
            size: 12
          },
          callback: function(value) {
            return formatBytes(value);
          }
        },
        title: {
          display: true,
          text: 'Capacity',
          color: isDarkMode ? "white" : "black"
        }
      }
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 6,
      },
    },
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1380px] flex justify-center items-center h-64">
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
  const capacityChartData = getCapacityAndJobsChartData();

  return (
    <div className="w-full mt-2 max-w-[1380px] space-y-2">
      <div className="mb-6">

        <h1 className={`${styles.subheading2} dark:text-white py-3`}>
          Active Networks
        </h1>
        
        <div className="">
            {/* Tensorlink Network Status */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 mb-2 px-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center bg-green-100 dark:bg-green-800/30 rounded-lg p-3 border-2 border-gray-300 dark:border-neutral-400 shadow-md"
                >
                    <div className="flex items-center">
                        <MdCircle className="text-green-500 text-sm mr-2" />
                        <span className="text-green-700 dark:text-green-300 font-medium">Tensorlink</span>
                        </div>
                        <div className="ml-auto">
                        <span className="text-xs text-green-600 dark:text-green-400 bg-green-200 dark:bg-green-700 px-2 py-1 rounded-full">
                            Active
                        </span>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center bg-neutral-100 dark:bg-neutral-800/30 rounded-lg p-3 border-2 border-gray-300 dark:border-gray-700 shadow-md"
                >
                    <div className="flex items-center">
                    <MdCircle className="text-neutral-500 text-sm mr-2" />
                        <span className="text-neutral-700 dark:text-neutral-300 font-medium">More coming soon...</span>
                    </div>
                </motion.div>
            </div>

            {/* Section header for Tensorlink data */}
            <div className="mb-4 mt-5">
                <div className="flex items-center justify-center">
                <div className="flex-1 h-px bg-green-300 dark:bg-green-600"></div>
                <div className="mx-4 text-sm text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-800/50 px-3 py-1 rounded-full">
                    Tensorlink Network Analytics
                </div>
                <div className="flex-1 h-px bg-green-300 dark:bg-green-600"></div>
                </div>
            </div>

            {/* Charts Container - Side by side on large screens */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 rounded-lg">
                {/* User Activity Chart */}
                {userChartData && (
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-neutral-200 dark:bg-neutral-800 rounded-2xl p-4 shadow-lg border-2 border-neutral-50 dark:border-neutral-300"
                    >
                    <div className="flex items-center mb-2">
                    <MdCircle className="text-green-500 text-xs mr-2" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Tensorlink Network Activity</span>
                    </div>
                    <div className="h-80 xl:h-96">
                        <Line data={userChartData} options={userChartOptions} />
                    </div>
                    </motion.div>
                )}

                {/* Capacity and Jobs Chart */}
                {capacityChartData && (
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-zinc-200 dark:bg-neutral-900 rounded-2xl p-4 shadow-lg border-2 border-neutral-200 dark:border-neutral-400"
                    >
                    <div className="flex items-center mb-2">
                    <MdCircle className="text-green-500 text-xs mr-2" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Tensorlink Network Capacity</span>
                    </div>
                    <div className="h-80 xl:h-96">
                        <Line data={capacityChartData} options={capacityChartOptions} />
                    </div>
                    </motion.div>
                )}
                </motion.div>
            </div>
          
            {/* {networkStats?.models && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Available Models (API)</h3>
                <div className="flex flex-wrap gap-2">
                {networkStats.models.map((model, index) => (
                    <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                    {model}
                    </span>
                ))}
                </div>
            </motion.div>
            )} */}
        </div>

        {/* Last Updated */}
        {networkHistory?.metadata && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center pb-10">
            Last updated: {new Date(networkHistory.metadata.generated_at_iso).toLocaleString()}
        </div>
        )}
    </div>
    );
};

export default NetworkDashboard;