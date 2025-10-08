import React, { useEffect, useState } from 'react';
import tokenAbiArtifact from "../assets/SmartnodesERC20.json";
import coreAbiArtifact from "../assets/SmartnodesCore.json";
import coordinatorAbiArtifact from '../assets/SmartnodesCoordinator.json';
import daoAbiArtifact from '../assets/SmartnodesDAO.json';
import { SmartnodesDashboard } from "../components";
import { ethers } from 'ethers';
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

const SmartnodesApp = ({ activeMenu }) => {
  // Utility function
  const round = (num, decimals) => {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  };

  // Network configuration
  // const RPC_ENDPOINT = "http://127.0.0.1:8545";
  const RPC_ENDPOINT = "https://sepolia.base.org";
  const BASE_NETWORK_ID = 84532;
  const CHAIN_ID_HEX = '0x14a34'; // Base Sepolia (84532)
  // const BASE_NETWORK_ID = 31337;
  // const CHAIN_ID_HEX = '0x7A69'; 
  
  
  // Contract addresses
  const CONTRACT_ADDRESSES = {  
    token: '0x9b38874d53c99861CbB87B25c54C1Fc2e5827fED',
    timelock: '0x18261818ed1bEfB24B70153a373b8351D9ed8e7e',
    dao: '0x21758f11900F2737a47617731CAaB7EA84332EE5',
    core: '0x36e13F23F90E226074A66324209A23F754a86c0B',
    coordinator: '0xcB9b80dF839c9850970832Da4bcD3faE895D3Ff4'
  };
1
  // ABIs
  const tokenAbi = tokenAbiArtifact.abi;
  const coreAbi = coreAbiArtifact.abi;
  const coordinatorAbi = coordinatorAbiArtifact.abi;
  const daoAbi = daoAbiArtifact.abi;

  // State variables
  const [status, setStatus] = useState('Loading network stats...');
  const [error, setError] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  // Contract instances
  const [tokenContract, setTokenContract] = useState(null);
  const [coreContract, setCoreContract] = useState(null);
  const [multisigContract, setMultisigContract] = useState(null);
  const [daoContract, setDAOContract] = useState(null);
  const [readOnlyProvider, setReadOnlyProvider] = useState(null);
  const [readOnlyContracts, setReadOnlyContracts] = useState({
    token: null,
    core: null,
    coordinator: null
  });
  const [signer, setSigner] = useState(null);

  // User data
  const [userAddress, setUserAddress] = useState('-');
  const [userBalance, setUserBalance] = useState("-");
  const [userLocked, setUserLocked] = useState("-");
  
  // Network stats
  const [supplyStats, setSupplyStats] = useState([
    { title: "Total Supply", amount: "-", suffix: "SNO" },
    { title: "Circulating Supply", amount: "-", suffix: "SNO" },
    { title: "Locked", amount: "-", suffix: "SNO" },
    { title: "Unclaimed Rewards", amount: "-", suffix: "SNO" },
    { title: "State Reward", amount: "-", suffix: "SNO" },
    { title: "State Time", amount: "-", suffix: "hours" },
    { title: "DAO Treasury", amount: "-", suffix: "SNO" }
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
          coordinator: new ethers.Contract(CONTRACT_ADDRESSES.coordinator, coordinatorAbi, provider),
          dao: new ethers.Contract(CONTRACT_ADDRESSES.dao, coordinatorAbi, provider)
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
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          setIsWalletConnected(true);
          getUserData(tokenContract, accounts[0]);
        } else {
          setIsWalletConnected(false);
          setUserAddress(null);
        }
      });
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
      const result = await readOnlyToken.getSupplyBreakdown();
      const [supply, circulating, locked, unclaimed, escrowed, a] = result.map(val => BigInt(val));
      
      // Convert and format values
      const formattedSupply = round(Number(ethers.formatUnits(supply, 18)), 2);
      const formattedLocked = round(Number(ethers.formatUnits(locked, 18)), 2);
      const formattedUnclaimed = round(Number(ethers.formatUnits(unclaimed, 18)), 2);
      const daoBalanceRaw = await readOnlyToken.balanceOf(CONTRACT_ADDRESSES.timelock);
      const formattedDao = round(Number(ethers.formatUnits(daoBalanceRaw, 18)), 2);
      // const stateTime = await readOnlyCore.getStateTime();

      setSupplyStats([
        { title: "Total Supply", amount: formattedSupply + formattedUnclaimed, suffix: "SNO" },
        { title: "Circulating Supply", amount: formattedSupply - formattedLocked, suffix: "SNO" },
        { title: "Locked", amount: formattedLocked, suffix: "SNO" },
        { title: "Unclaimed Rewards", amount: formattedUnclaimed, suffix: "SNO" },
        { title: "State Reward", amount: 45000, suffix: "SNO" },
        { title: "State Time", amount: 8, suffix: "hours" },
        { title: "DAO Treasury", amount: formattedDao, suffix: "SNO" }
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
      
      let lockedTokens;
      try {
        const lockInfo = await tokenContractInstance.getLockInfo(address);
        const { locked, isValidator, timestamp, lockAmount } = lockInfo;
        lockedTokens = { sno: Number(ethers.formatUnits(lockAmount, 18)).toFixed(2), eth: 0 };
        setUserLocked(lockedTokens.sno);
        console.log(lockInfo);
      } catch (error) {
        lockedTokens = { sno: 0, eth: 0 };
        console.log(error);
      }
      
      // Process the results
      setUserBalance(balance ? Number(ethers.formatUnits(balance, 18)).toFixed(2) : '0');
      const lockedSno = lockedTokens && lockedTokens.sno ? 
      Number(ethers.formatUnits(lockedTokens.sno, 18)).toFixed(1) : '0';
    
      setUserBalance(Number(ethers.formatUnits(balance, 18)).toFixed(2));
    
      setUserLocked(lockedSno);
      
      setStatus('Your data loaded successfully!');
      setError('');
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setStatus('Error loading your wallet data.');
      setError(error.message || 'Failed to load wallet data');
    }
  };

  const [connecting, setConnecting] = useState(false);

  const connectToContract = async () => {
    if (connecting) return; // Prevent multiple simultaneous calls
    setConnecting(true);
    setStatus('Connecting to wallet...');
    setError('');

    try {
      if (!window.ethereum) {
        setStatus('MetaMask not detected');
        setError('Please install MetaMask');
        return;
      }

      const correctNetwork = await checkAndSwitchNetwork();
      if (!correctNetwork) {
        setStatus('Please connect to Base Sepolia network to continue.');
        return;
      }

      // Check if already connected
      let accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        // Only request accounts if not already connected
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instances
      const tokenContractInstance = new ethers.Contract(CONTRACT_ADDRESSES.token, tokenAbi, signer);
      setTokenContract(tokenContractInstance);
      setMultisigContract(new ethers.Contract(CONTRACT_ADDRESSES.coordinator, coordinatorAbi, signer));
      setCoreContract(new ethers.Contract(CONTRACT_ADDRESSES.core, coreAbi, signer));
      setDAOContract(new ethers.Contract(CONTRACT_ADDRESSES.dao, daoAbi, signer));
      setUserAddress(accounts[0]);
      setSigner(signer);
      setIsWalletConnected(true);
      
      // Fetch user data
      await getUserData(tokenContractInstance, accounts[0]);

      setStatus('Wallet connected');
    } catch (error) {
      console.error('Connection error:', error);
      if (error.code === -32002) {
        setStatus('MetaMask request already pending. Please check your wallet.');
      } else {
        setStatus('Error connecting to wallet.');
        setError(error.message || 'Failed to connect wallet');
      }
      setIsWalletConnected(false);
    } finally {
      setConnecting(false);
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
      
      await getUserData(tokenContractInstance, accounts[0]);
      
    } catch (error) {
      console.error('Coinbase Wallet connection error:', error);
      setStatus('Error connecting to Coinbase Wallet.');
      setError(error.message || 'Failed to connect Coinbase Wallet');
      setIsWalletConnected(false);
    }
  };

  return (
    <SmartnodesDashboard 
      supplyStats={supplyStats}
      userAddress={userAddress}
      userBalance={userBalance}
      userLocked={userLocked}
      contract={tokenContract}
      tokenAddress={CONTRACT_ADDRESSES.token}
      coordinatorAddress={CONTRACT_ADDRESSES.coordinator}
      coreAddress={CONTRACT_ADDRESSES.core}
      dao={daoContract}
      daoAddress={CONTRACT_ADDRESSES.dao}
      connectToContract={connectToContract}
      connectToCoinbaseWallet={connectToCoinbaseWallet}
      status={status}
      error={error}
      isWalletConnected={isWalletConnected}
      signer={signer}
      token={tokenContract}
      activeMenu={activeMenu}
    />
  );
};

export default SmartnodesApp;