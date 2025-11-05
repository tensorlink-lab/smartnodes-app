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
import { ProposalsTable, ProposalsBarChart } from "..";
import { MdLink, MdLibraryAddCheck, MdMonetizationOn, MdVerified, MdCheck, MdLaunch, MdSecurity } from "react-icons/md";

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
  supplyStats, 
  tokenAddress,
  coordinatorAddress,
  coreAddress,
  daoAddress,
  proposals
}) => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [activeView, setActiveView] = useState('capacity');
  const ITEMS_PER_PAGE = 10;
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

  // Format with 3 significant figures + suffix
  const formatValue = (num) => {
    if (num === null || num === undefined) return "-";

    // Convert BigInt or string to number
    let value = typeof num === "bigint" ? Number(num) : Number(num);

    if (isNaN(value)) return "-";
    if (value === 0) return "0";

    const suffixes = ["", "k", "M", "B", "T"];
    const tier = Math.floor(Math.log10(Math.abs(value)) / 3);

    if (tier === 0) {
      // Round to 3 sig figs, then format with commas
      return Number(value.toPrecision(3)).toLocaleString();
    }

    const suffix = suffixes[tier];
    const scaled = value / Math.pow(10, tier * 3);

    return Number(scaled.toPrecision(3)).toLocaleString() + suffix;
  };

  const emissionsData = [
    { date: "Sep 2025", genesis_nodes: 4000000, dao: 0, worker: 0, validator: 0},
    { date: "Sep 2026", genesis_nodes: 4000000, dao: 2458687.5, worker: 41797687.5, validator: 4917375},
    { date: "Sep 2027", genesis_nodes: 4000000, dao: 3933900, worker: 66876300, validator: 7867800},
    { date: "Sep 2028", genesis_nodes: 4000000, dao: 4819027.5, worker: 81923467.5, validator: 9638055},
    { date: "Sep 2029", genesis_nodes: 4000000, dao: 5350104, worker: 90951768, validator: 10700208},
    { date: "Sep 2030", genesis_nodes: 4000000, dao: 5668749.9, worker: 96368748.3, validator: 11337499.8},
    { date: "Sep 2031", genesis_nodes: 4000000, dao: 5859762.6, worker: 99615964.2, validator: 11719525.2},
    { date: "Sep 2032", genesis_nodes: 4000000, dao: 6015807.3, worker: 102268724.1, validator: 12031614.6},
    { date: "Sep 2033", genesis_nodes: 4000000, dao: 6171852, worker: 104921484, validator: 12343704},
    { date: "Sep 2034", genesis_nodes: 4000000, dao: 6327896.7, worker: 107574243.9, validator: 12655793.4},
  ];

  const isSmallScreen = useMediaQuery({ maxWidth: 600 });
  const [showEmissionsChart, setShowEmissionsChart] = useState(false);
  
  // Check if data is still loading
  let isLoading = !supplyStats || supplyStats.length < 3 || 
                    supplyStats.some(item => item.amount === "-" || isNaN(Number(item.amount)));

  // Extract necessary amounts
  const totalSupply = !isLoading ? (supplyStats.find(item => item.title === "Total Supply")?.amount || 0) : 0;
  const locked = !isLoading ? (supplyStats.find(item => item.title === "Locked")?.amount || 0) : 0;
  const unclaimed = !isLoading ? (supplyStats.find(item => item.title === "Unclaimed Rewards")?.amount || 0) : 0;
  const dao = !isLoading ? (supplyStats.find(item => item.title === "DAO Treasury")?.amount || 0) : 0;

  // Compute circulating supply
  const circulatingSupply = totalSupply - locked - unclaimed - dao;

  // Format number for display
  const formatNumber = (number) => {
    return number.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 1 
    });
  };

  // Handle tooltip positioning
  const handleMouseEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Doughnut chart data
  const doughnutData = {
    labels: ['Locked', 'Unclaimed', 'Circulating', 'DAO'],
    datasets: [
      {
        data: [locked, unclaimed, circulatingSupply, dao],
        backgroundColor: ['rgba(255, 100, 150, 1)', 'rgba(150, 70, 255, 1)', 'rgba(120, 160, 255, 1)', 'rgba(50, 200, 125, 1)'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 3,
        hoverBorderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  // Line chart data with corrected stacking order (validators first so they show on top)
  const lineData = {
    labels: emissionsData.map(d => d.date),
    datasets: [
      {
        label: 'Workers',
        data: emissionsData.map(d => d.worker),
        backgroundColor: 'rgba(133, 222, 202, 0.6)',
        borderColor: '#85deca',
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
        label: 'DAO',
        data: emissionsData.map(d => d.dao),
        backgroundColor: 'rgba(113, 122, 222, 0.6)',
        borderColor: '#aa9eca',
        borderWidth: 2,
        fill: 'origin', // Fill from the bottom
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
          color: isDarkMode ? "white" : "black",
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: isSmallScreen ? 11 : 13,
          },
          padding: isSmallScreen ? 10 : 30,
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
    cutout: '40%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  // Line chart options with improved stacking
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: {
            size: isSmallScreen ? 10 : 12,
          },
        },
        grid: {
          color: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: isDarkMode ? "white" : "black",
          font: {
            size: isSmallScreen ? 10 : 12,
          },
          callback: function(value) {
            return formatNumber(value);
          }
        },
        grid: {
          color: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? "white" : "black",
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
    <div className="max-w-[1380px] w-full relative">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translateX(-50%) translateY(-100%)',
              zIndex: 1000,
            }}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none shadow-lg"
          >
            {showEmissionsChart 
              ? "Switch to Supply Distribution" 
              : "Switch to Projected Emissions"
            }
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Supply Stats and Chart Row */}
      <div className="flex md:flex-row flex-col mb-2">
         {/* Left: Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`flex flex-col items-center justify-center bg-neutral-200/20 dark:bg-neutral-900 rounded-xl border border-gray-600 dark:border-neutral-500 transition-all duration-500 
            ${showEmissionsChart ? 'lg:max-w-[600px] md:max-w-[460px]' : 'lg:max-w-[490px] max-w-[420px]'} 
            w-full`}
        >
          <div className="w-full flex justify-between items-center px-4">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl xs:text-2xl font-bold text-neutral-800 dark:text-white mt-3 sm:mt-2"
            >
              {showEmissionsChart ? "Projected Emissions (SNO)" : "Supply Distribution (SNO)"}
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              aria-label="Toggle chart"
              onClick={() => setShowEmissionsChart(!showEmissionsChart)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="mt-4 p-2 rounded-full hover:bg-gray-400 transition-colors relative"
            >
              <svg className="w-6 h-6 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </motion.button>
          </div>

          <div style={{ width: '100%', height: isSmallScreen ? '240px' : '300px', paddingLeft: '60px', padding: isSmallScreen ? '0px' : '15px' }}>
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
                  className="p-3 overflow-visible"
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

        {/* Supply Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-gray-600 dark:border-gray-500 p-2 xs:p-4 w-full max-w-[600px] mt-2 md:mt-0 md:ml-2
            ${showEmissionsChart ? '' : ''}`}
        >
          <h2 className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white mb-2 xs:mb-3 py-1">Supply & Emissions</h2>
          
          {/* Total Supply - Featured */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-4 bg-gradient-to-r from-gray-100 to-gray-100 dark:from-zinc-800 dark:to-neutral-800 rounded-lg max-w-[285px] border border-gray-300 dark:border-gray-500"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Supply</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(totalSupply)}
              </span>
              <span className="text-lg text-gray-500 dark:text-gray-400">SNO</span>
            </div>
          </motion.div>

          {/* Other Stats Grid */}
          <div className="flex flex-wrap gap-1 xs:gap-2 mt-1 xs:mt-2 ">
            {supplyStats.filter(item => item.title !== "Total Supply").map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="p-2 lg:p-3 border border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-zinc-800 rounded-lg max-w-[130px] md:min-w-[155px] lg:min-w-[150px] lg:max-w-[165px] flex-1"
              >
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  {item.title}
                </p>
                <p className="text-md md:text-xl font-semibold text-gray-900 dark:text-white flex items-baseline gap-1">
                  {formatValue(item.amount)}
                  {item.suffix && (
                    <span className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                      {item.suffix}
                    </span>
                  )}
                </p>
              </motion.div>
            ))}
          </div>

        </motion.div>
    
      </div>
        
      {/* Proposals Section - Grid Layout */}
      <div className="flex flex-col md:flex-row gap-2 mt-2 mx-auto">
                {/* Contract Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-shrink-0 w-full md:w-[450px] bg-gray-200 dark:bg-zinc-800 rounded-lg min-w-[250px] max-w-[450px] dark:text-gray-200 p-5 border border-black/20 dark:border-gray-500"
        >
          <h1 className="font-bold text-xl md:text-2xl dark:text-white mb-3">Contract Addresses</h1>
          <div className="space-y-3">
            {/* Token Contract */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <MdMonetizationOn className="text-green-500 text-lg" />
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">Token Contract</span>
                <MdVerified className="text-green-500 text-sm" />
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                <code className="text-xs font-mono flex-1 break-all">{tokenAddress}</code>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(tokenAddress, 'token')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="Copy address"
                  >
                    <MdCheck className="text-green-500 text-sm" />
                  </button>
                  <a
                    href={`${explorerBase}${tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="View on explorer"
                  >
                    <MdLaunch className="text-blue-500 text-sm" />
                  </a>
                </div>
              </div>
            </div>

            {/* Core Contract */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <MdLink className="text-blue-500 text-lg" />
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">Core Contract</span>
                <MdVerified className="text-green-500 text-sm" />
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                <code className="text-xs font-mono flex-1 break-all">{coreAddress}</code>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(coreAddress, 'contract')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="Copy address"
                  >
                    <MdCheck className="text-green-500 text-sm" />
                  </button>
                  <a
                    href={`${explorerBase}${coreAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="View on explorer"
                  >
                    <MdLaunch className="text-blue-500 text-sm" />
                  </a>
                </div>
              </div>
            </div>

            {/* Multisig Contract */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <MdSecurity className="text-red-500 text-lg" />
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">Multisig Contract</span>
                <MdVerified className="text-green-500 text-sm" />
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                <code className="text-xs font-mono flex-1 break-all">{coordinatorAddress}</code>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(coordinatorAddress, 'multisig')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="Copy address"
                  >
                    <MdCheck className="text-green-500 text-sm" />
                  </button>
                  <a
                    href={`${explorerBase}${coordinatorAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="View on explorer"
                  >
                    <MdLaunch className="text-blue-500 text-sm" />
                  </a>
                </div>
              </div>
            </div>

            {/* DAO Contract */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <MdLibraryAddCheck className="text-purple-500 text-lg" />
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">DAO Contract</span>
                <MdVerified className="text-green-500 text-sm" />
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                <code className="text-xs font-mono flex-1 break-all">{daoAddress}</code>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(daoAddress, 'token')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="Copy address"
                  >
                    <MdCheck className="text-green-500 text-sm" />
                  </button>
                  <a
                    href={`${explorerBase}${daoAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    title="View on explorer"
                  >
                    <MdLaunch className="text-blue-500 text-sm" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex w-full min-w-0 flex-1"
        >
          <div className="w-full min-w-0">
            <ProposalsBarChart
              proposals={proposals}
              currentPage={currentPage}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              activeView={activeView}
              setActiveView={setActiveView}
              isDarkMode={isDarkMode}
              isSmallScreen={isSmallScreen}
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Table */}
      <div className="mt-2">
        <motion.div>
          <ProposalsTable
            proposals={proposals}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            isDarkMode={isDarkMode}
            isSmallScreen={isSmallScreen}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SupplyStatsCard;