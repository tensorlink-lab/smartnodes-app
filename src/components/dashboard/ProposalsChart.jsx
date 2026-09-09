import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title
);

// Shared with the bar chart's per-metric accent so the pill toggle and the
// bars themselves always agree on color, and so it lines up with the same
// accents used for Workers/Jobs/Capacity on the Ecosystem dashboard.
const METRIC_META = {
  capacity: { label: 'Capacity', accent: '#60A5FA' },
  workers: { label: 'Workers', accent: '#4FD8C4' },
  jobs: { label: 'Jobs', accent: '#F472B6' },
};

const formatCapacity = (bytes) => {
  if (!bytes) return '0 GB';
  const gb = bytes / (1024 ** 3);
  if (gb >= 1024) return `${(gb / 1024).toFixed(2)} TB`;
  return `${gb.toFixed(2)} GB`;
};

const ProposalsTable = ({ proposals, currentPage, setCurrentPage, ITEMS_PER_PAGE }) => {
  const proposalEntries = Object.entries(proposals).map(([key, data]) => ({
    id: key.slice(0, 8) + '...',
    fullId: key,
    totalCapacity: data.total_capacity?.[0] || 0,
    totalWorkers: data.total_workers?.[0] || 0,
    jobCount: data.job_hashes?.length || 0,
    validatorCount: data.validators?.length || 0,
    distributionId: data.distribution_id,
  }));
  proposalEntries.sort((a, b) => Number(b.distributionId || 0) - Number(a.distributionId || 0));

  const totalPages = Math.ceil(proposalEntries.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProposals = proposalEntries.slice(startIndex, endIndex);

  const handleNextPage = () => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1);
  const handlePrevPage = () => currentPage > 0 && setCurrentPage(currentPage - 1);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#A78BFA]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
              Proposals
            </span>
          </div>
          <h3 className="font-bold text-lg text-neutral-900 dark:text-[#EDEFF4]">Proposal Details</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-[#5B6272]">
            Page {currentPage + 1} of {totalPages || 1}
          </span>
          <div className="inline-flex items-center gap-0.5 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-0.5">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="rounded-full px-3 py-1 text-xs font-medium text-gray-500 dark:text-[#8B93A7] transition-colors hover:text-gray-800 dark:hover:text-[#EDEFF4] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="rounded-full px-3 py-1 text-xs font-medium text-gray-500 dark:text-[#8B93A7] transition-colors hover:text-gray-800 dark:hover:text-[#EDEFF4] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10">
              <th className="text-left py-2.5 px-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7] font-medium">Dist</th>
              <th className="text-left py-2.5 px-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7] font-medium">Hash</th>
              <th className="text-right py-2.5 px-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7] font-medium">Capacity</th>
              <th className="text-right py-2.5 px-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7] font-medium">Workers</th>
              <th className="text-right py-2.5 px-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7] font-medium">Jobs</th>
              <th className="text-right py-2.5 px-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7] font-medium">Validators</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {currentProposals.map((p) => (
              <tr key={p.fullId} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                <td className="py-2.5 px-3 font-medium text-neutral-800 dark:text-[#EDEFF4]">{p.distributionId}</td>
                <td className="py-2.5 px-3 font-mono text-gray-500 dark:text-[#9AA2B4]">{p.fullId.slice(0, 10)}...</td>
                <td className="py-2.5 px-3 text-right font-medium text-[#60A5FA]">{formatCapacity(p.totalCapacity)}</td>
                <td className="py-2.5 px-3 text-right font-medium text-[#4FD8C4]">{p.totalWorkers}</td>
                <td className="py-2.5 px-3 text-right font-medium text-[#F472B6]">{p.jobCount}</td>
                <td className="py-2.5 px-3 text-right text-gray-500 dark:text-[#9AA2B4]">{p.validatorCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProposalsBarChart = ({ proposals, currentPage, ITEMS_PER_PAGE, activeView, setActiveView, isDarkMode, isSmallScreen }) => {
  const proposalEntries = Object.entries(proposals).map(([key, data]) => ({
    fullId: key,
    distributionId: data.distribution_id,
    totalCapacity: data.total_capacity?.[0] || 0,
    totalWorkers: data.total_workers?.[0] || 0,
    jobCount: data.job_hashes?.length || 0,
  }));
  proposalEntries.sort((a, b) => Number(b.distributionId || 0) - Number(a.distributionId || 0));

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProposals = proposalEntries.slice(startIndex, endIndex);

  const chartProposals = [...currentProposals].reverse(); // ascending for graph

  const accent = METRIC_META[activeView].accent;
  const axisColor = isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  const getChartData = () => ({
    labels: chartProposals.map(p => `Dist ${p.distributionId}`),
    datasets: [{
      label: activeView === 'capacity' ? 'Capacity (GB)' : activeView === 'workers' ? 'Workers' : 'Jobs',
      data: chartProposals.map(p => activeView === 'capacity' ? (p.totalCapacity / 1024 ** 3).toFixed(2) : activeView === 'workers' ? p.totalWorkers : p.jobCount),
      backgroundColor: `${accent}B3`,
      borderColor: accent,
      borderWidth: 1.5,
      borderRadius: 6,
      borderSkipped: false,
    }]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: true, color: gridColor },
        ticks: { color: axisColor, font: { size: 11 } },
      },
      x: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { color: axisColor, font: { size: 11 } },
      },
    },
    animation: { duration: 700, easing: 'easeInOutQuart' },
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm p-4 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#A78BFA]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
              Proposals
            </span>
          </div>
          <h3 className="font-bold text-lg text-neutral-900 dark:text-[#EDEFF4]">Proposal Metrics</h3>
        </div>
        <div className="inline-flex items-center gap-0.5 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-0.5">
          {Object.entries(METRIC_META).map(([key, meta]) => {
            const isActive = activeView === key;
            return (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-gray-900 text-white dark:bg-white/10 dark:text-[#EDEFF4]'
                    : 'text-gray-500 dark:text-[#8B93A7] hover:text-gray-800 dark:hover:text-[#EDEFF4]'
                }`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ height: isSmallScreen ? '200px' : '350px' }}>
        <Bar data={getChartData()} options={chartOptions} />
      </div>
    </div>
  );
};

export { ProposalsTable, ProposalsBarChart };
