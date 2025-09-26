import { useState } from 'react';
import { MdClose, MdRocket } from 'react-icons/md';

const AirdropIndicator = ({ 
    isVisible = true,
    title = "Testnet & Airdrop Now Live!",
    description = "Run a Tensorlink node to earn rewards!",
    actionText = "Learn More",
    onActionClick,
    onClose,
    closable = true,
    pulseEffect = true
}) => {
    const [visible, setVisible] = useState(isVisible);

    const handleClose = () => {
        setVisible(false);
        if (onClose) onClose();
    };

    const handleActionClick = () => {
        if (onActionClick) onActionClick();
    };

    if (!visible) return null;

    const pulseClasses = pulseEffect ? "animate-pulse" : "";

    return (
        <div className="w-full flex justify-center mb-2">
            <div
                className="
                    bg-gradient-to-r from-purple-700 via-pink-700 to-red-600 text-white
                    px-4 py-3 relative overflow-hidden rounded-lg w-full border dark:border-neutral-200 border-black"
            >
                {/* Background animation effect */}
                <div className="absolute inset-0 bg-blue-300 opacity-10 animate-pulse"></div>
                
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Icon with pulse effect */}
                        <div className={pulseClasses}>
                            <MdRocket className="text-2xl xs:block hidden" />
                        </div>
                        
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <div className="flex items-center font-bold text-sm sm:text-base">
                            {title}
                            {/* Small screen rocket (inline with title) */}
                            <MdRocket className={`text-2xl xs:hidden inline mr-4 ${pulseClasses}`} />
                        </div>
                        <span className="text-xs sm:text-sm opacity-90">
                            {description}
                        </span>
                    </div>

                    </div>

                    <div className="flex items-center space-x-1">
                        {/* Action button */}
                        {actionText && (
                            <button
                                onClick={handleActionClick}
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
                            </button>
                        )}

                        {/* Close button */}
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
