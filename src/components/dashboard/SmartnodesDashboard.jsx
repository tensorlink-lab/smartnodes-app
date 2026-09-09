import { MdDescription, MdLanguage, MdAccountCircle, MdVerifiedUser } from 'react-icons/md';
import { NetworkDashboard, DashboardSwitcher, AirdropIndicator, Account, NodeDashboard, NetworkSummary, SupplyStatsCard, ConnectWalletButton, DAODashboard } from "..";
import styles from "../../style";
import { useState, useEffect, useRef } from "react";

// Dummy data for local testing
const dummyNetworkStats = {
  validators: 1,
  workers: 3,
  users: 0,
  jobs: 4,
  proposal: 1839,
  available_capacity: 9565387824,
  used_capacity: 15231271888,
  models: ["Qwen/Qwen3-8B"]
};

const dummyModelDemand = {
    status: "success",
    data: {
        popular_models: [
            {
                model_name: "Qwen/Qwen3-8B",
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
        time_period_days: 90,
        min_requests_threshold: 1,
        generated_at: 1758814126.513382
    }
};

const dummyNetworkHistory = {
  daily: {
    labels: ["2025-06-09","2025-06-10","2025-06-11","2025-06-12","2025-06-13","2025-06-14","2025-06-15","2025-06-16","2025-06-17","2025-06-18","2025-06-19","2025-06-20","2025-06-21","2025-06-22","2025-06-23","2025-06-24","2025-06-25","2025-06-26","2025-06-27","2025-06-28","2025-06-29","2025-06-30","2025-07-01","2025-07-02","2025-07-03","2025-07-04","2025-07-05","2025-07-06","2025-07-07","2025-07-08"],
    datasets: {
      workers: [1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,3,3,3,3,3],
      validators: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      users: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      jobs: [9,4,5,3,2,2,4,5,3,5,4,4,3,4,1,1,2,2,2,2,1,2,2,3,1,1,1,1,0,2],
      proposals: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      total_capacity: [24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,24710348800,0,24709234688,24709234688,24802164736,24802295808,49420697600,49420697600,49420697600,49420697600,89420697600, 89420697600, 89420697600],
      used_capacity: [15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,15231271888,0,15231271888,15231271888,15231271888,15231271888,24710348800,24710348800,24710348800,24710348800,24710348800, 49420697600, 49420697600]
    }
  },
  timestamps: [1749441600.0,1749528000.0,1749614400.0,1749700800.0,1749787200.0,1749873600.0,1749960000.0,1750046400.0,1750132800.0,1750219200.0,1750305600.0,1750392000.0,1750478400.0,1750564800.0,1750651200.0,1750737600.0,1750824000.0,1750910400.0,1750996800.0,1751083200.0,1751169600.0,1751256000.0,1751342400.0,1751428800.0,1751515200.0,1751601600.0,1751688000.0,1751774400.0,1751860800.0,1751947200.0],
  // GPU / device breakdown, mirroring what `include_device=true` returns
  // from `/network-history`. Note `current` is realistically empty most of
  // the time (benchmarking only happens when a device connects/reconnects)
  // — the dashboard falls back to the most recent non-empty day in
  // `gpu_model_breakdown_by_day` when that's the case, which is what this
  // dummy data exercises.
  device: {
    labels: ["2025-07-06", "2025-07-07", "2025-07-08"],
    datasets: {
      avg_tflops: [null, 76.23, null],
      avg_bandwidth_gb_s: [null, 841.16, null],
      total_benchmarked: [0, 3, 0],
    },
    current: {
      avg_tflops: null,
      avg_bandwidth_gb_s: null,
      total_benchmarked: 0,
      by_gpu_model: {},
      by_backend: {},
    },
    gpu_model_breakdown_by_day: {
      "2025-07-06": {},
      "2025-07-07": {
        "NVIDIA RTX 4090": 1,
        "NVIDIA A100 80GB": 1,
        "NVIDIA GeForce RTX 3090": 1,
      },
      "2025-07-08": {},
    },
    backend_breakdown_by_day: {
      "2025-07-06": {},
      "2025-07-07": { cuda: 3 },
      "2025-07-08": {},
    },
  },
  summary: {
    current: {
      workers: 3,
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
    requested_days: 90,
    generated_at: 1751993624.323103,
    generated_at_iso: "2025-07-08T12:53:44.323103"
  }
};

const SmartnodesDashboard = ({ 
    supplyStats, 
    userAddress, 
    userBalance, 
    userLocked, 
    contract,
    dao,
    token,
    coreAddress,
    tokenAddress,
    coordinatorAddress,
    daoAddress,
    signer,
    connectToContract,
    connectToCoinbaseWallet,
    activeMenu
 }) => {
    const DASHBOARD_TYPES = {
        NODE: "node",
        SUPPLY_STATS: 'supply_stats',
        NETWORK: 'network',
        GOVERNANCE: 'governance',
    };
    
    const dashboardConfig = [
        {
            id: DASHBOARD_TYPES.NODE,
            name: "Account",
            icon: <MdAccountCircle />
        },
        {
            id: DASHBOARD_TYPES.NETWORK,
            name: 'Ecosystem',
            icon: <MdLanguage />
        },
        {
            id: DASHBOARD_TYPES.SUPPLY_STATS,
            name: 'Contract',
            icon: <MdDescription />
        },
        {
            id: DASHBOARD_TYPES.GOVERNANCE,
            name: 'Governance',
            icon: <MdVerifiedUser />
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
    const [useLocalData, setUseLocalData] = useState(false); // Toggle for local testing
    const [error, setError] = useState(null);
    const [userUnclaimed, setUserUnclaimed] = useState("-");
    const [proposals, setProposals] = useState({
        "f09b231df866b0cad1cb80ecd2877c80f519d1559cdbca22dddf36757cb4a19c": {
            validators: [],
            job_hashes: ["86a5f2d3b583f8f8ef7baac48a16d4a2a36d370575c78ed8de2bbebfdde89b48"],
            job_capacities: [221823030],
            workers: ["0x560fd8449eBAdAfE8168a560F656148F655459Ca"],
            total_capacity: [24641994752],
            total_workers: [1],
            distribution_id: 1,
            merkle_root: "a8f91bdcbb8a45852ace17fae6a36da4edc71f267737f6be008442b2a8d76036",
            workers_hash: "db991787d5936e9a20e62084516ad73523339e79bbf6fc4fbadaefb0dba78772",
            capacities_hash: "84a89de7dea777efe1af81da8d654dd3870fdc317283c1f52bfe9c89338b7e61"
        },
        "2041668305650f3c0076bc510a17efb7f233a26b1e8eeef57f008fef3ce8d7f3": {
            validators: [],
            job_hashes: [
            "75d2c3444c96712a1d448f393fa0ef35137b5f632d089c2df355896c635adbd6",
            "981e34217cf920b640142c5d4a4991da00369ff2da745b79b9e5607d5d636264"
            ],
            job_capacities: [443615273],
            workers: ["0x560fd8449eBAdAfE8168a560F656148F655459Ca"],
            total_capacity: [0],
            total_workers: [0],
            distribution_id: 2,
            merkle_root: "4817c90023edb8e2464c9bbeeeb1e79b36d228fa679d1fa0248ba03a26d8742c",
            workers_hash: "db991787d5936e9a20e62084516ad73523339e79bbf6fc4fbadaefb0dba78772",
            capacities_hash: "45e9f4d72e026e96e14d019d21be2ede672209c890fe9f5a561d9c8da210a0a2"
        }
        }
    ); 
    const [claimInfo, setClaimInfo] = useState([]);    

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
                        proposals={proposals}
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
            
            case DASHBOARD_TYPES.NODE:
                return <div>
                    <Account 
                        handleActionClick={handleActionClick}
                        userAddress={userAddress}
                        userBalance={userBalance}
                        userLocked={userLocked}
                        userUnclaimed={userUnclaimed}
                        connectToContract={connectToContract} 
                        connectToCoinbaseWallet={connectToCoinbaseWallet} 
                        contract={contract} 
                        claimData={claimInfo}
                    />
                    <NodeDashboard 
                        claimInfo={claimInfo}
                        userAddress={userAddress}
                        contract={contract}
                        fetchNetworkData={fetchNetworkData}
                        setUserUnclaimed={setUserUnclaimed}
                    />
                </div>
            
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

    const API_BASE_URL = "https://tensorlink.ddns.net/tensorlink";
    // const API_BASE_URL = "http://192.168.2.54:64747";
    
    // The /network-history endpoint caps `days` at 180 (Query(30, ge=1,
    // le=180)). Rather than re-fetching per range click, we always request
    // this single hardcoded window (plus weekly aggregates) and let
    // NetworkDashboard slice/aggregate client-side for whatever range the
    // user has selected.
    const NETWORK_HISTORY_DAYS = 180;

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
            // `include_device=true` pulls in the GPU breakdown (current
            // snapshot + per-day backend/GPU-model breakdowns, avg TFLOPS,
            // avg bandwidth) alongside the usual participant/job/capacity data.
            const [statsResponse, historyResponse, models] = await Promise.all([
                fetch(`${API_BASE_URL}/stats`),
                fetch(`${API_BASE_URL}/network-history?days=${NETWORK_HISTORY_DAYS}&include_weekly=true&include_summary=true&include_device=true`),
                fetch(`${API_BASE_URL}/v1/models/demand`)
            ]);

            if (!statsResponse.ok || !historyResponse.ok) {
                throw new Error('Failed to fetch network data');
            }

            const statsData = await statsResponse.json();
            const historyData = await historyResponse.json();
            const modelData = await models.json();

            fetchProposals();
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

    const fetchRewards = async () => {
        if (userAddress !== "-") {
            const response = await fetch(`${API_BASE_URL}/claim-info?node_address=${userAddress}`);
            console.log(response);
            if (!response.ok) throw new Error(`Failed to find worker rewards.`);
            
            const unclaimed = await response.json();
            setClaimInfo(unclaimed);
        }
    };

    const fetchProposals = async () => {
        const response = await fetch(`${API_BASE_URL}/proposal-history`);
        if (!response.ok) throw new Error(`Failed to find proposals.`);
        const p = await response.json();
        setProposals(p);
    }

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
        
        // Refresh data every 10 minutes
        const interval = setInterval(fetchNetworkData, 600000);
        return () => clearInterval(interval);
    }, []);

    const titleRef = useRef(null);

    useEffect(() => {
        // Scroll so that the title is at the very top of the page
        if (titleRef.current) {
            titleRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    useEffect(() => {
        if (userAddress !== "-") {
            fetchRewards();
        }
    }, [userAddress]);

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
            className="flex flex-col items-center pb-5">
            <div className="mt-3 w-full max-w-[1380px] flex-wrap items-center px-1 xs:px-5">
                {/* <div className="w-full max-w-[1380px]">
                    <AirdropIndicator />
                </div> */}

                {/* Header */}
                <div className="mb-6 flex items-center gap-3 px-1 md:mt-2">
                    {/* <span className="hidden h-px w-8 bg-gradient-to-r from-transparent to-teal-400 sm:block" />
                    <h1 className={`${styles.subheading2} !text-lg md:!text-2xl lg:!text-3xl !w-auto`}>
                        Network Dashboard {" "}
                        <span className="font-normal text-teal-400">(Testnet: Base Sepolia)</span>{" "}
                    </h1>
                    <span className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-white/10" /> */}
                </div>

                {/* Sidebar + main panel layout */}
                <div className="flex w-full flex-col items-start gap-4 lg:gap-8">
                    <DashboardSwitcher 
                        dashboardConfig={dashboardConfig} 
                        activeDashboard={activeDashboard}
                        setActiveDashboard={updateActiveDashboard}
                    />

                    <div className="min-w-0 w-full flex-1">
                        <NetworkSummary networkStats={networkStats} activeMenu={activeMenu}/>

                        {/* Render Active Dashboard */}
                        {renderActiveDashboard()}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SmartnodesDashboard;
