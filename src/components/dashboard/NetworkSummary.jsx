import React, { useEffect, useState } from 'react';
import { MdNetworkCheck, MdVerifiedUser, MdCircle, MdOutlineSettings, MdAccountBalanceWallet, MdAssessment } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';

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

function toSignificantDigits(num, digits) {
  if (num === 0) return 0;
  const d = Math.ceil(Math.log10(num < 0 ? -num : num));
  const power = digits - d;
  const magnitude = Math.pow(10, power);
  return Math.round(num * magnitude) / magnitude;
}

const NetworkSummary = ({ networkStats, currentJobs, activeMenu }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setStats(networkStats);
  }, [networkStats]);
  
  const getGridCols = () => {
    if (activeMenu) {
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
    }
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6";
  };
  
  const summaryCards = stats && [
    {
      title: 'Networks',
      amount: 1,
      icon: <MdNetworkCheck />,
      iconColor: '#ffffff',
      iconBg: 'linear-gradient(135deg, #a16eca 0%, #8855b3 100%)',
      accentColor: 'from-purple-500/10 to-purple-600/10',
    },
    {
      title: 'Workers',
      amount: stats.workers,
      icon: <MdOutlineSettings />,
      iconColor: '#ffffff',
      iconBg: 'linear-gradient(135deg, #2a6aa0 0%, #1e4d75 100%)',
      accentColor: 'from-blue-500/10 to-blue-600/10',
    },
    {
      title: 'Validators',
      amount: stats.validators,
      icon: <MdVerifiedUser />,
      iconColor: '#ffffff',
      iconBg: 'linear-gradient(135deg, #aaaaaa 0%, #888888 100%)',
      accentColor: 'from-gray-500/10 to-gray-600/10',
    },
    {
      title: 'Jobs',
      amount: stats.jobs,
      icon: <MdAccountBalanceWallet />,
      iconColor: '#ffffff',
      iconBg: 'linear-gradient(135deg, #1f1f1f 0%, #000000 100%)',
      accentColor: 'from-slate-500/10 to-slate-600/10',
    },
    {
      title: 'Capacity',
      amount: formatBytes(toSignificantDigits(stats.available_capacity + stats.used_capacity, 3)),
      icon: <MdAssessment />,
      iconColor: '#ffffff',
      iconBg: 'linear-gradient(135deg, #5BC34A 0%, #45a036 100%)',
      accentColor: 'from-green-500/10 to-green-600/10',
    }
  ];

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">Error loading summary: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Summary Cards Grid */}
      <div className={`grid ${getGridCols()} gap-3 w-full mb-3`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="group relative"
          >
            <div className="relative flex flex-col bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Gradient overlay on hover */}
              {stats && (
                <div className={`absolute inset-0 bg-gradient-to-br ${summaryCards[index].accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              )}
              
              <div className="relative flex items-center justify-between p-2">
                <AnimatePresence mode="wait">x 
                  {!stats ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 animate-pulse" />
                      <div className="flex flex-col items-end space-y-2">
                        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                      </div>
                    </motion.div>
                  ) : (
                    // Loaded state
                    <motion.div
                      key="loaded"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center justify-between w-full"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        style={{ 
                          background: summaryCards[index].iconBg 
                        }}
                        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-md border border-white/20 dark:border-white/10"
                      >
                        <span className="text-base sm:text-lg" style={{ color: summaryCards[index].iconColor }}>
                          {summaryCards[index].icon}
                        </span>
                      </motion.div>
                      
                      <div className="flex flex-col items-end">
                        <motion.span 
                          className="tex-md sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-none"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.08 + 0.2, type: "spring", stiffness: 200 }}
                        >
                          {summaryCards[index].amount}
                        </motion.span>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium leading-none mt-0">
                          {summaryCards[index].title}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
    </div>
  );
};

export default NetworkSummary;