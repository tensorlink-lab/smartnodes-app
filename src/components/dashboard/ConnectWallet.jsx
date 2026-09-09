import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardArrowDown } from "react-icons/md";

const ConnectWalletButton = ({ connectToContract, connectToCoinbaseWallet, contract }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef} style={{ zIndex: 10000000 }}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-800 dark:text-[#EDEFF4] hover:border-gray-300 dark:hover:border-white/20 transition-colors"
      >
        {contract ? (
          <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
            <motion.span
              className="absolute h-2 w-2 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.8, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative h-1 w-1 rounded-full bg-emerald-400" />
          </span>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-white/20 shrink-0" />
        )}
        {contract ? "Connected" : "Connect Wallet"}
        <MdKeyboardArrowDown
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 bottom-full z-20 mb-2 w-full min-w-[180px] overflow-hidden rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12151c] shadow-lg"
          >
            <button
              className="flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-gray-600 dark:text-[#9AA2B4] transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              onClick={() => {
                connectToContract();
                setIsOpen(false);
              }}
            >
              MetaMask
            </button>
            <button
              className="flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-gray-600 dark:text-[#9AA2B4] transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              onClick={() => {
                connectToCoinbaseWallet();
                setIsOpen(false);
              }}
            >
              Coinbase
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectWalletButton;
