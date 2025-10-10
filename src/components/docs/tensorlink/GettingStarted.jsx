import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "../../../style";
import { NavButton } from "../..";

const GettingStarted = () => (
  <section
    path="/docs/install"
    className="px-5 md:px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full"
  >
    <div className="text-left py-7 max-w-[1200px] w-full">
      {/* Page Title */}
      <div className="pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          Getting Started
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Install Tensorlink and set up your environment for distributed model training.
        </p>
      </div>

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300 mb-4">
          This section guides you through the installation of Tensorlink and its prerequisites.
          If your primary goal is to run a distributed model in Python, follow along here.
          For model API access, you may also explore the{" "}
          <a
            href="/tensorlink/docs/api"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Inference API
          </a>{" "}
          section. If you want to contribute compute resources to the network, see the{" "}
          <a
            href="/tensorlink/docs/mining"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Contributing Resources (Mining)
          </a>{" "}
          guide.
        </p>
      </div>

      {/* Requirements */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Requirements
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Ensure your environment meets the following requirements before installing Tensorlink:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-base dark:text-neutral-300 text-neutral-700">
          <li>UNIX/MacOS (Windows support is planned for a future release)</li>
          <li>Python 3.10 or higher</li>
          <li>PyTorch 2.3+ (confirm that your models are compatible with your PyTorch version)</li>
        </ul>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mt-4">
          These constraints will be gradually relaxed as Tensorlink matures, but Python 3.10+ and 
          a UNIX-based OS are currently required for stable usage.
        </p>
      </div>

      {/* Installation */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Installation
        </h2>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Install Tensorlink directly from PyPI:
        </p>
        <div className="my-4">
          <SyntaxHighlighter
            language="bash"
            style={vscDarkPlus}
            className="rounded-lg !bg-neutral-900 !text-neutral-100 text-sm"
          >
            {`pip install tensorlink`}
          </SyntaxHighlighter>
        </div>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          This command installs Tensorlink along with its dependencies. If you are working 
          in a virtual environment (recommended), ensure it is activated before running the 
          installation command.
        </p>
      </div>
    </div>

    {/* Navigation */}
    <div className="flex mt-8 mb-10 justify-between max-w-[1200px] w-full pt-8 border-t dark:border-neutral-800 border-neutral-200">
      <NavButton className="text-left" title="Overview" subtitle="Previous" page="tensorlink/docs/overview" />
      <NavButton className="text-right" title="Model Setup" subtitle="Next" page="tensorlink/docs/model" />
    </div>
  </section>
);

export default GettingStarted;
