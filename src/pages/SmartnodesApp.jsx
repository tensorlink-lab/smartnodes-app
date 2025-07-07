import React, { useEffect, useState } from 'react';
import { MdOutlineSupervisorAccount, MdOutlineSettings, MdVerifiedUser, MdBusinessCenter, MdPerson } from 'react-icons/md';
import abiArtifact from "../assets/SmartnodesCore.json";
import multisigAbiArtifact from '../assets/SmartnodesMultiSig.json';
import styles, { layout } from "../style";
import { Button, TensorlinkDashboard, SmartnodesDashboard, SupplyStatsCard, ConnectWalletButton } from "../components";
import { ethers } from 'ethers';
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { PieChart } from "@mui/x-charts/PieChart";

const SmartnodesApp = () => {
  function round(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }

  // State variables
  const [activeDashboard, setActiveDashboard] = useState(null);
  const [status, setStatus] = useState('Loading network stats...');
  const [contract, setContract] = useState(null);
  const [multisig, setMultisig] = useState(null);
  const [readOnlyProvider, setReadOnlyProvider] = useState(null);
  const [readOnlyContract, setReadOnlyContract] = useState(null);
  const [userAddress, setUserAddress] = useState('-');
  const [userBalance, setUserBalance] = useState("-");
  const [userLocked, setUserLocked] = useState("-");
  const [userUnclaimed, setUserUnclaimed] = useState("-");
  const [error, setError] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [networkStats, setNetworkStats] = useState([
    { title: "Jobs Completed", amount: "-", iconColor: "black", iconBg: "red", icon: <MdBusinessCenter /> },
    { title: "Active Validators", amount: "-", iconColor: "black", iconBg: "lightBlue", icon: <MdVerifiedUser/> },
    { title: "Active Workers", amount: "-", iconColor: "black", iconBg: "grey", icon: <MdOutlineSettings/> },
    { title: "Users", amount: "-", iconColor: "black", iconBg: "violet", icon: <MdOutlineSupervisorAccount/> },
  ]);
  const [supplyStats, setSupplyStats] = useState([
    { title: "Total Supply", amount: "-" },
    { title: "Locked", amount: "-" },
    { title: "Unclaimed Rewards", amount: "-" },
    { title: "State Reward", amount: "-" },
    { title: "State Time (s)", amount: "-" }
  ]);

  const dashboardOptions = [
    { title: "Tensorlink Dashboard", icon: <MdPerson style={{ color: "violet" }}/>, endpoint: "node", component: <TensorlinkDashboard /> },
  ];

  const RPC_ENDPOINT = "https://sepolia.base.org";
  const BASE_NETWORK_ID = 84532;
  const contractAddress = '0x64eC74C9370F684783cBf606eEDdd4Ba7fDFc338';
  const multisigAddress = '0x63592eA5012A660308A82b4cCDcA05f5C4d357Fa';
  const abi = abiArtifact.abi;
  const multisigAbi = multisigAbiArtifact.abi;

  const sdk = new CoinbaseWalletSDK({
    appName: 'Smartnodes'
  });

  // Initialize read-only provider on component mount
  useEffect(() => {
    const initReadOnlyProvider = async () => {
      try {
        // Create a provider that doesn't require wallet connection
        const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);
        setReadOnlyProvider(provider);
        
        // Create a read-only contract instance
        const contractInstance = new ethers.Contract(contractAddress, abi, provider);
        setReadOnlyContract(contractInstance);
        
        setStatus('Initializing public data connection...');
      } catch (error) {
        console.error('Error creating read-only provider:', error);
        setStatus('Error initializing data connection.');
      }
    };
    
    initReadOnlyProvider();
  }, []);

  // Fetch public network stats when read-only contract is available
  useEffect(() => {
    if (readOnlyContract) {
      getPublicNetworkStats();
    }
  }, [readOnlyContract]);

  // Function to fetch public network stats using read-only provider
  const getPublicNetworkStats = async () => {
    if (readOnlyContract) {
      try {
        setStatus('Loading network stats...');
        
        // Fetch values from contract using read-only provider
        let result = await readOnlyContract.getSupply();
        let [supply, locked, unclaimed] = result.map(val => BigInt(val));
        let emissionRate = await readOnlyContract.emissionRate();
        let totalJobs = (await readOnlyContract.jobCounter()) - BigInt(1);
        let activeValidators = await readOnlyContract.getActiveValidatorCount();
        let users = await readOnlyContract.userCounter();

        // Convert to regular numbers and round
        supply = Number(ethers.formatUnits(supply, 18));
        locked = Number(ethers.formatUnits(locked, 18));
        unclaimed = Number(ethers.formatUnits(unclaimed, 18));
        
        // Round the values
        supply = round(supply, 2);
        locked = round(locked, 2);
        unclaimed = round(unclaimed, 2);

        totalJobs = Number(ethers.formatUnits(totalJobs, 0));
        activeValidators = Number(ethers.formatUnits(activeValidators, 0));
        users = Number(ethers.formatUnits(users, 0));
        emissionRate = round(Number(ethers.formatUnits(emissionRate, 18)), 2);
        
        // Optional: Fetch the most recent 'StateUpdate' event
        let activeWorkers = 0;
        try {
          if (contract) {
            const currentBlock = await provider.getBlockNumber();
            const startBlock = Math.max(0, currentBlock - 500);
            const toBlock = Math.min(fromBlock + 500 - 1, currentBlock);
            const events = await contract.queryFilter("StateUpdate", startBlock, toBlock);
            
            if (events.length > 0) {
              console.log(1);
              const mostRecentStateUpdate = events[events.length - 1];
              if (mostRecentStateUpdate && mostRecentStateUpdate.args) {
                console.log(2);
                activeWorkers = Number(mostRecentStateUpdate.args.networkWorkers[0] || 0);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching state update events:', error);
        }
        
        // Set network stats and supply stats based on contract data
        setNetworkStats([
          { title: "Jobs Completed", amount: totalJobs, iconColor: "black", iconBg: "red", icon: <MdBusinessCenter /> },
          { title: "Active Validators", amount: activeValidators, iconColor: "black", iconBg: "lightBlue", icon: <MdVerifiedUser /> },
          { title: "Active Workers", amount: activeWorkers, iconColor: "black", iconBg: "grey", icon: <MdOutlineSettings /> },
          { title: "Users", amount: users, iconColor: "black", iconBg: "violet", icon: <MdOutlineSupervisorAccount /> },
        ]);

        setSupplyStats([
          { title: "Total Supply", amount: supply + unclaimed },
          { title: "Circulating Supply", amount: supply - locked },
          { title: "Locked", amount: locked },
          { title: "Unclaimed Rewards", amount: unclaimed },
          { title: "State Reward", amount: emissionRate },
          { title: "State Time (mins)", amount: 60 },
        ]);

        setStatus(isWalletConnected 
          ? 'Network stats updated. Your wallet is connected.' 
          : 'Network stats loaded. Connect wallet for personal stats.');
      } catch (error) {
        console.error('Error fetching public network stats:', error);
        setStatus('Error loading public network stats. Please try again later.');
      }
    }
  };

  // Check if user is on the correct network when connecting wallet
  const checkAndSwitchNetwork = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Get current chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const desiredChainIdHex = '0x14a34'; // Base Sepolia in hex (84532)
        
        if (chainId !== desiredChainIdHex) {
          try {
            // Try to switch to Base Sepolia
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: desiredChainIdHex }],
            });
            return true;
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: desiredChainIdHex,
                    chainName: 'Base Sepolia',
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18
                    },
                    rpcUrls: ['https://sepolia.base.org'],
                    blockExplorerUrls: ['https://sepolia.basescan.org']
                  }],
                });
                return true;
              } catch (addError) {
                setError('Could not add Base Sepolia network to your wallet.');
                return false;
              }
            } else {
              setError('Could not switch to Base Sepolia network.');
              return false;
            }
          }
        } else {
          // Already on the correct network
          return true;
        }
      } catch (error) {
        console.error(error);
        setError('Error checking network.');
        return false;
      }
    } else {
      setError('MetaMask is not installed.');
      return false;
    }
  };

  const connectToCoinbaseWallet = async () => {
    try {
      const coinbaseWallet = sdk.makeWeb3Provider(RPC_ENDPOINT, BASE_NETWORK_ID);
      const accounts = await coinbaseWallet.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(coinbaseWallet);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      const multisigContractInstance = new ethers.Contract(multisigAddress, multisigAbi, signer);
      setContract(contractInstance);
      setMultisig(multisigContractInstance);
      setUserAddress(accounts[0]);
      setIsWalletConnected(true);
      setStatus('Coinbase Wallet connected successfully.');
      setError('');
      
      // Fetch user-specific data after connection
      getUserData(contractInstance, accounts[0]);
    } catch (error) {
      console.error(error);
      setStatus('Error connecting to Coinbase Wallet.');
      setError('Error connecting to Coinbase Wallet.');
    }
  };

  const connectToContract = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setStatus('Connecting to wallet...');
        const correctNetwork = await checkAndSwitchNetwork();
        if (!correctNetwork) {
          setStatus('Please connect to Base Sepolia network to continue.');
          return;
        }
  
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create provider and signer using ethers
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Create contract instances after getting signer
        const contractInstance = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        
        const multisigContractInstance = new ethers.Contract(
          multisigAddress,
          multisigAbi,
          signer
        );
  
        setContract(contractInstance);
        setMultisig(multisigContractInstance);
        setUserAddress(accounts[0]);
        setIsWalletConnected(true);
        setStatus('Wallet connected successfully. Loading your data...');
        setError('');
        
        // Fetch user-specific data after connection
        getUserData(contractInstance, accounts[0]);
      } catch (error) {
        console.error(error);
        setStatus('Error connecting to Web Wallet.');
      }
    } else {
      setStatus('MetaMask is not installed.');
    }
  };
  
  // Separate function to get user-specific data
  const getUserData = async (contractInstance, address) => {
    try {
      let userBalance = await contractInstance.balanceOf(address);
      let userUnclaimed = await contractInstance.getUnclaimedRewards(address);
      let userLocked = await contractInstance.getLockedBalance(address);
      
      setUserBalance(Number(ethers.formatUnits(userBalance, 18)).toFixed(2));
      setUserUnclaimed(Number(ethers.formatUnits(userUnclaimed, 18)).toFixed(1));
      setUserLocked(Number(ethers.formatUnits(userLocked, 18)).toFixed(1));
      
      setStatus('Your data loaded successfully!');
    } catch (error) {
      console.error('Error fetching user data:', error);
      setStatus('Error loading your wallet data.');
    }
  };

  // Function to claim rewards - only available when wallet is connected
  const claimRewards = async () => {
    if (!contract) {
      setStatus('Connect to the wallet first to claim rewards.');
      return;
    }
    
    try {
      setStatus('Claiming rewards...');
      // Check if we need to reconnect the signer
      const provider = contract.runner?.provider;
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.claimRewards();
      await tx.wait();

      setStatus('Rewards claimed successfully!');
      
      // Refresh the user's balance and unclaimed rewards
      getUserData(contract, userAddress);
    } catch (error) {
      console.error('Error claiming rewards:', error);
      setStatus('Error claiming rewards: ' + error.message);
    }
  };

  // Function to refresh all data
  const refreshData = async () => {
    try {
      setStatus('Refreshing data...');
      
      // Always refresh public network stats
      await getPublicNetworkStats();
      
      // If wallet is connected, refresh user-specific data
      if (contract && userAddress !== '-') {
        await getUserData(contract, userAddress);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      setStatus('Error refreshing data.');
    }
  };
  
  return (
    <section className={`bg-gray-300 dark:bg-zinc-800 flex mt-5 flex-col border-t dark:border-t-white border-t-black items-center pb-10
                          border-b border-b-black dark:border-b-white px-1 xs:px-5`}>
      <div className="text-red-500 text-middle bg-gray-200 w-screen text-center md:-mr-0 -mr-5">
        {userAddress === '-' ? (
          <p className="p-2 underline text-lg">
            Connect Web Wallet to Access Dashboard
          </p>
        ) : (
          <div></div>
        )}
      </div>

      <div className="w-full flex flex-col items-end mt-5 md:mt-10">
        <div className="flex space-x-4">
        <ConnectWalletButton 
          connectToContract={connectToContract} 
          connectToCoinbaseWallet={connectToCoinbaseWallet} 
          contract={contract} 
        />

        </div>
      </div>

      <div className="max-w-[1380px] items-center w-full flex-wrap">
        <h1 className={`${styles.subheading} bg-stone-200 rounded-xl dark:bg-zinc-700 border dark:border-white border-black p-3 text-left px-6 mt-10 md:mt-0 max-w-[830px] mb-6`}>
          Smartnodes <span className="font-normal text-gray-400" style={{color: "#f7a6a0"}}>(testnet)</span> Dashboard
        </h1>
        
        <div className="flex mb-3 pt-2 ml-2 flex-wrap justify-start max-w-[1280px]">   
          <h1 className={`${styles.subheading2} text-left sm:px-10 md:px-0 xs:px-0 max-w-[1280px] text-black dark:text-[#8587de]`}>
            Token Info
          </h1> 
        </div>
        {/* <div className="border border-white dark:border-gray-400 max-w-[110px]">
          <h2 className={`font-semibold text-2xl p-1 pl-3 bg-zinc-200 dark:bg-zinc-500 text-black dark:text-gray-50`}>Supply</h2>
        </div> */}

        <div className="bg-gray-200 dark:bg-gray-600 mb-3 -mr-3 ss:-mr-0 rounded-xl dark:text-gray-200 p-4 xs:p-7 pt-7 overflow-x-scroll border border-black dark:border-gray-400 max-w-[750px]">
          <div className="mb-5 px-1 mt-2 xs:mt-3">
            <h2 className={`font-bold text-xl text-gray-400`}>Account</h2>
            <p className="text-lg xs:text-2xl overflow-auto font-semibold">{userAddress ? userAddress : "No address connected"}</p>
          </div>  
          <div className="flex flex-wrap px-1 mb-3">
            <div className="mt-1 pr-20">
              <p className="font-bold text-xl text-gray-400">Balance</p>
              <p className="text-xl xs:text-2xl">
                {(isNaN(Number(userBalance)) ? '-' : Number(userBalance).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }))}
              </p>
            </div>  
            <div className="pr-20 mt-1">
              <p className="font-bold text-xl text-gray-400">Locked</p>
              <p className="text-xl xs:text-2xl">
                {(isNaN(Number(userLocked)) ? '-' : Number(userLocked).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }))}
              </p>
            </div>  
            <div className="pr-5 mt-1">
              <p className="font-bold text-xl text-gray-400">Unclaimed Rewards</p>
              <p className="text-xl xs:text-2xl">
                {(isNaN(Number(userUnclaimed)) ? '-' : Number(userUnclaimed).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }))}
              </p>
            </div>  
            <a
              onClick={claimRewards}
              className="mt-7 inline-block px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-md text-sm md:text-base font-semibold cursor-pointer"
            >
              Claim Rewards
            </a>
          </div>
        </div>

        <SupplyStatsCard supplyStats={supplyStats}/>
    
        <div className="flex mb-3 pt-8 ml-2 flex-wrap justify-start max-w-[1280px]">
          <h1 
            className={`${styles.subheading2} text-left sm:px-10 md:px-0 xs:px-0 max-w-[1280px] text-black dark:text-[#cbbcf6]`}
          >
            Network Info
          </h1>    
        </div>

        <div className="flex flex-wrap justify-start gap-1 items-center w-full mb-4">
          {networkStats.map((item, index) => (
            <div key={index} className="flex flex-row bg-slate-200 dark:bg-slate-600 h-30 dark:text-gray-200 dark:bg-secondary-dark-bg min-w-[245px] max-w-[90%] p-4 pt-7 rounded-2xl m-1 border border-gray-600 mr-3">
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-3xl opacity-0.9 rounded-full max-h-[55px] p-3 border border-gray-300 hover:drop-shadow-xl xs:-ml-0 -ml-0"
              >
                {item.icon}
              </button>
              <div className="xs:ml-5 ml-1 my-1">
                <p>
                  <span className="text-2xl font-semibold">{item.amount}</span>
                </p>
                <p className="text-md text-gray-400 mt-1">{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        <SmartnodesDashboard contract={contract} multisig={multisig}/>
        
        {/* <TensorlinkDashboard /> */}
          {/* <div className="flex flex-wrap sm:m-3 pt-0 justify-start gap-1 items-center w-full">
            {dashboardOptions.map((item, index) => (
              <button 
                key={index} 
                onClick={async () => {
                  if (index === 0) {
                    const flaskRunning = await checkFlaskInstance(item.endpoint);
                    console.log(item.endpoint);
                    setActiveDashboard(item.component)
                  }
                }}
                disabled={index !== 0}
                className={`flex bg-gray-200 dark:bg-slate-600 h-[60px] dark:text-gray-200 dark:bg-secondary-dark-bg
                  max-w-[285px] min-w-[245px] p-3 sm:pt-1 mt-4 rounded-2xl mr-5 ${index === 0 
                  ? "dark:hover:border-white hover:border-black" : ""}`}
              >
                <div
                  type="button"
                  style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                  className="flex text-3xl opacity-0.9 sm:p-2 border-gray-300">
                  <div className="text-[1.75rem] opacity-0.9 rounded-full p-[0.2rem] border border-gray-300">
                    {item.icon}
                  </div>
                  <p className="mt-[0.3rem] ml-3 text-lg font-bold text-gray-400">{item.title}</p>
                </div>
              </button>
            ))}
          </div> */}
        {/* {activeDashboard && (
          <div className="mt-10 w-full p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <div className="space-x-3">
              <Button
                color="black"
                bgColor="lightGrey"
                text="Create User"
                borderRadius="10px"
                onClick={createUser}
              />
              <Button
                color="black"
                bgColor="lightGrey"
                text="Create Job"
                borderRadius="10px"
                onClick={requestJob}
              />
              <input type="text"/>
              
            </div>
            {activeDashboard}
            {checkFlaskInstance && (
              <div/>
            )}
          </div>
        )} */}
      </div>
    </section>
  );
};

export default SmartnodesApp;