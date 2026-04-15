import React from "react";

const SmartnodesOverview = () => (
  <section path="/docs" className="px-5 mt-6 md:px-12 flex flex-col border-t dark:border-t-white border-t-black items-center justify-center h-full w-full">
    <div className="text-left px-5 xs:px-0 mt-5 max-w-[1380px] justify-center items-center">
      {/* Header Section */}
      <div className="flex items-center mb-6 mt-5">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-8 w-2 mr-4 rounded-lg"></div>
        <h1 className="text-xl sm:text-3xl dark:text-zinc-100 font-bold">Smartnodes</h1>
      </div>

      {/* Current Status Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-l-4 border-green-500 p-5 mb-8 rounded-r-lg shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-base font-bold text-green-900 dark:text-green-100 mb-2">
              Testnet Now Live on Tensorlink
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              Join the testnet to support the development and stress test of Smartnodes and Tensorlink!
            </p>
            <a 
              href="/tensorlink/docs/mining" 
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              Set Up a Node
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* What is Smartnodes */}
      <div className="mb-10">
        <p className="text-base dark:text-gray-300 text-gray-700 mb-6 leading-relaxed">
          Smartnodes is a modular peer-to-peer framework for Python that enables distributed resource sharing.
          It provides the infrastructure for building applications that require data processing & computing power,
          handling peer networking, resource coordination, and a built-in smart contract reward system.
        </p>
        
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-lg p-5">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <h4 className="font-semibold dark:text-blue-200 text-blue-800">P2P Network Layer</h4>
            </div>
            <p className="text-sm dark:text-blue-300 text-blue-700">
              Flexible node framework for distributed computing and resource sharing across applications
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-lg p-5">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <h4 className="font-semibold dark:text-purple-200 text-purple-800">Smart Contract Rewards</h4>
            </div>
            <p className="text-sm dark:text-purple-300 text-purple-700">
              Automated payment distribution for computational work and resource contributions
            </p>
          </div>
          
         <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-lg p-5">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h4 className="font-semibold dark:text-green-200 text-green-800">Python Native</h4>
            </div>
            <p className="text-sm dark:text-green-300 text-green-700">
              Built for Python developers to easily integrate with existing ML and scientific workloads
            </p>
          </div>
        </div>
        
        <p className="text-base dark:text-gray-300 text-gray-700 my-8 leading-relaxed">
          This page will host the official documentation for the Smartnodes library once it has been modularized
          from the Tensorlink codebase. The library will expose the same core peer-to-peer networking and compute
          coordination modules that currently power Tensorlink, allowing developers to create other decentralized
          resource sharing applications. 
        </p>
      </div>

      {/* Current Implementation */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold dark:text-zinc-100 mb-4">Current Implementation: Tensorlink</h2>
        <p className="text-base dark:text-gray-300 text-gray-700 mb-6 leading-relaxed">
          The Smartnodes framework is currently powering Tensorlink, a peer-to-peer network for AI compute sharing. This testnet deployment demonstrates the full capabilities of the system in production.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border dark:border-gray-700 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold dark:text-zinc-100">Documentation</h3>
            </div>
            <p className="text-sm dark:text-gray-400 text-gray-600 mb-4">
              Learn how the network operates and how to participate as a node operator
            </p>
            <a className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium" href="/tensorlink/docs">
              View Tensorlink Docs
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="border dark:border-gray-700 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-semibold dark:text-zinc-100">Dashboard</h3>
            </div>
            <p className="text-sm dark:text-gray-400 text-gray-600 mb-4">
              Monitor your node performance and track your testnet rewards
            </p>
            <a className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium" href="/app">
              Open Dashboard
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold dark:text-zinc-100 mb-4">Roadmap</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold dark:text-zinc-100 mb-1">Smartnodes Testnet</h3>
              <p className="text-sm dark:text-gray-400 text-gray-600">Reputation and reward system distributing testnet tokens to contributors, currently live on Base Sepolia</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold dark:text-zinc-100 mb-1">Tensorlink Release</h3>
              <p className="text-sm dark:text-gray-400 text-gray-600">The first Smartnodes application showcasing P2P AI compute sharing</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 relative">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold dark:text-zinc-100 mb-1">Standalone Library</h3>
              <p className="text-sm dark:text-gray-400 text-gray-600">Core node framework extracted into a reusable Python library for other P2P applications</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 relative">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold dark:text-zinc-100 mb-1">Second Application</h3>
              <p className="text-sm dark:text-gray-400 text-gray-600">IoT hardware network exploring another Smartnodes use case (stay tuned!) 📡 </p>
            </div>
          </div>

          <div className="flex items-start opacity-60">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-4">
              <div className="w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold dark:text-zinc-100 mb-1">Security Audit</h3>
              <p className="text-sm dark:text-gray-400 text-gray-600">Smartnodes contract security audit.</p>
            </div>
          </div>

          <div className="flex items-start opacity-60">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-4">
              <div className="w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold dark:text-zinc-100 mb-1">Smartnodes Mainnet & Airdrop</h3>
              <p className="text-sm dark:text-gray-400 text-gray-600">Launch on Base mainnet post-audit, with rewards airdropped to testnet node operators.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Learn More */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold dark:text-zinc-100 mb-4">Learn More</h2>
        <div className="border dark:border-gray-700 border-gray-200 rounded-lg p-6">
          <p className="text-base dark:text-gray-300 text-gray-700 mb-4">
            Read the technical whitepaper to understand the architecture, reward mechanisms, and vision for the Smartnodes ecosystem.
          </p>
          <a 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium" 
            href="https://github.com/tensorlink-lab/smartnodes-core/blob/main/whitepaper.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the Whitepaper
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Navigation */}
      <div className="my-8 text-center">
        <a className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg" href="/">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return Home
        </a>
      </div>
    </div>
  </section>
);

export default SmartnodesOverview;