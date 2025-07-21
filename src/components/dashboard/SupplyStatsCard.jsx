import React, { copyToClipboard, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Doughnut, Line } from 'react-chartjs-2';
import { useMediaQuery } from "react-responsive";
import { MdLink, MdVerified, MdCheck, MdLaunch, MdSecurity } from "react-icons/md";

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

const SupplyStatsCard = ({ 
  supplyStats = [], 
  userAddress, 
  userBalance, 
  userLocked, 
  userUnclaimed, 
  claimRewards,
  connectToContract,
  connectToCoinbaseWallet,
  contract,
  ConnectWalletButton,
  styles,
  contractAddress,
  multisigAddress
}) => {
  const emissionsData = [
    { date: "Sep 2025", validator: 0, worker: 0, dao: 0 },
    { date: "Sep 2026", validator: 4917375, worker: 41797687.5, dao: 2458687.5 },
    { date: "Sep 2027", validator: 7867800, worker: 66876300, dao: 3933900 },
    { date: "Sep 2028", validator: 9638055, worker: 81923467.5, dao: 4819027.5 },
    { date: "Sep 2029", validator: 10700208, worker: 90951768, dao: 5350104},
    { date: "Sep 2030", validator: 11337499.8, worker: 96368748.3, dao: 5668749.9},
    { date: "Sep 2031", validator: 11719525.2, worker: 99615964.2, dao: 5859762.6},
    { date: "Sep 2032", validator: 12101550.6, worker: 102863180.1, dao: 6050775.3},
    { date: "Sep 2033", validator: 12483576, worker: 106110396, dao: 6241788},
    { date: "Sep 2034", validator: 12865601.4, worker: 109357611.9, dao: 6432800.7},
  ];

  const isSmallScreen = useMediaQuery({ maxWidth: 600 });
  const [showEmissionsChart, setShowEmissionsChart] = useState(false);
  
  // Check if data is still loading
  const isLoading = !supplyStats || supplyStats.length < 3 || 
                    supplyStats.some(item => item.amount === "-" || isNaN(Number(item.amount)));

  // Extract necessary amounts
  const totalSupply = !isLoading ? (supplyStats.find(item => item.title === "Total Supply")?.amount || 0) : 0;
  const locked = !isLoading ? (supplyStats.find(item => item.title === "Locked")?.amount || 0) : 0;
  const unclaimed = !isLoading ? (supplyStats.find(item => item.title === "Unclaimed Rewards")?.amount || 0) : 0;

  // Compute circulating supply
  const circulatingSupply = totalSupply - locked - unclaimed;

  // Format number for display
  const formatNumber = (number) => {
    return number.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 1 
    });
  };

  // Doughnut chart data
  const doughnutData = {
    labels: ['Locked', 'Unclaimed', 'Circulating'],
    datasets: [
      {
        data: [locked, unclaimed, circulatingSupply],
        backgroundColor: ['#85deca', '#f7a6a0', '#aaf7b6'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 3,
        hoverBorderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  // Line chart data with stacked configuration
  const lineData = {
    labels: emissionsData.map(d => d.date),
    datasets: [
      {
        label: 'DAO',
        data: emissionsData.map(d => d.dao),
        backgroundColor: 'rgba(247, 166, 160, 0.8)',
        borderColor: '#f7a6a0',
        borderWidth: 2,
        fill: 'origin',
        tension: 0.3,
      },
      {
        label: 'Validators',
        data: emissionsData.map(d => d.validator),
        backgroundColor: 'rgba(170, 247, 182, 0.8)',
        borderColor: '#aaf7b6',
        borderWidth: 2,
        fill: '-1',
        tension: 0.3,
      },
      {
        label: 'Workers',
        data: emissionsData.map(d => d.worker),
        backgroundColor: 'rgba(133, 222, 202, 0.8)',
        borderColor: '#85deca',
        borderWidth: 2,
        fill: '-1',
        tension: 0.3,
      },
    ],
  };

  // Doughnut chart options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isSmallScreen ? 'bottom' : 'left',
        labels: {
          color: 'white',
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: isSmallScreen ? 11 : 13,
          },
          padding: isSmallScreen ? 10 : 50,
          usePointStyle: true,
          pointStyle: 'circle',
          
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const percentage = ((context.parsed / totalSupply) * 100).toFixed(2);
            return `${context.label}: ${formatNumber(context.parsed)} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '35%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  // Line chart options with stacking enabled
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: '#dddddd',
          font: {
            size: isSmallScreen ? 10 : 12,
          },
        },
        grid: {
          color: 'black',
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: '#dddddd',
          font: {
            size: isSmallScreen ? 10 : 12,
          },
          callback: function(value) {
            return formatNumber(value);
          }
        },
        grid: {
          color: 'black',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: isSmallScreen ? 12 : 14,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatNumber(context.parsed.y)}`;
          },
          afterBody: function(tooltipItems) {
            // Calculate total for the current data point
            const total = tooltipItems.reduce((sum, item) => {
              return sum + item.parsed.y;
            }, 0);
            return `Total Supply: ${formatNumber(total)}`;
          }
        }
      }
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
  const explorerBase = "https://sepolia.basescan.org/address/";

  // Loading spinner component
  const LoadingSpinner = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex justify-center items-center h-full"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </motion.div>
  );

  return (
    <div className="max-w-[1380px] w-full">
      {/* Account Info Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gray-200 mb-2 dark:bg-gray-600 rounded-xl dark:text-gray-200 p-4 sm:pt-6 overflow-x-scroll border border-black dark:border-gray-400 max-w-[700px]"
      >
        <h1 className="font-extrabold text-xl md:text-2xl mb-2 dark:text-white">Account</h1>
        <div className="mb-4 px-1 mt-2 xs:mt-3">
          <h2 className="font-bold text-xl text-gray-400">Address</h2>
          <p className="text-lg xs:text-2xl overflow-auto font-semibold">
            {userAddress ? userAddress : "No address connected"}
          </p>
        </div>  
        
        <div className="flex flex-wrap px-1 mb-2">
          <div className="pr-20">
            <p className="font-bold text-xl text-gray-400">Balance</p>
            <p className="text-xl xs:text-2xl">
              {(isNaN(Number(userBalance)) ? '-' : Number(userBalance).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }))}
            </p>
          </div>  
          <div className="pr-20">
            <p className="font-bold text-xl text-gray-400">Locked</p>
            <p className="text-xl xs:text-2xl">
              {(isNaN(Number(userLocked)) ? '-' : Number(userLocked).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }))}
            </p>
          </div>  
          <div className="pr-5">
            <p className="font-bold text-xl text-gray-400">Unclaimed Rewards</p>
            <p className="text-xl xs:text-2xl">
              {(isNaN(Number(userUnclaimed)) ? '-' : Number(userUnclaimed).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }))}
            </p>
          </div>  
        </div>
        
        <div className="flex flex-wrap gap-3 items-center mt-5 px-1">
          <a
            onClick={claimRewards}
            className="border border-black inline-block px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-md text-sm md:text-base font-semibold cursor-pointer"
          >
            Claim Rewards
          </a>
          <div>
            <ConnectWalletButton 
              connectToContract={connectToContract} 
              connectToCoinbaseWallet={connectToCoinbaseWallet} 
              contract={contract} 
            />
          </div>
        </div>
      </motion.div>

      {/* Main Supply Stats and Chart Row */}
      <div className="flex md:flex-row flex-col mb-2">
         {/* Left: Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`flex flex-col items-center justify-center bg-neutral-400 dark:bg-neutral-900 rounded-xl border border-white transition-all duration-500 
            ${showEmissionsChart ? 'md:max-w-[800px]' : 'sm:max-w-[400px] md:max-w-[450px] max-w-[480px]'} 
            w-full`}
        >
          <div className="w-full flex justify-between items-center px-4">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl sm:text-2xl font-extrabold text-neutral-50 dark:text-white mt-3"
            >
              {showEmissionsChart ? "Projected Emissions" : "Supply Distribution"}
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              aria-label="Toggle chart"
              onClick={() => setShowEmissionsChart(!showEmissionsChart)}
              className="mt-4 p-2 rounded-full hover:bg-gray-400 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </motion.button>
          </div>

          <div style={{ width: '100%', height: isSmallScreen ? '240px' : '340px', paddingLeft: '60px', padding: isSmallScreen ? '0px' : '15px' }}>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <motion.div
                  key={showEmissionsChart ? 'line' : 'doughnut'}
                  initial={{ opacity: 0, x: -200 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.75 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  {showEmissionsChart ? (
                    <Line data={lineData} options={lineOptions} />
                  ) : (
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  )}
                </motion.div>

              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-neutral-200 dark:bg-neutral-800 rounded-xl mr-3 mt-2 md:mt-0 md:ml-2 max-w-[650px] dark:text-gray-200 dark:bg-secondary-dark-bg w-full p-7 lg:pt-10 pt-5 border dark:border-gray-400 border-gray-500"
        >
          <h1 className="font-extrabold text-xl md:text-2xl lg:text-3xl lg:mb-6 mb-2 dark:text-white">Supply & Emissions</h1>
          {/* Display "Current Supply" on top */}
          {supplyStats.map((item, index) => (
            item.title === "Total Supply" && (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-4 lg:mb-0 mt-1"
              >
                <p className="font-bold text-xl md:text-2xl dark:text-gray-200 text-gray-500">{item.title}</p>
                <div className="flex items-baseline dark:text-white">
                  <motion.p 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="xs:text-3xl text-2xl md:text-3xl font-semibold break-words max-w-full overflow-hidden dark:text-white"
                  >
                    {(isNaN(Number(item.amount)) ? '-' : Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }))}
                  </motion.p>
                  <p className="xs:text-2xl text-lg ml-2">SNO</p>
                </div>
              </motion.div>
            )
          ))}

          {/* Display the rest of the values in the row beneath */}
          <div className="flex flex-wrap justify-start mb-0 items-center h-[60%]">
            {supplyStats.map((item, index) => (
              item.title !== "Total Supply" && (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="mr-7"
                >
                  <div>
                    <p className="font-bold md:text-xl dark:text-gray-200 text-gray-500 mt-2">{item.title}</p>
                    <p className="text-2xl break-words max-w-full overflow-hidden dark:text-white">
                      {(isNaN(Number(item.amount)) ? '-' : Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }))}
                    </p>
                  </div>
                </motion.div>
              )
            ))}
          </div>
        </motion.div>
      </div>

      {/* Contract Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-200 w-full dark:bg-neutral-700 rounded-xl min-w-[250px] max-w-[510px] sm:max-h-[310px] dark:text-gray-200 p-6 border border-black dark:border-gray-400 mb-2"
      >
        <h1 className="font-extrabold text-xl md:text-2xl mb-2 dark:text-white">Contract Address</h1>
        {/* Contract Addresses */}
        <div className="space-y-4 mb-6">
          {/* Core Contract */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2 mt-4">
              <MdLink className="text-blue-500" />
              <span className="font-bold text-lg text-gray-600 dark:text-gray-300">Core Contract</span>
              {true && <MdVerified className="text-green-500" />}
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <code className="text-sm font-mono flex-1 break-all">
                {contractAddress}
              </code>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(contractAddress, 'contract')}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  title="Copy address"
                >
                    <MdCheck className="text-green-500" />
                </button>
                <a
                  href={`${explorerBase}${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  title="View on explorer"
                >
                  <MdLaunch className="text-blue-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Multisig Contract */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <MdSecurity className="text-green-500" />
              <span className="font-bold text-lg text-gray-600 dark:text-gray-300">Multisig Contract</span>
              {true && <MdVerified className="text-green-500" />}
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <code className="text-sm font-mono flex-1 break-all">
                {multisigAddress}
              </code>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(multisigAddress, 'multisig')}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  title="Copy address"
                >
                  <MdCheck className="text-green-500" />
                </button>
                <a
                  href={`${explorerBase}${multisigAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  title="View on explorer"
                >
                  <MdLaunch className="text-blue-500" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="flex flex-wrap justify-start gap-1 items-center w-full mb-4">
          {/* {summaryCards.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex xs:pl-1 xs:flex-col pb-1 bg-neutral-100 dark:bg-slate-600 xs:h-[92px] dark:text-gray-200 dark:bg-secondary-dark-bg min-w-[200px] xs:min-w-[155px] rounded-2xl m-1 border border-gray-400 dark:border-neutral-300"
            >
              <div className="px-3 flex items-center mt-1 xs:mt-3">
                <button
                  type="button"
                  style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                  className="text-2xl opacity-0.9 rounded-full max-h-[55px] p-2 border border-gray-300 hover:drop-shadow-xl xs:ml-1 -ml-1"
                >
                  {item.icon}
                </button>
                <span className="text-xl xs:text-2xl xs:ml-5 ml-3 font-semibold">{item.amount}</span>
              </div>
              <p className="text-md dark:text-gray-200 xs:mt-0 xs:mr-0 my-2 pt-1 mr-4 xs:ml-3">{item.title}</p>
            </motion.div>
          ))} */}
      </motion.div>
    </div>
  );
};

export default SupplyStatsCard;