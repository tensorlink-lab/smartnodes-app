import { useState, useEffect } from 'react';
import { MdClose, MdRocket } from 'react-icons/md';

const AirdropIndicator = ({ 
    localStorageKey = "airdropClosed", // key to store close state
    title = "Testnet Now Live!",
    description = "Run a Tensorlink node to support the network.",
    actionText = "Learn More",
    closable = true,
    closeOnAction = false, // NEW: close permanently on action click
    pulseEffect = true
}) => {
    const [visible, setVisible] = useState(() => {
        const stored = localStorage.getItem(localStorageKey);
        return stored !== "true";
    });


    // On mount, check localStorage to see if it was closed before
    useEffect(() => {
        const closed = localStorage.getItem(localStorageKey);
        if (closed === "true") {
            setVisible(false);
        }
    }, [localStorageKey]);

    const handleClose = () => {
        setVisible(false);
        localStorage.setItem(localStorageKey, "true"); // persist closed state
    };

    const handleActionClick = () => {
        if (onActionClick) onActionClick();
        if (closeOnAction) {
            handleClose(); // close permanently if specified
        }
    };

    if (!visible) return null;

    const pulseClasses = pulseEffect ? "animate-pulse" : "";

    return (
        <div className="w-full flex justify-center mb-2 max-w-[1380px]">
            <div
                className="
                    bg-gradient-to-r from-blue-800 via-pink-800 to-red-700 text-white
                    p-2 relative overflow-hidden rounded-lg w-full border dark:border-neutral-200 border-black"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/100 via-pink-500/100 to-purple-500/100 animate-pulse opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/100 via-blue-500/100 to-blue-500/100 animate-pulse opacity-30" style={{ animationDelay: '1s' }}></div>
                
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={pulseClasses}>
                            <MdRocket className="text-2xl xs:block hidden" />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                            <div className="flex items-center font-bold text-sm sm:text-base">
                                {title}
                                <MdRocket className={`text-2xl xs:hidden inline mr-4 ${pulseClasses}`} />
                            </div>
                            <span className="text-xs sm:text-sm opacity-90">
                                {description}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1">
                        {actionText && (
                            <a
                                href="docs"
                                onClick={closeOnAction ? handleClose : undefined}
                                className="
                                    bg-white bg-opacity-20 hover:bg-opacity-30 
                                    text-white text-xs sm:text-sm font-medium 
                                    px-2 xs:px-3 py-1 rounded-full 
                                    transition-all duration-200 
                                    hover:scale-105 active:scale-95
                                    border border-white border-opacity-30
                                "
                            >
                                {actionText}
                            </a>
                        )}

                        {closable && (
                            <button
                                onClick={handleClose}
                                className="
                                    text-white hover:text-gray-200
                                    transition-colors duration-200 
                                    xs:p-1 hover:bg-white hover:bg-opacity-20 rounded-full
                                "
                                aria-label="Close airdrop notification"
                            >
                                <MdClose className="text-lg" />
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AirdropIndicator;
