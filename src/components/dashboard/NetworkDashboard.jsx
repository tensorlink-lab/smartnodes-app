import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

// Dummy data for local testing
const dummyNetworkStats = {
  validators: 1,
  workers: 1,
  users: 0,
  proposal: 1839,
  available_capacity: 9565387824,
  used_capacity: 15231271888,
  models: ["Qwen/Qwen2.5-7B-Instruct"]
};

const dummyNetworkHistory = {
  daily: {
    labels: ["2025-06-09","2025-06-10","2025-06-11","2025-06-12","2025-06-13","2025-06-14","2025-06-15","2025-06-16","2025-06-17","2025-06-18","2025-06-19","2025-06-20","2025-06-21","2025-06-22","2025-06-23","2025-06-24","2025-06-25","2025-06-26","2025-06-27","2025-06-28","2025-06-29","2025-06-30","2025-07-01","2025-07-02","2025-07-03","2025-07-04","2025-07-05","2025-07-06","2025-07-07","2025-07-08"],
    datasets: {
      workers: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
      validators: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      users: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      jobs: [9,4,5,3,2,2,4,5,3,5,4,4,3,4,1,1,2,2,2,2,1,2,2,3,1,1,1,1,0,2],
      proposals: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total_capacity: [24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,0,24709234688,24709234688,24802164736,24802295808,24664014848,24664014848,24664014848,24664014848,0,0,24796659712],
      used_capacity: [15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,0,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,0,0,15231271888]
    }
  },
  timestamps: [1749441600.0,1749528000.0,1749614400.0,1749700800.0,1749787200.0,1749873600.0,1749960000.0,1750046400.0,1750132800.0,1750219200.0,1750305600.0,1750392000.0,1750478400.0,1750564800.0,1750651200.0,1750737600.0,1750824000.0,1750910400.0,1750996800.0,1751083200.0,1751169600.0,1751256000.0,1751342400.0,1751428800.0,1751515200.0,1751601600.0,1751688000.0,1751774400.0,1751860800.0,1751947200.0],
  summary: {
    current: {
      workers: 1,
      validators: 0,
      users: 0,
      jobs: 3,
      proposals: 0,
      available_capacity: 9565387824,
      used_capacity: 15231271888,
      total_capacity: 24796659712
    },
    recent_daily: [
      {
        date: "2025-07-02",
        timestamp: 1751428800.0,
        last_updated: 1751513607.5554426,
        workers: 1,
        validators: 1,
        users: 0,
        jobs: 3,
        proposals: 0,
        available_capacity: 9432742960,
        used_capacity: 15231271888,
        total_capacity: 24664014848
      },
      {
        date: "2025-07-08",
        timestamp: 1751947200.0,
        last_updated: 1751993396.4099038,
        workers: 1,
        validators: 1,
        users: 0,
        jobs: 2,
        proposals: 0,
        available_capacity: 0,
        used_capacity: 0,
        total_capacity: 0
      }
    ],
    recent_weekly: [],
    total_days_tracked: 43,
    total_weeks_archived: 0,
    retention_policy: {
      daily_days: 90,
      weekly_weeks: 104
    }
  },
  metadata: {
    total_days_available: 43,
    total_weeks_available: 0,
    requested_days: 30,
    generated_at: 1751993624.323103,
    generated_at_iso: "2025-07-08T12:53:44.323103"
  }
};

const NetworkDashboard = () => {
  const [networkStats, setNetworkStats] = useState(null);
  const [networkHistory, setNetworkHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useLocalData, setUseLocalData] = useState(false); // Toggle for local testing

  const API_BASE_URL = "https://smartnodes.ddns.net/tensorlink-api";
  
  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      
      if (useLocalData) {
        // Use dummy data for local testing
        setTimeout(() => {
          setNetworkStats(dummyNetworkStats);
          setNetworkHistory(dummyNetworkHistory);
          setError(null);
          setLoading(false);
        }, 1000); // Simulate network delay
        return;
      }
      
      // Fetch both stats and history from API
      const [statsResponse, historyResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/stats`),
        fetch(`${API_BASE_URL}/network-history`)
      ]);

      if (!statsResponse.ok || !historyResponse.ok) {
        throw new Error('Failed to fetch network data');
      }

      const statsData = await statsResponse.json();
      const historyData = await historyResponse.json();
      
      setNetworkStats(statsData);
      setNetworkHistory(historyData);
      setError(null);
    } catch (err) {
      console.error('Error fetching network data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();
    
    // Refresh data every 2 minutes
    const interval = setInterval(fetchNetworkData, 120000);
    return () => clearInterval(interval);
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

  const getNetworkStatsCards = () => {
    if (!networkStats) return [];

    return [
        {
            title: 'Available Capacity',
            amount: formatBytes(networkStats.available_capacity),
            icon: <MdStorage />,
            iconColor: '#ffffff',
            iconBg: '#9C27B0',
        },
        {
            title: 'Used Capacity',
            amount: formatBytes(networkStats.used_capacity),
            icon: <MdAssessment />,
            iconColor: '#ffffff',
            iconBg: '#607D8B',
        },
    ];
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
          color: "white"
        },
      },
      title: {
        display: true,
        text: 'Network Activity (30 days)',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: "white"
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#dddddd',
          font: {
            size: 12
          },
        },
      },
      y: {
        ticks: {
          color: '#dddddd',
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
          color: "white"
        },
      },
      title: {
        display: true,
        text: 'Network Capacity (30 days)',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: "white"
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#dddddd',
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
          color: '#dddddd',
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
          color: '#dddddd'
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

  const statsCards = getNetworkStatsCards();
  const userChartData = getUserChartData();
  const capacityChartData = getCapacityAndJobsChartData();

  return (
    <div className="w-full min-h-[1000px] mt-5 max-w-[1380px] space-y-6">
        <NetworkSummary
            networkStats={networkStats}
        />

        <div className="mb-6">
        <h1 className={`${styles.subheading2} dark:text-white mb-3 font-bold md:text-3xl text-lg bg-stone-200 rounded-xl dark:bg-zinc-700 border dark:border-white border-black p-3 text-left px-6 md:mt-2 sm:max-w-[250px] max-w-[200px] md:max-w-[290px]`}>
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
                    className="bg-neutral-800 dark:bg-neutral-800 rounded-2xl p-4 shadow-lg border-2 border-neutral-50 dark:border-neutral-300"
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
                    className="bg-zinc-700 dark:bg-neutral-900 rounded-2xl p-4 shadow-lg border-2 border-neutral-200 dark:border-neutral-400"
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
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            Last updated: {new Date(networkHistory.metadata.generated_at_iso).toLocaleString()}
        </div>
        )}
    </div>
    );
};

export default NetworkDashboard;