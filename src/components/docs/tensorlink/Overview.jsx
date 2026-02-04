import React from "react";

const Overview = () => (
  <section 
    path="/docs/overview" 
    className="px-2 sm:px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full"
  >
    <div className="text-left py-7 max-w-[1200px] w-full">
      {/* Navigation */}
      <div className="flex mb-10 justify-between max-w-[1200px] w-full">
        <div className="text-left">
          <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Previous</div>
          <a href="/tensorlink" className="text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
            Home
          </a>
        </div>
        <div className="text-right">
          <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Next</div>
          <a href="/tensorlink/docs/start" className="text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
            Getting Started
          </a>
        </div>
      </div>

      {/* Page Title */}
      <div className="pb-4 mb-4 border-b dark:border-neutral-800 border-neutral-200">
        <h1 className="text-4xl font-bold dark:text-white text-neutral-900 mb-2">
          Overview
        </h1>
        <p className="text-lg dark:text-neutral-400 text-neutral-600">
          Distributed AI Infrastructure for PyTorch and Hugging Face Models
        </p>
      </div>

      {/* Introduction Section */}
      <div className="mb-12">
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Tensorlink is a Python library and computational platform that enables distributed inference and training of PyTorch models across 
          peer-to-peer networks. It allows users to pool GPU power to run larger models and remotely access machine learning resources in Python 
          or via HTTP. Native PyTorch object wrappers simplify bootstrapping peers and configuring models for distributed execution, making 
          large-scale inference and training easy to deploy.
        </p>
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Unlike centralized cloud infrastructure, Tensorlink forms a distributed mesh of compute nodes that provides low-cost access to pooled 
          public GPUs. Workers automatically combine their computational power to collectively host models larger than what any single GPU can 
          support, with partitioning and execution handled transparently behind the scenes. Tensorlink connects devices and exposes them through 
          PyTorch object wrappers or a flexible HTTP API, enabling both public and private GPU networks to serve Python applications, services, and web apps.
        </p>
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Whether you're running large language models without local GPU capacity, deploying private inference infrastructure accessible 
          from any device, building agentic workflows with on-demand LLM APIs, or conducting distributed training with automatic model 
          and data parallelism, Tensorlink provides the infrastructure to make it happen. Users can also expose their personal GPUs as 
          private API endpoints, allowing secure access to AI resources from external applications while maintaining complete data privacy 
          and control.
        </p>
      </div>

      {/* Key Features Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Key Features
        </h2>
        
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-8">
          Tensorlink serves diverse computational scenarios across development, deployment, and production environments. From 
          prototyping models without GPU constraints to building production-grade AI services with cost-effective inference, 
          the platform adapts to your needs. Secure sensitive workloads on your own infrastructure, experiment with distributed 
          fine-tuning on models too large for a single GPU, or contribute idle compute to earn rewards while supporting the network.
        </p>

        <div className="space-y-8">
          {/* REST API */}
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              OpenAI-Compatible REST API
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300 mb-3">
              Access Hugging Face models through familiar OpenAI-style endpoints including <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">/v1/generate</code> and{' '}
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">/v1/chat/completions</code>. 
              Developers can maintain existing workflows while operating models across a distributed compute network. APIs support both 
              streaming and non-streaming responses, with backend execution transparently handled by worker nodes. Available in free 
              public tier and private deployment modes for production workloads.
            </p>
          </div>

          {/* DistributedModel */}
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              <code className="bg-neutral-100 dark:bg-neutral-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded font-mono text-base">
                DistributedModel
              </code>
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300">
              A drop-in wrapper around <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">torch.nn.Module</code> objects 
              that transparently distributes model execution across one or many nodes. The system automatically parses model architectures, 
              intelligently shards layers across available compute resources, and orchestrates forward and backward passes while preserving 
              the standard PyTorch interface (<code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">.forward()</code>, 
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">.backward()</code>, 
              <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">.parameters()</code>). Works with both 
              pre-trained Hugging Face models and custom PyTorch architectures.
            </p>
          </div>

          {/* DistributedOptimizer */}
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              <code className="bg-neutral-100 dark:bg-neutral-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded font-mono text-base">
                DistributedOptimizer
              </code>
            </h3>
            <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300">
              Complements <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">DistributedModel</code> with 
              automatic gradient aggregation and synchronized parameter updates across distributed workers. Fully compatible with standard 
              PyTorch optimizers (Adam, AdamW, SGD) and Hugging Face's optimization libraries, ensuring seamless integration into existing 
              training pipelines. Supports adaptive learning rates, weight decay, and momentum across the network.
            </p>
          </div>

          {/* Flexible Deployment */}
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Flexible Network Deployment
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300">
              Deploy nodes in three distinct modes tailored to your use case. <strong className="dark:text-white text-neutral-900">Public mode</strong> connects 
              to the global Tensorlink network where users contribute GPU resources and earn token rewards through the Smartnodes blockchain layer. 
              <strong className="dark:text-white text-neutral-900"> Private mode</strong> creates isolated clusters on your own infrastructure, ideal for 
              sensitive workloads that require complete data privacy. <strong className="dark:text-white text-neutral-900">Local mode</strong> enables 
              offline development and testing without any network connectivity, perfect for prototyping before deployment.
            </p>
          </div>

          {/* Node Types */}
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Worker and Validator Nodes
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300">
              Tensorlink's architecture separates compute execution from request routing. <strong className="dark:text-white text-neutral-900">Worker nodes</strong> execute 
              model operations on GPU hardware, handling tensor operations, gradient computations, and model weight storage. 
              <strong className="dark:text-white text-neutral-900"> Validator nodes</strong> coordinate distributed jobs, route API requests, manage model 
              sharding strategies, and expose HTTP endpoints for external access. A single physical device can run both roles simultaneously, 
              or you can build specialized clusters with dedicated workers and validators for optimal resource allocation.
            </p>
          </div>

          {/* Security & Privacy */}
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Security and Privacy Controls
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300">
              Tensorlink provides granular control over model execution and data privacy. The <strong className="dark:text-white text-neutral-900">trusted mode</strong> flag 
              determines whether nodes accept custom user-supplied models or restrict execution to verified Hugging Face checkpoints only. 
              Private networks ensure sensitive data never leaves your infrastructure, while priority node configurations let you explicitly 
              define which devices handle your workloads. For production deployments, you can expose your own hardware as private API endpoints 
              with custom authentication, ensuring your data flows exclusively through controlled infrastructure while remaining accessible from 
              any application via secure API keys.
            </p>
          </div>

          {/* Token Rewards */}
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
              Incentivized Compute Network
            </h3>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300">
              Public network participation is incentivized through a blockchain-based token reward system built on the Smartnodes network. 
              GPU providers earn rewards proportional to compute contributed, similar to distributed computing projects like Folding@Home 
              or Gridcoin. This economic layer bootstraps GPU availability and sustains free-tier API access for the community. Nodes can 
              optionally enable mining during idle periods to maximize rewards when not processing inference requests, creating a sustainable 
              ecosystem for decentralized AI infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-6 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Common Use Cases
        </h2>
        
        <div className="grid gap-6">
          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-lg border dark:border-neutral-800 border-neutral-200">
            <h4 className="text-sm sm:text-base font-semibold dark:text-white text-neutral-900 mb-2">
              Running Models Beyond Local GPU Capacity
            </h4>
            <p className="text-sm leading-relaxed dark:text-neutral-300 text-neutral-700">
              Execute large language models (14B+ parameters) that exceed your available VRAM by distributing layers across multiple 
              GPUs on the network. Ideal for researchers and developers who need access to state-of-the-art models without investing 
              in expensive hardware.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-lg border dark:border-neutral-800 border-neutral-200">
            <h4 className="text-sm sm:text-base font-semibold dark:text-white text-neutral-900 mb-2">
              Private API Endpoints for Personal Hardware
            </h4>
            <p className="text-sm leading-relaxed dark:text-neutral-300 text-neutral-700">
              Host models on your home PC or workstation and access them securely from mobile apps, web services, or third-party 
              applications via private API keys. Your data never leaves your infrastructure, ensuring complete privacy and control 
              while maintaining the convenience of cloud-style API access.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-lg border dark:border-neutral-800 border-neutral-200">
            <h4 className="text-sm sm:text-base font-semibold dark:text-white text-neutral-900 mb-2">
              Cost-Effective Production AI Services
            </h4>
            <p className="text-sm leading-relaxed dark:text-neutral-300 text-neutral-700">
              Build web services, chatbots, and agentic applications with access to free-tier public APIs or low-cost private 
              infrastructure. Eliminate recurring cloud inference costs while maintaining the scalability and reliability needed 
              for production deployments.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-lg border dark:border-neutral-800 border-neutral-200">
            <h4 className="text-sm sm:text-base font-semibold dark:text-white text-neutral-900 mb-2">
              Distributed Model Training and Fine-Tuning
            </h4>
            <p className="text-sm leading-relaxed dark:text-neutral-300 text-neutral-700">
              Train and fine-tune models with automatic gradient synchronization across distributed workers. Leverage model parallelism 
              to train architectures too large for a single GPU, or use data parallelism to accelerate training across multiple devices 
              on your local network.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-lg border dark:border-neutral-800 border-neutral-200">
            <h4 className="text-sm sm:text-base font-semibold dark:text-white text-neutral-900 mb-2">
              Earning Rewards for Idle Compute
            </h4>
            <p className="text-sm leading-relaxed dark:text-neutral-300 text-neutral-700">
              Monetize unused GPU capacity by contributing to the public network. Perfect for gaming rigs, workstations, or 
              mining hardware that sits idle for significant portions of the day. Earn blockchain-based rewards while supporting 
              the decentralized AI ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Limitations Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-6 pb-2 border-b dark:border-neutral-800 border-neutral-200">
          Current Limitations
        </h2>
        
        <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 mb-6">
          <p className="text-sm dark:text-amber-200 text-amber-900 font-medium mb-2">
            ⚠️ Early Release Notice
          </p>
          <p className="text-sm dark:text-amber-100 text-amber-800">
            Tensorlink is in active development and early access. Users may encounter bugs, performance inconsistencies, 
            and limited network availability. These limitations will be progressively addressed as the network matures and 
            the community grows. We appreciate your patience and feedback as we work toward a stable 1.0 release.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm sm:text-base font-medium dark:text-white text-neutral-900 mb-2">
              Model Support and Distribution
            </h4>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-2">
              Currently, support focuses on open-source Hugging Face models that do not require API keys or 
              restricted access. Custom model distribution is supported exclusively in trusted mode on private networks, 
              as we develop secure model serialization mechanisms for public custom model deployment.
            </p>
            <p className="text-sm leading-relaxed dark:text-neutral-400 text-neutral-600 italic">
              Future updates will introduce custom models and fault-tolerant execution environments 
              on the public network.
            </p>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-medium dark:text-white text-neutral-900 mb-2">
              Public Network Resource Constraints
            </h4>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-2">
              Due to limited availability of public worker nodes during early access, models may experience longer queue times or 
              fail to find sufficient compute resources. The network's capacity will scale as more GPU providers join and contribute resources.
            </p>
            <p className="text-sm leading-relaxed dark:text-neutral-400 text-neutral-600 italic">
              Consider running private worker nodes or contributing your own GPU to help expand network capacity.
            </p>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-medium dark:text-white text-neutral-900 mb-2">
              Network Latency and Performance
            </h4>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-2">
              Internet latency and connection quality significantly impact performance for distributed training and inference when 
              using peer-to-peer connections. HTTP API calls are generally unaffected, but Python-based distributed execution may 
              encounter challenges in latency-sensitive or high-throughput scenarios. Fiber internet and wired Ethernet connections 
              are strongly recommended for optimal performance.
            </p>
            <p className="text-sm leading-relaxed dark:text-neutral-400 text-neutral-600 italic">
              Local and LAN-based clusters achieve the best performance, making them ideal for production training workloads. Likewise, due to LAN 
              speeds, large-scale model training is not optimal, while low-shot fine-tuning would be more practical.
            </p>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-medium dark:text-white text-neutral-900 mb-2">
              Platform Compatibility
            </h4>
            <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-2">
              Tensorlink currently supports UNIX-based systems (Linux, macOS) and requires Python 3.10+ with PyTorch 2.3+. 
              Windows users can run Tensorlink via WSL (Windows Subsystem for Linux). Native Windows support is planned for 
              future releases.
            </p>
          </div>
        </div>
      </div>

      {/* Getting Started CTA */}
      <div className="mb-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
          Ready to Get Started?
        </h3>
        <p className="text-sm sm:text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Install Tensorlink via pip and connect to the public network in minutes, or download the node software to contribute 
          GPU resources and earn rewards. Check out the Getting Started guide for installation instructions, configuration examples, 
          and your first distributed inference job.
        </p>
        <div className="flex gap-3 flex-wrap">
          <a 
            href="/tensorlink/docs/install" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-2 rounded-lg transition-colors"
          >
            Installation Guide →
          </a>
          <a 
            href="https://github.com/mattjhawken/tensorlink" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-neutral-700 hover:bg-neutral-800 text-white font-medium px-3 py-2 rounded-lg transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </div>
    
    {/* Navigation */}
    <div className="flex mt-8 mb-10 justify-between max-w-[1200px] w-full pt-8 border-t dark:border-neutral-800 border-neutral-200">
      <div className="text-left">
        <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Previous</div>
        <a href="/tensorlink" className="text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
          Home
        </a>
      </div>
      <div className="text-right">
        <div className="text-sm dark:text-neutral-500 text-neutral-500 mb-1">Next</div>
        <a href="/tensorlink/docs/start" className="text-base font-medium dark:text-blue-400 text-blue-600 hover:underline">
          Getting Started
        </a>
      </div>
    </div>
  </section>
);

export default Overview;