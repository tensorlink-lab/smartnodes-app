import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const installCommand = `# Create virtual environment
python -m venv tensorlink-env

# Activate virtual environment
# On Linux/macOS:
source tensorlink-env/bin/activate

# On Windows (WSL):
source tensorlink-env/bin/activate`;

const GettingStarted = () => (
  <section
    path="/docs/install"
    className="px-5 md:px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full"
  >
    <div className="text-left py-7 max-w-[1200px] w-full">
      {/* Navigation */}
      <div className="flex mb-10 justify-between max-w-[1200px] w-full">
        <div className="text-left">
          <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Previous</div>
          <a href="/tensorlink/docs/overview" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
            Overview
          </a>
        </div>
        <div className="text-right">
          <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Next</div>
          <a href="/tensorlink/docs/install" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
            Installation
          </a>
        </div>
      </div>

      {/* Page Title */}
      <div className="pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Getting Started
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Install Tensorlink and set up your environment for distributed AI inference and training
        </p>
      </div>

      {/* Quick Start Paths */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-6 pb-2">
          Choose Your Path
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300 mb-4">
          Tensorlink offers three primary ways to get started, depending on your use case:
        </p>  
        <div className="grid gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
            <h3 className="text-md font-semibold dark:text-white text-neutral-900 mb-2">
              🐍 Python Library Installation
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
              Install via pip to use <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">DistributedModel</code> and{" "}
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">DistributedOptimizer</code> in 
              your PyTorch projects. Best for developers integrating distributed execution into existing codebases.
            </p>
            <a 
              href="/tensorlink/docs/install" 
              className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Continue to the Next Section →
            </a>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="text-md font-semibold dark:text-white text-neutral-900 mb-2">
              🌐 HTTP API Access
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
              Use OpenAI-compatible endpoints to access models without installing anything. Perfect for web applications, 
              serverless functions, or quick prototyping. Available on the public network or your own private infrastructure.
            </p>
            <a 
              href="/tensorlink/docs/api" 
              className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View API Documentation →
            </a>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="text-md font-semibold dark:text-white text-neutral-900 mb-2">
              🖥️ Run a Node
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
              Download node software to contribute GPU resources, earn blockchain rewards, or deploy private infrastructure 
              with your own API endpoints. Supports worker nodes (GPU execution), validator nodes (request routing), or both.
            </p>
            <a 
              href="/tensorlink/docs/mining" 
              className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Node Setup Guide →
            </a>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-4 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Additional Resources
        </h2>
        
        <div className="grid gap-4">
          <a 
            href="https://discord.gg/aCW2kTNzJ2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-2xl">💬</span>
            <div>
              <h4 className="font-semibold dark:text-white text-neutral-900 mb-1">Join the Discord Community</h4>
              <p className="text-sm dark:text-neutral-400 text-neutral-600">
                Get help, share projects, and stay updated on the latest features
              </p>
            </div>
          </a>

          <a 
            href="https://github.com/mattjhawken/tensorlink"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
          >
            <span className="text-2xl">📚</span>
            <div>
              <h4 className="font-semibold dark:text-white text-neutral-900 mb-1">View on GitHub</h4>
              <p className="text-sm dark:text-neutral-400 text-neutral-600">
                Explore examples, the source code, report issues, and contribute to development
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>

    {/* Navigation */}
    <div className="flex mt-8 mb-10 justify-between max-w-[1200px] w-full pt-8 border-t dark:border-neutral-800 border-neutral-200">
      <div className="text-left">
        <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Previous</div>
        <a href="/tensorlink/docs/overview" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
          Overview
        </a>
      </div>
      <div className="text-right">
        <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Next</div>
        <a href="/tensorlink/docs/install" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
          Installation
        </a>
      </div>
    </div>
  </section>
);

export default GettingStarted;