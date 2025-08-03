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
import { ConnectWalletButton, ActionMenu } from "..";

const NodeDashboard = ({ 
  userAddress,
  contract,
  connectToContract,
  connectToCoinbaseWallet
}) => {
  const [activeNodes, setActiveNodes] = useState([]);
  const [userJobs, setUserJobs] = useState([]);
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobType, setNewJobType] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [pubKeyHash, setPubKeyHash] = useState('');

  // Mock data for active nodes
  const mockActiveNodes = [
    {
      id: 'node_001',
      type: 'validator',
      name: '-',
      status: 'offline',
      uptime: '0%',
      performance: {
        blocksValidated: 0,
        rewards: '- tSNO',
        peers: 0
      },
      lastActivity: '-'
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

  useEffect(() => {
    // Simulate loading nodes and user status
    setActiveNodes(mockActiveNodes);
    setIsUserRegistered(Math.random() > 0.5);
    if (Math.random() > 0.3) {
      setUserJobs(mockUserJobs);
    }
  }, []);

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

  const NodeCard = ({ node }) => (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {node.type === 'validator' ? (
            <MdVerifiedUser className="text-green-500" size={20} />
          ) : (
            <MdComputer className="text-blue-500" size={20} />
          )}
          <h3 className="font-semibold dark:text-white">{node.name}</h3>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
          node.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {node.status.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Uptime</p>
          <p className="font-semibold text-green-600">{node.uptime}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
          <p className="font-semibold dark:text-white capitalize">{node.type}</p>
        </div>
      </div>

      {node.type === 'validator' && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Blocks</p>
            <p className="font-semibold dark:text-white">{node.performance.blocksValidated}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Rewards</p>
            <p className="font-semibold text-blue-600">{node.performance.rewards}</p>
          </div>
        </div>
      )}

      {node.type === 'worker' && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Jobs Done</p>
            <p className="font-semibold dark:text-white">{node.performance.jobsCompleted}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Earnings</p>
            <p className="font-semibold text-blue-600">{node.performance.earnings}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Last activity: {node.lastActivity}
      </p>
    </div>
  );

  return (
    <div className="mt-5 max-w-[1380px] items-center w-full flex-wrap">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gray-200 mb-2 dark:bg-neutral-800 rounded-xl dark:text-gray-200 p-4 overflow-x-auto border border-black dark:border-gray-400 max-w-[1300px] relative"
      >
        {/* Active Nodes Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold flex justify-between items-center gap-2 mb-2 dark:text-white">
            <div className="flex items-center">
              <MdComputer className="text-blue-500 mr-3 hidden xs:block" />
              Active Nodes ({activeNodes.length})
            </div>
            <ActionMenu />
          </h2>

          {activeNodes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeNodes.map((node) => (
                <NodeCard key={node.id} node={node} />
              ))}
            </div>
          ) : userAddress !== "-" ? (
            <div className="text-center py-24 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <MdComputer className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No active nodes found.</p>
              <p className="text-gray-500 dark:text-gray-400">Visit the <a href="tensorlink/docs/mining" className="text-blue-400 hover:underline">documentation</a> to start up a node.</p>
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <MdComputer className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Connect your wallet to track job activity.</p>
            </div>
          )}
        </div>

        {/* User Jobs Section */}
        <div className="space-y-4">
          {/* Jobs List */}
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
              <div className="text-center py-20">
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
        </div>

        <AnimatePresence>
          {showSignupModal && <SignupModal />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default NodeDashboard;