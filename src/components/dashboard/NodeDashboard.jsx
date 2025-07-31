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
import { ConnectWalletButton, DashboardSwitcher } from "..";


const NodeDashboard = ({ 
  userAddress,
  contract,
  connectToContract,
  connectToCoinbaseWallet
}) => {
  const [newJobDescription, setNewJobDescription] = useState(null);
  const [signupModalRole, setSignupModalRole] = useState(null); // 'user', 'validator', or null
  const [registeredRoles, setRegisteredRoles] = useState(new Set());
  const [nodeActivity, setNodeActivity] = useState({});
  const [userJobs, setUserJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pubKeyHash, setPubKeyHash] = useState('');
  const [newJobType, setNewJobType] = useState('');


  const DASHBOARD_TYPES = {
    USER: 'user',
    VALIDATOR: 'validator',
    WORKER: 'worker',
  };

  const [activeDashboard, setActiveDashboard] = useState(DASHBOARD_TYPES.USER);

  // Mock data
  const mockValidatorActivity = {
    status: 'online',
    uptime: '99.2%',
    blocksValidated: 1247,
    rewards: '152.4',
    lastActivity: '2 minutes ago',
    peers: 8
  };

  const mockWorkerActivity = {
    status: 'online',
    jobsCompleted: 89,
    jobsActive: 3,
    earnings: '45.7',
    cpuUsage: '67%',
    gpuUsage: '84%',
    lastJob: '5 minutes ago'
  };

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
    {
      id: 'job_002', 
      type: 'Inference',
      status: 'completed',
      progress: 100,
      started: '1 day ago',
      cost: '3.2 SNO',
      description: 'Running inference on dataset batch'
    }
  ];

  // Initialize with mock data
  useEffect(() => {
    // check localStorage/previous registration
    const hasUserRole = Math.random() > 0.5; 
    const hasValidatorRole = Math.random() > 0.5;
    const hasWorkerConnection = Math.random() > 0.5;
    
    const roles = new Set();
    if (hasUserRole) roles.add('user');
    if (hasValidatorRole) roles.add('validator');
    if (hasWorkerConnection) roles.add('worker');
    
    setRegisteredRoles(roles);
    
    // Set mock jobs for users
    // if (hasUserRole) {
    //   setUserJobs(mockUserJobs);
    // }
    
    // Set mock activity for registered roles
    const activity = {};
    // if (hasValidatorRole) {
    //   activity.validator = mockValidatorActivity;
    // }
    // if (hasWorkerConnection) {
    //   activity.worker = mockWorkerActivity;
    // }
    
    // setNodeActivity(activity);
  }, []);

  const handleSignup = async (role, pubKeyHash) => {
    if (!pubKeyHash.trim()) {
      alert('Please enter your public key hash');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call to register
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newRoles = new Set(registeredRoles);
      newRoles.add(role);
      setRegisteredRoles(newRoles);
      
      // Initialize activity data for the role
      const newActivity = { ...nodeActivity };
      // if (role === 'validator') {
      //   newActivity.validator = mockValidatorActivity;
      // } else if (role === 'user') {
      //   setUserJobs(mockUserJobs);
      // }
      // setNodeActivity(newActivity);
      
      setSignupModalRole(null);
      setPubKeyHash('');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
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

  const SignupModal = ({ role, onClose }) => {
    const [localPubKeyHash, setLocalPubKeyHash] = useState('');
    const handleSubmit = async () => {
      if (!localPubKeyHash.trim()) {
        alert('Please enter your public key hash');
        return;
      }
      await handleSignup(role, localPubKeyHash); // pass to parent
    };

    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-xl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-300 dark:border-gray-600"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold dark:text-white">
              Register as {role === 'validator' ? 'Validator' : 'User'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <MdClose size={24} />
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {role === 'validator' 
              ? 'Join the network as a validator to secure transactions and earn rewards.'
              : 'Register as a user for increased access to Smartnodes services. Requires 100 tSNO.'
            }
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Public Key Hash
              </label>
              <input
                type="text"
                value={localPubKeyHash}
                onChange={(e) => setLocalPubKeyHash(e.target.value)}
                placeholder="Enter your public key hash..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleSignup(role)}
                disabled={loading || !pubKeyHash.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <MdSave />
                )}
                {loading ? 'Registering...' : 'Register'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const ValidatorPanel = () => {
    const isRegistered = registeredRoles.has('validator');
    const activity = nodeActivity.validator;
    
    return (
      <div className="space-y-4 relative">
        <div className="bg-gray-200 dark:bg-gray-800 rounded-xl p-6 border border-gray-300 dark:border-gray-600">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 dark:text-white">
              <MdVerifiedUser className="text-green-500 hidden xs:block" />
              Validator Node
            </h2>
            <div className="flex items-center gap-2">
              {isRegistered && activity ? (
                <div className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  activity.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {activity.status.toUpperCase()}
                </div>
              ) : (
                <button
                  onClick={() => setSignupModalRole('validator')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                >
                  <MdLogin size={16} />
                  Sign Up
                </button>
              )}
            </div>
          </div>
          
          {isRegistered && activity ? (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">Uptime</h3>
                  <p className="text-2xl font-bold text-green-600">{activity.uptime}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">Blocks Validated</h3>
                  <p className="text-2xl font-bold dark:text-white">{activity.blocksValidated}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">Rewards Earned</h3>
                  <p className="text-2xl font-bold text-blue-600">{activity.rewards} SNO</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Last activity: {activity.lastActivity}</span>
                <span>Connected peers: {activity.peers}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <MdVerifiedUser className="text-6xl text-gray-300 mx-auto mb-4 hidden xs:block" />
              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Validator Not Registered
              </h3>
              <p className="text-gray-400 dark:text-gray-500 mb-4">
                Sign up to start validating transactions and earning rewards
              </p>
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg opacity-50">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">Uptime</h3>
                  <p className="text-2xl font-bold text-gray-400">--</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg opacity-50">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">Blocks Validated</h3>
                  <p className="text-2xl font-bold text-gray-400">--</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg opacity-50">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">Rewards Earned</h3>
                  <p className="text-2xl font-bold text-gray-400">-- SNO</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {signupModalRole === 'validator' && (
            <SignupModal 
              role="validator" 
              onClose={() => setSignupModalRole(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  const WorkerPanel = () => {
    const isConnected = registeredRoles.has('worker');
    const activity = nodeActivity.worker;
    
    return (
      <div className="space-y-4 relative">
        <div className="bg-gray-200 dark:bg-gray-800 rounded-xl p-4 border border-gray-300 dark:border-gray-600">
          <div className="flex items-center justify-between my-3">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 dark:text-white">
              <MdComputer className="text-blue-500 hidden sm:block" />
              Worker Node
            </h2>
            <div className="flex items-center gap-2">
              {isConnected && activity ? (
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  activity.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {activity.status.toUpperCase()}
                </div>
              ) : (
                <ConnectWalletButton 
                  connectToContract={connectToContract} 
                  connectToCoinbaseWallet={connectToCoinbaseWallet} 
                  contract={contract} 
                />
              )}
            </div>
          </div>
          
          {isConnected && activity ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">Jobs Completed</h3>
                  <p className="text-2xl font-bold text-green-600">{activity.jobsCompleted}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">Active Jobs</h3>
                  <p className="text-2xl font-bold text-orange-600">{activity.jobsActive}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">CPU Usage</h3>
                  <p className="text-2xl font-bold dark:text-white">{activity.cpuUsage}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">GPU Usage</h3>
                  <p className="text-2xl font-bold dark:text-white">{activity.gpuUsage}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Earnings</h3>
                <p className="text-3xl font-bold text-blue-600">{activity.earnings} SNO</p>
                <p className="text-sm text-gray-500">Last job: {activity.lastJob}</p>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <MdComputer className="text-6xl text-gray-300 mx-auto mb-4 hidden sm:block" />
              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Worker Node Not Connected
              </h3>
              <p className="text-gray-400 dark:text-gray-500 mb-4">
                Connect your worker node to view statistics and earnings
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg opacity-50">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">Jobs Completed</h3>
                  <p className="text-2xl font-bold text-gray-400">--</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg opacity-50">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">Active Jobs</h3>
                  <p className="text-2xl font-bold text-gray-400">--</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg opacity-50">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">CPU Usage</h3>
                  <p className="text-2xl font-bold text-gray-400">--%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg opacity-50">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300">GPU Usage</h3>
                  <p className="text-2xl font-bold text-gray-400">--%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const UserPanel = () => {
    const isRegistered = registeredRoles.has('user');

    return (
      <div className="space-y-4 relative">
        {/* Create Job Section */}
        <div className="bg-gray-200 dark:bg-gray-800 rounded-xl p-6 border border-gray-300 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
              <MdAdd className="text-green-500 hidden xs:block" />
              Create Job
            </h2>
            {!isRegistered && (
              <button
                onClick={() => setSignupModalRole('user')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
              >
                <MdLogin size={16} />
                Sign Up
              </button>
            )}
          </div>
          
          {isRegistered ? (
            <>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">Job Type</label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select job type...</option>
                    <option value="Model Training">Model Training</option>
                    <option value="Inference">Inference</option>
                    <option value="Data Processing">Data Processing</option>
                    <option value="Image Generation">Image Generation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">Description</label>
                  <input
                    type="text"
                    value={newJobDescription}
                    onChange={(e) => setNewJobDescription(e.target.value)}
                    placeholder="Describe your job..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              
              <button
                onClick={handleCreateJob}
                disabled={loading || !newJobType || !newJobDescription}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <MdPlayArrow />
                )}
                {loading ? 'Creating...' : 'Create Job'}
              </button>
            </>
          ) : (
            <div className="text-center py-8 opacity-50">
              <MdAdd className="text-6xl text-gray-300 mx-auto mb-4 hidden xs:block" />
              <p className="text-gray-500 dark:text-gray-400">
                Sign up as a user to create and manage jobs
              </p>
            </div>
          )}
        </div>

        {/* Jobs List */}
        <div className="bg-gray-200 dark:bg-gray-800 rounded-xl p-6 border border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6 dark:text-white">
            <MdAssignment className="text-purple-500" />
            Your Jobs
          </h2>
          
          {isRegistered && userJobs.length > 0 ? (
            <div className="space-y-4">
              {userJobs.map((job) => (
                <div key={job.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold dark:text-white">{job.type}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      job.status === 'running' ? 'bg-orange-100 text-orange-800' :
                      job.status === 'completed' ? 'bg-green-100 text-green-800' :
                      job.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status.toUpperCase()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{job.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <span>ID: {job.id}</span>
                    <span>Started: {job.started}</span>
                    <span>Cost: {job.cost}</span>
                  </div>
                  {job.status === 'running' && (
                    <div className="mt-2">
                      <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{job.progress}% complete</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MdAssignment className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {!isRegistered 
                  ? 'Sign up as a user to view and manage your jobs'
                  : 'No jobs yet. Create your first job above!'
                }
              </p>
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {signupModalRole === 'user' && (
            <SignupModal 
              role="user" 
              onClose={() => setSignupModalRole(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  const dashboardConfig = [
    {
      id: DASHBOARD_TYPES.USER,
      name: 'User',
      icon: <MdPerson />
    },
    {
      id: DASHBOARD_TYPES.VALIDATOR,
      name: 'Validator',
      icon: <MdVerifiedUser />
    },
    {
      id: DASHBOARD_TYPES.WORKER,
      name: 'Worker',
      icon: <MdComputer />
    }
  ];

  const renderActiveDashboard = () => {
    switch (activeDashboard) {
      case DASHBOARD_TYPES.USER:
        return <UserPanel />;
      case DASHBOARD_TYPES.WORKER:
        return <WorkerPanel />;
      case DASHBOARD_TYPES.VALIDATOR:
        return <ValidatorPanel />;
      default:
        return <UserPanel />;
    }
  };

  return (
    <div className="mt-5 max-w-[1380px] items-center w-full flex-wrap">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gray-200 mb-2 dark:bg-neutral-800 rounded-xl dark:text-gray-200 p-0 xs:p-4 sm:pt-4 overflow-x-auto border border-black dark:border-gray-400 max-w-[900px]"
      >
        <h1 className={`${styles.subheading2} md:text-3xl lg:text-4xl text-lg bg-gray-50 rounded-lg dark:bg-zinc-700 border dark:border-white border-black p-2 text-center xs:max-w-[310px] max-w-[280px] mb-1`}>
          Node Interface
        </h1>
        <div className="p-2">
          <DashboardSwitcher 
            dashboardConfig={dashboardConfig} 
            activeDashboard={activeDashboard}
            setActiveDashboard={setActiveDashboard}
          />
        </div>
        <div className="min-h-[300px] relative">
          {renderActiveDashboard()}
        </div>
      </motion.div>
    </div>
  );
};

export default NodeDashboard;