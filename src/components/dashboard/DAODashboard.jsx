import { motion } from 'framer-motion';
import { useState, useEffect } from "react";

// Mock styles object for demonstration
const styles = {
  subheading: "text-2xl font-bold",
  subheading2: "text-2xl font-bold"
};

const DAODashboard = ({
  loading,
  fetchNetworkData,
  networkStats,
  networkHistory,
  error
}) => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark); // trigger re-render
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full mt-2 max-w-[1380px] space-y-2">
      <div className="mb-6">

        <h1 className={`${styles.subheading2} dark:text-white py-3`}>
          Active Networks
        </h1>
        
        <div className="">
            {/* Tensorlink Network Status */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 mb-2 px-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center bg-green-100 dark:bg-green-800/30 rounded-lg p-3 border-2 border-gray-300 dark:border-neutral-400 shadow-md"
                >
                </motion.div>
            </div>

            {/* Section header for Tensorlink data */}
            <div className="mb-4 mt-5">
                <div className="flex items-center justify-center">
                <div className="flex-1 h-px bg-green-300 dark:bg-green-600"></div>
                <div className="mx-4 text-sm text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-800/50 px-3 py-1 rounded-full">
                    Tensorlink Network Analytics
                </div>
                <div className="flex-1 h-px bg-green-300 dark:bg-green-600"></div>
                </div>
            </div>

            {/* Charts Container - Side by side on large screens */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 rounded-lg">
              </motion.div>
            </div>
        </div>

        {/* Last Updated */}
        {networkHistory?.metadata && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center pb-10">
            Last updated: {new Date(networkHistory.metadata.generated_at_iso).toLocaleString()}
        </div>
        )}
    </div>
    );
};

export default DAODashboard;