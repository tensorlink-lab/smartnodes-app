import React from "react";
import styles, { layout } from "../../../style";
import { NavButton } from "../..";

const Overview = () => (
  <section 
    path="/docs/install" 
    className="px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full"
  >
    <div className="text-left py-7 max-w-[1200px] w-full">
      {/* Page Title */}
      <div className="pb-4 mb-4 border-b dark:border-neutral-800 border-neutral-200">
        <h1 className="text-4xl font-bold dark:text-white text-neutral-900 mb-2">
          Overview
        </h1>
        <p className="text-lg dark:text-neutral-400 text-neutral-600">
          Tensorlink: Distributed Neural Network Infrastructure for PyTorch
        </p>
      </div>

      {/* Introduction Section */}
      <div className="mb-12">
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Tensorlink is a decentralized computational platform that enables distributed inference and training of PyTorch models 
          across a peer-to-peer network. It eliminates the need for dedicated AI hardware by allowing users to run, share, and access 
          models through a distributed network while earning rewards for contributing compute resources. 
        </p>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Unlike existing services, Tensorlink provides native PyTorch integration alongside flexible API access, enabling seamless 
          transitions between local and distributed execution. The platform integrates directly into PyTorch codebases through REST 
          APIs for popular Hugging Face models and lightweight wrappers around core PyTorch objects like modules and optimizers. 
          Nodes connect through a smart contract-secured peer-to-peer mesh, with GPU providers earning token rewards similar to 
          Folding@Home or Gridcoin. Users can also expose their personal GPUs as private endpoints, allowing secure access to AI 
          resources from external applications while maintaining complete data privacy.
        </p>
      </div>

    {/* Key Features Section */}
    <div className="mb-6">
      <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
        Key Features
      </h2>
      
      <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-8">
        Tensorlink serves diverse computational scenarios: running large language models without local GPU requirements, deploying 
        private inference infrastructure on personal hardware accessible from any device, enabling agentic workflows with on-demand 
        LLM APIs, and conducting distributed training with built-in model and data parallelism. Whether you're building web services 
        that need cost-effective AI access, securing sensitive workloads on your own infrastructure, or experimenting with distributed 
        fine-tuning on models too large for a single GPU, Tensorlink provides the tools to make it happen.
      </p>

      <div className="space-y-8">
        {/* On-demand Inference APIs */}
        <div>
          <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
            REST API for Hugging Face
          </h3>
          <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300">
            This allows developers to maintain familiar workflows while operating models dynamically across a distributed compute network.
            APIs are available in both free and paid tiers, with backend execution handled by worker nodes on the network.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
            <code className="bg-neutral-100 dark:bg-neutral-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded font-mono text-base">
              DistributedModel
            </code>
          </h3>
          <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300">
            A wrapper around <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">torch.nn.Module</code> objects 
            designed to simplify the process of running models across one or many nodes. It automatically parses and distributes 
            models across worker nodes, making efficient use of available compute while preserving the standard 
            PyTorch model interface (<code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">.forward</code>, 
            <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">.backward</code>, 
            <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">.parameters</code>).
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
            <code className="bg-neutral-100 dark:bg-neutral-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded font-mono text-base">
              DistributedOptimizer
            </code>
          </h3>
          <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300">
            Complements <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">DistributedModel</code> 
            with synchronized parameter updates across nodes. Fully compatible with PyTorch and Hugging Face optimizers, 
            ensuring seamless integration into diverse training pipelines.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
            Public and Private Compute
          </h3>
          <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300">
            Tensorlink nodes connect through a smart contract-secured peer-to-peer mesh, creating a decentralized network where users can contribute idle GPU 
            resources and earn token rewards. The network is incentivized through a token reward system which helps bootstrap GPU availabuility and keeps free-tier
            services operational for the community. Private compute can also be exposed via endpoints to enable access to private AI compute in external applications, 
            maintaining data privacy. For example, you can host an LLM on your home PC and access it securely from mobile or web applications through your own API key, 
            ensuring your data never leaves your infrastructure.
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
            Early Release Notice
          </p>
          <p className="text-sm dark:text-amber-100 text-amber-800">
            As Tensorlink is still in its early release phase, users may encounter bugs, performance inconsistencies, 
            and limited network availability. These limitations are expected to be progressively addressed as the network matures.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-base font-medium dark:text-white text-neutral-900 mb-2">
              Model Support
            </h4>
            <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
              Currently, model support is focused on open-source Hugging Face models that do not require API keys. 
              Safe and secure methods for custom model distribution are under development and will be available in 
              future updates.
            </p>
          </div>

          <div>
            <h4 className="text-base font-medium dark:text-white text-neutral-900 mb-2">
              Resource Constraints
            </h4>
            <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
              Due to limited availability of public workers, tasks involving models larger than approximately 10 billion 
              parameters may not be processed.
            </p>
          </div>

          <div>
            <h4 className="text-base font-medium dark:text-white text-neutral-900 mb-2">
              Network Performance
            </h4>
            <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
              Internet latency and connection quality can significantly affect performance for distributed models over P2P, 
              while API calls are relatively unaffected. This may pose challenges for latency-sensitive or high-throughput 
              training and inference scenarios. Fiber internet and ethernet connections are recommended for the best performance.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Navigation */}
    <div className="flex mt-8 mb-10 justify-between max-w-[1200px] w-full pt-8 border-t dark:border-neutral-800 border-neutral-200">
      <NavButton className="text-left" title="Home" subtitle="Previous" page="tensorlink" />
      <NavButton className="text-right" title="Getting Started" subtitle="Next" page="tensorlink/docs/install" />
    </div>
  </section>
);

export default Overview;