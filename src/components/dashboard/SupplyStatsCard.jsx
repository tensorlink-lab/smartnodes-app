import React, { useState, useEffect } from "react";
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
import { MdLink, MdLibraryAddCheck, MdMonetizationOn, MdVerified, MdCheck, MdContentCopy, MdLaunch, MdSecurity } from "react-icons/md";

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
  const [copiedKey, setCopiedKey] = useState('');
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

  // Copies an address to the clipboard and briefly flips that row's icon
  // to a checkmark for feedback. (Previously imported — incorrectly — from
  // "react", which doesn't export it, so every copy button threw on click.)
  const copyToClipboard = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1500);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

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
    { date: "Dec 2025", genesis_nodes: 4000000, dao: 0, worker: 0, validator: 0},
    { date: "Dec 2026", genesis_nodes: 4000000, dao: 2458687.5, worker: 41797687.5, validator: 4917375},
    { date: "Dec 2027", genesis_nodes: 4000000, dao: 3933900, worker: 66876300, validator: 7867800},
    { date: "Dec 2028", genesis_nodes: 4000000, dao: 4819027.5, worker: 81923467.5, validator: 9638055},
    { date: "Dec 2029", genesis_nodes: 4000000, dao: 5350104, worker: 90951768, validator: 10700208},
    { date: "Dec 2030", genesis_nodes: 4000000, dao: 5668749.9, worker: 96368748.3, validator: 11337499.8},
    { date: "Dec 2031", genesis_nodes: 4000000, dao: 5859762.6, worker: 99615964.2, validator: 11719525.2},
    { date: "Dec 2032", genesis_nodes: 4000000, dao: 6015807.3, worker: 102268724.1, validator: 12031614.6},
    { date: "Dec 2033", genesis_nodes: 4000000, dao: 6171852, worker: 104921484, validator: 12343704},
    { date: "Dec 2034", genesis_nodes: 4000000, dao: 6327896.7, worker: 107574243.9, validator: 12655793.4},
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

  // Dashboard-wide accent palette, reused here so the supply breakdown reads
  // as part of the same system as the Ecosystem charts.
  const ACCENTS = {
    locked: '#F472B6',
    unclaimed: '#A78BFA',
    circulating: '#60A5FA',
    dao: '#34D399',
    workers: '#4FD8C4',
    validators: '#A78BFA',
  };

  // Doughnut chart data
  const doughnutData = {
    labels: ['Locked', 'Unclaimed', 'Circulating', 'DAO'],
    datasets: [
      {
        data: [locked, unclaimed, circulatingSupply, dao],
        backgroundColor: [ACCENTS.locked, ACCENTS.unclaimed, ACCENTS.circulating, ACCENTS.dao],
        borderColor: 'transparent',
        borderWidth: 0,
        hoverBorderWidth: 0,
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
        backgroundColor: `${ACCENTS.workers}33`,
        borderColor: ACCENTS.workers,
        borderWidth: 2,
        fill: 'origin',
        tension: 0.3,
      },
      {
        label: 'Validators',
        data: emissionsData.map(d => d.validator),
        backgroundColor: `${ACCENTS.validators}4D`,
        borderColor: ACCENTS.validators,
        borderWidth: 2,
        fill: '-1',
        tension: 0.3,
      },
      {
        label: 'DAO',
        data: emissionsData.map(d => d.dao),
        backgroundColor: `${ACCENTS.circulating}33`,
        borderColor: ACCENTS.circulating,
        borderWidth: 2,
        fill: 'origin', // Fill from the bottom
        tension: 0.3,
      },
    ],
  };

  const axisColor = isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const legendColor = isDarkMode ? '#EDEFF4' : '#111827';

  // Doughnut chart options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: isSmallScreen ? 'bottom' : 'left',
        labels: {
          color: legendColor,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: isSmallScreen ? 11 : 13,
          },
          padding: isSmallScreen ? 10 : 24,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 6,
          boxHeight: 6,
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
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 900,
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
          color: axisColor,
          font: {
            size: isSmallScreen ? 10 : 12,
          },
        },
        grid: {
          color: gridColor,
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: axisColor,
          font: {
            size: isSmallScreen ? 10 : 12,
          },
          callback: function(value) {
            return formatNumber(value);
          }
        },
        grid: {
          color: gridColor,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: legendColor,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: isSmallScreen ? 12 : 13,
          },
          padding: 12,
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
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
      duration: 900,
      easing: 'easeInOutQuart',
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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FD8C4]"></div>
    </motion.div>
  );

  // One row in the Contract Addresses card
  const ContractRow = ({ icon, label, address, copyId }) => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-gray-700 dark:text-[#9AA2B4]">{label}</span>
        <MdVerified className="text-emerald-500 text-sm" />
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] px-3 py-2">
        <code className="flex-1 break-all font-mono text-xs text-gray-600 dark:text-[#9AA2B4]">{address}</code>
        <div className="flex shrink-0 gap-1">
          <button
            onClick={() => copyToClipboard(address, copyId)}
            className="rounded-md p-1 text-gray-400 dark:text-[#8B93A7] transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.06]"
            title="Copy address"
          >
            {copiedKey === copyId ? (
              <MdCheck className="text-sm text-emerald-500" />
            ) : (
              <MdContentCopy className="text-sm" />
            )}
          </button>
          <a
            href={`${explorerBase}${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1 text-gray-400 dark:text-[#8B93A7] transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.06]"
            title="View on explorer"
          >
            <MdLaunch className="text-sm text-[#60A5FA]" />
          </a>
        </div>
      </div>
    </div>
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
            className="rounded-lg border border-white/10 bg-gray-900 dark:bg-[#12151c] px-3 py-2 text-xs font-medium text-white whitespace-nowrap pointer-events-none shadow-lg"
          >
            {showEmissionsChart
              ? "Switch to Supply Distribution"
              : "Switch to Projected Emissions"
            }
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-[#12151c]"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Supply Stats and Chart Row */}
      <div className="flex md:flex-row flex-col gap-2 mb-2">
        {/* Left: Chart */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`flex flex-col rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm p-4 sm:p-6 transition-all duration-500
            ${showEmissionsChart ? 'lg:max-w-[600px] md:max-w-[460px]' : 'lg:max-w-[490px] max-w-[420px]'}
            w-full`}
        >
          <div className="w-full flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#4FD8C4]" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
                  Supply
                </span>
              </div>
              <p className="font-bold text-lg sm:text-xl text-neutral-900 dark:text-[#EDEFF4]">
                {showEmissionsChart ? "Projected Emissions" : "Supply Distribution"}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle chart"
              onClick={() => setShowEmissionsChart(!showEmissionsChart)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-2 text-gray-500 dark:text-[#8B93A7] transition-colors hover:border-gray-300 dark:hover:border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </motion.button>
          </div>

          <div className="mt-2" style={{ width: '100%', height: isSmallScreen ? '240px' : '300px' }}>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <motion.div
                  key={showEmissionsChart ? 'line' : 'doughnut'}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
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

        {/* Supply Stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm p-4 sm:p-6 w-full max-w-[600px]"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#34D399]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
              Overview
            </span>
          </div>
          <h2 className="font-bold text-lg sm:text-xl text-neutral-900 dark:text-[#EDEFF4] mb-4">Supply &amp; Emissions</h2>

          {/* Total Supply - Featured */}
          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] backdrop-blur-sm px-4 py-3 max-w-[260px] mb-3">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-[#8B93A7] mb-1">Total Supply</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl xs:text-3xl font-bold text-neutral-900 dark:text-[#EDEFF4]">
                {formatNumber(totalSupply)}
              </span>
              <span className="text-sm text-gray-400 dark:text-[#5B6272]">SNO</span>
            </div>
          </div>

          {/* Other Stats Grid */}
          <div className="flex flex-wrap gap-2">
            {supplyStats.filter(item => item.title !== "Total Supply").map((item, index) => (
              <div
                key={index}
                className="flex-1 min-w-[130px] rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] backdrop-blur-sm px-4 py-3"
              >
                <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7] mb-1">
                  {item.title}
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-[#EDEFF4] flex items-baseline gap-1">
                  {formatValue(item.amount)}
                  {item.suffix && (
                    <span className="text-xs font-medium text-gray-400 dark:text-[#5B6272]">
                      {item.suffix}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Proposals Section */}
      <div className="flex flex-col md:flex-row gap-2 mt-2">
        {/* Contract Info */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-shrink-0 w-full md:w-[420px] min-w-[250px] max-w-[420px] rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#60A5FA]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
              Contracts
            </span>
          </div>
          <h1 className="font-bold text-lg sm:text-xl text-neutral-900 dark:text-[#EDEFF4] mb-4">Contract Addresses</h1>
          <div className="space-y-3">
            <ContractRow
              icon={<MdMonetizationOn className="text-emerald-500 text-base" />}
              label="Token Contract"
              address={tokenAddress}
              copyId="token"
            />
            <ContractRow
              icon={<MdLink className="text-[#60A5FA] text-base" />}
              label="Core Contract"
              address={coreAddress}
              copyId="core"
            />
            <ContractRow
              icon={<MdSecurity className="text-[#F472B6] text-base" />}
              label="Multisig Contract"
              address={coordinatorAddress}
              copyId="multisig"
            />
            <ContractRow
              icon={<MdLibraryAddCheck className="text-[#A78BFA] text-base" />}
              label="DAO Contract"
              address={daoAddress}
              copyId="dao"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
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
        <ProposalsTable
          proposals={proposals}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          ITEMS_PER_PAGE={ITEMS_PER_PAGE}
          isDarkMode={isDarkMode}
          isSmallScreen={isSmallScreen}
        />
      </div>
    </div>
  );
};

export default SupplyStatsCard;
