import React, { useEffect, useState } from 'react';
import { MdNetworkCheck, MdVerifiedUser, MdOutlineSettings, MdAccountBalanceWallet, MdAssessment } from "react-icons/md";
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

const NetworkSummary = ({ networkStats, currentJobs }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setStats(networkStats);
  }, [networkStats]);
  
  const summaryCards = stats && [
    {
      title: 'Networks',
      amount: 1,
      icon: <MdNetworkCheck />,
      iconColor: '#ffffff',
      iconBg: '#a16eca',
    },
    {
      title: 'Workers',
      amount: stats.workers,
      icon: <MdOutlineSettings />,
      iconColor: '#ffffff',
      iconBg: '#2a6aa0',
    },
    {
      title: 'Validators',
      amount: stats.validators,
      icon: <MdVerifiedUser />,
      iconColor: '#ffffff',
      iconBg: '#aaaaaa',
    },
    {
      title: 'Jobs',
      amount: stats.jobs,
      icon: <MdAccountBalanceWallet />,
      iconColor: '#ffffff',
      iconBg: '#1f1f1f',
    },
    {
      title: 'Capacity',
      amount: formatBytes(toSignificantDigits(stats.available_capacity + stats.used_capacity, 3)),
      icon: <MdAssessment />,
      iconColor: '#ffffff',
      iconBg: '#5BC34A',
    }
  ];

  if (error) {
    return <div className="text-sm text-red-500 mt-2">Error loading summary: {error}</div>;
  }

  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-1.5 w-full mb-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="flex flex-col bg-slate-100 dark:bg-zinc-900 rounded-lg border border-gray-400 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between px-2 py-1.5">
            <AnimatePresence mode="wait">
              {!stats ? (
                // Loading state
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between w-full"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse" />
                  <div className="flex flex-col items-end space-y-1">
                    <div className="w-10 h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                    <div className="w-14 h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                  </div>
                </motion.div>
              ) : (
                // Loaded state
                <motion.div
                  key="loaded"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between w-full"
                >
                  <div
                    style={{ 
                      color: summaryCards[index].iconColor, 
                      backgroundColor: summaryCards[index].iconBg 
                    }}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-sm border border-white"
                  >
                    <span className="text-xs xs:text-sm">{summaryCards[index].icon}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white leading-none">
                      {summaryCards[index].amount}
                    </span>
                    <p className="tex-xs xs:text-sm text-gray-600 dark:text-gray-300 font-medium leading-none mt-0.5">
                      {summaryCards[index].title}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NetworkSummary;