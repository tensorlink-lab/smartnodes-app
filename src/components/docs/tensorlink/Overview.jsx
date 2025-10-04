import React from "react";
import styles, { layout } from "../../../style";
import { NavButton } from "../..";

const Overview = () => (
  <section 
    path="/docs/install" 
    className="px-5 md:px-10 flex flex-col border-t dark:border-neutral-800 border-neutral-200 items-center h-full bg-white dark:bg-neutral-950"
  >
    <div className="text-left py-7 max-w-[900px] w-full">
      {/* Page Title */}
      <div className="pb-4 mb-4 border-b dark:border-neutral-800 border-neutral-200">
        <h1 className="text-4xl font-bold dark:text-white text-neutral-900 mb-2">
          Overview
        </h1>
        <p className="text-lg dark:text-neutral-400 text-neutral-600">
          Distributed Neural Network Infrastructure with Tensorlink
        </p>
      </div>

      {/* Introduction Section */}
      <div className="mb-12">
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-4">
          Tensorlink is a Python library and computational platform that provides tools for neural network inference and 
          training with PyTorch models. It is a peer-to-peer system that handles the distribution of models among node operators,
          and opens them up to users via APIs and model wrappers in Python, enabling users to work with LLMs and custom models without 
          specific VRAM requirements, expanding access to cutting-edge AI.
        </p>
        <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
          Providing both free and paid access to LLM APIs and integrated distributed PyTorch distribution of models, 
          Tensorlink offers a framework for accessing and sharing computation directly peer-to-peer. As a unique and 
          decentralized cloud service, it simplifies model distribution among peers while supporting pre-trained 
          architectures from libraries like Hugging Face. This significantly lowers the barrier to entry for both 
          training and inference, empowering individuals and organizations to deploy state-of-the-art AI models without 
          the need for costly, centralized infrastructure.
        </p>
      </div>

    {/* Key Features Section */}
<div className="mb-6">
  <h2 className="text-2xl font-semibold dark:text-white text-neutral-900 mb-3 pb-2 border-b dark:border-neutral-800 border-neutral-200">
    Key Features
  </h2>
  
  <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 mb-8">
    Tensorlink integrates directly into PyTorch codebases through API access to Hugging Face models or lightweight 
    wrappers around core PyTorch objects such as modules and optimizers. This allows developers to maintain familiar 
    workflows while operating models dynamically across a distributed compute network.
  </p>

  <div className="space-y-8">
    {/* On-demand Inference APIs */}
    <div>
      <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
        On-demand Hugging Face API
      </h3>
      <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300">
        Provides instant access to Hugging Face pre-trained models via APIs, enabling easy integration of LLMs into 
        applications without local GPU requirements.
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
        designed to simplify the process of running models across multiple nodes. It automatically parses and distributes 
        model submodules across worker nodes, making efficient use of available compute while preserving the standard 
        PyTorch interface (<code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">forward</code>, 
        <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">backward</code>, 
        <code className="bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono">parameters</code>).
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
        Tensorlink nodes connect through a smart contract-secured peer-to-peer mesh. Users can share idle compute 
        and earn token rewards, with both free and paid resource options available.
      </p>
    </div>

    <div>
      <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-3">
        Data Privacy and Security
      </h3>
      <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700 pl-4 border-l-2 dark:border-neutral-700 border-neutral-300">
        Safeguards training data through obfuscation and model fragmentation, supporting privacy-preserving workflows.
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
              parameters may not perform optimally. Additionally, public inference and training jobs are currently 
              restricted to a single worker, with data parallelism temporarily disabled for these tasks. However, data 
              parallel acceleration remains available for local jobs and within private clusters (experimental).
            </p>
          </div>

          <div>
            <h4 className="text-base font-medium dark:text-white text-neutral-900 mb-2">
              Network Performance
            </h4>
            <p className="text-base leading-relaxed dark:text-neutral-300 text-neutral-700">
              Internet latency and connection quality can significantly affect performance for public tasks over P2P, 
              while API calls are relatively unaffected. This may pose challenges for latency-sensitive or high-throughput 
              training and inference scenarios. Fiber internet and ethernet connections are recommended for the best performance.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Navigation */}
    <div className="flex mt-8 mb-10 justify-between max-w-[900px] w-full pt-8 border-t dark:border-neutral-800 border-neutral-200">
      <NavButton className="text-left" title="Home" subtitle="Previous" page="tensorlink" />
      <NavButton className="text-right" title="Getting Started" subtitle="Next" page="tensorlink/docs/install" />
    </div>
  </section>
);

export default Overview;