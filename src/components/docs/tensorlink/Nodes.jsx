import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const publicWorkerConfig = `{
  "node": {
    "type": "worker",
    "mode": "public",
    "endpoint": false,
    "priority_nodes": []
  },
  "crypto": {
    "address": "0x1Bc3a15dfFa205AA24F6386D959334ac1BF27336",
    "mining": false,
    "mining_script": "path/to/mining.executable",
    "seed_validators": [
      ["smartnodes.ddns.net", 38751, "58ef79797cd451e19df4a73fbd9871797f9c6a2e"]
    ]
  },
  "ml": {
    "trusted": false,
    "max_vram_gb": 24
  }
}`;

const privateValidatorConfig = `{
  "node": {
    "type": "validator",
    "mode": "private",
    "endpoint": true,
    "endpoint_url": "0.0.0.0",
    "endpoint_port": 64747,
    "priority_nodes": [
      ["192.168.1.101", 38752],
      ["192.168.1.102", 38753]
    ]
  },
  "ml": {
    "trusted": true
  }
}`;

const privateWorkerConfig = `{
  "node": {
    "type": "worker",
    "mode": "private"
  },
  "ml": {
    "trusted": true,
    "max_vram_gb": 24
  }
}`;

const localDevConfig = `{
  "node": {
    "type": "worker",
    "mode": "local",
    "endpoint": true,
    "endpoint_url": "127.0.0.1",
    "endpoint_port": 64747,
    "priority_nodes": []
  },
  "ml": {
    "trusted": true,
    "max_vram_gb": 24
  }
}`;

const pythonPrivateCluster = `from tensorlink.ml import DistributedModel
from tensorlink.nodes import User, UserConfig

# Create user node pointing to your private validator
node = User(
    UserConfig(
        priority_nodes=[["192.168.1.100", 38751]]  # Your validator IP/port
    )
)

# Use your private cluster for distributed execution
model = DistributedModel(
    model="Qwen/Qwen2.5-7B-Instruct",
    training=False,
    node=node
)`;

const pythonLocalTest = `from tensorlink.ml import DistributedModel
from tensorlink.nodes import User, UserConfig

# Configure for local testing
node = User(
    UserConfig(
        upnp=False,
        local_test=True,
        priority_nodes=[["127.0.0.1", 38752]]
    )
)

# Runs entirely on local node(s)
model = DistributedModel(
    model="gpt2",
    training=False,
    node=node
)`;

const Nodes = () => (
  <section className="px-1.5 xs:px-5 md:px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full">
    <div className="text-left py-7 max-w-[1200px] w-full">
      {/* Navigation */}
      <div className="flex mb-10 justify-between max-w-[1200px] w-full">
        <div className="text-left">
          <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Previous</div>
          <a href="/tensorlink/docs/model" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
            Distributed Models
          </a>
        </div>
        <div className="text-right">
          <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Next</div>
          <a href="/tensorlink/docs/mining" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
            Running a Worker
          </a>
        </div>
      </div>
      
      {/* Title */}
      <div className="pb-4 mb-4 border-b dark:border-neutral-800 border-neutral-200">
        <h1 className="text-xl sm:text-3xl font-bold dark:text-white text-neutral-900 mb-2">
          Node Setup & Network Configuration
        </h1>
        <p className="text-md dark:text-neutral-400 text-neutral-600">
          Deploy workers, validators, and private clusters for distributed ML workflows
        </p>
      </div>
      
      {/* Introduction */}
      <div className="mb-12">
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Tensorlink's distributed infrastructure is built on a flexible node system that supports public, private, and local 
          deployment modes. Nodes communicate through a peer-to-peer mesh secured by smart contracts, enabling collaborative 
          machine learning workflows across diverse network configurations.
        </p>
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          By default, <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-mono text-sm">DistributedModel</code> automatically 
          spawns a user node in the background and connects to Tensorlink's public GPU network. For production deployments, private 
          infrastructure, or custom architectures, you'll want to run dedicated nodes using the node software and configure them 
          via <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded font-mono text-sm">config.json</code>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-5">
          <p className="text-sm sm:text-base dark:text-neutral-300 text-neutral-700 mb-3">
            <strong className="dark:text-white text-neutral-900">When to Run Your Own Nodes:</strong>
          </p>
          <ul className="space-y-2 text-sm sm:text-base dark:text-neutral-300 text-neutral-700">
            <li>• Contribute GPU resources to the public network and earn token rewards</li>
            <li>• Deploy private clusters for sensitive workloads with complete data privacy</li>
            <li>• Expose your hardware as private API endpoints for external applications</li>
            <li>• Run custom models that require trusted execution environments</li>
            <li>• Build production infrastructure with controlled resource allocation</li>
          </ul>
        </div>
      </div>

      {/* Node Types */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Node Types and Roles
        </h2>
        
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-6">
          Tensorlink separates computational responsibilities into distinct node types. A single physical device can run 
          multiple roles simultaneously, or you can build specialized clusters with dedicated hardware for each function.
        </p>

        <div className="space-y-6">
          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Worker Nodes
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
              Worker nodes execute the actual model operations on GPU hardware. They handle tensor computations, gradient 
              calculations, and model weight storage. Workers receive job assignments from validators, process the workload, 
              and return results.
            </p>
            <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded border border-neutral-200 dark:border-neutral-700">
              <p className="text-sm dark:text-neutral-300 text-neutral-700 mb-2">
                <strong className="dark:text-white text-neutral-900">Primary Responsibilities:</strong>
              </p>
              <ul className="text-sm dark:text-neutral-400 text-neutral-600 space-y-1">
                <li>• Execute forward and backward passes for distributed models</li>
                <li>• Store and manage model weights across the network</li>
                <li>• Compute gradients during distributed training</li>
                <li>• Process inference requests from user nodes</li>
              </ul>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Validator Nodes
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
              Validator nodes coordinate distributed jobs, route API requests, and manage the network topology. They determine 
              optimal model sharding strategies, assign work to available workers, and optionally expose HTTP endpoints for 
              external access. Validators ensure network integrity and facilitate communication between user and worker nodes.
            </p>
            <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded border border-neutral-200 dark:border-neutral-700">
              <p className="text-sm dark:text-neutral-300 text-neutral-700 mb-2">
                <strong className="dark:text-white text-neutral-900">Primary Responsibilities:</strong>
              </p>
              <ul className="text-sm dark:text-neutral-400 text-neutral-600 space-y-1">
                <li>• Route inference and training requests to appropriate workers</li>
                <li>• Determine model sharding strategies based on available resources</li>
                <li>• Expose HTTP API endpoints (optional)</li>
                <li>• Validate job authenticity and manage network security</li>
              </ul>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              User Nodes (Python API)
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
              User nodes are typically spawned programmatically within Python code using <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">DistributedModel</code>. 
              They initiate jobs, coordinate model communication, and manage the client-side execution flow. User nodes connect 
              to validators to submit work and receive results.
            </p>
            <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded border border-neutral-200 dark:border-neutral-700">
              <p className="text-sm dark:text-neutral-300 text-neutral-700 mb-2">
                <strong className="dark:text-white text-neutral-900">Primary Responsibilities:</strong>
              </p>
              <ul className="text-sm dark:text-neutral-400 text-neutral-600 space-y-1">
                <li>• Submit inference and training jobs to the network</li>
                <li>• Coordinate distributed model execution from Python code</li>
                <li>• Manage tokenization and pre/post-processing</li>
                <li>• Connect to public or private validator nodes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Installing Node Software
        </h2>
        
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          To run dedicated worker or validator nodes, download the latest node software from the GitHub releases page. 
          The node binary includes everything needed to participate in the network and requires minimal configuration.
        </p>

        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm dark:text-neutral-300 text-neutral-700 mb-3">
            <strong className="dark:text-white text-neutral-900">Download Steps:</strong>
          </p>
          <ol className="space-y-2 text-sm dark:text-neutral-300 text-neutral-700">
            <li>1. Visit <a href="https://github.com/mattjhawken/tensorlink/releases" target="_blank" rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium">GitHub Releases</a></li>
            <li>2. Download <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">tensorlink-node</code> for 
            your platform (Linux/macOS)</li>
            <li>3. Extract the archive and navigate to the directory</li>
            <li>4. Edit <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">config.json</code> to 
            configure your node</li>
            <li>5. Run <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">./run-node.sh</code> to 
            start the node</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4">
          <p className="text-sm dark:text-amber-200 text-amber-900 font-medium mb-2">
            💡 System Requirements
          </p>
          <ul className="text-sm dark:text-amber-100 text-amber-800 space-y-1">
            <li>• UNIX-based OS (Linux, macOS) - Windows via WSL</li>
            <li>• Python 3.10+ (for worker nodes processing models)</li>
            <li>• CUDA-compatible GPU (recommended for workers)</li>
            <li>• Stable internet connection (for public/private modes)</li>
          </ul>
        </div>
      </div>

      {/* Configuration Examples */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Configuration Examples
        </h2>
        
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-6">
          Your <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">config.json</code> file 
          controls all aspects of node behavior, from network connectivity to security settings. Below are common configuration 
          patterns for different deployment scenarios.
        </p>

        <div className="space-y-8">
          {/* Public Worker */}
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Public Worker Node (Earn Rewards)
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
              Contribute your GPU to the public network and earn token rewards for processing inference and training jobs.
            </p>
            <SyntaxHighlighter language="json" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
              {publicWorkerConfig}
            </SyntaxHighlighter>
            <div className="bg-neutral-50 dark:bg-neutral-900/50 border-l-4 border-emerald-500 p-4 mt-3">
              <p className="text-sm dark:text-neutral-300 text-neutral-700">
                <strong className="dark:text-white text-neutral-900">Key Points:</strong> Set <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">trusted: false</code> to 
                only accept verified Hugging Face models. Add your wallet address to receive rewards. Optionally enable mining during idle periods.
              </p>
            </div>
          </div>

          {/* Private Validator */}
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Private Validator Node (API Endpoint)
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
              Coordinate a private cluster and expose HTTP endpoints for external application access. Change node type to "validator"
              if you don't want the validator to run worker tasks.
            </p>
            <SyntaxHighlighter language="json" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
              {privateValidatorConfig}
            </SyntaxHighlighter>
            <div className="bg-neutral-50 dark:bg-neutral-900/50 border-l-4 border-blue-500 p-4 mt-3">
              <p className="text-sm dark:text-neutral-300 text-neutral-700">
                <strong className="dark:text-white text-neutral-900">Key Points:</strong> Use <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">0.0.0.0</code> to 
                expose API on LAN. List your worker nodes in <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">priority_nodes</code>. 
                Enable <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">trusted: true</code> for custom models.
              </p>
            </div>
          </div>

          {/* Private Worker */}
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Private Worker Node
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-3">
              Worker configuration for private clusters that execute custom models and sensitive workloads.
            </p>
            <SyntaxHighlighter language="json" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
              {privateWorkerConfig}
            </SyntaxHighlighter>
            <div className="bg-neutral-50 dark:bg-neutral-900/50 border-l-4 border-purple-500 p-4 mt-3">
              <p className="text-sm dark:text-neutral-300 text-neutral-700">
                <strong className="dark:text-white text-neutral-900">Key Points:</strong> Minimal configuration required. 
                Workers automatically discover validators on private networks. Set <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">max_vram_gb</code> to 
                limit GPU usage per node.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Python Integration */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Connecting from Python
        </h2>
        
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-6">
          Once your nodes are running, you can connect to them from Python using the <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">User</code> and{" "}
          <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">UserConfig</code> classes. 
          This allows you to target specific infrastructure for distributed execution.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Connecting to Private Clusters
            </h3>
            <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
              {pythonPrivateCluster}
            </SyntaxHighlighter>
          </div>

          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Local Testing Configuration
            </h3>
            <SyntaxHighlighter language="python" style={vscDarkPlus} className="rounded-lg !bg-[#1e1e1e] border border-neutral-700 text-sm">
              {pythonLocalTest}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-l-4 border-blue-500 p-4 mt-6">
          <p className="text-sm dark:text-neutral-300 text-neutral-700 mb-2">
            <strong className="dark:text-white text-neutral-900">UserConfig Parameters:</strong>
          </p>
          <ul className="space-y-1 text-sm dark:text-neutral-300 text-neutral-700">
            <li>• <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">priority_nodes</code>: 
            List of [IP, port] pairs for explicit validator connections</li>
            <li>• <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">upnp</code>: 
            Enable UPnP for automatic port forwarding (disable for local/private)</li>
            <li>• <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">local_test</code>: 
            Force localhost-only connections for testing</li>
          </ul>
        </div>
      </div>

      {/* Architecture Examples */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Common Network Architectures
        </h2>
        
        <div className="space-y-6">
          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Single Device (Worker + Validator)
            </h3>
            <pre className="overflow-auto text-xs sm:text-sm dark:text-neutral-300 text-neutral-700 font-mono bg-neutral-100 dark:bg-neutral-800 p-3 rounded mb-3">
{`Device 1 (192.168.1.100)
  ├── Validator Node :38751 (API endpoint)
  └── Worker Node :38752 (24GB VRAM)`}
            </pre>
            <p className="text-xs sm:text-sm dark:text-neutral-400 text-neutral-600">
              Simplest configuration. One device runs both roles, exposing an API endpoint for external access while 
              executing models locally.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Private LAN Cluster
            </h3>
            <pre className="overflow-auto text-xs sm:text-sm dark:text-neutral-300 text-neutral-700 font-mono bg-neutral-100 dark:bg-neutral-800 p-3 rounded mb-3">
{`Validator (192.168.1.100:38751)
    ├── Worker 1 (192.168.1.100:38752) - 24GB VRAM
    ├── Worker 2 (192.168.1.101:38753) - 12GB VRAM
    └── Worker 3 (192.168.1.102:38754) - 24GB VRAM`}
            </pre>
            <p className="text-sm dark:text-neutral-400 text-neutral-600">
              Dedicated validator coordinates multiple workers. Models are sharded across available VRAM. Validator 
              exposes HTTP API for external access.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Hybrid Public-Private Network
            </h3>
            <pre className="overflow-auto text-xs sm:text-sm dark:text-neutral-300 text-neutral-700 font-mono bg-neutral-100 dark:bg-neutral-800 p-3 rounded mb-3">
{`Private Cluster
  └── Validator (192.168.1.100) → Public Network
        ├── Local Worker 1 (192.168.1.101)
        ├── Local Worker 2 (192.168.1.102)
        └── Public Workers (global network)`}
            </pre>
            <p className="text-sm dark:text-neutral-400 text-neutral-600">
              Validator connects to both private local workers and the public network, allowing workloads to overflow 
              to community resources when local capacity is exceeded.
            </p>
          </div>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Security Best Practices
        </h2>
        
        <div className="space-y-4">
          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-semibold dark:text-white text-neutral-900 mb-2">
              🔒 Never Enable Trusted Mode on Public Nodes
            </h4>
            <p className="text-sm dark:text-neutral-300 text-neutral-700">
              Setting <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">trusted: true</code> allows 
              arbitrary code execution. Only enable this on infrastructure you fully control. Public workers should always 
              use <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">trusted: false</code> to 
              restrict execution to verified Hugging Face models.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-semibold dark:text-white text-neutral-900 mb-2">
              🛡️ Firewall Private Endpoints
            </h4>
            <p className="text-sm dark:text-neutral-300 text-neutral-700">
              If exposing API endpoints on private networks, use firewall rules to restrict access to trusted IP ranges. 
              Binding to <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">0.0.0.0</code> exposes 
              the API on all network interfaces—ensure proper access controls are in place.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-semibold dark:text-white text-neutral-900 mb-2">
              🔐 Protect Wallet Private Keys
            </h4>
            <p className="text-sm dark:text-neutral-300 text-neutral-700">
              Your wallet address in <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">config.json</code> is 
              used for receiving rewards on public networks. Never share your private keys. The config only requires your 
              public address for identification and reward distribution.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <h4 className="font-semibold dark:text-white text-neutral-900 mb-2">
              📊 Monitor Resource Usage
            </h4>
            <p className="text-sm dark:text-neutral-300 text-neutral-700">
              Set appropriate <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">max_vram_gb</code> limits 
              to prevent workers from accepting jobs that exceed available GPU memory. This prevents OOM errors and maintains 
              system stability during peak usage.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
          Next Steps
        </h3>
        <ul className="space-y-2 text-sm sm:text-base dark:text-neutral-300 text-neutral-700">
          <li>
            • Download the <a href="https://github.com/mattjhawken/tensorlink/releases" target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            latest node software</a> from GitHub releases
          </li>
          <li>
            • Review the <a href="https://github.com/mattjhawken/tensorlink/tree/main/docs/examples" target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            configuration examples</a> for your deployment scenario
          </li>
          <li>
            • Learn about <a href="/tensorlink/docs/mining" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            earning rewards</a> by contributing GPU resources to the public network
          </li>
          <li>
            • Join the <a href="https://discord.gg/aCW2kTNzJ2" target="_blank" rel="noopener noreferrer" 
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Discord community</a> for help with node setup and configuration
          </li>
        </ul>
      </div>
    </div>

    {/* Navigation */}
    <div className="flex mt-8 mb-10 justify-between max-w-[1200px] w-full pt-8 border-t dark:border-neutral-800 border-neutral-200">
      <div className="text-left">
        <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Previous</div>
          <a href="/tensorlink/docs/model" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
            Distributed Models
        </a>
      </div>
      <div className="text-right">
        <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Next</div>
        <a href="/tensorlink/docs/mining" className="text-sm sm:text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
          Running a Worker
        </a>
      </div>
    </div>
  </section>
);

export default Nodes;