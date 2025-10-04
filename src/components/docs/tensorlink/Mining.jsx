import React from "react";
import styles from "../../../style";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { NavButton } from "../..";

const Mining = () => (
  <section className="px-5 md:px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full bg-white dark:bg-neutral-950">
    <div className="text-left py-7 max-w-[900px] w-full">
      {/* Page Title */}
      <div className="pb-4 mb-6 border-b dark:border-neutral-800 border-neutral-200">
        <h1 className="text-4xl font-bold dark:text-white text-neutral-900 mb-2">
          Running a Node (Mining)
        </h1>
        <p className="text-lg dark:text-neutral-400 text-neutral-600">
          Contribute compute to Tensorlink by running a worker node.
        </p>
      </div>

      {/* Intro */}
      <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-5">
        Contributing compute to Tensorlink is as simple as running a node. Whether you’re a hobbyist with a spare GPU 
        or managing a cluster, your hardware can help power real-world machine learning workflows. By mining, 
        you join a decentralized ecosystem that rewards contributors for supporting distributed inference and training jobs.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Minimum Requirements
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
          A modern NVIDIA GPU with CUDA support (RTX 30xx or better), at least 16 GB of RAM (32+ recommended), 
          and Linux (Ubuntu 20.04+ preferred). Multi-GPU support and Windows compatibility are still in development.
        </p>
      </div>

      {/* Step 1 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          1. Download the Node Binary
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
          Download the latest{" "}
          <a href="https://github.com/smartnodes-lab/tensorlink/releases" className="text-blue-500 underline">
            Tensorlink release
          </a>{" "}
          and locate the{" "}
          <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">
            tensorlink-miner
          </code>{" "}
          binary. Ensure you have Python 3 and a CUDA-enabled GPU installed.
        </p>
      </div>

      {/* Step 2 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          2. Node Configuration
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
          Open the{" "}
          <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">config.json</code>{" "}
          file and add:
        </p>
        <ul className="list-disc pl-6 text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
          <li><strong>Wallet Address</strong> — to receive rewards.</li>
          <li><strong>Idle Script Path</strong> — optional script while idle (TBD).</li>
          <li><strong>"mining": "true"</strong> — enables mining mode (TBD).</li>
        </ul>
      </div>

      {/* Step 3 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          3. Run the Worker Node
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Use the provided script:
        </p>
        <div className="max-w-[600px] overflow-x-auto">
          <SyntaxHighlighter
            language="bash"
            style={vscDarkPlus}
            className="text-xs sm:text-sm md:text-base p-2 sm:p-4 rounded-lg"
          >
            {`./run-worker.sh`}
          </SyntaxHighlighter>
        </div>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mt-4">
          Once started, your node will contribute compute and earn rewards.
        </p>
      </div>
    </div>

    {/* Navigation */}
    <div className="flex mt-8 mb-10 justify-between max-w-[900px] w-full pt-8 border-t dark:border-neutral-800 border-neutral-200">
      <NavButton className="text-left" title="Nodes" subtitle="Previous" page="tensorlink/docs/nodes" />
      <NavButton className="text-right" title="Community" subtitle="Next" page="tensorlink/docs/community" />
    </div>
  </section>
);

export default Mining;
