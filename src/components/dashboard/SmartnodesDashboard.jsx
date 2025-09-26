import { MdDescription, MdLanguage, MdCheckCircle } from 'react-icons/md';
import { NetworkDashboard, DashboardSwitcher, AirdropIndicator, Account, NodeDashboard, NetworkSummary, SupplyStatsCard, ConnectWalletButton, DAODashboard } from "..";
import styles, { layout } from "../../style";
import { useState, useEffect, useRef } from "react";

// Dummy data for local testing
const dummyNetworkStats = {
  validators: 1,
  workers: 1,
  users: 0,
  jobs: 4,
  proposal: 1839,
  available_capacity: 9565387824,
  used_capacity: 15231271888,
  models: ["Qwen/Qwen2.5-7B-Instruct"]
};

const dummyModelDemand = {
    status: "success",
    data: {
        popular_models: [
            {
                model_name: "Qwen/Qwen2.5-7B-Instruct",
                recent_requests: 3,
                total_requests: 3,
                last_accessed: 1758814095.544846, 
                has_distribution: true,
                requests_per_day: 0.1,
                last_accessed_human: "0 minutes ago"
            }
        ],
        total_models_tracked: 1,
        models_with_recent_activity: 1,
        time_period_days: 30,
        min_requests_threshold: 1,
        generated_at: 1758814126.513382
    }
};

const dummyNetworkHistory = {
  daily: {
    labels: ["2025-06-09","2025-06-10","2025-06-11","2025-06-12","2025-06-13","2025-06-14","2025-06-15","2025-06-16","2025-06-17","2025-06-18","2025-06-19","2025-06-20","2025-06-21","2025-06-22","2025-06-23","2025-06-24","2025-06-25","2025-06-26","2025-06-27","2025-06-28","2025-06-29","2025-06-30","2025-07-01","2025-07-02","2025-07-03","2025-07-04","2025-07-05","2025-07-06","2025-07-07","2025-07-08"],
    datasets: {
      workers: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
      validators: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      users: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      jobs: [9,4,5,3,2,2,4,5,3,5,4,4,3,4,1,1,2,2,2,2,1,2,2,3,1,1,1,1,0,2],
      proposals: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total_capacity: [24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,0,24709234688,24709234688,24802164736,24802295808,24664014848,24664014848,24664014848,24664014848,0,0,24796659712],
      used_capacity: [15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,0,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,0,0,15231271888]
    }
  },
  timestamps: [1749441600.0,1749528000.0,1749614400.0,1749700800.0,1749787200.0,1749873600.0,1749960000.0,1750046400.0,1750132800.0,1750219200.0,1750305600.0,1750392000.0,1750478400.0,1750564800.0,1750651200.0,1750737600.0,1750824000.0,1750910400.0,1750996800.0,1751083200.0,1751169600.0,1751256000.0,1751342400.0,1751428800.0,1751515200.0,1751601600.0,1751688000.0,1751774400.0,1751860800.0,1751947200.0],
  summary: {
    current: {
      workers: 1,
      validators: 0,
      users: 0,
      jobs: 3,
      proposals: 0,
      available_capacity: 9565387824,
      used_capacity: 15231271888,
      total_capacity: 24796659712
    },
    recent_daily: [
      {
        date: "2025-07-02",
        timestamp: 1751428800.0,
        last_updated: 1751513607.5554426,
        workers: 1,
        validators: 1,
        users: 0,
        jobs: 3,
        proposals: 0,
        available_capacity: 9432742960,
        used_capacity: 15231271888,
        total_capacity: 24664014848
      },
      {
        date: "2025-07-08",
        timestamp: 1751947200.0,
        last_updated: 1751993396.4099038,
        workers: 1,
        validators: 1,
        users: 0,
        jobs: 2,
        proposals: 0,
        available_capacity: 0,
        used_capacity: 0,
        total_capacity: 0
      }
    ],
    recent_weekly: [],
    total_days_tracked: 43,
    total_weeks_archived: 0,
    retention_policy: {
      daily_days: 90,
      weekly_weeks: 104
    }
  },
  metadata: {
    total_days_available: 43,
    total_weeks_available: 0,
    requested_days: 30,
    generated_at: 1751993624.323103,
    generated_at_iso: "2025-07-08T12:53:44.323103"
  }
};

const SmartnodesDashboard = ({ 
    supplyStats, 
    userAddress, 
    userBalance, 
    userLocked, 
    userUnclaimed,
    claimRewards,
    contract,
    dao,
    token,
    coreAddress,
    tokenAddress,
    coordinatorAddress,
    daoAddress,
    signer,
    connectToContract,
    connectToCoinbaseWallet
 }) => {
    const DASHBOARD_TYPES = {
        SUPPLY_STATS: 'supply_stats',
        NETWORK: 'network',
        GOVERNANCE: 'governance',
    };
    
    const dashboardConfig = [
        {
            id: DASHBOARD_TYPES.NETWORK,
            name: 'Tensorlink',
            icon: <MdLanguage />
        },
        {
            id: DASHBOARD_TYPES.SUPPLY_STATS,
            name: 'Contract Info',
            icon: <MdDescription />
        },
        {
            id: DASHBOARD_TYPES.GOVERNANCE,
            name: 'Governance',
            icon: <MdCheckCircle />
        }
    ];

    // Storage key for persisting dashboard selection
    const STORAGE_KEY = 'smartnodes_active_dashboard';

    // Helper function to get saved dashboard from localStorage
    const getSavedDashboard = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            // Validate that the saved value is a valid dashboard type
            if (saved && Object.values(DASHBOARD_TYPES).includes(saved)) {
                return saved;
            }
        } catch (error) {
            console.warn('Error reading from localStorage:', error);
        }
        // Return default if no valid saved value
        return DASHBOARD_TYPES.NETWORK;
    };

    // Helper function to save dashboard to localStorage
    const saveDashboard = (dashboard) => {
        try {
            localStorage.setItem(STORAGE_KEY, dashboard);
        } catch (error) {
            console.warn('Error saving to localStorage:', error);
        }
    };

    // State initialization - get from localStorage or use default
    const [loading, setLoading] = useState(true);
    const [networkStats, setNetworkStats] = useState(null);
    const [networkHistory, setNetworkHistory] = useState(null);
    const [modelDemand, setModelDemand] = useState(null);
    const [activeDashboard, setActiveDashboard] = useState(getSavedDashboard());
    const [useLocalData, setUseLocalData] = useState(true); // Toggle for local testing
    const [error, setError] = useState(null);

    // Custom setter that also saves to localStorage
    const updateActiveDashboard = (dashboard) => {
        setActiveDashboard(dashboard);
        saveDashboard(dashboard);
    };

    // Function to render active dashboard
    const renderActiveDashboard = () => {
        // If wallet is connected and user is on Network dashboard, show Node dashboard instead        
        switch (activeDashboard) {
            case DASHBOARD_TYPES.SUPPLY_STATS:
                return (
                    <SupplyStatsCard 
                        supplyStats={supplyStats}
                        tokenAddress={tokenAddress}
                        coordinatorAddress={coordinatorAddress}
                        coreAddress={coreAddress}
                        daoAddress={daoAddress}
                    />
                );
            case DASHBOARD_TYPES.NETWORK:
                return <NetworkDashboard 
                    loading={loading}
                    fetchNetworkData={fetchNetworkData}
                    networkStats={networkStats}
                    networkHistory={networkHistory}
                    modelDemandData={modelDemand}
                    error={error}
                />;
            case DASHBOARD_TYPES.GOVERNANCE:
                return <DAODashboard dao={dao} token={token} signer={signer}/>;
            
            default:
                return <NetworkDashboard
                    loading={loading}
                    fetchNetworkData={fetchNetworkData}
                    networkStats={networkStats}
                    networkHistory={networkHistory}
                    modelDemandData={modelDemand}
                    error={error}
                />;
        }
    };

    const API_BASE_URL = "https://smartnodes.ddns.net/tensorlink-api";
    
    const fetchNetworkData = async () => {
        try {
            setLoading(true);
            
            if (useLocalData) {
                // Use dummy data for local testing
                setTimeout(() => {
                    setNetworkStats(dummyNetworkStats);
                    setNetworkHistory(dummyNetworkHistory);
                    setModelDemand(dummyModelDemand);
                    setError(null);
                    setLoading(false);
                }, 1000);
                return;
            }
            
            // Fetch both stats and history from API
            const [statsResponse, historyResponse, models] = await Promise.all([
                fetch(`${API_BASE_URL}/stats`),
                fetch(`${API_BASE_URL}/network-history`),
                fetch(`${API_BASE_URL}/model-demand`)
            ]);

            if (!statsResponse.ok || !historyResponse.ok) {
                throw new Error('Failed to fetch network data');
            }

            const statsData = await statsResponse.json();
            const historyData = await historyResponse.json();
            const modelData = await models.json();
            
            setNetworkStats(statsData);
            setNetworkHistory(historyData);
            setModelDemand(modelData);
            setError(null);
        } catch (err) {
            console.error('Error fetching network data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (actionId) => {
        switch (actionId) {
          case 'request-job':
            // Handle job request
            break;
          case 'create-user':
            // Handle user creation
            break;
          case 'create-validator':
            // Handle validator creation
            break;
        }
    };

    useEffect(() => {
        fetchNetworkData();
        
        // Refresh data every 2 minutes
        const interval = setInterval(fetchNetworkData, 120000);
        return () => clearInterval(interval);
    }, []);

    const titleRef = useRef(null);

    useEffect(() => {
        // Scroll so that the title is at the very top of the page
        if (titleRef.current) {
            titleRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    const handleAirdropAction = () => {
        console.log("Learn more about airdrop clicked");
    };

    const handleAirdropClose = () => {
        setShowAirdropBanner(false);
        // Optional: Save to localStorage to remember user preference
        localStorage.setItem('airdrop_banner_dismissed', 'true');
    };

    // Check if user previously dismissed the banner
    useEffect(() => {
        const dismissed = localStorage.getItem('airdrop_banner_dismissed');
        if (dismissed === 'true') {
            setShowAirdropBanner(false);
        }
    }, []);

    return (
        <section 
            id="dashboard"
            ref={titleRef}
            className={`bg-gray-300 dark:bg-zinc-900 flex mt-5 flex-col border-t dark:border-t-white border-t-black items-center pb-10
                                border-b border-b-black dark:border-b-white px-1 xs:px-5`}>
            <div className="mt-5 max-w-[1380px] items-center w-full flex-wrap">
                <div className="w-full max-w-[1380px]">
                    <AirdropIndicator />
                </div>
                <h1 
                    className={`${styles.subheading} md:text-3xl lg:text-4xl text-lg bg-gray-50 rounded-xl dark:bg-zinc-900 border dark:border-white border-black p-2 xs:p-5 text-left px-6 md:mt-2 max-w-[830px] mb-3`}>
                    Smartnodes <span className="font-normal text-gray-400" style={{color: "rgba(255, 120, 150, 1)"}}>(testnet)</span> Dashboard
                </h1>

                <NetworkSummary networkStats={networkStats} />
                
                {/* Dashboard Switcher - now uses updateActiveDashboard */}
                <DashboardSwitcher 
                    dashboardConfig={dashboardConfig} 
                    activeDashboard={activeDashboard}
                    setActiveDashboard={updateActiveDashboard}
                />

                {/* Render Active Dashboard */}
                {renderActiveDashboard()}

                <Account 
                    handleActionClick={handleActionClick}
                    userAddress={userAddress}
                    userBalance={userBalance}
                    userLocked={userLocked}
                    userUnclaimed={userUnclaimed}
                    claimRewards={claimRewards}
                    connectToContract={connectToContract} 
                    connectToCoinbaseWallet={connectToCoinbaseWallet} 
                    contract={contract} 
                />

                <NodeDashboard 
                    userAddress={userAddress}
                    contract={contract}
                />
            </div>
        </section>
    );
}

export default SmartnodesDashboard;