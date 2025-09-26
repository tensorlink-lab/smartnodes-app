import React from "react";
import styles, { layout } from "../../../style";
import { NavButton } from "../..";


const Overview = () => (
  <section path="/docs/install" className="px-5 md:px-10 flex flex-col border-t dark:border-t-white border-t-black items-center h-full">
    <div className="text-left px-5 xs:px-0 md:mt-10 max-w-[1280px] justify-center items-center">
      <div className="flex items-center mb-6 mt-5">
        <div className="bg-blue-600 h-8 w-2 mr-4 rounded-lg"></div>
        <h1 className="text-xl sm:text-3xl dark:text-zinc-100 font-bold">Distributed Neural Networks with Tensorlink</h1>
      </div>
      <p className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5`}>
        Tensorlink is a Python library and computational platform that provides tools for neural network inference and 
        training with PyTorch models. It enables users to work with LLMs and custom models without the VRAM requirements, 
        expanding access to cutting-edge AI. Providing both free and paid access to LLM APIs and integrated distributed pytorch
        distribution of models and provides a framework for accessing and sharing computation directly peer-to-peer, making 
        model infrastructure, Tensorlink stands out as a unique and decentralized cloud service.
      </p>
      <p className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5`}>
        By simplifying the distribution of models among peers while also supporting pre-trained architectures from libraries like Hugging Face, Tensorlink 
        enables seamless operation of model sharding, parallel workflow execution, automated peer discovery, 
        all with a built-in incentive system, Tensorlink provides an efficient, decentralized alternative to traditional cloud-based ML services across consumer hardware. 
        This significantly lowers the barrier to entry for both training and inference, empowering individuals and organizations to deploy state-of-the-art AI models without 
        the need for costly, centralized infrastructure.
      </p>

      <div className="flex items-center mb-6 mt-10">
        <div className="bg-red-500 h-8 w-2 mr-4 rounded-lg"></div>
        <h2 className="text-lg sm:text-2xl dark:text-zinc-100 font-bold">Key Features</h2>
      </div>
      <p className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5`}>
        Tensorlink integrates directly into PyTorch codebases through API access to Hugging Face models or lightweight wrappers around core PyTorch objects such as modules and optimizers. This allows developers 
        to maintain familiar workflows while scaling models dynamically across a distributed compute network. By enabling collaboration and resource-sharing between users, 
        Tensorlink brings the power of distributed training and inference to a broader community.
      </p>
      <h4 className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-10`}>
          <strong><code className="bg-gray-200 dark:bg-gray-800 p-1 px-2 rounded">DistributedModel</code></strong>
      </h4>
      <ul className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5 list-disc ml-5`}>
        A wrapper around `torch.nn.Module` objects designed to simplify the process of running models across multiple nodes. It automatically parses and distributes model submodules across worker nodes, making efficient use of available compute. Crucially, it preserves the standard PyTorch interface, including `forward`, `backward`, and `parameters` - allowing developers to integrate it into existing codebases with minimal friction. Tensorlink supports both model parallelism and data parallelism, and handles synchronization and communication between distributed components behind the scenes, streamlining complex workflows.
      </ul>
      <h4 className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-10`}>
          <strong><code className="bg-gray-200 dark:bg-gray-800 p-1 px-2 rounded">DistributedOptimizer</code></strong>
      </h4>
      <ul className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5 list-disc ml-5`}>
        The `DistributedOptimizer` is built to complement `DistributedModel`, providing synchronized parameter updates across distributed training nodes. It is fully compatible with PyTorch’s built-in optimizers as well as third-party optimizers used in Hugging Face transformers. This ensures seamless integration into diverse training pipelines and guarantees consistent updates in sharded or parallelized model training environments, improving training stability and reproducibility in distributed contexts.
      </ul>
      <h4 className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-10`}>
          <strong>Public and Private Compute</strong>
      </h4>
      <ul className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5 list-disc ml-5`}>
        By default, all Tensorlink nodes are connected through a smart contract-secured peer-to-peer mesh. This decentralized architecture enables users to share their idle computational resources and earn token-based rewards in return. The network supports both free and paid usage of resources, giving users flexible options depending on their compute needs and budget.
      </ul>
      <h4 className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-10`}>
          <strong>On-demand Inference APIs</strong>
      </h4>
      <ul className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5 list-disc ml-5`}>
        Tensorlink includes an API for on-demand inference using open-source Hugging Face pre-trained models. These APIs allow users to instantly access popular models in their applications.
      </ul>
      <h4 className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-10`}>
          <strong>Data Privacy and Security</strong>
      </h4>
      <ul className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5 list-disc ml-5`}>
        Tensorlink safeguards training data by obfuscating input data and fragmenting models. Privacy-preserving workflows are also supported.
      </ul>
      {/* <h4 className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-10`}>
          <strong>Consensus (In Development):</strong>
      </h4>
      <ul className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5 list-disc ml-5`}>
        The Proof-of-Learning (PoL) protocol ensures trust and reliability across the network through a dual-layered validation approach.
      </ul>  
      <h2 className={`${styles.subheading2} mt-10 pt-10 border-t dark:border-t-white border-t-black`}>
        Privacy-Preserved Training
      </h2>
      <p className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5`}>
        Tensorlink offers specialized workflows for privacy-preserving training, safeguarding sensitive data by obfuscating input data and fragmenting models. Future advancements like homomorphic encryption could provide additional security layers.
      </p> */}
      <div className="flex items-center mb-6 mt-10">
      <div className="bg-purple-500 h-8 w-2 mr-4 rounded-lg"></div>
      <h2 className="text-lg sm:text-2xl dark:text-zinc-100 font-bold">Current Limitations</h2>
    </div>  
    <p className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5`}>
      As Tensorlink is still in its early release phase, users may encounter bugs, performance inconsistencies, and limited
      network availability. As the network matures, these limitations are expected to be progressively addressed.
    </p>
    <p className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5`}>
      Currently, model support is focused on open-source Hugging Face models that do not require API keys. Safe and secure methods 
      for custom model distribution are under development and will be available in future updates. There are also some practical 
      constraints related to model size and resource allocation. Due to limited availability of public workers, tasks involving 
      models larger than approximately 10 billion parameters may not perform optimally. Additionally, public inference and training 
      jobs are currently restricted to a single worker, with data parallelism temporarily disabled for these tasks. However, data 
      parallel acceleration remains available for local jobs and within private clusters (experimental).
    </p>
    <p className={`${styles.landingText2} sm:px-5 md:px-10 text-lg dark:text-gray-300 text-black mb-5 mt-5`}>    
      Finally, internet latency and connection quality can significantly affect performance for public tasks over P2P, while API calls
      are relatively unaffected. This may pose challenges for latency-sensitive or high-throughput training and inference scenarios in Python.
      Fibre internet and over ethernet is recommended for the best performance.
    </p>
  </div>
    
    <div className="flex mt-16 mb-10 justify-between max-w-[1300px] w-full">
      <NavButton className="text-left" title="Home" subtitle="Previous" page="tensorlink" />
      <NavButton className="text-right" title="Getting Started" subtitle="Next" page="tensorlink/docs/install" />
    </div>
  </section>


);

export default Overview;
