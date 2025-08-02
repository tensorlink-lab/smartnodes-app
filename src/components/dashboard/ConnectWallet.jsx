import React, { useState } from "react";
import { FaChevronUp } from "react-icons/fa";

const ConnectWalletButton = ({ connectToContract, connectToCoinbaseWallet, contract }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" style={{ zIndex: 10000000 }}>
      {/* Main Button */}
      <button
        className="flex items-center px-3 py-2 border border-gray-400 rounded-lg shadow hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold text-sm xs:text-md dark:text-gray-50 text-gray-800"
        onClick={() => setIsOpen((prev) => !prev)}
      >

        {contract ? <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div> : <div></div>}
        {contract ? "Connected" : "Connect Wallet"}
        <FaChevronUp
          className={`ml-2 transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`}
        />
      </button>

      {/* Dropdown Menu with Transition */}
      <div
        className={`
          absolute left-0 bottom-full mb-2
          bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
          rounded-lg shadow-lg overflow-hidden
          transition-all duration-300 ease-in-out
          transform
          ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
        `}
        style={{ zIndex: 10000000000 }}
      >
        <ul>
          <li>
            <button
              className="font-semibold text-sm xs:text-md dark:text-gray-100 text-gray-500 block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => {
                connectToContract();
                setIsOpen(false);
              }}
            >
              MetaMask
            </button>
          </li>
          <li>
            <button
              className="font-semibold text-sm xs:text-md dark:text-gray-100 text-gray-500 block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => {
                connectToCoinbaseWallet();
                setIsOpen(false);
              }}
            >
              Coinbase
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectWalletButton;
