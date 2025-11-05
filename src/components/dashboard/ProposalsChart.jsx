import React, { useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion"; 
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


const ProposalsTable = ({ proposals, currentPage, setCurrentPage, ITEMS_PER_PAGE, isDarkMode, isSmallScreen }) => {
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

  const formatCapacity = (bytes) => {
    if (!bytes) return '0 GB';
    const gb = bytes / (1024 ** 3);
    if (gb >= 1024) return `${(gb / 1024).toFixed(2)} TB`;
    return `${gb.toFixed(2)} GB`;
  };

  const formatNumber = (num) => num?.toLocaleString() || '0';

  const handleNextPage = () => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1);
  const handlePrevPage = () => currentPage > 0 && setCurrentPage(currentPage - 1);

  return (
    <div className="bg-neutral-200/20 dark:bg-neutral-800/50 rounded-xl border border-gray-600 dark:border-neutral-500 p-3 overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Proposal Details</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Page {currentPage + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button onClick={handlePrevPage} disabled={currentPage === 0} className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">←</button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages - 1} className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">→</button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b-2 border-gray-400 dark:border-gray-600">
              <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Dist</th>
              <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Hash</th>
              <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Capacity</th>
              <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Workers</th>
              <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Jobs</th>
              <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Validators</th>
            </tr>
          </thead>
          <tbody>
            {currentProposals.map((p, idx) => (
              <tr key={p.fullId} className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors">
                <td className="py-2 px-2 font-semibold text-gray-800 dark:text-gray-200">{p.distributionId}</td>
                <td className="py-2 px-2 font-mono text-xs text-gray-700 dark:text-gray-300">{p.fullId.slice(0, 10)}...</td>
                <td className="py-2 px-2 text-right font-medium text-blue-600 dark:text-blue-400">{formatCapacity(p.totalCapacity)}</td>
                <td className="py-2 px-2 text-right font-medium text-purple-600 dark:text-purple-400">{p.totalWorkers}</td>
                <td className="py-2 px-2 text-right font-medium text-pink-600 dark:text-pink-400">{p.jobCount}</td>
                <td className="py-2 px-2 text-right text-gray-800 dark:text-gray-200">{p.validatorCount}</td>
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
    validatorCount: data.validators?.length || 0,
  }));
  proposalEntries.sort((a, b) => Number(b.distributionId || 0) - Number(a.distributionId || 0));

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProposals = proposalEntries.slice(startIndex, endIndex);

  const chartProposals = [...currentProposals].reverse(); // ascending for graph

  const getChartData = () => ({
    labels: chartProposals.map(p => `Dist ${p.distributionId}`),
    datasets: [{
      label: activeView === 'capacity' ? 'Capacity (GB)' : activeView === 'workers' ? 'Workers' : 'Jobs',
      data: chartProposals.map(p => activeView === 'capacity' ? (p.totalCapacity / 1024 ** 3).toFixed(2) : activeView === 'workers' ? p.totalWorkers : p.jobCount),
      backgroundColor: 'rgba(59,130,246,0.7)',
      borderColor: 'rgba(59,130,246,1)',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true }, x: { beginAtZero: true } },
  };

  return (
    <div className="bg-neutral-200/20 dark:bg-neutral-900 rounded-xl border border-gray-600 dark:border-neutral-500 p-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm xs:text-lg font-bold text-gray-900 dark:text-white">Proposal Metrics</h3>
        <div className="flex gap-1">
          <button onClick={() => setActiveView('capacity')} className={`${activeView==='capacity'?'bg-blue-500 text-white':'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} px-2 py-1 rounded-md text-xs`}>Capacity</button>
          <button onClick={() => setActiveView('workers')} className={`${activeView==='workers'?'bg-purple-500 text-white':'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} px-2 py-1 rounded-md text-xs`}>Workers</button>
          <button onClick={() => setActiveView('jobs')} className={`${activeView==='jobs'?'bg-pink-500 text-white':'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} px-2 py-1 rounded-md text-xs`}>Jobs</button>
        </div>
      </div>
      <div style={{ height: isSmallScreen ? '200px' : '350px' }}>
        <Bar data={getChartData()} options={chartOptions} />
      </div>
    </div>
  );
};

export { ProposalsTable, ProposalsBarChart };
