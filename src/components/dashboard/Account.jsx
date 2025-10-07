import { motion } from "framer-motion";
import { ActionMenu, ConnectWalletButton } from "..";

const Account = ({ 
    handleActionClick,
    userAddress,
    userBalance,
    userLocked,
    userUnclaimed,
    claimRewards,
    connectToContract,
    connectToCoinbaseWallet,
    contract
 }) => {
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
                    <a
                    onClick={claimRewards}
                    className="border border-gray-400 inline-block p-1.5 px-3 text-white bg-blue-500 hover:bg-blue-600 rounded-md text-sm md:text-base font-semibold cursor-pointer"
                    >
                        Claim Rewards
                    </a>
                    <div>
                        <ConnectWalletButton 
                            connectToContract={connectToContract} 
                            connectToCoinbaseWallet={connectToCoinbaseWallet} 
                            contract={contract} 
                        />
                    </div>
                </div>
            </motion.div>      
        </div>
    );
}

export default Account;