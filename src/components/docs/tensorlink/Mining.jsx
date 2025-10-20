import React from "react";
import { HiOutlineClipboard } from "react-icons/hi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { NavButton } from "../..";

const Mining = () => (
  <section className="px-5 md:px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full">
    <div className="text-left py-7 max-w-[1200px] w-full">
      {/* Page Title */}
      <div className="pb-4 mb-6 border-b dark:border-neutral-800 border-neutral-200">
        <h1 className="text-4xl font-bold dark:text-white text-neutral-900 mb-2">
          Running a Worker Node
        </h1>
        <p className="text-lg dark:text-neutral-400 text-neutral-600">
          Contribute compute to Tensorlink by running a worker node.
        </p>
      </div>

      {/* Intro */}
      <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-5">
        Contributing compute to Tensorlink is as simple as downloading the node software and running a script. 
        Depending on your setup, you may need to install Python, pip, and NVIDIA CUDA drivers. Whether you’re a hobbyist with a spare GPU or managing a cluster, your hardware can help power machine learning workflows for yourself and others.
      </p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Minimum Requirements
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
          - Modern NVIDIA GPU with CUDA support (RTX 20xx or better)<br/>
          - At least 16 GB of RAM (32+ recommended)<br/>
          - Linux (Ubuntu 20.04+ preferred)<br/>
          <br/>
          Multi-GPU and AMD support, Windows, and Apple compatibility are in development. Python and CUDA drivers may need to be installed depending on your system.
        </p>
      </div>

      {/* Step 0: Optional installation instructions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          0. Install Dependencies (if needed)
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
          If Python or CUDA is not installed, you can install them with the following commands:
        </p>
        <SyntaxHighlighter
          language="bash"
          style={vscDarkPlus}
          className="text-xs sm:text-sm md:text-base p-2 sm:p-4 rounded-lg mb-3"
        >
          {`# Install Python and pip
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Check CUDA installation (NVIDIA GPU required)
nvidia-smi`}
        </SyntaxHighlighter>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
          For NVIDIA CUDA installation guides, visit <a href="https://developer.nvidia.com/cuda-downloads" className="text-blue-500 underline">NVIDIA CUDA Downloads</a>.
        </p>
      </div>

      {/* Step 1 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          1. Download and extract the node binary
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Download and extract the {" "}
          <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">
            tensorlink-miner
          </code>{" "}
          from the latest {" "}
          <a href="https://github.com/smartnodes-lab/tensorlink/releases" className="text-blue-500 underline">
            release.
          </a>
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-[800px] w-full">
            <button
              onClick={() => navigator.clipboard.writeText('tar -xvf tensorlink-miner-linux.v0.X.X.tar.gz && cd tensorlink-miner')}
              className="absolute right-2 top-2 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded flex items-center gap-1 transition-colors"
              title="Copy to clipboard"
            >
              <HiOutlineClipboard className="w-4 h-4" />
            </button>
            <SyntaxHighlighter
              language="bash"
              style={vscDarkPlus}
              className="text-xs sm:text-sm md:text-base p-2 sm:p-4 rounded-lg"
            >
              {`tar -xvf tensorlink-miner-linux.v0.X.X.tar.gz && cd tensorlink-miner`}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          2. Node Configuration
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
          Open the{" "}
          <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">config.json</code>{" "}
          file and fill in the required fields:
        </p>
        <ul className="list-disc pl-6 text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          <li><strong>address</strong> — your Ethereum/Base wallet address to receive rewards.</li>
          <li><strong>mining</strong> — set to <code>true</code> to enable mining mode (off by default).</li>
          <li><strong>mining-script</strong> — optional, if mining is enabled, specify the executable path here.</li>
        </ul>

        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
          Example configuration with idle script enabled:
        </p>

        <div className="flex justify-center">
          <div className="relative max-w-[800px] w-full">
            <button
              onClick={() => navigator.clipboard.writeText('tar -xvf tensorlink-miner-linux.v0.X.X.tar.gz && cd tensorlink-miner')}
              className="absolute right-2 top-2 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded flex items-center gap-1 transition-colors"
              title="Copy to clipboard"
            >
              <HiOutlineClipboard className="w-4 h-4" />
            </button>
            <SyntaxHighlighter
                        language="json"
                        style={vscDarkPlus}
                        className="text-xs sm:text-sm md:text-base p-2 sm:p-4 rounded-lg"
                      >
                  {`{
  "address": "0x1Bc3a15dfFa205AA24F6386D959334ac1BF27336",
  "local": false,        // Set true to run in local mode (no peer discovery; isolated/private networks only)
  "trusted": false,      // Set true to disable peer and model verification (unsafe; only for trusted/private networks)
  "mining": true,        // Set true to run the mining script when idle
  "mining-script": "../1.98/mine_tari_CR29_luckypool.sh"  // Absolute or relative path to the mining script from tensorlink-miner folder
}`}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          3. Run the Worker Node
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Use the provided script to start your node:
        </p>
        <div className="flex justify-center">
          <div className="relative max-w-[800px] w-full">
            <button
              onClick={() => navigator.clipboard.writeText('tar -xvf tensorlink-miner-linux.v0.X.X.tar.gz && cd tensorlink-miner')}
              className="absolute right-2 top-2 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded flex items-center gap-1 transition-colors"
              title="Copy to clipboard"
            >
              <HiOutlineClipboard className="w-4 h-4" />
            </button>
            <SyntaxHighlighter
              language="bash"
              style={vscDarkPlus}
              className="text-xs sm:text-sm md:text-base p-2 sm:p-4 rounded-lg"
            >
              {`./run-worker.sh`}
            </SyntaxHighlighter>
          </div>
        </div>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mt-4">
          The first start may take a few minutes while Python dependencies are installed. Once started, your node will contribute compute and earn rewards.
        </p>
      </div>
    </div>

    {/* Support & Issues */}
    <div className="mb-8 max-w-[1200px] w-full">
      <h2 className="text-xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
        Support & Issues
      </h2>
      <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
        If you run into any issues or have questions, the best place to ask is on our{" "}
        <a href="https://discord.com/invite/aCW2kTNzJ2" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Discord
        </a>
        . You can also report bugs or request features on{" "}
        <a href="https://github.com/smartnodes-lab/tensorlink/issues" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          GitHub Issues
        </a>.
      </p>
    </div>

    {/* Navigation */}
    <div className="flex mt-4 mb-10 justify-between max-w-[1200px] w-full pt-8 border-t dark:border-neutral-800 border-neutral-200">
      <NavButton className="text-left" title="Nodes" subtitle="Previous" page="tensorlink/docs/nodes" />
      <NavButton className="text-right" title="Community" subtitle="Next" page="tensorlink/docs/community" />
    </div>
  </section>
);

export default Mining;
