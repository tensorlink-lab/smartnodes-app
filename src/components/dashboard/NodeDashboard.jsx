import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from "../../style.js";
import {
  MdComputer,
  MdVerifiedUser,
  MdAdd,
  MdError,
  MdRefresh,
  MdClose,
} from 'react-icons/md';
import { ConnectWalletButton, ClaimRewardsComponent, ActionMenu } from "..";

const NodeDashboard = ({
  claimInfo,
  userUnclaimed,
  setUserUnclaimed,
  fetchNetworkData,
  userAddress = "-",
  contract = null,
}) => {
  const [userJobs, setUserJobs] = useState([]);
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobType, setNewJobType] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [pubKeyHash, setPubKeyHash] = useState('');
  const [nodeSearchQuery, setNodeSearchQuery] = useState('');
  const [trackedNodes, setTrackedNodes] = useState([]);
  const [nodeSearchLoading, setNodeSearchLoading] = useState(false);
  const [nodeSearchError, setNodeSearchError] = useState('');
  const [claimableRewards, setClaimableRewards] = useState([]);
  const [fetchingClaims, setFetchingClaims] = useState(false);

  const mockActiveNodes = [
    {
      pubKeyHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      type: 'V',
      lastSeen: '2 minutes ago',
      data: {
        peers: 12,
        rewards: 1000.5,
        isActive: true
      }
    },
    {
      pubKeyHash: '0x8f3B9c4A7E2D1F5C6A8B9D0E3F4A5B6C7D8E9F0A',
      type: 'W',
      lastSeen: '5 minutes ago',
      data: {
        jobs_completed: 47,
        rewards: 235.8,
        isActive: true
      }
    },
    {
      pubKeyHash: '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B',
      type: 'V',
      lastSeen: '1 hour ago',
      data: {
        peers: 8,
        rewards: 500.0,
        isActive: false
      }
    }
  ];

  const mockUserJobs = [
    {
      id: 'job_001',
      type: 'Model Training',
      status: 'running',
      progress: 67,
      started: '2 hours ago',
      cost: '12.5 SNO',
      description: 'Training neural network for image classification'
    },
  ];

  // Load saved tracked nodes on mount
  useEffect(() => {
    const savedNodes = getStoredTrackedNodes();
    if (savedNodes.length > 0) {
      setTrackedNodes(savedNodes);
    }
  }, []);

  // Fetch claimable rewards for all tracked nodes
  useEffect(() => {
    if (trackedNodes.length > 0 && userAddress !== "-") {
      fetchClaimableRewards();
    }
  }, [trackedNodes, userAddress]);

  const fetchClaimableRewards = async () => {
    setFetchingClaims(true);
    try {
      const allClaims = [];

      for (const node of trackedNodes) {
        try {
          // Fetch claim data from your API endpoint
          const response = await fetch(`/api/rewards/claimable?pubKeyHash=${node.pubKeyHash}&address=${userAddress}`);

          if (response.ok) {
            const data = await response.json();
            if (data.claimable && data.claimable.length > 0) {
              allClaims.push({
                nodeId: node.pubKeyHash,
                claims: data.claimable
              });
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch claims for node ${node.pubKeyHash}:`, err);
        }
      }

      setClaimableRewards(allClaims);
    } catch (error) {
      console.error('Failed to fetch claimable rewards:', error);
    } finally {
      setFetchingClaims(false);
    }
  };

  const handleClaimRewards = async (nodeId, claims) => {
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      // Prepare arrays for batch claim
      const distributionIds = claims.map(claim => claim.distributionId);
      const capacities = claims.map(claim => claim.capacity);
      const merkleProofs = claims.map(claim => claim.merkleProof);

      // Call the smart contract
      const tx = await contract.batchClaimMerkleRewards(
        distributionIds,
        capacities,
        merkleProofs
      );

      // Wait for transaction confirmation
      await tx.wait();

      // Update UI
      alert('Rewards claimed successfully!');

      // Refresh claims data
      await fetchClaimableRewards();

      // Refresh network data if available
      if (fetchNetworkData) {
        await fetchNetworkData();
      }
    } catch (error) {
      console.error('Claim failed:', error);
      alert(`Failed to claim rewards: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSingleReward = async (nodeId, claim) => {
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.claimMerkleRewards(
        claim.distributionId,
        claim.capacity,
        claim.merkleProof
      );

      await tx.wait();
      alert('Reward claimed successfully!');

      await fetchClaimableRewards();
      if (fetchNetworkData) {
        await fetchNetworkData();
      }
    } catch (error) {
      console.error('Claim failed:', error);
      alert(`Failed to claim reward: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Storage helper functions
  const getStoredTrackedNodes = () => {
    try {
      const stored = sessionStorage.getItem('tensorlink_tracked_nodes');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Storage not available:', e);
      return [];
    }
  };

  const storeTrackedNodes = (nodes) => {
    try {
      sessionStorage.setItem('tensorlink_tracked_nodes', JSON.stringify(nodes));
    } catch (e) {
      console.warn('Storage not available:', e);
    }
  };

  const handleCreateJob = async () => {
    if (!newJobType.trim() || !newJobDescription.trim()) {
      alert('Please fill in all job details');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newJob = {
        id: `job_${Date.now()}`,
        type: newJobType,
        status: 'pending',
        progress: 0,
        started: 'Just now',
        cost: `${(Math.random() * 20 + 5).toFixed(1)} SNO`,
        description: newJobDescription
      };

      setUserJobs([newJob, ...userJobs]);
      setNewJobType('');
      setNewJobDescription('');
    } catch (error) {
      console.error('Job creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeLookup = async () => {
    if (!nodeSearchQuery.trim()) {
      setNodeSearchError("Please enter a valid node ID");
      return;
    }

    // Check if already tracking this node
    if (trackedNodes.some(node => node.pubKeyHash === nodeSearchQuery)) {
      setNodeSearchError('This node is already being tracked');
      return;
    }

    setNodeSearchLoading(true);
    setNodeSearchError('');

    try {
      const response = await fetch(`/node-info?pubkey_hash=${nodeSearchQuery}`);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('API endpoint not found. Please check your backend is running.');
        }
        throw new Error(`Node not found (Status: ${response.status})`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response from server. Expected JSON but received HTML.');
      }

      const data = await response.json();

      // Add to tracked nodes
      const newTrackedNode = {
        pubKeyHash: nodeSearchQuery,
        data: data,
        addedAt: Date.now()
      };

      const updatedNodes = [...trackedNodes, newTrackedNode];
      setTrackedNodes(updatedNodes);
      storeTrackedNodes(updatedNodes);

      // Clear search input
      setNodeSearchQuery('');
    } catch (error) {
      console.error('Node lookup error:', error);
      setNodeSearchError(error.message || 'Failed to find node on the network');
    } finally {
      setNodeSearchLoading(false);
    }
  };

  const handleRemoveNode = (pubKeyHash) => {
    const updatedNodes = trackedNodes.filter(node => node.pubKeyHash !== pubKeyHash);
    setTrackedNodes(updatedNodes);
    storeTrackedNodes(updatedNodes);
  };

  const handleRefreshAllNodes = async () => {
    if (trackedNodes.length === 0) return;
    setLoading(true);

    try {
      const refreshed = await Promise.all(
        trackedNodes.map(async (node) => {
          try {
            const response = await fetch(`/node-info?pubkey_hash=${node.pubKeyHash}`);
            if (!response.ok) throw new Error(`Failed to fetch ${node.pubKeyHash}`);

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json"))
              throw new Error("Invalid server response");

            const data = await response.json();
            return { ...node, data, lastUpdated: Date.now() };
          } catch (err) {
            console.warn(`Node ${node.pubKeyHash} refresh failed:`, err);
            return node; // return old node if refresh fails
          }
        })
      );

      setTrackedNodes(refreshed);
      storeTrackedNodes(refreshed);
    } catch (error) {
      console.error("Failed to refresh all nodes:", error);
      alert("Failed to refresh all nodes. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const NodeCard = ({ node }) => {
    const isActive = node.data?.isActive ?? false;
    const nodeType = node.data?.type || node.type || 'unknown';
    const nodeClaims = claimableRewards.find(c => c.nodeId === node.pubKeyHash);
    const totalClaimable = nodeClaims?.claims.reduce((sum, claim) => sum + parseFloat(claim.amount || 0), 0) || 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] backdrop-blur-sm px-4 py-3 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {nodeType === 'validator' ? (
              <MdVerifiedUser className="text-[#34D399]" size={18} />
            ) : (
              <MdComputer className="text-[#60A5FA]" size={18} />
            )}
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-[#EDEFF4]">
              {node.pubKeyHash.slice(0, 6)}...{node.pubKeyHash.slice(-4)}
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                isActive
                  ? 'border-emerald-200 dark:border-emerald-400/20 bg-emerald-50 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300'
                  : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-[#8B93A7]'
              }`}
            >
              {isActive && (
                <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                  <motion.span
                    className="absolute h-1.5 w-1.5 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.55, 0, 0.55] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  />
                  <span className="relative h-1 w-1 rounded-full bg-emerald-400" />
                </span>
              )}
              {isActive ? 'ACTIVE' : 'OFFLINE'}
            </span>
            <button
              onClick={() => handleRemoveNode(node.pubKeyHash)}
              className="rounded-md p-1 text-gray-400 dark:text-[#5B6272] transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-red-500"
              title="Remove node"
            >
              <MdClose size={15} />
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7]">Last Seen</p>
            <p className="mt-0.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">{node.lastSeen || 'Just now'}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7]">Type</p>
            <p className="mt-0.5 text-sm font-medium text-neutral-800 dark:text-[#EDEFF4]">{nodeType === "V" ? "Validator" : "Worker"}</p>
          </div>
        </div>

        {nodeType === 'W' && node.data && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7]">Rewards</p>
              <p className="mt-0.5 text-sm font-medium text-[#60A5FA]">{node.data.rewards || 0} SNO</p>
            </div>
          </div>
        )}

        {/* Claimable rewards */}
        {nodeClaims && nodeClaims.claims.length > 0 && (
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-3">
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 dark:text-[#8B93A7]">Claimable Rewards</p>
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                {totalClaimable.toFixed(4)} SNO
              </p>
              <p className="text-xs text-gray-400 dark:text-[#5B6272]">
                {nodeClaims.claims.length} distribution{nodeClaims.claims.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => handleClaimRewards(node.pubKeyHash, nodeClaims.claims)}
              disabled={loading || !contract}
              className="flex items-center gap-2 rounded-full bg-[#4FD8C4] px-4 py-2 text-sm font-medium text-[#0A0D13] transition-colors hover:bg-[#6EE2D1] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <MdRefresh className="animate-spin" />
                  Claiming...
                </>
              ) : (
                'Claim All'
              )}
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="w-full mt-2 max-w-[1380px]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid gap-4 lg:grid-cols-2 lg:gap-6 mb-6"
      >
        {/* Tracked nodes */}
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-px w-4 bg-gradient-to-r from-transparent to-[#60A5FA]" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 dark:text-[#8B93A7]">
                  Monitoring
                </span>
              </div>
              <h2 className="font-bold text-xl text-neutral-900 dark:text-[#EDEFF4] flex items-center gap-2">
                <MdComputer className="text-[#60A5FA]" />
                My Nodes ({trackedNodes.length})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchClaimableRewards}
                disabled={fetchingClaims || trackedNodes.length === 0}
                className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-2 text-gray-500 dark:text-[#8B93A7] transition-colors hover:border-gray-300 dark:hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Refresh claims"
              >
                <MdRefresh className={fetchingClaims ? 'animate-spin' : ''} size={18} />
              </button>
              <ActionMenu />
            </div>
          </div>

          {/* Tutorial banner */}
          <div className="mb-4 rounded-xl border border-dashed border-[#4FD8C4]/30 bg-[#4FD8C4]/5 px-3.5 py-2.5 text-sm text-gray-600 dark:text-[#9AA2B4]">
            New to Tensorlink? Learn how to set up your own{' '}
            <a
              href="/tensorlink/docs/mining"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#0FA894] dark:text-[#4FD8C4] underline underline-offset-2 hover:text-[#0c8a79] dark:hover:text-[#6EE2D1]"
            >
              Worker Node
            </a>{' '}
            in just a few minutes.
          </div>

          {/* Add node input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={nodeSearchQuery}
              onChange={(e) => setNodeSearchQuery(e.target.value)}
              placeholder="Enter node ID to track..."
              className="min-w-[100px] flex-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm text-gray-900 dark:text-[#EDEFF4] placeholder:text-gray-400 dark:placeholder:text-[#5B6272] focus:outline-none focus:ring-2 focus:ring-[#4FD8C4]/40 focus:border-[#4FD8C4]/40"
              onKeyPress={(e) => e.key === 'Enter' && handleNodeLookup()}
            />
            <button
              onClick={handleNodeLookup}
              disabled={nodeSearchLoading}
              className="flex items-center gap-2 rounded-lg bg-[#4FD8C4] px-4 py-2.5 text-sm font-medium text-[#0A0D13] transition-colors hover:bg-[#6EE2D1] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {nodeSearchLoading ? <MdRefresh className="animate-spin" size={18} /> : <MdAdd size={18} />}
            </button>
          </div>

          {nodeSearchError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-400/20 bg-red-50 dark:bg-red-400/10 px-3 py-2.5 text-sm text-red-700 dark:text-red-300">
              <MdError className="shrink-0" />
              <span>{nodeSearchError}</span>
            </div>
          )}

          {/* Tracked nodes list */}
          {trackedNodes.length > 0 ? (
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {trackedNodes.map((node) => (
                  <NodeCard key={node.pubKeyHash} node={node} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 dark:border-white/10 py-10 text-center">
              <MdComputer className="mx-auto mb-3 text-4xl text-gray-300 dark:text-[#3B4152]" />
              <p className="mb-1 text-sm text-gray-500 dark:text-[#8B93A7]">
                No nodes tracked yet.
              </p>
              <p className="text-xs text-gray-400 dark:text-[#5B6272]">
                Enter your node's ID above to start monitoring it.
              </p>
            </div>
          )}
        </div>

        <ClaimRewardsComponent
          claimData={claimInfo}
          userAddress={userAddress}
          setUnclaimed={setUserUnclaimed}
        />
      </motion.div>

      <AnimatePresence>
        {showSignupModal && <div>Signup Modal</div>}
      </AnimatePresence>
    </div>
  );
};

export default NodeDashboard;
