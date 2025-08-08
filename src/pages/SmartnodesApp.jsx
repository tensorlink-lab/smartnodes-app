import React, { useEffect, useState } from 'react';
import tokenAbiArtifact from "../assets/SmartnodesToken.json";
import coreAbiArtifact from "../assets/SmartnodesCore.json";
import coordinatorAbiArtifact from '../assets/SmartnodesCoordinator.json';
import { SmartnodesDashboard } from "../components";
import { ethers } from 'ethers';
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

const SmartnodesApp = () => {
  // Utility function
  const round = (num, decimals) => {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  };

  // Network configuration
  const RPC_ENDPOINT = "http://127.0.0.1:8545";
  // const BASE_NETWORK_ID = 84532;
  // const CHAIN_ID_HEX = '0x14a34'; // Base Sepolia (84532)
  const BASE_NETWORK_ID = 31337;
  const CHAIN_ID_HEX = '0x7A69'; 
  
  
  // Contract addresses
  const CONTRACT_ADDRESSES = {
    token: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    core: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    coordinator: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
  };

  // ABIs
  const tokenAbi = tokenAbiArtifact.abi;
  const coreAbi = coreAbiArtifact.abi;
  const coordinatorAbi = coordinatorAbiArtifact.abi;

  // State variables
  const [status, setStatus] = useState('Loading network stats...');
  const [error, setError] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  // Contract instances
  const [tokenContract, setTokenContract] = useState(null);
  const [coreContract, setCoreContract] = useState(null);
  const [multisigContract, setMultisigContract] = useState(null);
  const [readOnlyProvider, setReadOnlyProvider] = useState(null);
  const [readOnlyContracts, setReadOnlyContracts] = useState({
    token: null,
    core: null,
    coordinator: null
  });

  // User data
  const [userAddress, setUserAddress] = useState('-');
  const [userBalance, setUserBalance] = useState("-");
  const [userLocked, setUserLocked] = useState("-");
  const [userUnclaimed, setUserUnclaimed] = useState("-");
  
  // Network stats
  const [supplyStats, setSupplyStats] = useState([
    { title: "Total Supply", amount: "-" },
    { title: "Locked", amount: "-" },
    { title: "Unclaimed Rewards", amount: "-" },
    { title: "State Reward", amount: "-" },
    { title: "State Time (s)", amount: "-" }
  ]);

  // Coinbase Wallet SDK
  const sdk = new CoinbaseWalletSDK({
    appName: 'Smartnodes'
  });

  // Initialize read-only provider and contracts
  useEffect(() => {
    const initReadOnlyProvider = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);
        setReadOnlyProvider(provider);
        
        const contracts = {
          token: new ethers.Contract(CONTRACT_ADDRESSES.token, tokenAbi, provider),
          core: new ethers.Contract(CONTRACT_ADDRESSES.core, coreAbi, provider),
          coordinator: new ethers.Contract(CONTRACT_ADDRESSES.coordinator, coordinatorAbi, provider)
        };
        
        setReadOnlyContracts(contracts);
        setStatus('Initializing public data connection...');
      } catch (error) {
        console.error('Error creating read-only provider:', error);
        setStatus('Error initializing data connection.');
        setError('Failed to initialize blockchain connection');
      }
    };
    
    initReadOnlyProvider();
  }, []);

  // Fetch public network stats when read-only contracts are available
  useEffect(() => {
    if (readOnlyContracts.token) {
      getSmartContractStats();
    }
  }, [readOnlyContracts.token]);

  // Function to fetch public network stats
  const getSmartContractStats = async () => {
    try {
      setStatus('Loading network stats...');
      
      const { token: readOnlyToken, core: readOnlyCore } = readOnlyContracts;
      
      // Test if contract exists by calling a simple view function
      try {
        await readOnlyToken.name(); // This should work if contract exists
      } catch (testError) {
        throw new Error(`Token contract not found at ${CONTRACT_ADDRESSES.token}. Please verify the contract address.`);
      }

      // Fetch supply data
      const result = await readOnlyToken.getSupply();
      const [supply, locked, unclaimed] = result.map(val => BigInt(val));
      
      const emissionRate = await readOnlyToken.getEmissionRate();
      const totalJobs = (await readOnlyCore.getJobCount()) - BigInt(1);

      // Convert and format values
      const formattedSupply = round(Number(ethers.formatUnits(supply, 18)), 2);
      const formattedLocked = round(Number(ethers.formatUnits(locked, 18)), 2);
      const formattedUnclaimed = round(Number(ethers.formatUnits(unclaimed, 18)), 2);
      const formattedEmissionRate = round(Number(ethers.formatUnits(emissionRate, 18)), 2);
      const formattedTotalJobs = Number(ethers.formatUnits(totalJobs, 0));

      setSupplyStats([
        { title: "Total Supply", amount: formattedSupply + formattedUnclaimed },
        { title: "Circulating Supply", amount: formattedSupply - formattedLocked },
        { title: "Locked", amount: formattedLocked },
        { title: "Unclaimed Rewards", amount: formattedUnclaimed },
        { title: "State Reward", amount: formattedEmissionRate },
        { title: "State Time (mins)", amount: 60 },
      ]);

      setStatus(isWalletConnected 
        ? 'Network stats updated. Your wallet is connected.' 
        : 'Network stats loaded. Connect wallet for personal stats.');
        
    } catch (error) {
      console.error('Error fetching network stats:', error);
      setStatus('Error loading network stats.');
      setError(error.message || 'Failed to load network statistics');
    }
  };

  // Check and switch to correct network
  const checkAndSwitchNetwork = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed.');
      return false;
    }

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId !== CHAIN_ID_HEX) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CHAIN_ID_HEX }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            // Chain not added, try to add it
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: CHAIN_ID_HEX,
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
          } else {
            throw new Error('Could not switch to Base Sepolia network.');
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Network switch error:', error);
      setError(error.message || 'Error checking network.');
      return false;
    }
  };

  // Get user-specific data from contracts
  const getUserData = async (tokenContractInstance, address) => {
    try {
    setStatus('Loading your wallet data...');
    
    let balance;
    try {
      balance = await tokenContractInstance.balanceOf(address);
    } catch (error) {
      balance = 0;
    }
    
    let unclaimedRewards;
    try {
      unclaimedRewards = await tokenContractInstance.getUnclaimedRewards(address);
    } catch (error) {
      unclaimedRewards = { sno: 0, eth: 0 };
    }
    
    let lockedTokens;
    try {
      lockedTokens = await tokenContractInstance.getLockedTokens(address);
    } catch (error) {
      lockedTokens = { sno: 0, eth: 0 };
    }
    
    // Process the results
    setUserBalance(balance ? Number(ethers.formatUnits(balance, 18)).toFixed(2) : '0');
    
    // Handle PaymentAmounts struct safely
    const unclaimedSno = unclaimedRewards && unclaimedRewards.sno ? 
      Number(ethers.formatUnits(unclaimedRewards.sno, 18)).toFixed(1) : '0';
    const unclaimedEth = unclaimedRewards && unclaimedRewards.eth ? 
      Number(ethers.formatUnits(unclaimedRewards.eth, 18)).toFixed(1) : '0';
    
    const lockedSno = lockedTokens && lockedTokens.sno ? 
      Number(ethers.formatUnits(lockedTokens.sno, 18)).toFixed(1) : '0';
    const lockedEth = lockedTokens && lockedTokens.eth ? 
      Number(ethers.formatUnits(lockedTokens.eth, 18)).toFixed(1) : '0';
    
      setUserBalance(Number(ethers.formatUnits(balance, 18)).toFixed(2));
    
      setUserUnclaimed(unclaimedSno);
      setUserLocked(lockedSno);
      
      setStatus('Your data loaded successfully!');
      setError('');
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setStatus('Error loading your wallet data.');
      setError(error.message || 'Failed to load wallet data');
    }
  };

  // Connect to MetaMask/Web3 wallet
  const connectToContract = async () => {
    try {
      setStatus('Connecting to wallet...');
      setError('');
      
      const correctNetwork = await checkAndSwitchNetwork();
      if (!correctNetwork) {
        setStatus('Please connect to Base Sepolia network to continue.');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Create contract instances with signer
      const tokenContractInstance = new ethers.Contract(CONTRACT_ADDRESSES.token, tokenAbi, signer);
      const multisigContractInstance = new ethers.Contract(CONTRACT_ADDRESSES.coordinator, coordinatorAbi, signer);

      setTokenContract(tokenContractInstance);
      setMultisigContract(multisigContractInstance);
      setUserAddress(accounts[0]);
      setIsWalletConnected(true);
      
      // Fetch user data
      await getUserData(tokenContractInstance, accounts[0]);
      
    } catch (error) {
      console.error('Connection error:', error);
      setStatus('Error connecting to wallet.');
      setError(error.message || 'Failed to connect wallet');
      setIsWalletConnected(false);
    }
  };

  // Connect to Coinbase Wallet
  const connectToCoinbaseWallet = async () => {
    try {
      setStatus('Connecting to Coinbase Wallet...');
      setError('');
      
      const coinbaseWallet = sdk.makeWeb3Provider(RPC_ENDPOINT, BASE_NETWORK_ID);
      const accounts = await coinbaseWallet.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(coinbaseWallet);
      const signer = await provider.getSigner();
      
      const tokenContractInstance = new ethers.Contract(CONTRACT_ADDRESSES.token, tokenAbi, signer);
      const multisigContractInstance = new ethers.Contract(CONTRACT_ADDRESSES.coordinator, coordinatorAbi, signer);
      
      setTokenContract(tokenContractInstance);
      setMultisigContract(multisigContractInstance);
      setUserAddress(accounts[0]);
      setIsWalletConnected(true);
      
      await getUserData(tokenContract, accounts[0]);
      
    } catch (error) {
      console.error('Coinbase Wallet connection error:', error);
      setStatus('Error connecting to Coinbase Wallet.');
      setError(error.message || 'Failed to connect Coinbase Wallet');
      setIsWalletConnected(false);
    }
  };

  // Claim rewards function
  const claimRewards = async () => {
    if (!tokenContract) {
      setStatus('Connect to the wallet first to claim rewards.');
      return;
    }
    
    try {
      setStatus('Claiming rewards...');
      setError('');
      
      const tx = await tokenContract.claimRewards();
      setStatus('Transaction submitted. Waiting for confirmation...');
      
      await tx.wait();
      setStatus('Rewards claimed successfully!');
      
      // Refresh user data
      await getUserData(tokenContract, userAddress);
      
    } catch (error) {
      console.error('Error claiming rewards:', error);
      setStatus('Error claiming rewards.');
      setError(error.message || 'Failed to claim rewards');
    }
  };
  
  return (
    <SmartnodesDashboard 
      supplyStats={supplyStats}
      userAddress={userAddress}
      userBalance={userBalance}
      userLocked={userLocked}
      userUnclaimed={userUnclaimed}
      claimRewards={claimRewards}
      contract={tokenContract}
      tokenAddress={CONTRACT_ADDRESSES.token}
      coordinatorAddress={CONTRACT_ADDRESSES.coordinator}
      connectToContract={connectToContract}
      connectToCoinbaseWallet={connectToCoinbaseWallet}
      status={status}
      error={error}
      isWalletConnected={isWalletConnected}
    />
  );
};

export default SmartnodesApp;