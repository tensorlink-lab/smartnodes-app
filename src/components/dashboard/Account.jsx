import { motion, AnimatePresence } from "framer-motion";
import { MdCheckCircle, MdError } from "react-icons/md";
import { ActionMenu, ConnectWalletButton } from "..";
import { useState } from "react";

const formatSNO = (value) => {
  if (isNaN(Number(value))) return null;
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
};

const StatTile = ({ label, value }) => (
  <div className="flex min-w-[140px] flex-1 flex-col rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] backdrop-blur-sm px-4 py-3 shadow-sm">
    <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-[#8B93A7]">
      {label}
    </span>
    <span className="mt-1 text-xl font-semibold text-neutral-900 dark:text-[#EDEFF4]">
      {value === null ? '—' : (
        <>
          {value}
          <span className="ml-1 text-xs font-medium text-gray-400 dark:text-[#5B6272]">SNO</span>
        </>
      )}
    </span>
  </div>
);

const Account = ({
  handleActionClick,
  userAddress,
  userBalance,
  userLocked,
  userUnclaimed,
  connectToContract,
  connectToCoinbaseWallet,
  contract,
  claimData,
}) => {
  const [claiming, setClaiming] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleBatchClaim = async () => {
    if (!contract) {
      setError('Contract not initialized. Please connect your wallet.');
      return;
    }

    if (claimData.length === 0) {
      setError('No claims available');
      return;
    }

    setClaiming(true);
    setError('');
    setStatus('Preparing batch claim transaction...');

    try {
      const distributionIds = claimData.map(item => item.distribution_id);
      const capacities = claimData.map(item => item.capacity);
      const merkleProofs = claimData.map(item => item.merkle_proof || []);

      setStatus('Submitting transaction...');

      const tx = await contract.batchClaimMerkleRewards(
        distributionIds,
        capacities,
        merkleProofs
      );

      setStatus('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      setStatus('Rewards claimed successfully!');
    } catch (err) {
      console.error('Error claiming rewards:', err);
      setError(err.message || 'Failed to claim rewards. Please try again.');
      setStatus('');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative mb-4 max-w-[700px] rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#4FD8C4]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
              Wallet
            </span>
          </div>
          <h1 className="font-bold text-xl sm:text-2xl text-neutral-900 dark:text-[#EDEFF4]">
            Account
          </h1>
        </div>
        {/* <ActionMenu onActionClick={handleActionClick} /> */}
      </div>

      {/* Address */}
      <div className="mb-4">
        <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-[#8B93A7]">
          Address
        </span>
        <p className="mt-1 overflow-auto text-sm sm:text-base font-medium text-neutral-800 dark:text-[#EDEFF4]">
          {userAddress ? userAddress : "No address connected"}
        </p>
      </div>

      {/* Balance / Locked / Unclaimed */}
      <div className="flex flex-wrap gap-3 mb-4">
        <StatTile label="Balance" value={formatSNO(userBalance)} />
        <StatTile label="Locked" value={formatSNO(userLocked)} />
        <StatTile label="Unclaimed Rewards" value={formatSNO(userUnclaimed)} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <ConnectWalletButton
          connectToContract={connectToContract}
          connectToCoinbaseWallet={connectToCoinbaseWallet}
          contract={contract}
        />
        <button
          onClick={handleBatchClaim}
          disabled={claiming}
          className="rounded-full bg-[#4FD8C4] px-4 py-2 text-sm font-medium text-[#0A0D13] transition-colors hover:bg-[#6EE2D1] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {claiming ? 'Claiming…' : 'Claim Rewards'}
        </button>
      </div>

      {/* Status / Error messages */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-4 flex items-center gap-2 rounded-lg border border-[#4FD8C4]/30 bg-[#4FD8C4]/10 px-3 py-2.5 text-sm text-emerald-700 dark:text-emerald-300"
          >
            <MdCheckCircle className="shrink-0" />
            <span>{status}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-400/20 bg-red-50 dark:bg-red-400/10 px-3 py-2.5 text-sm text-red-700 dark:text-red-300"
          >
            <MdError className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Account;
