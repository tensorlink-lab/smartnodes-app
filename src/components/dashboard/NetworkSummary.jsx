import React, { useEffect, useState } from 'react';
import { MdNetworkCheck, MdVerifiedUser, MdOutlineSettings, MdAccountBalanceWallet, MdAssessment } from "react-icons/md";
import { motion } from 'framer-motion';

const API_BASE_URL = "https://smartnodes.ddns.net/tensorlink-api";

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
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setStats(networkStats);
  }, [networkStats]);
  useEffect(() => {
    setJobs(currentJobs);
  }, [currentJobs]);

  const summaryCards = stats && [
    {
      title: 'Active Networks',
      amount: 1,
      icon: <MdNetworkCheck />,
      iconColor: '#ffffff',
      iconBg: '#85deca',
    },
    {
      title: 'Active Validators',
      amount: stats.validators,
      icon: <MdVerifiedUser />,
      iconColor: '#ffffff',
      iconBg: '#03C9D7',
    },
    {
      title: 'Active Workers',
      amount: stats.workers,
      icon: <MdOutlineSettings />,
      iconColor: '#ffffff',
      iconBg: '#f7a6a0',
    },
    {
      title: 'Jobs Today',
      amount: 4,
      icon: <MdAccountBalanceWallet />,
      iconColor: '#ffffff',
      iconBg: '#1f1f1f',
    },
    {
      title: 'GPU Capacity',
      amount: formatBytes(toSignificantDigits(stats.available_capacity + stats.used_capacity, 3)),
      icon: <MdAssessment />,
      iconColor: '#ffffff',
      iconBg: '#8BC34A',
    }
  ];

  if (error) {
    return <div className="text-sm text-red-500 mt-4">Error loading summary: {error}</div>;
  }

  if (!stats) {
    return <div className="mt-4 text-sm text-gray-500">Loading network summary...</div>;
  }

  return (
    // <div className="flex flex-wrap justify-start gap-1 items-center w-full mb-4">
    //   {summaryCards.map((item, index) => (
    //     <motion.div
    //       key={index}
    //       initial={{ opacity: 0, x: -20 }}
    //       animate={{ opacity: 1, x: 0 }}
    //       transition={{ duration: 0.4, delay: index * 0.1 }}
    //       className="flex xs:pl-1 xs:flex-col pb-1 bg-neutral-100 dark:bg-slate-600 xs:h-[92px] dark:text-gray-200 dark:bg-secondary-dark-bg min-w-[200px] xs:min-w-[155px] rounded-2xl m-1 border border-gray-400 dark:border-neutral-300"
    //     >
    //       <div className="px-3 flex items-center mt-1 xs:mt-3">
    //         <button
    //           type="button"
    //           style={{ color: item.iconColor, backgroundColor: item.iconBg }}
    //           className="text-2xl opacity-0.9 rounded-full max-h-[55px] p-2 border border-gray-300 hover:drop-shadow-xl xs:ml-1 -ml-1"
    //         >
    //           {item.icon}
    //         </button>
    //         <span className="text-xl xs:text-2xl xs:ml-5 ml-3 font-semibold">{item.amount}</span>
    //       </div>
    //       <p className="text-md dark:text-gray-200 xs:mt-0 xs:mr-0 my-2 pt-1 mr-4 xs:ml-3">{item.title}</p>
    //     </motion.div>
    //   ))}
    // </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 w-full mb-4">
      {summaryCards.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="flex flex-col bg-slate-100 dark:bg-slate-600 rounded-lg border border-gray-400 dark:border-gray-500 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          {/* Header section with icon and amount */}
          <div className="flex items-center justify-between p-2 pb-1">
            <div
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className="flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 rounded-full shadow-sm border border-white"
            >
              <span className="text-sm">{item.icon}</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {item.amount}
            </span>
          </div>
          
          {/* Title section */}
          <div className="px-1.5 pb-2">
            <p className="text-xs text-gray-600 dark:text-gray-300 font-bold">
              {item.title}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NetworkSummary;
