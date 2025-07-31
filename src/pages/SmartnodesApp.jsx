import React, { useEffect, useState } from 'react';
import abiArtifact from "../assets/SmartnodesCore.json";
import multisigAbiArtifact from '../assets/SmartnodesMultiSig.json';
import { motion } from "framer-motion";
import styles, { layout } from "../style";
import { Button, SmartnodesDashboard } from "../components";
import { ethers } from 'ethers';
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

const SmartnodesApp = () => {
  function round(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }

  // State variables
  const [status, setStatus] = useState('Loading network stats...');
  const [contract, setContract] = useState(null);
  const [multisig, setMultisig] = useState(null);
  const [readOnlyContract, setReadOnlyContract] = useState(null);
  const [readOnlyProvider, setReadOnlyProvider] = useState(null);
  const [userAddress, setUserAddress] = useState('-');
  const [userBalance, setUserBalance] = useState("-");
  const [userLocked, setUserLocked] = useState("-");
  const [userUnclaimed, setUserUnclaimed] = useState("-");
  const [error, setError] = useState('');    
  const [supplyStats, setSupplyStats] = useState([
        { title: "Total Supply", amount: "-" },
        { title: "Locked", amount: "-" },
        { title: "Unclaimed Rewards", amount: "-" },
        { title: "State Reward", amount: "-" },
        { title: "State Time (s)", amount: "-" }
    ]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const API_BASE_URL = "https://smartnodes.ddns.net/tensorlink-api";
  const RPC_ENDPOINT = "https://sepolia.base.org";
  const BASE_NETWORK_ID = 84532;
  const contractAddress = '0x64eC74C9370F684783cBf606eEDdd4Ba7fDFc338';
  const multisigAddress = '0x63592eA5012A660308A82b4cCDcA05f5C4d357Fa';
  const abi = abiArtifact.abi;
  const multisigAbi = multisigAbiArtifact.abi;

  const sdk = new CoinbaseWalletSDK({
    appName: 'Smartnodes'
  });

  // Fetch public network stats when read-only contract is available
  useEffect(() => {
    if (readOnlyContract) {
      getSmartContractStats();
    }
  }, [readOnlyContract]);

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

  // Function to fetch public network stats using read-only provider
  const getSmartContractStats = async () => {
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
        setSupplyStats([
          { title: "Total Supply", amount: supply + unclaimed },
          { title: "Circulating Supply", amount: supply - locked },
          { title: "Locked", amount: locked },
          { title: "Unclaimed Rewards", amount: unclaimed },
          { title: "State Reward", amount: emissionRate },
          { title: "State Time (mins)", amount: 60 },
        ]);

        console.log('supplyStats in parent:', supplyStats);

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
  
  return (
    <SmartnodesDashboard 
      supplyStats={supplyStats}
      userAddress={userAddress}
      userBalance={userBalance}
      userLocked={userLocked}
      userUnclaimed={userUnclaimed}
      claimRewards={claimRewards}
      handleActionClick={handleActionClick}
      contract={contract}
      contractAddress={contractAddress}
      multisigAddress={multisigAddress}
      connectToContract={connectToContract}
      connectToCoinbaseWallet={connectToCoinbaseWallet}
    />
  );
};

export default SmartnodesApp;