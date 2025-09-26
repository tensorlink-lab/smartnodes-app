import React from "react";

const SmartnodesOverview = () => (
  <section path="/docs" className="px-5 mt-6 md:px-12 flex flex-col border-t dark:border-t-white border-t-black items-center justify-center h-full w-full">
    <div className="text-left px-5 xs:px-0 mt-5 max-w-[1380px] justify-center items-center">
      {/* Header Section */}
      <div className="flex items-center mb-6 mt-5">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-8 w-2 mr-4 rounded-lg"></div>
        <h1 className="text-xl sm:text-3xl dark:text-zinc-100 font-bold">Modular Peer-to-Peer Infrastructure for Python</h1>
      </div>

      {/* Hero Description */}
      <div className="mb-8">
        <p className="text-lg dark:text-gray-300 text-black mb-6 leading-relaxed">
          Smartnodes is a modular P2P node framework in Python designed for distributed resource sharing applications, 
          providing developers with the tools to harness volunteer compute resources while ensuring fair compensation 
          through integrated smart contract rewards.
        </p>
        
        {/* Status Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-400 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Library In Development
              </h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                <p>
                  Smartnodes is currently being extracted and modularized from Tensorlink into a standalone Python library. 
                  Documentation will be updated as the library matures. Use the resources below to understand the current ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold dark:text-zinc-100 mb-4">Architecture Overview</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <h4 className="font-medium dark:text-blue-200 text-blue-800">P2P Network Layer</h4>
            </div>
            <p className="text-sm dark:text-blue-300 text-blue-700">
              Modular node framework for distributed computing and resource sharing (currently part of the Tensorlink repo)
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <h4 className="font-medium dark:text-purple-200 text-purple-800">Smart Contracts</h4>
            </div>
            <p className="text-sm dark:text-purple-300 text-purple-700">
              Automated reward distribution for computational work and resource contributions
            </p>
          </div>
          
         <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h4 className="font-medium dark:text-green-200 text-green-800">Resource Flexibility</h4>
            </div>
            <p className="text-sm dark:text-green-300 text-green-700">
              Share computate, bandwidth, or custom services to power scientific applications in Python
            </p>
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Foundation */}
        <div className="border dark:border-gray-700 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m-2-8a3 3 0 00-3 3v6a3 3 0 003 3m2-13a3 3 0 00-3 3v6a3 3 0 003 3m-8-13a3 3 0 00-3 3v6a3 3 0 003 3" />
            </svg>
            <h3 className="text-lg font-semibold dark:text-zinc-100">Foundation Resources</h3>
          </div>
          <div className="space-y-2">
            <a className="block dark:text-blue-300 text-blue-600 hover:underline" href="/tensorlink/docs">
              → Tensorlink Documentation
            </a>
            <a className="block dark:text-blue-300 text-blue-600 hover:underline" href="/tensorlink/setup">
              → Node Setup Guide
            </a>
          </div>
          <p className="text-sm dark:text-gray-400 text-gray-600 mt-3">
            Current P2P network implementation with AI/ML compute sharing capabilities.
          </p>
        </div>

        {/* Smart Contract System */}
        <div className="border dark:border-gray-700 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-lg font-semibold dark:text-zinc-100">Smart Contract System</h3>
          </div>
          <div className="space-y-2">
            <a className="block dark:text-blue-300 text-blue-600 hover:underline" href="/lightpaper">
              → Smartnodes Lightpaper
            </a>
            <a className="block dark:text-blue-300 text-blue-600 hover:underline" href="/app">
              → Smartnode Dashboard
            </a>
          </div>
          <p className="text-sm dark:text-gray-400 text-gray-600 mt-3">
            Reward distribution system for P2P work contributions and resource sharing.
          </p>
        </div>

        {/* Future Library */}
        <div className="border-2 border-dashed dark:border-gray-600 border-gray-300 rounded-lg p-6 hover:border-green-400 dark:hover:border-green-500 transition-colors">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h3 className="text-lg font-semibold dark:text-zinc-100">Modular Library</h3>
          </div>
          <div className="space-y-2 opacity-60">
            <span className="block dark:text-gray-400 text-gray-600">→ pip install smartnodes</span>
            <span className="block dark:text-gray-400 text-gray-600">→ API Documentation</span>
            <span className="block dark:text-gray-400 text-gray-600">→ Integration Examples</span>
          </div>
          <p className="text-sm dark:text-gray-400 text-gray-600 mt-3">
            Standalone Python library for building custom P2P applications (coming soon).
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold dark:text-zinc-100 mb-4">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium dark:text-zinc-100">Modular Architecture</h4>
              <p className="text-sm dark:text-gray-400 text-gray-600">Extract and reuse node components across different P2P applications</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium dark:text-zinc-100">Automated Rewards</h4>
              <p className="text-sm dark:text-gray-400 text-gray-600">Smart contract integration for fair compensation of network contributors</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium dark:text-zinc-100">Python Native</h4>
              <p className="text-sm dark:text-gray-400 text-gray-600">Built for Python developers with PyTorch integration for AI workloads</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium dark:text-zinc-100">Multi-Network Support</h4>
              <p className="text-sm dark:text-gray-400 text-gray-600">Design supports integration with various P2P networks beyond Tensorlink</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold dark:text-zinc-100 mb-3">Getting Started</h3>
        <p className="dark:text-gray-300 text-gray-700 mb-4">
          While the standalone Smartnodes library is in development, you can explore the current ecosystem:
        </p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">1</span>
            <span className="dark:text-gray-300 text-gray-700">Set up a Tensorlink node to understand the P2P architecture</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">2</span>
            <span className="dark:text-gray-300 text-gray-700">Review the Smartnodes lightpaper for the reward system design</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">3</span>
            <span className="dark:text-gray-300 text-gray-700">Monitor development progress through the dashboard</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 text-center">
        <a className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg" href="/">
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