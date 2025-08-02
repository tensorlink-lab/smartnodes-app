import { MdDescription, MdLanguage, MdLink } from 'react-icons/md';
import { NetworkDashboard, DashboardSwitcher, Account, NodeDashboard, NetworkSummary, SupplyStatsCard, ConnectWalletButton } from "..";
import styles, { layout } from "../../style";
import { useState, useEffect } from "react";

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
    handleActionClick,
    contract,
    contractAddress,
    multisigAddress,
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
            name: 'Active Networks',
            icon: <MdLanguage />
        },
        {
            id: DASHBOARD_TYPES.SUPPLY_STATS,
            name: 'Contract Info',
            icon: <MdDescription />
        },
    ];

    // Function to render active dashboard
    const renderActiveDashboard = () => {
        // If wallet is connected and user is on Network dashboard, show Node dashboard instead        
        switch (activeDashboard) {
            case DASHBOARD_TYPES.SUPPLY_STATS:
                return (
                    <SupplyStatsCard 
                        supplyStats={supplyStats}
                        userAddress={userAddress}
                        userBalance={userBalance}
                        userLocked={userLocked}
                        userUnclaimed={userUnclaimed}
                        claimRewards={claimRewards}
                        contract={contract}
                        ConnectWalletButton={ConnectWalletButton}
                        contractAddress={contractAddress}
                        multisigAddress={multisigAddress}
                    />
                );
            case DASHBOARD_TYPES.NETWORK:
                return <NetworkDashboard 
                    loading={loading}
                    fetchNetworkData={fetchNetworkData}
                    networkStats={networkStats}
                    networkHistory={networkHistory}
                    error={error}
                />;
        }
    };

    const [loading, setLoading] = useState(true);
    const [networkStats, setNetworkStats] = useState(null);
    const [networkHistory, setNetworkHistory] = useState(null);
    const [activeDashboard, setActiveDashboard] = useState(DASHBOARD_TYPES.NETWORK);
    const [useLocalData, setUseLocalData] = useState(false); // Toggle for local testing
    const [error, setError] = useState(null);

    const API_BASE_URL = "https://smartnodes.ddns.net/tensorlink-api";
    
    const fetchNetworkData = async () => {
        try {
            setLoading(true);
            
            if (useLocalData) {
                // Use dummy data for local testing
                setTimeout(() => {
                    setNetworkStats(dummyNetworkStats);
                    setNetworkHistory(dummyNetworkHistory);
                    setError(null);
                    setLoading(false);
                }, 1000);
                return;
            }
            
            // Fetch both stats and history from API
            const [statsResponse, historyResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/stats`),
                fetch(`${API_BASE_URL}/network-history`)
            ]);

            if (!statsResponse.ok || !historyResponse.ok) {
                throw new Error('Failed to fetch network data');
            }

            const statsData = await statsResponse.json();
            const historyData = await historyResponse.json();
            
            setNetworkStats(statsData);
            setNetworkHistory(historyData);
            setError(null);
        } catch (err) {
            console.error('Error fetching network data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNetworkData();
        
        // Refresh data every 2 minutes
        const interval = setInterval(fetchNetworkData, 120000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className={`bg-gray-300 dark:bg-zinc-900 flex mt-5 flex-col border-t dark:border-t-white border-t-black items-center pb-10
                                border-b border-b-black dark:border-b-white px-1 xs:px-5`}>
            <div className="mt-5 max-w-[1380px] items-center w-full flex-wrap">
                <h1 className={`${styles.subheading} md:text-3xl lg:text-4xl text-lg bg-gray-50 rounded-xl dark:bg-zinc-700 border dark:border-white border-black p-5 text-left px-6 md:mt-2 max-w-[830px] mb-6`}>
                    Smartnodes <span className="font-normal text-gray-400" style={{color: "#f7a6a0"}}>(testnet)</span> Dashboard
                </h1>

                <NetworkSummary networkStats={networkStats} />

                <h1 className={`${styles.subheading3} text-neutral-800 dark:text-neutral-50 py-2`}>
                    {/* Toggle Panel */}
                </h1>
                
                {/* Dashboard Switcher */}
                <DashboardSwitcher 
                    dashboardConfig={dashboardConfig} 
                    activeDashboard={activeDashboard}
                    setActiveDashboard={setActiveDashboard}
                />

                {/* Render Active Dashboard */}
                {renderActiveDashboard()}
                
                <div className="border-t mb-6 mx-10"/>

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
                    connectToContract={connectToContract}
                    connectToCoinbaseWallet={connectToCoinbaseWallet}
                />
            </div>
        </section>
    );
}

export default SmartnodesDashboard;