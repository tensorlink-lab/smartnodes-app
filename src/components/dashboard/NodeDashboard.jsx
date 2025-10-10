import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from "../../style.js";
import { 
  MdComputer, 
  MdVerifiedUser, 
  MdPerson, 
  MdAdd, 
  MdCheckCircle, 
  MdError,
  MdRefresh,
  MdTrendingUp,
  MdSchedule,
  MdAssignment,
  MdSave,
  MdPlayArrow,
  MdClose,
  MdLogin
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
    } else {
      setTrackedNodes(trackedNodes);
    }
  }, []);

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
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-neutral-50 dark:bg-gray-700 p-2 sm:p-4 rounded-lg border border-gray-300 dark:border-gray-600"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {nodeType === 'validator' ? (
              <MdVerifiedUser className="text-green-500" size={20} />
            ) : (
              <MdComputer className="text-blue-500" size={20} />
            )}
            <h3 className="font-semibold dark:text-white text-sm">
              {node.pubKeyHash.slice(0, 6)}...{node.pubKeyHash.slice(-4)}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <div className={`px-2 py-1 rounded-full text-[9px] xs:text-xs font-semibold ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isActive ? 'ACTIVE' : 'OFFLINE'}
            </div>
            <button
              onClick={() => handleRemoveNode(node.pubKeyHash)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="Remove node"
            >
              <MdClose className="text-red-600 dark:text-red-400" size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Last Seen</p>
            <p className="font-semibold text-green-600 text-sm">{node.lastSeen || 'Just now'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
            <p className="font-semibold dark:text-white capitalize text-sm">{nodeType === "V" ? "Validator" : "Worker"}</p>
          </div>
        </div>

        {nodeType === 'V' && node.data && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Peers</p>
              <p className="font-semibold dark:text-white">{node.data.peers || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rewards</p>
              <p className="font-semibold text-blue-600">{node.data.rewards || 0} SNO</p>
            </div> */}
          </div>
        )}

        {nodeType === 'W' && node.data && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rewards</p>
              <p className="font-semibold text-blue-600">{node.data.rewards || 0} SNO</p>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="mt-2 max-w-[1380px] items-center w-full flex-wrap">
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-neutral-100 mb-10 dark:bg-neutral-900 rounded-xl dark:text-gray-200 p-0 xs:p-4 overflow-x-auto border border-black dark:border-gray-400 grid max-w-[1300px] relative lg:grid-cols-2 gap-1"
      >
        {/* Tracked Nodes Section */}
        <div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-2 sm:px-4 sm:pb-4 border border-gray-300 dark:border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                <MdComputer className="text-blue-500" />
                My Nodes ({trackedNodes.length})
              </h2>
              <ActionMenu />
            </div>
            
            {/* Add Node Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={nodeSearchQuery}
                onChange={(e) => setNodeSearchQuery(e.target.value)}
                placeholder="Enter node ID to track..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px]"
                onKeyPress={(e) => e.key === 'Enter' && handleNodeLookup()}
              />
              <button
                onClick={handleNodeLookup}
                disabled={nodeSearchLoading}
                className="px-3.5 py-3 bg-blue-500 hover:bg-blue-600 text-white sm:text-xl rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {nodeSearchLoading ? (
                  <>
                    <MdRefresh className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <MdAdd />
                  </>
                )}
              </button>
            </div>

            {nodeSearchError && (
              <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg mb-4">
                <MdError />
                <span>{nodeSearchError}</span>
              </div>
            )}

            {/* Tracked Nodes List */}
            {trackedNodes.length > 0 ? (
              <div className="flex flex-col items-center gap-3">
                <AnimatePresence>
                  {trackedNodes.map((node) => (
                    <div className="w-full">
                      <NodeCard key={node.pubKeyHash} node={node} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <MdComputer className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  No nodes tracked yet.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Enter your node's ID above to start monitoring it.
                </p>
              </div>
            )}
          </div>
        </div>

        <ClaimRewardsComponent 
          claimData={claimInfo} 
          userAddress={userAddress}
          setUnclaimed={setUserUnclaimed}
        />

        {/* User Jobs Section */}
        {/* <div className="space-y-4 mt-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-600">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 dark:text-white">
              <MdAssignment className="text-purple-500" />
              Your Jobs ({userJobs.length})
            </h2>
            
            {userJobs.length > 0 ? (
              <div className="space-y-3">
                {userJobs.map((job) => (
                  <div key={job.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold dark:text-white">{job.type}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        job.status === 'running' ? 'bg-orange-100 text-orange-800' :
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {job.status.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{job.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{job.id}</span>
                      <span>{job.started}</span>
                      <span>{job.cost}</span>
                    </div>
                    {job.status === 'running' && (
                      <div className="mt-2">
                        <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{job.progress}% complete</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <MdAssignment className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {!isUserRegistered 
                    ? 'Sign up as a user to view jobs'
                    : 'No jobs yet. Create your first job!'
                  }
                </p>
              </div>
            )}
          </div>
        </div> */}

        <AnimatePresence>
          {showSignupModal && <div>Signup Modal</div>}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default NodeDashboard;