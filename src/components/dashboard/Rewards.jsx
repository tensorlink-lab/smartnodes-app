import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MdRefresh,
  MdAccountBalanceWallet,
} from 'react-icons/md';

const ClaimRewardsComponent = ({
  userAddress,
  claimData,
  setUnclaimed,
  ITEMS_PER_PAGE = 6,
}) => {
  const [loading, setLoading] = useState(false);
  const [totalRewards, setTotalRewards] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (claimData && claimData.length > 0) {
      const total = claimData.reduce((sum, claim) => {
        const workerReward = (claim.capacity / claim.total_capacity) * 45000 * 0.85;
        return sum + workerReward;
      }, 0);

      const formatted = Number(total.toFixed(2));
      setTotalRewards(formatted);
      setUnclaimed(formatted);
    } else {
      setTotalRewards(0);
      setUnclaimed(0);
    }
  }, [claimData, setUnclaimed]);

  const formatAddress = (address) => {
    if (!address) return '-';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Pagination logic
  const totalPages = Math.ceil(claimData.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentClaims = claimData.slice(startIndex, endIndex);

  const handleNextPage = () => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1);
  const handlePrevPage = () => currentPage > 0 && setCurrentPage(currentPage - 1);

  // Reset to first page when claimData changes
  useEffect(() => {
    setCurrentPage(0);
  }, [claimData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#60A5FA]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
              Rewards
            </span>
          </div>
          <h2 className="font-bold text-xl text-neutral-900 dark:text-[#EDEFF4] flex items-center gap-2">
            <MdAccountBalanceWallet className="text-[#60A5FA]" />
            Pending Rewards
          </h2>
        </div>
        <p className="text-xs text-gray-400 dark:text-[#5B6272] font-mono">
          {formatAddress(userAddress)}
        </p>
      </div>

      {/* Claims table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-[#5B6272]">
          <MdRefresh className="text-3xl animate-spin mb-2" />
          <p className="text-sm">Loading claim data...</p>
        </div>
      ) : claimData.length > 0 ? (
        <>
          {/* Pagination controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs text-gray-400 dark:text-[#5B6272]">
              Page {currentPage + 1} of {totalPages} · {claimData.length} claims
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

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="px-3 py-2.5 text-left text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7] font-medium">ID</th>
                  <th className="px-3 py-2.5 text-left text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7] font-medium">Worker</th>
                  <th className="px-3 py-2.5 text-right text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7] font-medium">Cap.</th>
                  <th className="px-3 py-2.5 text-right text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7] font-medium">Total</th>
                  <th className="px-3 py-2.5 text-right text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7] font-medium">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {currentClaims.map((claim) => {
                  const reward = ((claim.capacity / claim.total_capacity) * 6500).toFixed(2);
                  return (
                    <tr
                      key={claim.distribution_id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                    >
                      <td className="px-3 py-2.5 font-medium text-neutral-800 dark:text-[#EDEFF4]">#{claim.distribution_id}</td>
                      <td className="px-3 py-2.5 font-mono text-gray-500 dark:text-[#9AA2B4]">
                        {formatAddress(claim.worker)}
                      </td>
                      <td className="px-3 py-2.5 text-right text-[#60A5FA]">{claim.capacity}</td>
                      <td className="px-3 py-2.5 text-right text-gray-500 dark:text-[#9AA2B4]">{claim.total_capacity}</td>
                      <td className="px-3 py-2.5 text-right font-medium text-emerald-600 dark:text-emerald-400">{reward}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-gray-200 dark:border-white/10 py-12">
          <MdAccountBalanceWallet className="text-4xl text-gray-300 dark:text-[#3B4152] mb-2" />
          <p className="text-sm text-gray-500 dark:text-[#8B93A7] mb-1">
            No pending claims
          </p>
          <p className="text-xs text-gray-400 dark:text-[#5B6272]">
            {userAddress === '-'
              ? 'Connect your wallet to view claims'
              : 'Check back later for new distributions'}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ClaimRewardsComponent;
