import { motion } from "framer-motion";
import { ActionMenu, ConnectWalletButton } from "..";
import { useState } from "react";

const Account = ({ 
    handleActionClick,
    userAddress,
    userBalance,
    userLocked,
    userUnclaimed,
    connectToContract,
    connectToCoinbaseWallet,
    contract,
    claimData
 }) => {
    const [claiming, setClaiming] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const handleBatchClaim = async () => {
        if (!contract) {
            setError('Contract not initialized. Please connect your wallet.');
            return;
        }

        if (claimData.length === 0) {
            setError('No claims available');
            return;
        }

        setClaiming(true);
        setError('');
        setStatus('Preparing batch claim transaction...');

        try {
            const distributionIds = claimData.map(item => item.distribution_id);
            const capacities = claimData.map(item => item.capacity);
            const merkleProofs = claimData.map(item => item.merkle_proof || []);

            setStatus('Submitting transaction...');

            const tx = await contract.batchClaimMerkleRewards(
            distributionIds,
            capacities,
            merkleProofs
            );

            setStatus('Transaction submitted. Waiting for confirmation...');
            await tx.wait();
            setStatus('Rewards claimed successfully!');
        } catch (err) {
            console.error('Error claiming rewards:', err);
            setError(err.message || 'Failed to claim rewards. Please try again.');
            setStatus('');
        } finally {
            setClaiming(false);
        }
    };
    
    return (
        <div>
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-zinc-50 mb-2 dark:bg-zinc-800 rounded-xl dark:text-gray-200 p-4 sm:pt-4 overflow-x-scroll border border-black dark:border-gray-400 max-w-[700px]"
            >
                <div className="flex justify-between items-center">
                    <h1 className="font-extrabold text-xl sm:text-2xl mb-1 text-neutral-800 dark:text-white py-1">Account</h1>
                    {/* <ActionMenu style={{ zIndex: 100 }} onActionClick={handleActionClick} /> */}
                </div>
                <div className="mb-2 px-1 xs:mt-1">
                    <h2 className="font-bold text-xl text-gray-400">Address</h2>
                    <p className="text-lg xs:text-2xl overflow-auto font-semibold">
                    {userAddress ? userAddress : "No address connected"}
                    </p>
                </div>  
                
                <div className="flex flex-wrap px-1 mb-2">
                    <div className="pr-20">
                        <p className="font-bold text-xl text-gray-400">Balance</p>
                        <p className="text-xl xs:text-2xl mb-2">
                            {isNaN(Number(userBalance)) ? (
                                <span>-</span>
                            ) : (
                                <>
                                {Number(userBalance).toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 1,
                                })}
                                <span className="text-sm ml-1">SNO</span>
                                </>
                            )}
                        </p>
                    </div>  
                    <div className="pr-20">
                        <p className="font-bold text-xl text-gray-400">Locked</p>
                        <p className="text-xl xs:text-2xl mb-2">
                            {isNaN(Number(userLocked)) ? (
                                <span>-</span>
                            ) : (
                                <>
                                {Number(userLocked).toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 1,
                                })}
                                <span className="text-sm ml-1">SNO</span>
                                </>
                            )}
                        </p>
                    </div>  
                    <div className="pr-5">
                        <p className="font-bold text-xl text-gray-400">Unclaimed Rewards</p>
                        <p className="text-xl xs:text-2xl mb-2">
                            {isNaN(Number(userUnclaimed)) ? (
                                <span>-</span>
                            ) : (
                                <>
                                {Number(userUnclaimed).toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 1,
                                })}
                                <span className="text-sm ml-1">SNO</span>
                                </>
                            )}
                        </p>
                    </div>  
                </div>
                
                <div className="flex flex-wrap gap-3 items-center mt-2 px-1">
                    <div>
                        <ConnectWalletButton 
                            connectToContract={connectToContract} 
                            connectToCoinbaseWallet={connectToCoinbaseWallet} 
                            contract={contract} 
                        />
                    </div>
                    <a
                        onClick={handleBatchClaim}
                        className="border border-gray-400 inline-block p-1.5 px-3 text-white bg-blue-500 hover:bg-blue-600 rounded-md text-sm md:text-base font-semibold cursor-pointer"
                    >
                        Claim Rewards
                    </a>
                </div>
                {/* Status Messages */}
                {status && (
                    <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg flex items-center gap-2">
                    <MdCheckCircle />
                    <span>{status}</span>
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
                    <MdError />
                    <span>{error}</span>
                    </div>
                )}
            </motion.div>      
        </div>
    );
}

export default Account;
