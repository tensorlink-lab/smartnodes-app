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

const Installation = () => (
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
          <a href="/tensorlink/docs/model" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
            Model Setup
          </a>
        </div>
      </div>

      {/* Page Title */}
      <div className="pb-4 mb-4 ">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Getting Started
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Install Tensorlink and set up your environment for distributed AI inference and training
        </p>
      </div>

      {/* Requirements */}
      <div className="mb-12">
        <div className="space-y-6 relative pl-6">
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-neutral-300 dark:bg-neutral-700" />
          {[
            {
              title: "Operating System",
              body: (
                <>
                  UNIX-based systems (Linux, macOS) are currently supported. Windows users can run Tensorlink via WSL 
                  (Windows Subsystem for Linux). Native Windows support is planned for future releases.
                </>
              ),
            },
            {
              title: "Python Version",
              body: (
                <>
                  Python 3.10 or higher is required. Check your version with{" "}
                  <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">
                    python --version
                  </code>{" "}
                  or{" "}
                  <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">
                    python3 --version
                  </code>.
                </>
              ),
            },
            {
              title: "PyTorch",
              body: (
                <>
                  PyTorch 2.3 or higher is required. If you don't have PyTorch installed, visit{" "}
                  <a
                    href="https://pytorch.org/get-started/locally/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    pytorch.org
                  </a>{" "}
                  for installation instructions specific to your hardware (CPU, CUDA, ROCm, MPS).
                </>
              ),
            },
            {
              title: "GPU (Optional)",
              body: (
                <>
                  A GPU is not required to use Tensorlink as a client, since model execution happens on remote workers. However, 
                  if you plan to contribute compute resources or run private worker nodes, an NVIDIA GPU with CUDA support is recommended.
                </>
              ),
            },
          ].map((item, i) => (
            <div key={i} className="relative flex gap-4">
              {/* dot */}
              <span className="mt-2 h-2 w-2 rounded-full bg-neutral-500 dark:bg-neutral-400 flex-shrink-0" />

              <div>
                <h4 className="text-sm sm:text-base font-medium dark:text-white text-neutral-900 mb-1">
                  {item.title}
                </h4>
                <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Installation */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Installation
        </h2>
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Install Tensorlink directly from PyPI using pip. We recommend using a virtual environment to isolate dependencies 
          and avoid conflicts with other projects.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
            Step 1: Create a Virtual Environment (Recommended)
          </h3>
          <div className="bg-neutral-900 rounded-lg p-4 mb-3">
            <SyntaxHighlighter language="bash" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
              {installCommand}
            </SyntaxHighlighter>
          </div>
          <p className="text-sm dark:text-neutral-400 text-neutral-600">
            Your terminal prompt should now show <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">(tensorlink-env)</code> indicating 
            the environment is active.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
            Step 2: Install Tensorlink
          </h3>
          <div className="bg-neutral-900 rounded-lg p-4 mb-3">
            <SyntaxHighlighter language="bash" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
              pip install tensorlink
            </SyntaxHighlighter>
          </div>
          <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
            This installs Tensorlink and its core dependencies. If you haven't installed PyTorch yet, pip will attempt to 
            install a CPU-only version. For GPU support, install PyTorch separately first with the appropriate CUDA version.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
            Step 3: Verify Installation
          </h3>
          <div className="bg-neutral-900 rounded-lg p-4 mb-3">
            <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
              {`python -c "import tensorlink; print(tensorlink.__version__)"`}
            </SyntaxHighlighter>
          </div>
          <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
            If the command prints a version number without errors, installation was successful.
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4">
          <p className="text-sm dark:text-amber-200 text-amber-900 font-medium mb-2">
            💡 Troubleshooting
          </p>
          <p className="text-sm dark:text-amber-100 text-amber-800 mb-2">
            If you encounter installation errors, ensure you have the latest pip version:
          </p>
          <div className="bg-neutral-900 rounded-lg p-3 mb-2">
            <pre className="text-neutral-100 text-sm overflow-x-auto">
              <code>pip install --upgrade pip</code>
            </pre>
          </div>
          <p className="text-sm dark:text-amber-100 text-amber-800">
            For persistent issues, check the{" "}
            <a 
              href="https://github.com/mattjhawken/tensorlink/issues" 
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              GitHub Issues
            </a>{" "}
            or ask for help in our{" "}
            <a 
              href="https://discord.gg/aCW2kTNzJ2" 
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              Discord community
            </a>.
          </p>
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
        <a href="/tensorlink/docs/model" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
          Model Setup
        </a>
      </div>
    </div>
  </section>
);

export default Installation;