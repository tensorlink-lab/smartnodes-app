import React, { useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import styles from "../../style";

const ConnectWalletButton = ({ connectToContract, connectToCoinbaseWallet, contract }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" style={{zIndex:10000}}>
      {/* Main Button with Dropdown Indicator */}
      <button
        className="flex items-center px-4 py-3 border border-gray-400 rounded-lg shadow hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold text-md dark:text-gray-50 text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {contract ? "Connected" : "Connect Wallet"}
        <FaChevronUp className={`ml-2 transition-transform duration-200 ${isOpen ? "" : "rotate-180"}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute left-0 bottom-full mb-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg w-48">
          <li>
            <button
              className="font-semibold text-md dark:text-gray-100 text-gray-500 block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                connectToContract();
                setIsOpen(false);
              }}
            >
              Connect with MetaMask
            </button>
          </li>
          <li>
            <button
              className="font-semibold text-md dark:text-gray-100 text-gray-500 block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                connectToCoinbaseWallet();
                setIsOpen(false);
              }}
            >
              Connect with Coinbase Wallet
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ConnectWalletButton;
