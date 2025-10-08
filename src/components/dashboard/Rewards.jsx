import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MdCheckCircle, 
  MdError,
  MdRefresh,
  MdAccountBalanceWallet,
  MdVerifiedUser
} from 'react-icons/md';

const ClaimRewardsComponent = ({ 
  userAddress,
  claimData,
  setUnclaimed
}) => {
  const [loading, setLoading] = useState(false);
  const [totalRewards, setTotalRewards] = useState(0); // total SNO available to claim

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 border border-gray-300 dark:border-gray-600"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
          <MdAccountBalanceWallet className="text-blue-500" />
          Pending Rewards
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatAddress(userAddress)}
        </p>
      </div>

      {/* Claims Table */}
      {loading ? (
        <div className="text-center py-6">
          <MdRefresh className="text-3xl text-gray-300 animate-spin mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading claim data...</p>
        </div>
      ) : claimData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-zinc-700 border-b border-gray-300 dark:border-gray-600">
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">ID</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Worker</th>
                <th className="px-3 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">Cap.</th>
                <th className="px-3 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">Total</th>
                <th className="px-3 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {claimData.map((claim) => {
                const reward = ((claim.capacity / claim.total_capacity) * 6500).toFixed(2);
                return (
                  <tr 
                    key={claim.distribution_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-3 py-2 text-gray-900 dark:text-white font-medium">#{claim.distribution_id}</td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-300 font-mono">
                      {formatAddress(claim.worker)}
                    </td>
                    <td className="px-3 py-2 text-right text-blue-600 dark:text-blue-400">{claim.capacity}</td>
                    <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-300">{claim.total_capacity}</td>
                    <td className="px-3 py-2 text-right text-green-600 dark:text-green-400">{reward}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <MdAccountBalanceWallet className="text-4xl text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            No pending claims
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
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
